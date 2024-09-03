class PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        this.pos = pos;
        this.id = id;
        this.iters = iters;
        this.p_id = p_id;
    }

    getPlayer()
    {
        return (game.players[this.p_id - 1]);
    }

    setPlainObject(plainObj)
    {
        Object.assign(this, plainObj);
    }

    checkApplyPower() 
    {
        if (this.getPlayer() != null)
        {
            let count = 0;
            for (let i = 0; i < this.getPlayer().powers.length; i++) if (this.getPlayer().powers[i].id == this.id) count++;
            if (count < 4) this.powerApply();
        }
    }
    powerApply() {}
    powerRemove() {}
}

class PowerSpeed extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
        
    }
    powerApply()
    {
        this.getPlayer().vel_t *= 2;
        this.getPlayer().turn_rate *= 1.75;
    }   
    powerRemove()
    {
        this.getPlayer().vel_t /= 2;
        this.getPlayer().turn_rate /= 1.75;
    }
}

class PowerSlow extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
        
    }
    powerApply() 
    {
        this.getPlayer().vel_t /= 2;
        this.getPlayer().turn_rate /= 1.35;
    }
    powerRemove() 
    {
        this.getPlayer().vel_t *= 2;
        this.getPlayer().turn_rate *= 1.35;
    }
}

class PowerThin extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
        
    }
    powerApply() 
    {
        this.getPlayer().radius /= 2;
    }
    powerRemove() 
    {
        this.getPlayer().radius *= 2;
    }
}

class PowerSmallTurn extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        this.getPlayer().turn_rate *= 1.6;
    }
    powerRemove() 
    {
        this.getPlayer().turn_rate /= 1.6;
    }
}

class PowerGod extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        this.getPlayer().god = true;
    }
    powerRemove() 
    {
        this.getPlayer().god = false;
    }
}

class PowerBig extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        this.getPlayer().radius *= 2;
    }
    powerRemove() 
    {
        this.getPlayer().radius /= 2;
    }
}

class PowerBigTurn extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        this.getPlayer().turn_rate /= 1.75;
    }
    powerRemove() 
    {
        this.getPlayer().turn_rate *= 1.75;
    }
}

class PowerReverse extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        let tmp = this.getPlayer().right;
        this.getPlayer().right = this.getPlayer().left;
        this.getPlayer().left = tmp;
    }
    powerRemove() 
    {
        let tmp = this.getPlayer().right;
        this.getPlayer().right = this.getPlayer().left;
        this.getPlayer().left = tmp;
    }
}

class PowerCheese extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() 
    {
        this.getPlayer().hole_rate = 4
    }
    powerRemove() 
    {
        this.getPlayer().hole_rate = game.baseValues.hole;
    }
}

class PowerBulb extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerWalls extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerMore extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerRubber extends PowerUp
{
    constructor(id, pos, iters, p_id)
    {
        super(id, pos, iters, p_id);
    }
    powerApply() {}
    powerRemove() {}
}

const FtPower = PowerUp.prototype; 

FtPower.paint_powerup = function()
{
    ctx.fillStyle = game.powerColors[this.id];
    ctx.beginPath();
    ctx.arc((this.pos[0]) + width / 2, (this.pos[1]) + height / 2, 20, 0, 2 * Math.PI);
    ctx.fill();
}

function new_powerup()
{
    drop = (game.currentIters[14] == 0) ? 601 : 301;
    if (Math.floor(Math.random() * drop) > 1) return;
    outer : while (1)
    {
        x = Math.floor(Math.random() * width) - width / 2;
        y = Math.floor(Math.random() * height) - height / 2;
        for (let i = 0; i < game.players.length; i++)
            if (dist([x, y], game.players[i].pos) < 50) {continue outer};
        for (let j = 0; j < game.powers.length; j++)
            if (dist([x, y], game.powers[j].pos) < 20) {continue outer};
        break ;
    }
    //id = Math.floor(Math.random() * 15) + 1; //all the power ups
    //id = Math.floor(Math.random() * 2); //specific range
    id = 15; //specific powerup
    power = new game.powerConstructors[15](id, [x, y], game.baseIters[id], null)
    game.powers.push(power);
    sendGameAction({'type': 'powerup',
                    'powerup': power});
}