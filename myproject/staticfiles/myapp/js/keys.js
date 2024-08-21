document.addEventListener('keydown', function(event)
{
    for (let i = 0; i < players.length; i++)
    {
        if (event.key === players[i].right)
        {
            players[i].turning = 1;
            sendGameAction({'type': 'keydown-right',
                            'player-id': playerId});
        }
            
        if (event.key === players[i].left)
        {
            players[i].turning = 2;
            sendGameAction({'type': 'keydown-right',
                            'player-id': playerId});
        }
    }
});

document.addEventListener('keyup', function(event) 
{
    for (let i = 0; i < players.length; i++)
    {
        if (event.key === players[i].right || event.key === players[i].left)
        {
            sendGameAction({'type': 'keyup',
                            'player-id': playerId});
            players[i].turning = 0;
            players[i].vel[0] = players[i].vel_t * players[i].trig[0];
            players[i].vel[1] = players[i].vel_t * players[i].trig[1];
        }
    }
});