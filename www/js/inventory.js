function Inventory(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.inventoryContainer = this.game.add.group();
    this.add(this.inventoryContainer);

    this.inventoryBackgroundContainer = this.game.add.group();
    this.inventoryContainer.add(this.inventoryBackgroundContainer);

    this.labelContainer = this.game.add.group();
    this.inventoryContainer.add(this.labelContainer);

    this.imageContainer = this.game.add.group();
    this.inventoryContainer.add(this.imageContainer);

    this.descriptionContainer = this.game.add.group();
    this.inventoryContainer.add(this.descriptionContainer);

    this.buttonsContainer = this.game.add.group();
    this.inventoryContainer.add(this.buttonsContainer);

    this.padding = 10 * GAME.RATIO;

    this.selectedSlot = '';

    this.createBackground();
    this.createInventoryBackground();
};

Inventory.prototype = Object.create(Phaser.Group.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.SPEED = 250;

Inventory.prototype.addButton = function(buttonData) {
    let button = this.game.add.button(0, 0, 'popup:button', buttonData.callback, buttonData.context, 1, 0, 1, 0);
    button.x = this.buttonsContainer.children.length * (button.width + this.padding);
    button.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.buttonsContainer.addChild(button);

    let label = this.game.add.bitmapText(0, 0, 'font:gui', buttonData.text, 10);
    label.anchor.set(0.5, 0.5);
    label.x = (button.width/2);
    label.y = (button.height/2);
    this.buttonsContainer.addChild(label);
};

Inventory.prototype.generate = function() {

    let minWidth = this.backgroundContainer.width - (this.padding*4);

    /* Generate labels */

    let label = this.game.add.bitmapText(0, 0, 'font:gui', "Arme", 10);
    label.anchor.set(0.5, 0);
    label.x = (minWidth / 4);
    this.labelContainer.addChild(label);
    
    label = this.game.add.bitmapText(0, 0, 'font:gui', "Bouclier", 10);
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

    this.spriteWeapon = this.imageContainer.create(0, 0, 'item:apple');
    this.spriteWeapon.item = GAME.json['items']['apple'];
    this.spriteWeapon.scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);
    this.spriteWeapon.x = frame.x;
    this.spriteWeapon.y = frame.y;

    frame = new Ninepatch(this.game);
    frame.resize(16 * GAME.RATIO * 2, 16 * GAME.RATIO * 2);
    frame.x = ((minWidth / 4) * 3) - (frame.width / 2);
    frame.enableClick(function() { 
        this.selectItem('shield');
    }, this);
    this.imageContainer.add(frame);

    this.spriteShield = this.imageContainer.create(0, 0, 'item:apple');
    this.spriteShield.item = GAME.json['items']['apple'];
    this.spriteShield.scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);
    this.spriteShield.x = frame.x;
    this.spriteShield.y = frame.y;

    /* Description */

    let ninepatch = new Ninepatch(this.game);
    this.descriptionContainer.add(ninepatch);
    ninepatch.resize(minWidth - (this.padding * 2), 80);

    this.itemDescription = this.game.add.bitmapText(0, 0, "font:gui-multiline", "Aucun n'item n'est sélectionné", 10);
    this.itemDescription.anchor.set(0, 0.5);
    this.itemDescription.x = this.padding;
    this.itemDescription.maxWidth = minWidth - (this.padding*2);
    this.itemDescription.y = (this.descriptionContainer.height/2) + 3;
    this.descriptionContainer.add(this.itemDescription);
    
    /* Buttons */

    //this.addButton({text:"Changer"});

    /* Resize the inventory */

    let inventoryWidth = minWidth;
    let inventoryHeight = this.padding;
    //inventoryHeight += this.buttonsContainer.height + this.padding;
    inventoryHeight += this.imageContainer.height + this.padding;
    inventoryHeight += this.descriptionContainer.height + this.padding;
    inventoryHeight += this.labelContainer.height + this.padding;

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

    this.selectItem('weapon');
    this.hide(true);
};

Inventory.prototype.createInventoryBackground = function() {
    this.ninepatch = new Ninepatch(this.game);
    this.ninepatch.removeBorders('bottom');
    this.inventoryBackgroundContainer.add(this.ninepatch);
};

Inventory.prototype.createBackground = function() {
    let sprite = this.backgroundContainer.create(0, 0, 'popup:background');
    sprite.width = this.game.width;
    sprite.height = this.game.height;
    sprite.tint = 0x000000;
    sprite.alpha = 0.5;
    sprite.inputEnabled = true;
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

        this.itemDescription.text = item.name;
    }
};

Inventory.prototype.show = function() {
    this.generate();
};

Inventory.prototype.reveal = function() {
    this.toggleIcon.frame = 1;
    this.backgroundContainer.alpha = 0.8;

    let tween = this.game.add.tween(this.inventoryContainer).to({y:this.inventoryContainer.originalY}, Inventory.SPEED).start();
};

Inventory.prototype.hide = function(skipAnimation) {
    this.toggleIcon.frame = 0;
    let sound = this.game.add.audio('sound:popup-button');
    sound.play();
    
    let newY = this.backgroundContainer.height - this.padding;
    if (skipAnimation == true) {
        this.inventoryContainer.y = newY;
    } else {
        this.game.add.tween(this.inventoryContainer).to({y:newY}, Inventory.SPEED).start();
    }
};

Inventory.prototype.onToggleClicked = function() {
    if (this.inventoryContainer.y == this.inventoryContainer.originalY) {
        this.hide();
    } else {
        this.reveal();
    }

};
