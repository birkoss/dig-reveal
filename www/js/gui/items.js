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
            if (frame.item.id == GAME.config[this.slotName]) {
                this.selectItem(frame);
            }
        }, this);
    }
};

Items.prototype = Object.create(Overlay.prototype);
Items.prototype.constructor = Items;

Items.prototype.update = function() {
    let group = this.getContainerGroup("images");
    for (let i=0; i<group.children.length; i++) {
        if (group.getChildAt(i).qtyLabel != null && group.getChildAt(i).inventoryItem != null) {
            group.getChildAt(i).qtyLabel.text = group.getChildAt(i).inventoryItem.qty;
        }
    }
};

Items.prototype.createItems = function() {
    for (let i=0; i<15; i++) {
        let item = this.addItem({size:1, item:GAME.json['items']['apple']});
        item.getChildAt(1).alpha = 0;
        
        if (this.slotName == "usable") {
            let label = this.game.add.bitmapText(0, 0, 'font:guiOutline', "0", 8);
            label.anchor.set(1, 1);
            label.x = item.width - 4;
            label.y = item.height - 4;
            label.alpha = 0;
            item.addChild(label);

            item.qtyLabel = label;
        }
    }

    let group = this.getContainerGroup("images");
    let currentItem = 0;
    GAME.config.inventory.forEach(function(singleItem) {
        let item = GAME.json['items'][singleItem.itemID];
        if (item != null) {
            if ((this.slotName == "usable" && item.usable == true) || (item.slot == this.slotName)) {
                group.getChildAt(currentItem).inventoryItem = singleItem;
                group.getChildAt(currentItem).item = item;

                group.getChildAt(currentItem).getChildAt(1).alpha = 1;
                group.getChildAt(currentItem).getChildAt(1).loadTexture("item:" + item.sprite);

                group.getChildAt(currentItem).enableClick(function(singleFrame) {
                    this.selectItem(singleFrame.parent.parent);
                }, this);

                if (group.getChildAt(currentItem).qtyLabel != null) {
                    group.getChildAt(currentItem).qtyLabel.alpha = 1;
                }

                currentItem++;
            }
        }
    }, this);
};

Items.prototype.selectItem = function(singleFrame) {
    let itemSprite = singleFrame.getChildAt(1);
    let item = singleFrame.item;

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
