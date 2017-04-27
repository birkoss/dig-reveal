var GAME = GAME || {};

GAME.config = {};

/* Base values, never saved */
GAME.config['attack'] = 1;
GAME.config['staminaMax'] = 100;
GAME.config['timeDelay'] = Phaser.Timer.SECOND * 60;

/* Dynamics values */
GAME.config['weapon'] = null;
GAME.config['shield'] = null;
GAME.config['stamina'] = GAME.config['staminaMax'];
GAME.config['time'] = null;
GAME.config['levelID'] = null;


GAME.RATIO = Math.floor(window.innerWidth / 320) * 2;

GAME.json = {};

GAME.music = null;

GAME.equip = function(type, itemID) {
    if (itemID != null && GAME.json['items'] != null && GAME.json['items'][itemID] != null) {
        let item = GAME.json['items'][itemID];
        /* Stamina Max = Stamina & StaminaMax mod */
        console.log(item);
    }
};

GAME.tick = function() {
    if (GAME.config.stamina < GAME.config.staminaMax) {
        GAME.now = (new Date()).getTime();
        if (GAME.config.time == null) {
            GAME.config.time = GAME.now;
        }

        /* Increase our stamina (retroactively...) */
        while (GAME.config.time + GAME.config.timeDelay <= GAME.now) {
            GAME.config.time += GAME.config.timeDelay;
            GAME.config.stamina = Math.min(GAME.config.staminaMax, GAME.config.stamina + 1);
            /* Stop the loop if we are full */
            if (GAME.config.stamina >= GAME.config.staminaMax) {
                break;
            }

            /* @TODO Should not call this that often... */
            GAME.save();
        }
    } else {
        GAME.config.time = null;
    }
};

GAME.save = function() {
    let fields = ['time', 'stamina', 'levelID', 'weapon', 'shield'];

    let data = {};
    fields.forEach(function(field) {
        data[field] = GAME.config[field];
    }, this);

    localStorage.setItem('game_config', JSON.stringify(data));
};

GAME.load = function() {
    let data = localStorage.getItem('game_config');
    if (data != null) {
        data = JSON.parse(data);

        GAME.config = Object.assign(GAME.config, data);
    }
};

GAME.load();

console.log(GAME.config);
/* Start Phaser */

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Game', GAME.Game);
GAME.game.state.add('Debug', GAME.Debug);

GAME.game.state.start('Boot');
