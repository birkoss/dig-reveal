var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        GAME.STAMINA = GAME.STAMINA_MAX = 10;
        this.levelContainer = this.game.add.group();

        let level = new Level(this.game, 'Village');
        level.onStaminaChanged.add(this.onLevelStaminaChanged, this);
        this.levelContainer.addChild(level);

        level.show();
    },
    update: function() {
        this.levelContainer.getChildAt(0).panel.updateStamina(GAME.STAMINA, GAME.STAMINA_MAX);
    },
    onLevelStaminaChanged: function(level, value) {
        GAME.STAMINA = Math.max(0, GAME.STAMINA - value);
    }
};
