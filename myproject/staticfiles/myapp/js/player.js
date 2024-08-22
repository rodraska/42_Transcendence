class Player
{
    back = [0, 0];
    mid = [0, 0];
    powers = [];
    vel = [0, 0];
    vel_t = baseValues.vel;
    radius = baseValues.radius;
    turn_rate = baseValues.turn;
    hole_rate = baseValues.hole;
    hole_iter = 0;
    turning = 0;
    god = false;
    stop = false;

    constructor(id, name, color, rgb, pos, theta, right, left)
    {
        this.id = id;
        this.name = name;
        this.color = color;
        this.rgb = rgb;
        this.pos = pos;
        this.truepos = [pos[0] + width / 2, pos[1] + height / 2];
        this.theta = theta;
        this.trig = [this._cos(0), this._sin(0)];
        this.right = right;
        this.left = left;
    }

    static fromPlainObject(plainObj) {
        // Create a new Player instance with the required constructor parameters
        const player = new Player(
            plainObj.id || null,
            plainObj.name || "",
            plainObj.color || "",
            plainObj.rgb || [],
            plainObj.pos || [0, 0],
            plainObj.theta || 0,
            plainObj.right || false,
            plainObj.left || false
        );

        // Iterate over all properties in the plain object and assign them to the new Player instance
        for (const [key, value] of Object.entries(plainObj)) {
            if (key !== 'constructor' && key !== '__proto__') {
                player[key] = value;
            }
        }

        // Ensure all class-level attributes are set, using default values if not present in plainObj
        player.back = plainObj.back || [0, 0];
        player.mid = plainObj.mid || [0, 0];
        player.powers = plainObj.powers || [];
        player.vel = plainObj.vel || [0, 0];
        player.vel_t = plainObj.vel_t || baseValues.vel;
        player.radius = plainObj.radius || baseValues.radius;
        player.turn_rate = plainObj.turn_rate || baseValues.turn;
        player.hole_rate = plainObj.hole_rate || baseValues.hole;
        player.hole_iter = plainObj.hole_iter || 0;
        player.turning = plainObj.turning || 0;
        player.god = plainObj.god || false;
        player.stop = plainObj.stop || false;

        // Recalculate any derived properties
        player.truepos = [player.pos[0] + width / 2, player.pos[1] + height / 2];
        player.trig = [player._cos(0), player._sin(0)];

        return player;
    }
}

const FtPlayer = Player.prototype;