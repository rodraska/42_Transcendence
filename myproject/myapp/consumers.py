import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message, Game, Player
from django.contrib.auth.models import User
from datetime import datetime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connect')
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        messages = await self.get_messages()
        for message in messages:
            await self.send(text_data=json.dumps({
                'message': message['content'],
                'user': message['username'],
                'timestamp': message['timestamp']
            }))
    
    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print('receive')
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = self.scope["user"].username

        await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': username,
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
        )

    async def chat_message(self, event):
        print('chat_message')
        message = event['message']
        user = event['user']
        timestamp = event['timestamp']

        await self.send(text_data=json.dumps({
            'message': message,
            'user': user,
            'timestamp': timestamp
        }))

    @database_sync_to_async
    def save_message(self, message):
        print('save_message')
        room = ChatRoom.objects.get(id=self.room_id)
        Message.objects.create(room=room, sender=self.user, content=message)
    
    @database_sync_to_async
    def get_messages(self):
        print('get_message')
        room = ChatRoom.objects.get(id=self.room_id)
        messages = room.messages.order_by('timestamp')[:50]
        return [
            {
                'content': message.content,
                'username': message.sender.username,
                'timestamp': message.timestamp.strftime("%Y-%m-%d %H:%M:%S")
            }
            for message in messages
        ]
    
class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['type']
        if action == 'player_join':
            await self.player_join()
    
    async def player_join(self, event):
        await self.send(text_data=json.dumps({
            'type': 'player_join',
            'username': event['username']
        }))