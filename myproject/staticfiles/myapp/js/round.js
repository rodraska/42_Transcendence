function ft_round()
{
    if (game.game_winner != 0) return (final_paint());
    game.round++;
    sendGameAction({'type': 'round'});
    game.powers = [];
    game.players = [];
    ctx.reset();
    ft_start();
}

function players_spawn()
{
    for (let i = 1; i <= numberPlayers; i++)
    {
        let username = getPlayerById(i).username;
        outer: while (1)
        {
            x = Math.floor(Math.random() * 3 * width / 4) - 3 * width / 8;
            y = Math.floor(Math.random() * 3 * height / 4) - 3 * height / 8;
            for (let p = 0; p < game.players.length; p++)
                if (dist([x, y], game.players[p].pos) < 100) {continue outer};
            break ;
        }
        let t = Math.floor(Math.random() * 361) * Math.PI / 180;
        let tmp_player = new Player(i, username, game.playerColors[i], game.playerRGB[i], [x, y], t, game.playerControls[i][0], game.playerControls[i][1])
        if (i == playerId)
            me_player = tmp_player;
        game.players.push(tmp_player);
    }
}

function players_load()
{
    for (let key in game.currentIters) game.currentIters[key] = 0;
    game.round_winner = 0;
    game.stp = 0;
    reset_paint();
    paint_offset();
    game.PaintPlayer();
    game.PaintArrows();
}

function players_still()
{
    if (game.currentIters.load == 0)
    {
        for (let key in game.currentIters) game.currentIters[key] = 0;
        game.round_winner = 0;
        game.stp = 0;
        reset_paint();
    }
    if (game.currentIters.load > 30)
    {
        reset_paint();
        paint_offset();
        game.PaintPlayer();
        game.PaintArrows();
    }
    if (game.currentIters.load == 150) return (players_free());
    
    sendGameAction({'type': 'player',
                    'player': me_player})
    game.currentIters.load++;               
    requestAnimationFrame(players_still);
}

function roundWinner()
{
    game.stp = 1;
    let top_scorer = 0;
    for (let i = 1; i <= game.players.length; i++)
    {
        if (game.players[i - 1].stop == false) game.round_winner = getPlayerById(i).username;
        if (game.playerScores[i] == game.playerScores[top_scorer]) top_scorer = 0;
        if (game.playerScores[i] > game.playerScores[top_scorer]) top_scorer = i;
    }
    if (numberPlayers == 1) game.round_winner = 1;
    if (top_scorer != 0 && game.playerScores[top_scorer] >= numberPlayers * 1) game.game_winner = top_scorer;
}