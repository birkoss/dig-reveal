function Popup(game) {
    Phaser.Group.call(this, game);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.buttonsContainer = this.game.add.group();
    this.add(this.buttonsContainer);

    this.contentContainer = this.game.add.group();
    this.add(this.contentContainer);

    this.padding = 10 * GAME.RATIO;

    this.createBackground();
};

Popup.prototype = Object.create(Phaser.Group.prototype);
Popup.prototype.constructor = Popup;

Popup.prototype.addButton = function(buttonData) {
    let button = this.game.add.button(0, 0, 'popup:button', buttonData.callback, buttonData.context, 1, 0, 1, 0);
    button.x = this.buttonsContainer.children.length * (button.width + this.padding);
    button.scale.setTo(GAME.RATIO, GAME.RATIO);

    console.log(button.height);
    let label = this.game.add.bitmapText(0, 0, 'font:gui', buttonData.text, 8);
    label.anchor.set(0.5, 0.5);
    label.x = (button.width/GAME.RATIO)/2;
    label.y = (button.height/GAME.RATIO)/2;
    button.addChild(label);

    this.buttonsContainer.addChild(button);
};

Popup.prototype.generate = function() {

    this.resizeBackground(300, 150);

    /* Position the buttons */
    this.buttonsContainer.x = (this.backgroundContainer.width - this.buttonsContainer.width) / 2;
    this.buttonsContainer.y = this.backgroundContainer.height - this.buttonsContainer.height - this.padding;
};

Popup.prototype.createBackground = function() {
    for (let y=0; y<3; y++) {
        for (let x=0; x<3; x++) {
            let sprite = this.backgroundContainer.create(0, 0, 'popup:background');
            sprite.scale.setTo(GAME.RATIO, GAME.RATIO);
            sprite.frame = (y * 3) + x;
            sprite.x = x * sprite.width;
            sprite.y = y * sprite.height;
        }
    }
};

Popup.prototype.resizeBackground = function(newWidth, newHeight) {
    let cornerSize = this.backgroundContainer.getChildAt(0).width;
    let parts = new Array();

    if (newWidth != this.backgroundContainer.width) {
       parts = [1, 4, 7]; 
       for (let i=0; i<parts.length; i++) {
           this.backgroundContainer.getChildAt(parts[i]).width = newWidth - (cornerSize * 2);
           this.backgroundContainer.getChildAt(parts[i]+1).x = this.backgroundContainer.getChildAt(parts[i]).width + this.backgroundContainer.getChildAt(parts[i]).x;
       }
    }

    if (newHeight != this.backgroundContainer.height) {
       parts = [3, 4, 5]; 
       for (let i=0; i<parts.length; i++) {
           this.backgroundContainer.getChildAt(parts[i]).height = newHeight - (cornerSize * 2);
           this.backgroundContainer.getChildAt(parts[i]+3).y = this.backgroundContainer.getChildAt(parts[i]).height + this.backgroundContainer.getChildAt(parts[i]).y;
       }
    }
};

Popup.prototype.setContent = function(newContent) {
    let borderSize = this.backgroundContainer.getChildAt(0).width;

    let maxWidth = this.game.width - (borderSize*2) - (this.padding*2);

    let content = this.game.add.bitmapText(0, 0, 'font:gui-multiline', newContent, 8);
    content.maxWidth = maxWidth;
    this.contentContainer.addChild(content);
};
