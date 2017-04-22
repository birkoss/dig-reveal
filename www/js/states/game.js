var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();

        this.createMap();
    },

    createMap() {
        /* Get the best map size for the current resolution */
        let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));

        /* Create the map */
        this.map = new Map(this.game, mapWidth, 12);

        /* Create a background under the map */
        let background = this.game.add.tileSprite(0, 0, this.game.width, (this.map.height/GAME.RATIO) + 32, 'tile:water-middle');
        background.scale.setTo(GAME.RATIO, GAME.RATIO);
        background.animations.add('idle', [0, 1], 2, true);
        background.play('idle');
        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.game.width - this.map.width)/2;
        this.map.y = 32;
    }
};
