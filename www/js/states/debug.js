var GAME = GAME || {};

GAME.Debug = function() {};

GAME.Debug.prototype = {
    create: function() {
        let popup = new Popup(this.game);
        popup.setContent("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin a sapien a tellus vulputate vulputate varius eu eros. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla aliquet suscipit lacus non consectetur.");
        popup.addButton({text:"Utiliser", callback:this.onButtonPressed, context:this});
        popup.generate();

        popup.x = (this.game.width - popup.width) / 2;
        popup.y = (this.game.height - popup.height) / 2;
    },

    onButtonPressed: function() {
        console.log('pressed...');
    }
};
