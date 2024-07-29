class PowerUp
{
    constructor(id, pos, iters, player)
    {
        this.pos = pos;
        this.id = id;
        this.iters = iters;
        this.player = player;
    }
    checkApplyPower() 
    {
        if (this.player != null)
        {
            let count = 0;
            for (let i = 0; i < this.player.powers.length; i++) if (this.player.powers[i].id == this.id) count++;
            if (count < 4) this.powerApply();
        }
    }
    powerApply() {}
    powerRemove() {}
}

class PowerSpeed extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
        
    }
    powerApply()
    {
        this.player.vel_t *= 2;
        this.player.turn_rate *= 1.75;
    }   
    powerRemove()
    {
        this.player.vel_t /= 2;
        this.player.turn_rate /= 1.75;
    }
}

class PowerSlow extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
        
    }
    powerApply() 
    {
        this.player.vel_t /= 2;
        this.player.turn_rate /= 1.35;
    }
    powerRemove() 
    {
        this.player.vel_t *= 2;
        this.player.turn_rate *= 1.35;
    }
}

class PowerThin extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
        
    }
    powerApply() 
    {
        this.player.radius /= 2;
    }
    powerRemove() 
    {
        this.player.radius *= 2;
    }
}

class PowerSmallTurn extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        this.player.turn_rate *= 1.6;
    }
    powerRemove() 
    {
        this.player.turn_rate /= 1.6;
    }
}

class PowerGod extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        this.player.god = true;
    }
    powerRemove() 
    {
        this.player.god = false;
    }
}

class PowerBig extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        this.player.radius *= 2;
    }
    powerRemove() 
    {
        this.player.radius /= 2;
    }
}

class PowerBigTurn extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        this.player.turn_rate /= 1.75;
    }
    powerRemove() 
    {
        this.player.turn_rate *= 1.75;
    }
}

class PowerReverse extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        let tmp = this.player.right;
        this.player.right = this.player.left;
        this.player.left = tmp;
    }
    powerRemove() 
    {
        let tmp = this.player.right;
        this.player.right = this.player.left;
        this.player.left = tmp;
    }
}

class PowerCheese extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() 
    {
        this.player.hole_rate = 4
    }
    powerRemove() 
    {
        this.player.hole_rate = baseValues.hole;
    }
}

class PowerBulb extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerWalls extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerMore extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() {}
    powerRemove() {}
}

class PowerRubber extends PowerUp
{
    constructor(id, pos, iters, player)
    {
        super(id, pos, iters, player);
    }
    powerApply() {}
    powerRemove() {}
}

const FtPower = PowerUp.prototype; 

FtPower.paint_powerup = function()
{
    ctx.fillStyle = powerColors[this.id];
    ctx.beginPath();
    ctx.arc((this.pos[0]) + width / 2, (this.pos[1]) + height / 2, 20, 0, 2 * Math.PI);
    ctx.fill();
}

function new_powerup()
{
    drop = (currentIters[14] == 0) ? 601 : 301;
    if (Math.floor(Math.random() * drop) > 1) return;
    outer : while (1)
    {
        x = Math.floor(Math.random() * width) - width / 2;
        y = Math.floor(Math.random() * height) - height / 2;
        for (let i = 0; i < players.length; i++)
            if (dist([x, y], players[i].pos) < 50) {continue outer};
        for (let j = 0; j < powers.length; j++)
            if (dist([x, y], powers[j].pos) < 20) {continue outer};
        break ;
    }
    //id = Math.floor(Math.random() * 15) + 1; //all the power ups
    //id = Math.floor(Math.random() * 2); //specific range
    id = 1; //specific powerup
    //powers.push(new PowerUp(id, [x, y], baseIters[id]));
    powers.push(new powerConstructors[15](id, [x, y], baseIters[id], null));
}