function Panel(game, name) {
    Phaser.Group.call(this, game);

    this.name = name;

    this.createBackground();
}

Panel.prototype = Object.create(Phaser.Group.prototype);
Panel.prototype.constructor = Panel;

Panel.prototype.updateStamina = function(staminaTotal, staminaMax) {
    this.staminaText.text = staminaTotal + "/" + staminaMax; 
    this.stamina.width = staminaTotal / staminaMax * this.stamina.originalWidth;
};

Panel.prototype.createBackground = function() {
    let background = this.create(0, 0, 'panel:background');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    background.width = this.game.width;

    let mapName = this.game.add.bitmapText(16, (background.height/2), 'font:gui', this.name, 8);
    mapName.anchor.set(0, 0.5);
    this.addChild(mapName);

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

    this.staminaText = this.game.add.bitmapText(this.stamina.x + (this.stamina.width/2), (background.height/2), 'font:gui', '100/100', 8);
    this.staminaText.anchor.set(0.5, 0.5);
    this.addChild(this.staminaText);
};
