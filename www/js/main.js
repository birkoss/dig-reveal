/* @TODO
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
 * Make a sound/effect when trying to reveal when an enemy is active
 *
 * On the new item popup, add a EQUIP button (and rename the remaining as keep)
 * * Allow to add to inventory (Allow multiple usable...)
 *
 * On equip, check to fix the "stamina difference" without allowing the user to cheat and switching armors back and forth
 *
 * On the item list page, instead of hiding the remaining weapon :
 * * Change the tint, change the alpha, and disable the click (will give hope for a better weapon and maybe keep the interest alive)
 *
 * On the usable items list, add an extra label showing the qty
 * * Update that label on update() to always represent the value
 * * When 0, alpha the sprite
 *
 * Verify if the items are randomnize before placing the in a castle (the weapon and armor are always in the same castle....
 *
 */
var GAME = GAME || {};

GAME.debug = true;

GAME.config = {};

/* Base values, never saved */
GAME.config['attack'] = GAME.config['attackBase'] = 1;
GAME.config['staminaMax'] = GAME.config['staminaMaxBase'] = 40;
GAME.config['timeDelay'] = Phaser.Timer.SECOND * 60;

/* Dynamics values */
GAME.config['weapon'] = 'wooden-stick';
GAME.config['armor'] = 'leather-glove';
GAME.config['inventory'] = [{itemID:'wooden-stick', qty:1}, {itemID:'leather-glove', qty:1}, {itemID:"apple", qty:2}];

GAME.config['stamina'] = GAME.config['staminaMax'];
GAME.config['time'] = null;
GAME.config['levelID'] = null;


GAME.RATIO = Math.min(6, Math.floor(window.innerWidth / 320) * 2);

GAME.json = {};

GAME.music = null;

GAME.useItem = function(itemID) {
    let item = GAME.json['items'][itemID];
    if (item.modifier != undefined && item.modifier.stamina != undefined) {
        GAME.config.stamina = Math.min(GAME.config.staminaMax, GAME.config.stamina + item.modifier.stamina);
        GAME.save();
    }
};

GAME.keepItem = function(itemID) {
    console.log("keepItem:" + itemID);
    let existingItem = null;
    GAME.config.inventory.forEach(function(singleItem) {
        if (singleItem.itemID == itemID) {
            existingItem = singleItem;
        }
    }, this);

    if (existingItem == null) {
        GAME.config.inventory.push({itemID:itemID, qty:1});
    } else {
        let item = GAME.json['items'][itemID];
        if (item.usable == true) {
            console.log("QTY ++");
            console.log(existingItem);
            existingItem.qty++;
        }
    }
    GAME.save();
};

GAME.equip = function(type, itemID) {
    if (itemID != null && GAME.json['items'] != null && GAME.json['items'][itemID] != null) {
        let item = GAME.json['items'][itemID];
        if (item.equipable == true) {
            GAME.keepItem(itemID);
        }
        if (item.equipable == true && item.modifier != undefined) {
            if (item.modifier.staminaMax != undefined) {
                GAME.config['staminaMax'] = GAME.config['staminaMaxBase'] + item.modifier.staminaMax;
                GAME.config['stamina'] = Math.min(GAME.config['staminaMax'], GAME.config['stamina']);
            }
            if (item.modifier.attack != undefined) {
                GAME.config['attack'] = GAME.config['attackBase'] + item.modifier.attack;
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
    let fields = ['time', 'stamina', 'levelID', 'weapon', 'armor', 'inventory'];

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
