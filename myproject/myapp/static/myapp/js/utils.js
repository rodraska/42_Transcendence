function dist([x1, y1], [x2, y2])
{
    return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
}

function avg(x1, x2)
{
    return ((x1 + x2) / 2);
}

function loop_all_players(ft_function, ...args)
{
    for (let j = 0; j < players.length; j++) ft_function.apply(players[j], args);
}

function loop_all_powers(ft_function, ...args)
{
    for (let j = 0; j < powers.length; j++) ft_function.apply(powers[j], args);
}  

function give_points(id)
{
    for (let i = 0; i < players.length; i++)
    {
        (i != (id - 1) && players[i].stop == false) ? playerScores[i + 1] += 1 : null;
        /* abc Increase player score */
    }
}

function checkColor(pos, color)
{
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var colorData = ctx.getImageData(0, 0, 1, 1).data;
    var posData = ctx.getImageData(pos[0], pos[1], 1, 1).data;
    for (let k = 0; k < 3; k++) if (posData[k] != colorData[k]) return (0);
    return (1);
}

function checkRGB(pos, rgb)
{
    var posData = ctx.getImageData(pos[0], pos[1], 1, 1).data;
    for (let k = 0; k < 3; k++) if (posData[k] != rgb[k]) return (0);
    return (1);
}