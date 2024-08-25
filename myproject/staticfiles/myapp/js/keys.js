document.addEventListener('keydown', function(event)
{
    if (event.key === me_player.right)
        me_player.turning = 1;     
    if (event.key === me_player.left)
        me_player.turning = 2;
});

document.addEventListener('keyup', function(event) 
{
    if (event.key === me_player.right || event.key === me_player.left)
    {
        me_player.turning = 0;
        me_player.vel[0] = me_player.vel_t * me_player.trig[0];
        me_player.vel[1] = me_player.vel_t * me_player.trig[1];
    }
});