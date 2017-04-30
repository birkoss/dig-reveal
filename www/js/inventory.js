function Inventory(game) {
    Overlay.call(this, game);

    this.setPosition('bottom');

    this.selectedSlot = '';

    this.items = {};

    this.ninepatch.removeBorders('bottom');

    this.createItems();

    this.setName("Épée en bois");
    
    this.addStats("attack", "1", "2");
    this.addStats("attack", "1", "2");

    this.setDescription("Épée en bois bla bla bla bla bla....");

    this.addButton({text: "Remplacer"});
};

Inventory.prototype = Object.create(Overlay.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.update = function() {
    /*
    if (GAME.config.weapon != this.items['weapon'].item.id) {
        //this.setItem('weapon');
    }
    if (GAME.config.armor != this.items['armor'].item.id) {
        //this.setItem('armor');
    }
    */
};

Inventory.prototype.createItems = function() {
    let paddingBetweenItems = 50;

    let weapon = this.addItem({label:"Arme", item:GAME.json['items']['apple']}, paddingBetweenItems);
    weapon.enableClick(function() { 
        this.selectItem('weapon');
    }, this);

    let armor = this.addItem({label:"Armure", item:GAME.json['items']['apple']}, paddingBetweenItems);
    armor.enableClick(function() { 
        this.selectItem('armor');
    }, this);
};

Inventory.prototype.addLabel = function(labelText) {
    let group = this.getContainerGroup("label");
    let groupImage = this.getContainerGroup("images");
    let item = groupImage.getChildAt(groupImage.children.length - 1);

    let label = this.game.add.bitmapText(0, 0, 'font:gui', labelText, 10);
    label.anchor.set(0.5, 0);
    label.x = item.x + ((item.width-label.width)/2);
    group.addChild(label);
    
};

Inventory.prototype.generate2 = function() {

    let minWidth = this.backgroundContainer.width - (this.padding*4);

    /* Generate labels */

    let label = this.game.add.bitmapText(0, 0, 'font:gui', "Arme", 10);
    label.anchor.set(0.5, 0);
    label.x = (minWidth / 4);
    this.labelContainer.addChild(label);
    
    label = this.game.add.bitmapText(0, 0, 'font:gui', "Armure", 10);
    label.anchor.set(0.5, 0);
    label.x = (minWidth / 4) * 3;
    this.labelContainer.addChild(label);

    /* Generate images */

    let frame = new Ninepatch(this.game);
    frame.resize(16 * GAME.RATIO * 2, 16 * GAME.RATIO * 2);
    frame.x = (minWidth / 4) - (frame.width/2);
    frame.enableClick(function() { 
        this.selectItem('weapon');
    }, this);
    this.imageContainer.add(frame);

    this.items['weapon'] = this.imageContainer.create(0, 0, 'item:apple');
    this.items['weapon'].item = GAME.json['items']['apple'];
    this.items['weapon'].scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);
    this.items['weapon'].x = frame.x;
    this.items['weapon'].y = frame.y;

    frame = new Ninepatch(this.game);
    frame.resize(16 * GAME.RATIO * 2, 16 * GAME.RATIO * 2);
    frame.x = ((minWidth / 4) * 3) - (frame.width / 2);
    frame.enableClick(function() { 
        this.selectItem('armor');
    }, this);
    this.imageContainer.add(frame);

    this.items['armor'] = this.imageContainer.create(0, 0, 'item:apple');
    this.items['armor'].item = GAME.json['items']['apple'];
    this.items['armor'].scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);
    this.items['armor'].x = frame.x;
    this.items['armor'].y = frame.y;

    /* Name */

    this.itemName = this.game.add.bitmapText(0, 0, "font:gui", "ABC", 10);
    this.nameContainer.add(this.itemName);

    /* Description */

    let ninepatch = new Ninepatch(this.game);
    this.descriptionContainer.add(ninepatch);
    ninepatch.resize(minWidth - (this.padding * 2), 80);

    this.itemDescription = this.game.add.bitmapText(0, 0, "font:gui-multiline", "Aucun n'item n'est sélectionné", 10);
    this.itemDescription.anchor.set(0, 0.5);
    this.itemDescription.x = this.padding;
    this.itemDescription.maxWidth = minWidth - (this.padding*4);
    this.itemDescription.y = (this.descriptionContainer.height/2) + 3;
    this.descriptionContainer.add(this.itemDescription);
    
    /* Buttons */

    this.addButton({text:"Changer", callback:this.onBtnChangeItemClicked, context:this});

    /* Resize the inventory */

    let inventoryWidth = minWidth;
    let inventoryHeight = this.padding;
    inventoryHeight += this.buttonsContainer.height + this.padding;
    inventoryHeight += this.imageContainer.height + this.padding;
    inventoryHeight += this.descriptionContainer.height + this.padding;
    inventoryHeight += this.labelContainer.height + this.padding;
    inventoryHeight += this.nameContainer.height + this.padding;

    this.ninepatch.resize(inventoryWidth, inventoryHeight);

    /* Position each containers */

    let inventoryY = 0;

    if (this.labelContainer.height > 0) {
        this.labelContainer.y = this.padding + inventoryY;
        inventoryY += this.labelContainer.height + this.padding;
    }

    if (this.imageContainer.height > 0) {
        this.imageContainer.y = this.padding + inventoryY;
        //this.imageContainer.x = this.padding;
        inventoryY += this.imageContainer.height + this.padding;
    }

    if (this.nameContainer.height > 0) {
        this.nameContainer.y = this.padding + inventoryY;
        this.nameContainer.x = this.padding;
        inventoryY += this.nameContainer.height + this.padding;
    }

    if (this.descriptionContainer.height > 0) {
        this.descriptionContainer.x = (this.inventoryContainer.width - this.descriptionContainer.width) / 2;
        this.descriptionContainer.y = this.padding + inventoryY;
        inventoryY += this.descriptionContainer.height + this.padding;
    }

    if (this.buttonsContainer.height > 0) {
        this.buttonsContainer.x = (this.inventoryBackgroundContainer.width - this.buttonsContainer.width) / 2;
        this.buttonsContainer.y = inventoryY + this.padding;
    }

    /* Add the toggle */

    let toggle = this.inventoryContainer.create(0, 0, 'inventory:toggle');
    toggle.scale.setTo(GAME.RATIO, GAME.RATIO);
    toggle.x = (this.inventoryContainer.width-toggle.width)/2;
    toggle.y = -toggle.height + GAME.RATIO;
    toggle.inputEnabled = true;
    toggle.events.onInputDown.add(this.onToggleClicked, this);

    this.toggleIcon = this.inventoryContainer.create(0, 0, 'inventory:arrows');
    this.toggleIcon.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.toggleIcon.x = toggle.x + ((toggle.width - this.toggleIcon.width) / 2);
    this.toggleIcon.y = toggle.y + ((toggle.height - this.toggleIcon.height) / 2);

    /* Position the inventory at the bottom */

    this.inventoryContainer.x = (this.backgroundContainer.width - this.inventoryContainer.width)/2;
    this.inventoryContainer.y = (this.backgroundContainer.height - this.inventoryContainer.height + toggle.height);
    this.inventoryContainer.originalY = this.inventoryContainer.y;

    this.setItem('weapon');
    this.setItem('armor');

    this.selectItem('weapon');
    this.hide(true);
};

Inventory.prototype.setItem = function(slot) {
    let itemID = GAME.config[slot];
    if (itemID != null) {
        let item = GAME.json['items'][itemID];
        if (item != null) {
            this.items[slot].item = item;
            this.items[slot].loadTexture('item:' + item.sprite);
        }
    }
};

Inventory.prototype.selectItem = function(slot) {
    if (slot != this.selectedSlot) {
        for (let i=0; i<this.imageContainer.children.length; i+=2) {
            this.imageContainer.getChildAt(i).alpha = 1;
        }
        let position = (slot == 'weapon' ? 0 : 2);
        this.imageContainer.getChildAt(position).alpha = 0.5;
        let item = this.imageContainer.getChildAt(position+1).item;

        this.selectedSlot = slot;

        this.itemName.text = item.name;
        this.itemDescription.text = item.description;
    }
};

Inventory.prototype.onToggleClicked = function() {
    if (this.inventoryContainer.y == this.inventoryContainer.originalY) {
        this.hide();
    } else {
        this.reveal();
    }
};

Inventory.prototype.onBtnChangeItemClicked = function() {
    console.log('SHOULD DO SOMETHING...');
};
