var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        console.log('Game.create');
        console.log(GAME.level);

        this.levelContainer = this.game.add.group();

        this.level = new Level(this.game, GAME.level);
        this.level.onStaminaChanged.add(this.onLevelStaminaChanged, this);
        this.level.onLoadMap.add(this.onLevelOnLoadMap, this);
        this.levelContainer.addChild(this.level);

        this.level.show();
    },
    update: function() {
        this.level.panel.updateStamina(GAME.STAMINA, GAME.STAMINA_MAX);
    },
    onLevelStaminaChanged: function(level, value) {
        GAME.STAMINA = Math.max(0, GAME.STAMINA - value);
    },
    onLevelOnLoadMap: function(type, tile) {
        let config = {name:tile.name, id:tile.id};
        switch (tile.type) {
            case 'level':
                config.type = 'castle';
                config.parent = this.level.config.id;
                break;
            case 'start':
                config.type = 'village';
                config.id = this.level.config.parent;
                break;
        }
        GAME.level = config;
        this.game.state.restart();
    }
};
