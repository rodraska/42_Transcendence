function ft_round()
{
    if (game_winner != 0) return (final_paint());
    round++;
    sendGameAction({'type': 'round'});
    powers = [];
    players = [];
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
            for (let p = 0; p < players.length; p++)
                if (dist([x, y], players[p].pos) < 100) {continue outer};
            break ;
        }
        let t = Math.floor(Math.random() * 361) * Math.PI / 180;
        let tmp_player = new Player(i, username, playerColors[i], playerRGB[i], [x, y], t, playerControls[i][0], playerControls[i][1])
        if (i == playerId)
            me_player = tmp_player;
        players.push(tmp_player);
    }
}

function players_load()
{
    for (let key in currentIters) currentIters[key] = 0;
    round_winner = 0;
    stp = 0;
    paint_offset();
    gamePaintPlayer();
    gamePaintArrows();
}

function players_still()
{
    if (currentIters.load == 150) return (players_free());
    currentIters.load++;
    requestAnimationFrame(players_still);
}

function roundWinner()
{
    stp = 1;
    let top_scorer = 0;
    for (let i = 1; i <= players.length; i++)
    {
        if (players[i - 1].stop == false) round_winner = getPlayerById(i).username;
        if (playerScores[i] == playerScores[top_scorer]) top_scorer = 0;
        if (playerScores[i] > playerScores[top_scorer]) top_scorer = i;
    }
    if (numberPlayers == 1) round_winner = 1;
    if (top_scorer != 0 && playerScores[top_scorer] >= numberPlayers * 1) game_winner = top_scorer;
}