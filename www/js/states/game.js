var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createMap();
        this.createPanel();

        this.showPanel();
    },
    showPanel: function() {
        this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
    },
    createMap: function() {
        /* Get the best map size for the current resolution */
        let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));

        /* Create the map */
        this.map = new Map(this.game, mapWidth, 12);

        /* Create a background under the map */
        let background = this.game.add.tileSprite(0, 0, this.game.width, (this.map.height/GAME.RATIO) + 32, 'tile:water-middle');
        background.scale.setTo(GAME.RATIO, GAME.RATIO);
        background.animations.add('idle', [0, 1], 2, true);
        background.play('idle');
        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.game.width - this.map.width)/2;
        this.map.y = 32;
    },
    createPanel: function() {
        let background = this.panelContainer.create(0, 0, 'panel:background');
        background.scale.setTo(GAME.RATIO, GAME.RATIO);
        background.width = this.game.width;

        let mapName = this.game.add.bitmapText(16, (background.height/2), 'font:gui', 'Village', 16);
        mapName.anchor.set(0, 0.5);
        this.panelContainer.addChild(mapName);

        let staminaIcon = this.panelContainer.create(0, (background.height/2), 'panel:stamina');
        staminaIcon.anchor.set(1, 0.5);
        staminaIcon.scale.setTo(GAME.RATIO, GAME.RATIO);
        staminaIcon.x = background.width - 16;

        let progressBarBackground = this.panelContainer.create(0, (background.height/2), 'progress-bar:background');
        progressBarBackground.anchor.set(0, 0.5);
        progressBarBackground.scale.setTo(GAME.RATIO, GAME.RATIO);
        progressBarBackground.x = staminaIcon.x - progressBarBackground.width - staminaIcon.width - 16;

        this.stamina = this.panelContainer.create(progressBarBackground.x, (background.height/2), 'progress-bar:filling');
        this.stamina.anchor.set(0, 0.5);
        this.stamina.scale.setTo(GAME.RATIO, GAME.RATIO);
        this.stamina.originalWidth = this.stamina.width;

        this.staminaText = this.game.add.bitmapText(this.stamina.x + (this.stamina.width/2), (background.height/2), 'font:gui', '100/100', 8);
        this.staminaText.anchor.set(0.5, 0.5);
        this.panelContainer.addChild(this.staminaText);

        this.panelContainer.y = - this.panelContainer.height;
    }
};
