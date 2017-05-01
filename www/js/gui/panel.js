function Panel(game) {
    Phaser.Group.call(this, game);

    this.createBackground();
}

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.updateStamina = function(staminaTotal, staminaMax) {
    this.staminaText.text = staminaTotal + "/" + staminaMax; 
    this.stamina.width = staminaTotal / staminaMax * this.stamina.originalWidth;

    if (GAME.config.time == null) {
        this.staminaRefresh.width = this.width;
    } else {
        this.staminaRefresh.width = this.width * ((GAME.now - GAME.config.time) / GAME.config.timeDelay);
    }
};

Panel.prototype.createBackground = function() {
    let background = this.create(0, 0, 'panel:background');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    background.width = this.game.width;

    let staminaBackground = this.create(0, background.height, 'panel:stamina-background');
    staminaBackground.scale.setTo(GAME.RATIO, GAME.RATIO);
    staminaBackground.width = background.width;

    this.staminaRefresh = this.create(0, background.height, 'panel:stamina-progress');
    this.staminaRefresh.scale.setTo(GAME.RATIO, GAME.RATIO);

    this.levelName = this.game.add.bitmapText(16, (background.height/2), 'font:gui', '', 10);
    this.levelName.anchor.set(0, 0.5);
    this.addChild(this.levelName);

    let button = this.game.add.button(0, (background.height/2), "panel:btn-items", this.showUsableItems, this, 1, 0, 1, 0);
    button.anchor.set(1, 0.5);
    button.x = this.game.width - 16;
    this.addChild(button);

    this.staminaBackground = this.create(0, (background.height/2), 'progress-bar:background');
    this.staminaBackground.anchor.set(0, 0.5);
    this.staminaBackground.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.staminaBackground.x = button.x - this.staminaBackground.width - button.width - 16;
    this.staminaBackground.originalTint = this.staminaBackground.tint;

    this.stamina = this.create(this.staminaBackground.x, (background.height/2), 'progress-bar:filling');
    this.stamina.anchor.set(0, 0.5);
    this.stamina.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.stamina.originalWidth = this.stamina.width;

    let progressBarBorder = this.create(0, (background.height/2), 'progress-bar:border');
    progressBarBorder.anchor.set(0, 0.5);
    progressBarBorder.scale.setTo(GAME.RATIO, GAME.RATIO);
    progressBarBorder.x = button.x - progressBarBorder.width - button.width - 16;

    this.staminaText = this.game.add.bitmapText(this.stamina.x + (this.stamina.width/2), (background.height/2), 'font:gui', '100/100', 10);
    this.staminaText.anchor.set(0.5, 0.5);
    this.addChild(this.staminaText);
};

Panel.prototype.noMoreStamina = function() {
    var duration = 50;
    var repeat = 4;
    var ease = Phaser.Easing.Bounce.InOut;
    var autoStart = false;
    var delay = 0;
    var yoyo = true;

    this.staminaBackground.tint = 0xff0000;
    var tween = this.game.add.tween(this.staminaBackground).to({alpha:0}, duration, ease, autoStart, delay, 4, yoyo);

    tween.onComplete.add(function() {
        this.staminaBackground.tint = this.staminaBackground.originalTint;
    }, this);
    tween.start();
}

Panel.prototype.showUsableItems = function() {
    let popup = new Items(this.game, "usable");
    popup.show();
};
