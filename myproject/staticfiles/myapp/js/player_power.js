FtPlayer.pick_powerups = function()
{
    for (let i = 0; i < game.powers.length; i++)
    {
        if (this.stop == true) break;
        if (dist(this.pos, game.powers[i].pos) <= (this.radius + 20))
        {
            this.give_powerup(game.powers[i].id);
            game.powers.splice(i, 1);
            sendGameAction({'type': 'power_splice',
                'index': i})
            i--;
        }
    }
    this.iter_power();
}

FtPlayer.give_powerup = function(id)
{
    if (id <= 4) //give me
    {
        let power = new game.powerConstructors[id](id, [0, 0], game.baseIters[id], this.id);
        this.powers.push(power);
    }
    if (id == 5) //renew me
    {
        let id_renew = this.check_powerup(id)
        if (id_renew == -1)
        {
            let power = new game.powerConstructors[id](id, [0, 0], game.baseIters[id], this.id);
            this.powers.push(power);
        } 
        else this.powers[id_renew].iters = game.baseIters[id]; 
    }
    if (id >= 6 && id <= 9) //give others
    {
        for (let i = 0; i < game.players.length; i++)
        {
            if (game.players[i].id != this.id)
            {
                let power = new game.powerConstructors[id](id, [0, 0], game.baseIters[id], game.players[i].id);
                game.players[i].powers.push(power);
                sendGameAction({'type': 'give_others',
                    'power_id': id,
                    'player_id': game.players[i].id})
            } 
        }
    }
    if (id == 10 || id == 11) //renew others
    {
        for (let i = 0; i < game.players.length; i++)
        {
            if (game.players[i].id != this.id)
            {
                let id_renew = game.players[i].check_powerup(id);
                if (id_renew == -1)
                {
                    let power = new game.powerConstructors[id](id, [0, 0], game.baseIters[id], game.players[i].id);
                    game.players[i].powers.push(power);
                    sendGameAction({'type': 'give_others',
                        'power_id': id,
                        'player_id': game.players[i].id})
                }
                else 
                {
                    game.players[i].powers[id_renew].iters = game.baseIters[id];
                    sendGameAction({'type': 'renew_others',
                    'power_index': id_renew,
                    'power_id': id,
                    'player_id': game.players[i].id})
                }
            } 
        }
    }
    if (id == 12 || id == 13) //renew all
    {
        game.currentIters[id] = game.baseIters[id];
        for (let i = 0; i < game.players.length; i++)
        {
            let id_renew = this.check_powerup(id);
            if (id_renew == -1)
            {
                let power = new game.powerConstructors[id](id, [0, 0], game.baseIters[id], this.id);
                game.players[i].powers.push(power);
            }
            else this.powers[id_renew].iters = game.baseIters[id]; 
        }
    }
    if (id == 14 || id == 15) //general
    {
        game.currentIters[id] = game.baseIters[id];
        if (id == 15) reset_paint();
    }
}

FtPlayer.iter_power = function()
{
    for (let i = 0; i < this.powers.length; i++)
    {
        curr_power = this.powers[i];
        if (curr_power.iters == game.baseIters[curr_power.id] && this.count_powerup(curr_power.id) < 4)
            curr_power.powerApply();
        if (curr_power.iters == -1)
        {
            curr_power.powerRemove();
            this.powers.splice(i, 1);
            i--;
        }
        curr_power.iters--;
    }
}
