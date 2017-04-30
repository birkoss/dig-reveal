function Popup(game) {
    Overlay.call(this, game);

    this.openOnShow = true;
};

Popup.prototype = Object.create(Overlay.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.setItem = function(item) {
    this.addItem({item:item});
    this.setName(item.name);
    this.setDescription(item.description);
    this.setStats(item.modifier);
};
