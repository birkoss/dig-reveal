var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:grass', 'images/tiles/grass.png');
        this.load.image('tile:dungeon', 'images/tiles/dungeon.png');
        this.load.image('tile:village', 'images/tiles/village.png');
        this.load.image('tile:castle', 'images/tiles/castle.png');
        this.load.image('tile:fog-of-war', 'images/tiles/fog-of-war.png');

        this.load.image('tile:water-top', 'images/tiles/water/top.png');
        this.load.image('tile:water-right', 'images/tiles/water/right.png');
        this.load.image('tile:water-bottom', 'images/tiles/water/bottom.png');
        this.load.image('tile:water-left', 'images/tiles/water/left.png');
        this.load.spritesheet('tile:water-middle', 'images/tiles/water/middle.png', 16, 16);
        this.load.image('tile:water-top-left', 'images/tiles/water/top-left.png');
        this.load.image('tile:water-top-right', 'images/tiles/water/top-right.png');
        this.load.image('tile:water-bottom-left', 'images/tiles/water/bottom-left.png');
        this.load.image('tile:water-bottom-right', 'images/tiles/water/bottom-right.png');
    },
    create: function() {
        this.state.start('Game');
    }
};
