from django.shortcuts import render, redirect, get_object_or_404
from .models import ChatRoom, Message, Game, Player
from .forms import ChatRoomForm, GameForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
import json
from django.db import transaction
from django.utils import timezone

# Create your views here.

def home_view(request):
    return render(request, 'home.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, 'login.html', {'error: Invalid username or password'})
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

@login_required
def chat_room_list(request):
    rooms = ChatRoom.objects.all()
    return render(request, 'chat_room_list.html', {'rooms': rooms})

@login_required
def chat_room(request, room_id):
    room = ChatRoom.objects.get(id=room_id)
    messages = room.messages.all()

    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Message.objects.create(room=room, sender=request.user, content=content)
        return redirect('chat_room', room_id=room.id)

    return render(request, 'chat_room.html', {'room': room, 'messages': messages})

@login_required
def create_chat_room(request):
    if request.method == 'POST':
        form = ChatRoomForm(request.POST)
        if form.is_valid():
            room = form.save(commit=False)
            room.created_by = request.user
            room.save()
            return redirect('chat_room_list')
    else:
        form = ChatRoomForm()
    return render(request, 'create_chat_room.html', {'form': form})

def game_list(request):
    active_games = Game.objects.filter(is_active=True).order_by('-created_at')
    return render(request, 'game_list.html', {'active_games': active_games})

@login_required
def delete_chat_room(request, room_id):
    chat_room = get_object_or_404(ChatRoom, id=room_id)
    chat_room.delete()
    return redirect('chat_room_list')


@login_required
def create_game(request):
    if request.method == 'POST':
        form = GameForm(request.POST)
        if form.is_valid():
            game = form.save()
            player, created = Player.objects.get_or_create(user=request.user)
            player.game = game
            player.save()
            return redirect('game_list')
    else:
        form = GameForm()
    return render(request, 'create_game.html', {'form': form})

@login_required
def game_room(request, game_id):
    game = get_object_or_404(Game, id=game_id)

    with transaction.atomic():
        player, created = Player.objects.get_or_create(user=request.user)

        if player.game != game:
            if player.game:
                player.leave_game()
            player.join_game(game)

    players = game.players.all()

    context = {
        'game': game,
        'players': players,
    }

    return render(request, 'game_room.html', context)

@login_required
def game_play(request, game_id):
    game = get_object_or_404(Game, id=game_id)
    players = game.players.all()

    context = {
        'game': game,
        'players': players,
    }
    return render(request, 'game_play.html', context)


@login_required
def leave_game(request, game_id):
    player = Player.objects.get(user=request.user)
    if player.game and player.game.id == game_id:
        player.game = None
        player.save()
    return redirect('game_list')

@login_required
def delete_game(request, game_id):
    game = get_object_or_404(Game, id=game_id)
    game.delete()
    return redirect('game_list')





