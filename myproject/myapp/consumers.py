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
        print('connect')
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.game_group_name = f'game_{self.game_id}'
        self.user = self.scope["user"]

        await self.channel_layer.group_add(
            self.game_group_name,
            self.channel_name
        )

        await self.accept()

        players = await self.get_players()

        await self.send(json.dumps({
            'type': 'me_join',
            'players': players
        }))

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print('receive')
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        username = self.scope["user"].username

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': type,
                'username': username,
                'text_data_json': text_data_json
            }
        )
    
    async def player_join(self, event):
        print('other_join')
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'player_join',
            'username': username
        }))

    async def start_game(self, event):
        print('start_game')
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'username': username
        }))
    
    async def player(self, event):
        print('player')
        username = event['username']
        text_data_json = event['text_data_json']
        player = text_data_json['player']

        await self.send(text_data=json.dumps({
            'type': 'player',
            'username': username,
            'player': player
        }))
    
    @database_sync_to_async
    def get_players(self):
        print('get_players')
        game = Game.objects.get(id=self.game_id)
        players = list(game.players.order_by('joined_at').values('user__username'))
        return [{'username': player['user__username']} for player in players]


    