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

    let label = this.game.add.bitmapText(0, 0, 'font:gui', buttonData.text, 8);
    label.anchor.set(0.5, 0.5);
    label.x = (button.width/GAME.RATIO)/2;
    label.y = (button.height/GAME.RATIO)/2;
    button.addChild(label);

    this.buttonsContainer.addChild(button);
};

Inventory.prototype.generate = function() {

    let minWidth = this.backgroundContainer.width - (this.padding*4);

    /* Generate labels */

    let label = this.game.add.bitmapText(0, 0, 'font:gui', "Arme", 8);
    label.anchor.set(0.5, 0);
    label.x = (minWidth / 4);
    this.labelContainer.addChild(label);
    
    label = this.game.add.bitmapText(0, 0, 'font:gui', "Bouclier", 8);
    label.anchor.set(0.5, 0);
    label.x = (minWidth / 4) * 3;
    this.labelContainer.addChild(label);

    /* Generate images */

    let frame = this.imageContainer.create(0, 0, 'inventory:item-frame');
    frame.scale.setTo(GAME.RATIO*2, GAME.RATIO*2);
    frame.anchor.set(0.5, 0);
    frame.x = (minWidth / 4);

    frame = this.imageContainer.create(0, 0, 'inventory:item-frame');
    frame.scale.setTo(GAME.RATIO*2, GAME.RATIO*2);
    frame.anchor.set(0.5, 0);
    frame.x = (minWidth / 4) * 3;

    /* Description */

    frame = this.descriptionContainer.create(0, 0, 'inventory:item-frame');
    frame.scale.setTo(GAME.RATIO*2, GAME.RATIO*2);
    frame.anchor.set(0, 0);
    frame.width = minWidth - (this.padding * 2);
    frame.height = 80;

    //let InventoryWidth = Math.min(minWidth, Math.max(this.buttonsContainer.width, this.labelContainer.width)+(this.padding*2));
    let InventoryWidth = minWidth;
    let InventoryHeight = (this.padding*2) + this.buttonsContainer.height;

    if (this.imageContainer.height > 0) {
        InventoryHeight += this.imageContainer.height + this.padding;
    }
    if (this.descriptionContainer.height > 0) {
        InventoryHeight += this.descriptionContainer.height + this.padding;
    }
    if (this.labelContainer.height > 0) {
        InventoryHeight += this.labelContainer.height + this.padding;
    }

    this.ninepatch.resize(InventoryWidth, InventoryHeight);

    let InventoryY = 0;

    if (this.labelContainer.height > 0) {
        //this.labelContainer.x = this.padding;
        this.labelContainer.y = this.padding + InventoryY;
        InventoryY += this.labelContainer.height + this.padding;
    }

    if (this.imageContainer.height > 0) {
        this.imageContainer.y = this.padding + InventoryY;
        //this.imageContainer.x = this.padding;
        InventoryY += this.imageContainer.height + this.padding;
    }

    if (this.descriptionContainer.height > 0) {
        this.descriptionContainer.x = (this.inventoryContainer.width - this.descriptionContainer.width) / 2;
        this.descriptionContainer.y = this.padding + InventoryY;
        InventoryY += this.descriptionContainer.height + this.padding;
    }

    this.buttonsContainer.x = (this.inventoryBackgroundContainer.width - this.buttonsContainer.width) / 2;
    this.buttonsContainer.y = InventoryY + this.padding;//this.inventoryBackgroundContainer.height - this.buttonsContainer.height - this.padding;

    this.inventoryContainer.x = (this.backgroundContainer.width - this.inventoryContainer.width)/2;
    this.inventoryContainer.y = (this.backgroundContainer.height - this.inventoryContainer.height);
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

Inventory.prototype.setContent = function(newContent) {
    let borderSize = this.inventoryBackgroundContainer.getChildAt(0).width;

    let maxWidth = this.game.width - (borderSize*2) - (this.padding*4);

    let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', newContent, 8);
    content.maxWidth = maxWidth;
    this.labelContainer.addChild(content);
};

Inventory.prototype.setImage = function(spriteName, label) {
    let sprite = this.imageContainer.create(0, 0, spriteName);
    sprite.scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);

    if (label != undefined) {
        let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', label, 8);
        content.x = sprite.width + (this.padding / 2)
        content.y = (sprite.height - content.height) / 2;
        this.imageContainer.addChild(content);
    }
};

Inventory.prototype.addStats = function(stat, from, to) {
    let statName = stat;
    switch(stat) {
        case "attack":
            statName = "Attaque";
            break;
        case "stamina":
            statName = "Stamina";
            break;
        case "staminaMax":
            statName = "Stamina\nmaximum";
            break;
    }

    let nbrStats = Math.floor(this.descriptionContainer.children.length/4);
    let textX = 0;
    let textY = this.descriptionContainer.height;
    if (textY > 0) {
        textY += this.padding;
    }

    let text = this.game.add.bitmapText(textX, textY, 'font:gui-multiline', statName + ": ", 8);
    this.descriptionContainer.addChild(text);
    textX += text.width + this.padding;
    let labelHeight = text.height;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', from, 8);
    text.y += (labelHeight - text.height) / 2;
    this.descriptionContainer.addChild(text);
    textX += text.width + this.padding;
    
    text = this.game.add.bitmapText(textX, textY, 'font:gui', "->", 8);
    text.y += (labelHeight - text.height) / 2;
    this.descriptionContainer.addChild(text);
    textX += text.width + this.padding;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', to, 8);
    text.y += (labelHeight - text.height) / 2;
    this.descriptionContainer.addChild(text);
    textX += text.width + this.padding;
};

Inventory.prototype.show = function() {
    this.generate();

    this.backgroundContainer.alpha = 0.8;
    this.inventoryContainer.originalY = this.inventoryContainer.y;
    this.inventoryContainer.y = this.backgroundContainer.height;

    let tween = this.game.add.tween(this.inventoryContainer).to({y:this.inventoryContainer.originalY}, Inventory.SPEED).start();
};

Inventory.prototype.hide = function() {
    let sound = this.game.add.audio('sound:popup-button');
    sound.play();

    let tween = this.game.add.tween(this.inventoryContainer).to({y:-this.backgroundContainer.height}, Inventory.SPEED);
    tween.onComplete.add(function() {
        this.destroy();
    }, this);
    tween.start();
};
