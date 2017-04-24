var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:castle', 'images/tiles/castle.png');
        this.load.image('tile:fog-of-war', 'images/tiles/fog-of-war.png');

        this.load.image('tile:village-start', 'images/tiles/village/start.png');
        this.load.image('tile:village-floor', 'images/tiles/village/floor.png');
        this.load.image('tile:village-detail', 'images/tiles/village/detail.png');
        this.load.image('tile:village-border-top', 'images/tiles/village/borders/top.png');
        this.load.image('tile:village-border-right', 'images/tiles/village/borders/right.png');
        this.load.image('tile:village-border-bottom', 'images/tiles/village/borders/bottom.png');
        this.load.image('tile:village-border-left', 'images/tiles/village/borders/left.png');
        this.load.spritesheet('tile:village-border-middle', 'images/tiles/village/borders/middle.png', 16, 16);
        this.load.image('tile:village-border-top-left', 'images/tiles/village/borders/top-left.png');
        this.load.image('tile:village-border-top-right', 'images/tiles/village/borders/top-right.png');
        this.load.image('tile:village-border-bottom-left', 'images/tiles/village/borders/bottom-left.png');
        this.load.image('tile:village-border-bottom-right', 'images/tiles/village/borders/bottom-right.png');

        this.load.image('tile:castle-start', 'images/tiles/castle/start.png');
        this.load.image('tile:castle-floor', 'images/tiles/castle/floor.png');
        this.load.image('tile:castle-detail', 'images/tiles/castle/detail.png');
        this.load.image('tile:castle-border-top', 'images/tiles/castle/borders/top.png');
        this.load.image('tile:castle-border-right', 'images/tiles/castle/borders/right.png');
        this.load.image('tile:castle-border-bottom', 'images/tiles/castle/borders/bottom.png');
        this.load.image('tile:castle-border-left', 'images/tiles/castle/borders/left.png');
        this.load.spritesheet('tile:castle-border-middle', 'images/tiles/castle/borders/middle.png', 16, 16);
        this.load.image('tile:castle-border-top-left', 'images/tiles/castle/borders/top-left.png');
        this.load.image('tile:castle-border-top-right', 'images/tiles/castle/borders/top-right.png');
        this.load.image('tile:castle-border-bottom-left', 'images/tiles/castle/borders/bottom-left.png');
        this.load.image('tile:castle-border-bottom-right', 'images/tiles/castle/borders/bottom-right.png');

        this.load.image('panel:background', 'images/panel/background.png');
        this.load.image('panel:stamina-timer', 'images/panel/stamina-timer.png');
        this.load.image('panel:stamina', 'images/panel/stamina.png');

        this.load.image('progress-bar:background', 'images/progress-bar/background.png');
        this.load.image('progress-bar:filling', 'images/progress-bar/filling.png');
        this.load.image('progress-bar:border', 'images/progress-bar/border.png');

        this.load.spritesheet('unit:skeleton', 'images/units/skeleton.png', 16, 16);

        this.load.spritesheet('effect:dead', 'images/effects/dead.png', 16, 16);
        this.load.spritesheet('effect:attack', 'images/effects/attack.png', 16, 16);

        this.load.bitmapFont('font:gui', 'images/fonts/gui.png', 'images/fonts/gui.xml');

        this.load.audio('music:village', 'audio/musics/village.ogg');
        this.load.audio('music:castle', 'audio/musics/castle.ogg');

        this.load.audio('sound:attack', 'audio/sounds/attack.wav');
        this.load.audio('sound:fow', 'audio/sounds/fow.wav');
        this.load.audio('sound:skeleton', 'audio/sounds/skeleton.wav');
    },
    create: function() {
        GAME.level = {type:'village', name:'Village', id:'village'};

        this.state.start('Game');
    }
};
