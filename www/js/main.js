var GAME = GAME || {};

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Game', GAME.Game);

GAME.game.state.start('Boot');

GAME.RATIO = window.devicePixelRatio;
GAME.RATIO = Math.floor(window.innerWidth / 320) * 2;

GAME.timeDelay = Phaser.Timer.SECOND * 2;
GAME.time = null;
/* @TODO Load the value here */
GAME.tick = function() {
    if (GAME.STAMINA < GAME.STAMINA_MAX) {
        GAME.now = (new Date()).getTime();
        if (GAME.time == null) {
            GAME.time = GAME.now;
        }

        while (GAME.time + GAME.timeDelay <= GAME.now) {
            GAME.time += GAME.timeDelay;
            GAME.STAMINA = Math.min(GAME.STAMINA_MAX, GAME.STAMINA + 1);
            /* @TODO Save the value here */
        }
    } else {
        GAME.time = null;
    }
};
