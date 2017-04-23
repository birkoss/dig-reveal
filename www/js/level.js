function Level(game, name) {
    Phaser.Group.call(this, game);

    this.name = name;

    this.mapContainer = this.game.add.group();
    this.panelContainer = this.game.add.group();

    this.createPanel();
    this.createMap();
}

Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

Level.prototype.show = function() {
    this.showPanel();
};

Level.prototype.showPanel = function() {
    this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
    let tween = this.game.add.tween(this.map).to({alpha:1}, 400).start();
    tween.onComplete.add(function() {
        this.map.show();
    }, this);
};

Level.prototype.createMap = function() {
    /* Get the best map size for the current resolution */
    let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));

    /* Get the best map height from the remaining space left UNDER the panel */
    let mapHeight = Math.floor((this.game.height-this.panelContainer.height) / (16 * GAME.RATIO));

    /* Create the map */
    this.map = new Map(this.game, mapWidth, mapHeight);

    /* Create a background under the map */
    let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.width, 'tile:water-middle');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    background.animations.add('idle', [0, 1], 2, true);
    background.play('idle');
    this.mapContainer.addChild(background);
    this.mapContainer.addChild(this.map);

    this.map.x = (this.game.width - this.map.width)/2;
    this.map.y = this.panelContainer.height + 16;

    /* Hide the background */
    this.map.alpha = 0;
};

Level.prototype.createPanel = function() {
    this.panel = new Panel(this.game, this.name);
    this.panelContainer.addChild(this.panel);

    /* Hide the panel */
    this.panelContainer.y = -this.panelContainer.height;
};
