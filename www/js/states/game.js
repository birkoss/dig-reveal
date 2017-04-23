var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        GAME.STAMINA = GAME.STAMINA_MAX = 100;
        this.levelContainer = this.game.add.group();
        this.subLevelContainer = this.game.add.group();

        let level = new Level(this.game, 'village', 'Village');
        level.onStaminaChanged.add(this.onLevelStaminaChanged, this);
        level.onLoadMap.add(this.onLevelOnLoadMap, this);
        this.levelContainer.addChild(level);

        level.show();
    },
    createSubLevel: function() {
        let level = new Level(this.game, 'castle', 'Castle');
        level.onStaminaChanged.add(this.onLevelStaminaChanged, this);
        this.subLevelContainer.addChild(level);

        level.show();
    },
    update: function() {
        this.levelContainer.getChildAt(0).panel.updateStamina(GAME.STAMINA, GAME.STAMINA_MAX);
        if (this.subLevelContainer.children.length > 0) {
            this.subLevelContainer.getChildAt(0).panel.updateStamina(GAME.STAMINA, GAME.STAMINA_MAX);
        }
    },
    onLevelStaminaChanged: function(level, value) {
        GAME.STAMINA = Math.max(0, GAME.STAMINA - value);
    },
    onLevelOnLoadMap: function(type, item) {
        this.createSubLevel();
    }
};
