var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('tile:fog-of-war', 'images/tiles/fog-of-war.png');

        this.load.image('tile:map-start', 'images/tiles/map/start.png');
        this.load.image('tile:map-dungeon', 'images/tiles/map/dungeon.png');
        this.load.image('tile:map-floor', 'images/tiles/map/floor.png');
        this.load.image('tile:map-detail', 'images/tiles/map/detail.png');
        this.load.image('tile:map-border-top', 'images/tiles/map/borders/top.png');
        this.load.image('tile:map-border-right', 'images/tiles/map/borders/right.png');
        this.load.image('tile:map-border-bottom', 'images/tiles/map/borders/bottom.png');
        this.load.image('tile:map-border-left', 'images/tiles/map/borders/left.png');
        this.load.spritesheet('tile:map-border-middle', 'images/tiles/map/borders/middle.png', 16, 16);
        this.load.image('tile:map-border-top-left', 'images/tiles/map/borders/top-left.png');
        this.load.image('tile:map-border-top-right', 'images/tiles/map/borders/top-right.png');
        this.load.image('tile:map-border-bottom-left', 'images/tiles/map/borders/bottom-left.png');
        this.load.image('tile:map-border-bottom-right', 'images/tiles/map/borders/bottom-right.png');

        this.load.image('tile:dungeon-start', 'images/tiles/dungeon/start.png');
        this.load.image('tile:dungeon-chest', 'images/tiles/dungeon/chest.png');
        this.load.image('tile:dungeon-floor', 'images/tiles/dungeon/floor.png');
        this.load.image('tile:dungeon-detail', 'images/tiles/dungeon/detail.png');
        this.load.image('tile:dungeon-border-top', 'images/tiles/dungeon/borders/top.png');
        this.load.image('tile:dungeon-border-right', 'images/tiles/dungeon/borders/right.png');
        this.load.image('tile:dungeon-border-bottom', 'images/tiles/dungeon/borders/bottom.png');
        this.load.image('tile:dungeon-border-left', 'images/tiles/dungeon/borders/left.png');
        this.load.spritesheet('tile:dungeon-border-middle', 'images/tiles/dungeon/borders/middle.png', 16, 16);
        this.load.image('tile:dungeon-border-top-left', 'images/tiles/dungeon/borders/top-left.png');
        this.load.image('tile:dungeon-border-top-right', 'images/tiles/dungeon/borders/top-right.png');
        this.load.image('tile:dungeon-border-bottom-left', 'images/tiles/dungeon/borders/bottom-left.png');
        this.load.image('tile:dungeon-border-bottom-right', 'images/tiles/dungeon/borders/bottom-right.png');

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

        this.load.audio('music:map', 'audio/musics/map.ogg');
        this.load.audio('music:dungeon', 'audio/musics/dungeon.ogg');

        this.load.audio('sound:attack', 'audio/sounds/attack.wav');
        this.load.audio('sound:fow', 'audio/sounds/fow.wav');
        this.load.audio('sound:skeleton', 'audio/sounds/skeleton.wav');

        this.load.json('data:maps', 'data/maps.json');
        this.load.json('data:enemies', 'data/enemies.json');
        this.load.json('data:items', 'data/items.json');
    },
    create: function() {
        GAME.json['maps'] = this.cache.getJSON('data:maps');
        GAME.json['enemies'] = this.cache.getJSON('data:enemies');
        GAME.json['items'] = this.cache.getJSON('data:items');

        GAME.level = {type:'village', name:'Village', id:'village'};

        this.state.start('Game');
    }
};
