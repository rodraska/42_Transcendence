const canvas = document.getElementById('curve');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

s_canvas = document.createElement("canvas");
s_canvas.width = canvas.width;
s_canvas.height = canvas.height;
s_ctx = s_canvas.getContext('2d');

const offset = 4;
const width = canvas.width;
const height = canvas.height;

var me_player;

game = new Game();

function players_free()
{
    if (game.currentIters.begin == 150)
    {
        reset_paint();
        saveCanvas();
        return (players_play());
    }
    game.currentIters.load = 0;
    reset_paint();
    me_player.save_hist();
    me_player.generalized_coordinates();
    game.PaintPlayer();
    game.PaintArrows();
    paint_offset();
    sendGameAction({'type': 'player',
                    'player': me_player})
    game.currentIters.begin++;
    requestAnimationFrame(players_free);
}

function begin_iter()
{
    for (let i = 12; i <= 15; i++) if (game.currentIters[i] > 0) game.currentIters[i]--;
    paint_offset();
    //new_powerup();
    restoreCanvas();
}

function curr_iter()
{
    me_player.save_hist();
    me_player.generalized_coordinates();
    me_player.holes();
    me_player.pick_powerups();
    me_player.checkCollision();
    game.PaintHist();
    saveCanvas();
    game.PaintPlayer();
    game.PaintPowers();
}

function end_iter()
{
    if (game.currentIters[12] > 0) paint_bulb();
    if (game.currentIters.end > 60) paint_gg();
    game.PaintArcs();
    paint_offset();
    game.currentIters.begin++;
}

function players_play()
{
    if (game.stp == 1) game.currentIters.end++;
    if (game.currentIters.end > 300) return (ft_round());
    begin_iter();
    curr_iter();
    end_iter();
    sendGameAction({'type': 'player',
                    'player': me_player})
    requestAnimationFrame(players_play);
}

function ft_start()
{
    reset_paint();
    players_spawn();
    players_load();
    players_still();
}