function Items(game, slotName) {
    Overlay.call(this, game);

    this.slotName = slotName;
    console.log(this.slotName);
    this.openOnShow = true;

    this.createItems();

    this.setName("");
    this.setDescription("#");
    this.setStats();

    this.addButton({text: "Fermer", callback:this.close, context:this});
};

Items.prototype = Object.create(Overlay.prototype);
Items.prototype.constructor = Items;

Items.prototype.createItems = function() {
    for (let i=0; i<15; i++) {
        let item = this.addItem({size:1, item:GAME.json['items']['apple']});
        item.getChildAt(1).alpha = 0;
    }
};
