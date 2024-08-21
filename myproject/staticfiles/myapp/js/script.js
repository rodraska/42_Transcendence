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

console.log('playerId:', playerId);

function players_free()
{
    if (currentIters.begin == 150)
    {
        reset_paint();
        saveCanvas();
        return (players_play());
    }
    currentIters.load = 0;
    reset_paint();
    gameSaveHist();
    gameCoordinates();
    gamePaintPlayer();
    gamePaintArrows();
    paint_offset();
    currentIters.begin++;
    requestAnimationFrame(players_free);
}

function begin_iter()
{
    for (let i = 12; i <= 15; i++) if (currentIters[i] > 0) currentIters[i]--;
    paint_offset();
    new_powerup();
    restoreCanvas();
}

function curr_iter()
{
    gameSaveHist();
    gameCoordinates();
    gameHoles();
    gamePowers();
    gameCheckCollision();
    gamePaintHist();
    saveCanvas();
    gamePaintPlayer();
    gamePaintPowers();
}

function end_iter()
{
    if (currentIters[12] > 0) paint_bulb();
    if (currentIters.end > 60) paint_gg();
    gamePaintArcs();
    paint_offset();
    currentIters.begin++;
}

function players_play()
{
    if (stp == 1) currentIters.end++;
    if (currentIters.end > 300) return (ft_round());
    sendGameAction({'type': 'player',
                    'player': players[playerId - 1]})
    begin_iter();
    curr_iter();
    end_iter();
    requestAnimationFrame(players_play);
}

function ft_start()
{
    reset_paint();
    players_spawn();
    players_load();
    players_still();
}