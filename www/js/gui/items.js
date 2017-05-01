function Items(game, slotName) {
    Overlay.call(this, game);

    this.slotName = slotName;
    this.openOnShow = true;

    this.createItems();

    this.setName("");
    this.setDescription("#");
    this.setStats();

    this.currentItemID = null;

    this.btnEquip = this.addButton({text: (this.slotName == "usable" ? "Utiliser" : "Équipper"), callback:this.equipSelectedItem, context:this});
    this.addButton({text: "Fermer", callback:this.close, context:this});

    if (this.slotName == "usable") {
        this.selectItem(this.getContainerGroup("images").getChildAt(0));
    } else {
        let group = this.getContainerGroup("images").forEach(function(frame) {
            if (frame.getChildAt(1).item.id == GAME.config[this.slotName]) {
                this.selectItem(frame);
            }
        }, this);
    }
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
    GAME.config.inventory.forEach(function(singleItem) {
        let item = GAME.json['items'][singleItem.itemID];
        if (item != null) {
            if ((this.slotName == "usable" && item.usable == true) || (item.slot == this.slotName)) {
                group.getChildAt(currentItem).getChildAt(1).alpha = 1;
                group.getChildAt(currentItem).getChildAt(1).item = item;
                group.getChildAt(currentItem).getChildAt(1).loadTexture("item:" + item.sprite);

                group.getChildAt(currentItem).enableClick(function(singleFrame) {
                    this.selectItem(singleFrame.parent.parent);
                }, this);

                currentItem++;
            }
        }
    }, this);
};

Items.prototype.selectItem = function(singleFrame) {
    let itemSprite = singleFrame.getChildAt(1);
    let item = itemSprite.item;

    if (this.currentItemID != item.id) {
        let group = this.getContainerGroup("images");
        for (let i=0; i<group.children.length; i++) {
            group.getChildAt(i).getChildAt(0).alpha = 1;
        }

        singleFrame.getChildAt(0).alpha = 0.5;

        this.itemName.text = item.name;
        this.itemDescription.text = item.description;
        this.setStats(item.modifier);

        this.currentItemID = item.id;

        if (this.slotName == "usable") {
            GAME.config.inventory.forEach(function(item) {
                if (item.itemID == this.currentItemID) {
                    console.log(item);
                    this.enableButton(item.qty <= 0 ? false : true);
                }
            }, this);
        } else {
            this.enableButton(GAME.config[this.slotName] === this.currentItemID ? false : true);
        }
    }
};

Items.prototype.enableButton = function(state) {
    console.log("enableButton:" + state);
    if (state) {
        this.btnEquip.inputEnabled = true;
        this.btnEquip.alpha = 1;
    } else {
        this.btnEquip.inputEnabled = false;
        this.btnEquip.alpha = 0.5;
    }
};

Items.prototype.equipSelectedItem = function() {
    if (this.slotName == "usable") {
        GAME.config.inventory.forEach(function(item) {
            if (item.itemID == this.currentItemID) {
                GAME.useItem(item.itemID);
                item.qty = Math.max(item.qty - 1, 0);
                GAME.save();
            }
        }, this);
    } else {
        GAME.equip(this.slotName, this.currentItemID);
    }
    this.close();
};
