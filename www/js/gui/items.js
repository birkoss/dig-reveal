function Items(game, slotName) {
    Overlay.call(this, game);

    this.slotName = slotName;
    console.log(this.slotName);
    this.openOnShow = true;

    this.createItems();

    this.setName("");
    this.setDescription("#");
    this.setStats();

    this.addButton({text: "Équipper", callback:this.close, context:this});
    this.addButton({text: "Fermer", callback:this.close, context:this});

    let group = this.getContainerGroup("images").forEach(function(frame) {
        if (frame.getChildAt(1).item.id == GAME.config[this.slotName]) {
            this.selectItem(frame, true);
        }
    }, this);
};

Items.prototype = Object.create(Overlay.prototype);
Items.prototype.constructor = Items;

Items.prototype.createItems = function() {
    for (let i=0; i<15; i++) {
        let item = this.addItem({size:1, item:GAME.json['items']['apple']});
        item.getChildAt(1).alpha = 0;
    }

    let group = this.getContainerGroup("images");
    let currentItem = 0;
    GAME.config.inventory.forEach(function(singleItemID) {
        let item = GAME.json['items'][singleItemID];
        if (item != null) {
            if (item.slot == this.slotName) {
                group.getChildAt(currentItem).getChildAt(1).alpha = 1;
                console.log(group.getChildAt(currentItem).getChildAt(1).item);
                group.getChildAt(currentItem).getChildAt(1).item = item;
                console.log(group.getChildAt(currentItem).getChildAt(1).item);
                group.getChildAt(currentItem).getChildAt(1).loadTexture("item:" + item.sprite);

                group.getChildAt(currentItem).enableClick(function(singleFrame) {
                    this.selectItem(singleFrame.parent.parent);
                }, this);

                currentItem++;
            }
        }
    }, this);
};

Items.prototype.selectItem = function(singleFrame, forceRefresh) {
    let itemSprite = singleFrame.getChildAt(1);
    let item = itemSprite.item;

    if (GAME.config[this.slotName] != item.id || forceRefresh === true) {
        let group = this.getContainerGroup("images");
        for (let i=0; i<group.children.length; i++) {
            group.getChildAt(i).getChildAt(0).alpha = 1;
        }

        singleFrame.getChildAt(0).alpha = 0.5;

        GAME.equip(this.slotName, item.id);

        this.itemName.text = item.name;
        this.itemDescription.text = item.description;
        this.setStats(item.modifier);
    }
};
