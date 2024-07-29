from django import forms
from .models import ChatRoom, Game

class ChatRoomForm(forms.ModelForm):
    class Meta:
        model = ChatRoom
        fields = ['name']

class GameForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = ['name']