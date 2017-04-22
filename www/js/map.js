function Map(game, width, height) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.FOWContainer = this.game.add.group();
    this.add(this.FOWContainer);

    this.init();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.init = function() {
    let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'tile:dungeon');
    this.backgroundContainer.addChild(background);

    let floor = this.game.add.tileSprite(0, 0, this.gridWidth*16, this.gridHeight*16, 'tile:grass');
    this.tilesContainer.addChild(floor);

    /* Add a fog of war */
    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            let fow = this.FOWContainer.create(0, 0, 'tile:fog-of-war');
            fow.anchor.set(0.5, 0.5);
            fow.x = (x * fow.width);
            fow.y = (y * fow.height);

            fow.x += (fow.width/2);
            fow.y += (fow.height/2);

            fow.alpha = 0.5;

            fow.inputEnabled = true;
            fow.events.onInputDown.add(this.onFOWClicked, this);
        }
    }

    //this.tilesContainer.x = (this.game.width/2-(this.tilesContainer.width/2));
    //this.FOWContainer.x = this.FOWContainer.y = this.tilesContainer.y = this.tilesContainer.x;
};

Map.prototype.onFOWClicked = function(tile, pointer) {
    tile.inputEnabled = false;

    this.game.add.tween(tile.scale).to({x:0, y:0}, 400).start();
    let tween = this.game.add.tween(tile).to({alpha:0}, 400).start();
    tween.onComplete.add(function() {
        tile.destroy();
    }, this);
};

Map.prototype.onTileClicked = function(tile, pointer) {
    console.log(tile);
};
