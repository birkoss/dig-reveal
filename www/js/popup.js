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

    this.padding = 10 * GAME.RATIO;

    this.createBackground();
    this.createPopupBackground();
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

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
    this.contentContainer.x = this.padding;
    this.contentContainer.y = this.padding;

    this.resizePopupBackground(this.contentContainer.width+(this.padding*2), this.contentContainer.y + this.contentContainer.height + (this.padding*2) + this.buttonsContainer.height);

    /* Position the buttons */
    this.buttonsContainer.x = (this.popupBackgroundContainer.width - this.buttonsContainer.width) / 2;
    this.buttonsContainer.y = this.popupBackgroundContainer.height - this.buttonsContainer.height - this.padding;

    this.popupContainer.x = (this.backgroundContainer.width - this.popupContainer.width)/2;
    this.popupContainer.y = (this.backgroundContainer.height - this.popupContainer.height)/2;
};

Popup.prototype.createPopupBackground = function() {
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            let sprite = this.popupBackgroundContainer.create(0, 0, 'popup:background');
            sprite.scale.setTo(GAME.RATIO, GAME.RATIO);
            sprite.frame = (y * 3) + x;
            sprite.x = x * sprite.width;
            sprite.y = y * sprite.height;
        }
    }
};

Popup.prototype.createBackground = function() {
    let sprite = this.backgroundContainer.create(0, 0, 'popup:background');
    sprite.width = this.game.width;
    sprite.height = this.game.height;
    sprite.tint = 0x000000;
    sprite.alpha = 0.5;
    sprite.inputEnabled = true;
};

Popup.prototype.resizePopupBackground = function(newWidth, newHeight) {
    let cornerSize = this.popupBackgroundContainer.getChildAt(0).width;
    let parts = new Array();

    if (newWidth != this.popupBackgroundContainer.width) {
       parts = [1, 4, 7]; 
       for (let i=0; i<parts.length; i++) {
           this.popupBackgroundContainer.getChildAt(parts[i]).width = newWidth - (cornerSize * 2);
           this.popupBackgroundContainer.getChildAt(parts[i]+1).x = this.popupBackgroundContainer.getChildAt(parts[i]).width + this.popupBackgroundContainer.getChildAt(parts[i]).x;
       }
    }

    if (newHeight != this.popupBackgroundContainer.height) {
       parts = [3, 4, 5]; 
       for (let i=0; i<parts.length; i++) {
           this.popupBackgroundContainer.getChildAt(parts[i]).height = newHeight - (cornerSize * 2);
           this.popupBackgroundContainer.getChildAt(parts[i]+3).y = this.popupBackgroundContainer.getChildAt(parts[i]).height + this.popupBackgroundContainer.getChildAt(parts[i]).y;
       }
    }
};

Popup.prototype.setContent = function(newContent) {
    let borderSize = this.popupBackgroundContainer.getChildAt(0).width;

    let maxWidth = this.game.width - (borderSize*2) - (this.padding*4);

    let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', newContent, 8);
    content.maxWidth = maxWidth;
    this.contentContainer.addChild(content);
};

Popup.prototype.show = function() {
    this.backgroundContainer.alpha = 0.8;
    this.popupContainer.originalY = this.popupContainer.y;
    this.popupContainer.y = - this.backgroundContainer.height;

    let tween = this.game.add.tween(this.popupContainer).to({y:this.popupContainer.originalY}, 500).start();
};

Popup.prototype.close = function() {
    let tween = this.game.add.tween(this.popupContainer).to({y:-this.backgroundContainer.height}, 500);
    tween.onComplete.add(function() {
        this.destroy();
    }, this);
    tween.start();
};
