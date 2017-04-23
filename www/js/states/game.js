var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.staminaMax = this.staminaTotal = 100;

        this.levelContainer = this.game.add.group();

        let level = new Level(this.game, 'Village');
        this.levelContainer.addChild(level);

        level.show();
    },
    update: function() {
        this.levelContainer.getChildAt(0).panel.updateStamina(this.staminaTotal, this.staminaMax);
    }
};
