var GAME = GAME || {};

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Game', GAME.Game);

GAME.game.state.start('Boot');

GAME.RATIO = window.devicePixelRatio;
GAME.RATIO = Math.floor(window.innerWidth / 320) * 2;

GAME.STAMINA = GAME.STAMINA_MAX = 100;
GAME.timeDelay = Phaser.Timer.SECOND * 60;
GAME.time = null;

GAME.music = null;

GAME.tick = function() {
    if (GAME.STAMINA < GAME.STAMINA_MAX) {
        GAME.now = (new Date()).getTime();
        if (GAME.time == null) {
            GAME.time = GAME.now;
        }

        while (GAME.time + GAME.timeDelay <= GAME.now) {
            GAME.time += GAME.timeDelay;
            GAME.STAMINA = Math.min(GAME.STAMINA_MAX, GAME.STAMINA + 1);
            /* Stop the loop if we are full */
            if (GAME.STAMINA >= GAME.STAMINA_MAX) {
                break;
            }
        }
    } else {
        GAME.time = null;
    }

    GAME.save();
};

GAME.save = function() {
    let data = {};
    data['time'] = GAME.time;
    data['stamina'] = GAME.STAMINA;
    data['stamina_max'] = GAME.STAMINA_MAX;

    localStorage.setItem('game_config', JSON.stringify(data));
};

GAME.load = function() {
    let data = localStorage.getItem('game_config');
    if (data != null) {
        data = JSON.parse(data);

        GAME.time = data['time'];
        GAME.STAMINA = data['stamina'];
        GAME.STAMINA_MAX = data['stamina_max'];
    }
};

GAME.load();
