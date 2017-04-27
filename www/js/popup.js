function Popup(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.popupContainer = this.game.add.group();
    this.add(this.popupContainer);

    this.popupBackgroundContainer = this.game.add.group();
    this.popupContainer.add(this.popupBackgroundContainer);

    this.buttonsContainer = this.game.add.group();
    this.popupContainer.add(this.buttonsContainer);

    this.contentContainer = this.game.add.group();
    this.popupContainer.add(this.contentContainer);

    this.statsContainer = this.game.add.group();
    this.popupContainer.add(this.statsContainer);

    this.imageContainer = this.game.add.group();
    this.popupContainer.add(this.imageContainer);

    this.padding = 10 * GAME.RATIO;

    this.createBackground();
    this.createPopupBackground();
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.SPEED = 250;

Popup.prototype.addButton = function(buttonData) {
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

Popup.prototype.generate = function() {

    let popupWidth = Math.max(this.buttonsContainer.width, this.contentContainer.width)+(this.padding*2);
    let popupHeight = (this.padding*2) + this.buttonsContainer.height;
    if (this.imageContainer.height > 0) {
        popupHeight += this.imageContainer.height + this.padding;
    }
    if (this.statsContainer.height > 0) {
        popupHeight += this.statsContainer.height + this.padding;
    }
    if (this.contentContainer.height > 0) {
        popupHeight += this.contentContainer.height + this.padding;
    }

    this.ninepatch.resize(popupWidth, popupHeight);

    this.buttonsContainer.x = (this.popupBackgroundContainer.width - this.buttonsContainer.width) / 2;
    this.buttonsContainer.y = this.popupBackgroundContainer.height - this.buttonsContainer.height - this.padding;

    let popupY = 0;

    if (this.imageContainer.height > 0) {
        this.imageContainer.y = this.padding + popupY;
        this.imageContainer.x = this.padding;
        popupY += this.imageContainer.height + this.padding;
    }

    if (this.statsContainer.height > 0) {
        this.statsContainer.x = (this.popupContainer.width - this.statsContainer.width) / 2;
        this.statsContainer.y = this.padding + popupY;
        popupY += this.statsContainer.height + this.padding;
    }

    if (this.contentContainer.height > 0) {
        this.contentContainer.x = this.padding;
        this.contentContainer.y = this.padding + popupY;
        popupY += this.contentContainer.height + this.padding;
    }

    this.popupContainer.x = (this.backgroundContainer.width - this.popupContainer.width)/2;
    this.popupContainer.y = (this.backgroundContainer.height - this.popupContainer.height)/2;
};

Popup.prototype.createPopupBackground = function() {
    this.ninepatch = new Ninepatch(this.game);
    this.popupBackgroundContainer.add(this.ninepatch);
};

Popup.prototype.createBackground = function() {
    let sprite = this.backgroundContainer.create(0, 0, 'popup:background');
    sprite.width = this.game.width;
    sprite.height = this.game.height;
    sprite.tint = 0x000000;
    sprite.alpha = 0.5;
    sprite.inputEnabled = true;
};

Popup.prototype.setContent = function(newContent) {
    let borderSize = this.popupBackgroundContainer.getChildAt(0).width;

    let maxWidth = this.game.width - (borderSize*2) - (this.padding*4);

    let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', newContent, 8);
    content.maxWidth = maxWidth;
    this.contentContainer.addChild(content);
};

Popup.prototype.setImage = function(spriteName, label) {
    let sprite = this.imageContainer.create(0, 0, spriteName);
    sprite.scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);

    if (label != undefined) {
        let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', label, 8);
        content.x = sprite.width + (this.padding / 2)
        content.y = (sprite.height - content.height) / 2;
        this.imageContainer.addChild(content);
    }
};

Popup.prototype.addStats = function(stat, from, to) {
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

    let nbrStats = Math.floor(this.statsContainer.children.length/4);
    let textX = 0;
    let textY = this.statsContainer.height;
    if (textY > 0) {
        textY += this.padding;
    }

    let text = this.game.add.bitmapText(textX, textY, 'font:gui-multiline', statName + ": ", 8);
    this.statsContainer.addChild(text);
    textX += text.width + this.padding;
    let labelHeight = text.height;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', from, 8);
    text.y += (labelHeight - text.height) / 2;
    this.statsContainer.addChild(text);
    textX += text.width + this.padding;
    
    text = this.game.add.bitmapText(textX, textY, 'font:gui', "->", 8);
    text.y += (labelHeight - text.height) / 2;
    this.statsContainer.addChild(text);
    textX += text.width + this.padding;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', to, 8);
    text.y += (labelHeight - text.height) / 2;
    this.statsContainer.addChild(text);
    textX += text.width + this.padding;
};

Popup.prototype.show = function() {
    this.generate();

    this.backgroundContainer.alpha = 0.8;
    this.popupContainer.originalY = this.popupContainer.y;
    this.popupContainer.y = - this.backgroundContainer.height;

    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, Popup.SPEED).start();
};

Popup.prototype.close = function() {
    let sound = this.game.add.audio('sound:popup-button');
    sound.play();

    let tween = this.game.add.tween(this.popupContainer).to({y:-this.backgroundContainer.height}, Popup.SPEED);
    tween.onComplete.add(function() {
        this.destroy();
    }, this);
    tween.start();
};
