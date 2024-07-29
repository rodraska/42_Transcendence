from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('chat/room', views.chat_room_list, name='chat_room_list'),
    path('chat/room/create', views.create_chat_room, name='create_chat_room'),
    path('chat/room/<int:room_id>/', views.chat_room, name='chat_room'),
    path('chat/room/<int:room_id>', views.delete_chat_room, name="delete_chat_room"),
    path('games/', views.game_list, name='game_list'),
    path('games/create', views.create_game, name='create_game'),
    path('games/<int:game_id>/', views.game_room, name='game_room'),
    path('games/<int:game_id>/leave/', views.leave_game, name='leave_game'),
    path('games/<int:game_id>/delete', views.delete_game, name='delete_game'),
    path('games/<int:game_id>/play/', views.game_play, name='game_play'),
]