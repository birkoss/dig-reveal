var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.mapContainer.scale.setTo(GAME.RATIO, GAME.RATIO);

        this.map = new Map(this.game, 9, 12);
        this.mapContainer.addChild(this.map);
    },
};
