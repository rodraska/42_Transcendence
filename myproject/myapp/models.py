from django.db import models, transaction
from django.contrib.auth.models import User
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

# Create your models here.

class ChatRoom(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class Game(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    game_state = models.JSONField(default=dict)

    def __str__(self):
        return self.name
    
    @property
    def number_of_players(self):
        return self.players.count()

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.SET_NULL, null=True, related_name='players')
    points = models.IntegerField(default=0)
    joined_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username
    
    class Meta:
        ordering = ['joined_at']

    def join_game(self, game):
        self.game = game
        self.joined_at = timezone.now()
        self.save()

    def leave_game(self):
        self.game = None
        self.joined_at = None
        self.save()
