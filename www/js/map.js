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
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.backgroundContainer.addChild(background);

    let floor = this.game.add.tileSprite(0, 0, this.gridWidth*16, this.gridHeight*16, 'tile:grass');
    floor.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.tilesContainer.addChild(floor);

    /* Add a fog of war */
    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            let fow = this.FOWContainer.create(0, 0, 'tile:fog-of-war');
            fow.scale.setTo(GAME.RATIO, GAME.RATIO);
            fow.anchor.set(0.5, 0.5);
            fow.gridX = x;
            fow.gridY = y;
            fow.x = (x * fow.width);
            fow.y = (y * fow.height);

            fow.x += (fow.width/2);
            fow.y += (fow.height/2);

            fow.alpha = 0.8;

            fow.inputEnabled = true;
            fow.events.onInputDown.add(this.onFOWClicked, this);
        }
    }

    let itemX = this.game.rnd.integerInRange(1, this.gridWidth-2);
    let itemY = this.game.rnd.integerInRange(1, this.gridHeight-2);
    this.createItem(itemX, itemY, 'tile:village', true);
    
    this.getNeighboorsAt(itemX, itemY).forEach(function(position) {
        this.getFOWAt(position.x, position.y).kill();
    }, this);

    this.createItem(6, 9, 'tile:castle');
    this.createItem(10, 3, 'tile:castle');

    this.tilesContainer.x = (this.game.width/2-(this.tilesContainer.width/2));
    this.FOWContainer.x = this.FOWContainer.y = this.tilesContainer.y = this.tilesContainer.x;
};

Map.prototype.createItem = function(itemX, itemY, itemSprite, reveal) {
    let sprite = this.tilesContainer.create(0, 0, itemSprite);
    sprite.scale.setTo(GAME.RATIO, GAME.RATIO);

    sprite.x = (sprite.width * itemX);
    sprite.y = (sprite.height * itemY);

    /* Remove the FOG at the position */
    if (reveal == true) {
        let fogOfWar = this.getFOWAt(itemX, itemY);
        if (fogOfWar != null) {
            fogOfWar.kill();
        }
    }
};

/* Getters Helpers */

Map.prototype.getNeighboorsAt = function(gridX, gridY) {
    let neighboors = new Array();
    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            if (Math.abs(x) != Math.abs(y)) {
                let newX = gridX + x;
                let newY = gridY + y;
                if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                    neighboors.push({x:newX, y:newY});
                }
            }
        }
    }
    return neighboors;
};

Map.prototype.getFOWAt = function(gridX, gridY) {
    let fogOfWar = null;

    this.FOWContainer.forEach(function(tile) {
        if (tile.gridX == gridX && tile.gridY == gridY) {
            fogOfWar = tile;
        }
    }, this);

    return fogOfWar;
};

/* Events */

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
