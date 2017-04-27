/* @TODO
 *
 * See how to fix accentuated character
 * - Use a new fonts to replace gui and gui-multiline
 *
 * Time based usable items:
 * - Reduce the stamina timeDelay by X secondes for 2 hours
 *
 * Weapon effects
 * - Some weapon may add a AOE (without stamina cost) when we reveal tiles (With a % of happening)
 *   - X effects until borders
 *   - Square effects
 *   - + effects until borders
 *   
 * Enemy effects
 * - On hit, hide in another hidden cell (if remaining)
 * - On death, spawn another enemy (like a weak skeleton)
 * - On reveal, spawn enemies around to protect it
 * - On health below treshold, change into another enemy
 *
 * Add an inventory for owned weapon and shield
 * Add a default weapon that attack of 1, same with shield
 *
 */
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


GAME.RATIO = Math.min(6, Math.floor(window.innerWidth / 320) * 2);

GAME.json = {};

GAME.music = null;

GAME.equip = function(type, itemID) {
    if (itemID != null && GAME.json['items'] != null && GAME.json['items'][itemID] != null) {
        let item = GAME.json['items'][itemID];
        if (item.equipable == true && item.modifier != undefined) {
            if (item.modifier.staminaMax != undefined) {
                GAME.config['stamina'] += item.modifier.staminaMax;
                GAME.config['staminaMax'] += item.modifier.staminaMax;
            }
            if (item.modifier.attack != undefined) {
                GAME.config['attack'] += item.modifier.attack;
            }

            /* If it's a new equipment, equip and save it */
            if (GAME.config[item.slot] != item.id) {
                GAME.config[item.slot] = item.id;
                GAME.save();
            }
        }
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
