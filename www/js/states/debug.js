var GAME = GAME || {};

GAME.Debug = function() {};

GAME.Debug.prototype = {
    create: function() {
        let inventory = new Inventory(this.game);

        inventory.addButton({"text":"aaa"});

        inventory.show();
    }
};
