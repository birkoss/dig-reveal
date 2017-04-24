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
GAME.tick = function() {
    if (GAME.STAMINA < GAME.STAMINA_MAX) {
        let now = (new Date()).getTime();
        if (GAME.time == null) {
            console.log('Setting time to : ' + now);
            GAME.time = now;
        }

        while (GAME.time + GAME.timeDelay <= now) {
            console.log('Tick...');
            GAME.time += GAME.timeDelay;
            GAME.STAMINA = Math.min(GAME.STAMINA_MAX, GAME.STAMINA + 1);
        }
    } else {
        GAME.time = null;
    }
};
