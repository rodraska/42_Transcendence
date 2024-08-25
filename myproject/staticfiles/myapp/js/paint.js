function paint_gg()
{
    ctx.fillStyle = "rgba(64, 64, 64, 0.8)";
    ctx.fillRect(offset, height / 2 - 30, width - offset, 38);
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    if (game.game_winner == 0)
    {
        ctx.fillStyle = 'white';
        ctx.fillText(game.round_winner + " Wins This Round", width / 2, height / 2);
    }
    else
    {
        ctx.fillStyle = game.players[game.game_winner - 1].color;
        ctx.fillText("Player " + game.game_winner + " Wins The Game", width / 2, height / 2);
    }    
}

function final_paint()
{
    reset_paint();
    game.PaintHist();
    game.PaintPlayer();
    game.PaintPowers();
    paint_offset();
    paint_gg();
}

function paint_bulb()
{
    ctx.fillStyle = 'darkgray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < game.players.length; i++)
    {
        for (let x = 0; x < game.players[i].powers.length; x++)
        {
            if (game.players[i].powers[x].id == 12)
            {
                ctx.save();
                ctx.beginPath();
                ctx.arc(game.players[i].truepos[0], game.players[i].truepos[1], 100, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.clip();
                restoreCanvas();
                game.PaintPlayer();
                game.PaintPowers();
                ctx.restore();
            }  
        }
    }
}

function paint_line(x_i, y_i, x_f, y_f)
{
    ctx.beginPath();
    ctx.moveTo(x_i, y_i);
    ctx.lineTo(x_f, y_f);
    ctx.stroke();
}

function paint_curve(x_i, y_i, x_m, y_m, x_f, y_f, w)
{
    ctx.beginPath();
    ctx.moveTo(x_i, y_i);
    ctx.quadraticCurveTo(x_m, y_m, x_f, y_f);
    ctx.lineWidth = w;
    ctx.stroke();
}

function paint_offset()
{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, offset, canvas.height);
    ctx.fillRect(canvas.width, 0, -offset, canvas.height);
    ctx.fillRect(0, 0, canvas.width, offset);
    ctx.fillRect(0, canvas.height, canvas.width, -offset);
}

function reset_paint()
{
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0 , width, height);
}