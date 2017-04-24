var GAME = GAME || {};

GAME.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

GAME.game.state.add('Boot', GAME.Boot);
GAME.game.state.add('Preload', GAME.Preload);
GAME.game.state.add('Game', GAME.Game);

GAME.game.state.start('Boot');

GAME.RATIO = window.devicePixelRatio;
GAME.RATIO = Math.floor(window.innerWidth / 320) * 2;

GAME.timerDelay = Phaser.Timer.SECOND * 2;
GAME.updateTimer = function(game) {
    if (GAME.STAMINA < GAME.STAMINA_MAX) {
        if (GAME.timer == null) {
            GAME.timer = game.time.events.loop(GAME.timerDelay, function() {
                GAME.STAMINA = Math.min(GAME.STAMINA_MAX, GAME.STAMINA + 1);
            }, this);
        }
    } else {
        if (GAME.timer != null) {
            game.time.events.remove(GAME.timer);
            GAME.timer = null;
        }
    }
}
