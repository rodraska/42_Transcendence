import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message, Game, Player
from django.contrib.auth.models import User
from datetime import datetime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
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
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
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
        room = ChatRoom.objects.get(id=self.room_id)
        Message.objects.create(room=room, sender=self.user, content=message)
    
    @database_sync_to_async
    def get_messages(self):
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

        players = await self.get_players()

        await self.send(json.dumps({
            'type': 'me_join',
            'players': players
        }))

    async def disconnect(self, close_code):
        username = self.scope["user"].username

        await self.channel_layer.group_discard(
            self.game_group_name,
            self.channel_name
        )

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': 'player_leave',
                'username': username
            }
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        username = self.scope["user"].username

        await self.channel_layer.group_send(
            self.game_group_name,
            {
                'type': type,
                'username': username,
                'sender_channel_name': self.channel_name,
                'text_data_json': text_data_json
            }
        )
    
    async def player_join(self, event):
        username = event['username']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'player_join',
                'username': username
            }))
    
    async def player_leave(self, event):
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'player_leave',
            'username': username
        }))

    async def start_game(self, event):

        await self.send(text_data=json.dumps({
            'type': 'start_game'
        }))
    
    async def player(self, event):
        text_data_json = event['text_data_json']
        player = text_data_json['player']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'player',
                'player': player
            }))
        
    async def round(self, event):
        username = event['username']

        await self.send(text_data=json.dumps({
            'type': 'round',
            'username': username
        }))
    
    async def collision(self, event):
        text_data_json = event['text_data_json']
        player = text_data_json['player']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'collision',
                'player': player
            }))
    
    async def powerup(self, event):
        text_data_json = event['text_data_json']
        powerup = text_data_json['powerup']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'powerup',
                'powerup': powerup
            }))

    async def power_splice(self, event):
        text_data_json = event['text_data_json']
        index = text_data_json['index']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'power_splice',
                'index': index
            }))

    async def give_others(self, event):
        text_data_json = event['text_data_json']
        power_id = text_data_json['power_id']
        player_id = text_data_json['player_id']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'give_others',
                'power_id': power_id,
                'player_id': player_id
            }))

    async def renew_others(self, event):
        text_data_json = event['text_data_json']
        power_index = text_data_json['power_index']
        power_id = text_data_json['power_id']
        player_id = text_data_json['player_id']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'renew_others',
                'power_index': power_index,
                'power_id': power_id,
                'player_id': player_id
            }))

    async def game_iters(self, event):
        text_data_json = event['text_data_json']
        power_id = text_data_json['power_id']

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'game_iters',
                'power_id': power_id
            }))
    
    @database_sync_to_async
    def get_players(self):
        game = Game.objects.get(id=self.game_id)
        players = list(game.players.order_by('joined_at').values('user__username'))
        return [{'username': player['user__username']} for player in players]


    