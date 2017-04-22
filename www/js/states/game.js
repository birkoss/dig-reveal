var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {

        let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));
        console.log(mapWidth);
        this.mapContainer = this.game.add.group();

        this.map = new Map(this.game, mapWidth, 12);
        this.mapContainer.addChild(this.map);
    },
};
