function Panel(game) {
    Phaser.Group.call(this, game);

    this.createBackground();
}

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.updateStamina = function(staminaTotal, staminaMax) {
    this.staminaText.text = staminaTotal + "/" + staminaMax; 
    this.stamina.width = staminaTotal / staminaMax * this.stamina.originalWidth;

    if (GAME.time == null) {
        this.staminaRefresh.width = this.width;
    } else {
        this.staminaRefresh.width = this.width * ((GAME.now - GAME.time) / GAME.timeDelay);
    }
};

Panel.prototype.createBackground = function() {
    let background = this.create(0, 0, 'panel:background');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    background.width = this.game.width;

    this.staminaRefresh = this.create(0, 0, 'panel:stamina-timer');
    this.staminaRefresh.scale.setTo(GAME.RATIO, GAME.RATIO);

    this.levelName = this.game.add.bitmapText(16, (background.height/2), 'font:gui', '', 8);
    this.levelName.anchor.set(0, 0.5);
    this.addChild(this.levelName);

    let staminaIcon = this.create(0, (background.height/2), 'panel:stamina');
    staminaIcon.anchor.set(1, 0.5);
    staminaIcon.scale.setTo(GAME.RATIO, GAME.RATIO);
    staminaIcon.x = background.width - 16;

    let progressBarBackground = this.create(0, (background.height/2), 'progress-bar:background');
    progressBarBackground.anchor.set(0, 0.5);
    progressBarBackground.scale.setTo(GAME.RATIO, GAME.RATIO);
    progressBarBackground.x = staminaIcon.x - progressBarBackground.width - staminaIcon.width - 16;

    this.stamina = this.create(progressBarBackground.x, (background.height/2), 'progress-bar:filling');
    this.stamina.anchor.set(0, 0.5);
    this.stamina.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.stamina.originalWidth = this.stamina.width;

    let progressBarBorder = this.create(0, (background.height/2), 'progress-bar:border');
    progressBarBorder.anchor.set(0, 0.5);
    progressBarBorder.scale.setTo(GAME.RATIO, GAME.RATIO);
    progressBarBorder.x = staminaIcon.x - progressBarBorder.width - staminaIcon.width - 16;

    this.staminaText = this.game.add.bitmapText(this.stamina.x + (this.stamina.width/2), (background.height/2), 'font:gui', '100/100', 8);
    this.staminaText.anchor.set(0.5, 0.5);
    this.addChild(this.staminaText);
};
