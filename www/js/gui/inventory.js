function Inventory(game) {
    Overlay.call(this, game, 'ninepatch:blue');

    this.setPosition('bottom');

    this.selectedSlot = '';

    this.items = {};

    this.ninepatch.removeBorders('bottom');

    this.createToggleButton();

    this.createItems();

    this.setName("");
    this.setDescription("#");
    this.setStats();

    this.btnChange = this.addButton({text: "Changer", callback:this.onBtnChangeItemClicked, context:this});

    /* Set the item from our current equipment */
    this.setItem('weapon');
    this.setItem('armor');

    /* Select the first item */
    this.selectItem('weapon');
};

Inventory.prototype = Object.create(Overlay.prototype);
Inventory.prototype.constructor = Inventory;

/* Always keep the inventory updated with the current equipment */
Inventory.prototype.update = function() {
    if (GAME.config.weapon != this.getItem("weapon").id) {
        this.setItem('weapon');
        this.selectItem('weapon', true);
    }
    if (GAME.config.armor != this.getItem("armor").id) {
        this.setItem('armor');
        this.selectItem('armor', true);
    }
};

/* Create 2 items: Armor and Weapon, for each equipment slot */
Inventory.prototype.createItems = function() {
    let paddingBetweenItems = 50;

    this.items.weapon = this.addItem({label:"Arme", item:GAME.json['items']['apple']}, paddingBetweenItems);
    this.items.weapon.enableClick(function() { 
        this.selectItem('weapon');
    }, this);

    this.items.armor = this.addItem({label:"Armure", item:GAME.json['items']['apple']}, paddingBetweenItems);
    this.items.armor.enableClick(function() { 
        this.selectItem('armor');
    }, this);
};

Inventory.prototype.createToggleButton = function() {
    this.getContainer("toggle").outside = true;
    let group = this.getContainerGroup("toggle");

    let toggle = group.create(0, 0, 'inventory:toggle');
    toggle.scale.setTo(GAME.RATIO, GAME.RATIO);
    toggle.x = (this.backgroundContainer.width-toggle.width)/2;
    toggle.y = -toggle.height + GAME.RATIO;
    toggle.inputEnabled = true;
    toggle.events.onInputDown.add(this.onToggleClicked, this);

    this.toggleIcon = group.create(0, 0, 'inventory:arrows');
    this.toggleIcon.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.toggleIcon.x = toggle.x + ((toggle.width - this.toggleIcon.width) / 2);
    this.toggleIcon.y = toggle.y + ((toggle.height - this.toggleIcon.height));
};

/* Update an item with the appropriate item equipped */
Inventory.prototype.setItem = function(slot) {
    let itemID = GAME.config[slot];
    if (itemID != null) {
        let item = GAME.json['items'][itemID];
        if (item != null) {
            this.items[slot].item = item;

            let sprite = this.items[slot].getChildAt(1);
            sprite.loadTexture('item:' + item.sprite);
        }
    }
};

/* Get the item currently in the slot */
/* @TODO Check to see if we could use GAME.weapon/GAME.armor instead since they should be in sync... */
Inventory.prototype.getItem = function(slot) {
    let slotItem = null;

    let itemID = GAME.config[slot];
    if (itemID != null) {
        let item = GAME.json['items'][itemID];
        if (item != null) {
            slotItem = this.items[slot].item;
        }
    }

    return slotItem;
};

/* Update the item details from a current slot and select it */
Inventory.prototype.selectItem = function(slot, forceRefresh) {
    if (slot != this.selectedSlot || forceRefresh === true) {
        let group = this.getContainerGroup("images");
        for (let i=0; i<group.children.length; i++) {
            group.getChildAt(i).getChildAt(0).alpha = 0.5;
            group.getChildAt(i).getChildAt(1).alpha = 0.5;
        }
        let position = (slot == 'weapon' ? 0 : 1);
        group.getChildAt(position).getChildAt(0).alpha = 1;
        group.getChildAt(position).getChildAt(1).alpha = 1;
        let item = group.getChildAt(position).item;

        this.selectedSlot = slot;

        this.itemName.text = item.name;
        this.itemDescription.text = item.description;

        this.setStats(item.modifier);

        /* Check how many items of that slot we have in inventory */
        let itemQty = 0;
        GAME.config.inventory.forEach(function(singleItem) {
            let item = GAME.json['items'][singleItem.itemID];
            if (item.slot == this.selectedSlot) {
                itemQty++;
            }
        }, this);

        if (itemQty <= 1) {
            this.btnChange.alpha = 0.5;
            this.btnChange.inputEnabled = false;
        } else {
            this.btnChange.alpha = 1;
            this.btnChange.inputEnabled = true;
        }
    }
};

/* Called to toggle the inventory screen */
Inventory.prototype.onToggleClicked = function() {
    if (this.backgroundContainer.y == this.backgroundContainer.originalY) {
        this.toggleIcon.frame = 0;
        this.hide();
    } else {
        this.toggleIcon.frame = 1;
        this.reveal();
    }
};

/* Should show all the items available in the current slot */
Inventory.prototype.onBtnChangeItemClicked = function() {
    let popup = new Items(this.game, this.selectedSlot);
    popup.show();
};
