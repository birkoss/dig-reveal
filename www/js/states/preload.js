var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:grass', 'images/tiles/grass.png');
        this.load.image('tile:dungeon', 'images/tiles/dungeon.png');
        this.load.image('tile:fog-of-war', 'images/tiles/fog-of-war.png');
    },
    create: function() {
        this.state.start('Game');
    }
};
