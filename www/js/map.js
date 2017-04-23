function Map(game, width, height, type) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;
    this.type = type;

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.FOWContainer = this.game.add.group();
    this.add(this.FOWContainer);

    this.onFOWClicked = new Phaser.Signal();
    this.onTileClicked = new Phaser.Signal();
    this.onMapDirty = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.load = function(data) {
    data['fow'].forEach(function(position) {
            this.createFOW(position.gridX, position.gridY);
    }, this);

    this.createStartPosition(data['start'].gridX, data['start'].gridY);

    data['details'].forEach(function(position) {
        this.createItem(position.gridX, position.gridY, this.type+'-detail', 'detail');
    }, this);

    data['levels'].forEach(function(level) {
        this.createItem(level.gridX, level.gridY, 'castle', 'level', {id: level.id});
    }, this);
};

Map.prototype.generate = function() {
    this.generateFOW();
    this.generateDetails();
    let position = this.getRandomPosition();
    this.createStartPosition(position.gridX, position.gridY);
    this.generateLevels(5);
};

/* @TODO Rename to start, or something more pertinent */
Map.prototype.show = function() {
    let positions = this.getItems('start');

    positions.forEach(function(tile) {
        /* Reveals all tiles around it */
        this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1, false).forEach(function(position) {
            this.destroyFOW(this.getFOWAt(position.gridX, position.gridY));
        }, this);
    }, this);
};

Map.prototype.createMap = function() {
    let background = this.game.add.tileSprite(0, 0, this.gridWidth*16, this.gridHeight*16, 'tile:'+this.type+'-floor');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    this.backgroundContainer.addChild(background);

    /* Add borders */
    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            let sprite = "";
            if (x == 0) {
                sprite = "left";
                if (y == 0) {
                    sprite = "top-left";
                } else if (y == this.gridHeight - 1) {
                    sprite = "bottom-left";
                }
            } else if (x == this.gridWidth -1) {
                sprite =  "right";
                if (y == 0) {
                    sprite = "top-right";
                } else if (y == this.gridHeight - 1) {
                    sprite = "bottom-right";
                }
            } else if (y == 0) {
                sprite =  "top";
            } else if (y == this.gridHeight -1) {
                sprite = "bottom";
            }

            if (sprite != "" ) {
                let tile = this.tilesContainer.create(0, 0, "tile:"+this.type+"-border-" + sprite);
                tile.scale.setTo(GAME.RATIO, GAME.RATIO);
                tile.x = x * tile.width;
                tile.y = y * tile.height;

                tile.gridX = x;
                tile.gridY = y;

                tile.type = 'border';
            }
        }
    }
};

Map.prototype.generateFOW = function() {
    /* Add a fog of war */
    for (let y=0; y<this.gridHeight; y++) {
        for (let x=0; x<this.gridWidth; x++) {
            this.createFOW(x, y);
        }
    }
};

Map.prototype.createFOW = function(gridX, gridY) {
    let fow = this.FOWContainer.create(0, 0, 'tile:fog-of-war');
    fow.scale.setTo(GAME.RATIO, GAME.RATIO);
    fow.anchor.set(0.5, 0.5);
    fow.gridX = gridX
    fow.gridY = gridY;
    fow.x = (gridX * fow.width);
    fow.y = (gridY * fow.height);

    fow.x += (fow.width/2);
    fow.y += (fow.height/2);

    fow.alpha = 0.8;

    fow.inputEnabled = true;
    fow.events.onInputDown.add(this.onFOWClick, this);
};

Map.prototype.generateDetails = function() {
    for (let i=0; i<this.game.rnd.integerInRange(15, 25); i++) {
        let position = this.getRandomPosition();
        this.createItem(position.gridX, position.gridY, this.type+'-detail', 'detail');
    }
};

Map.prototype.createStartPosition = function(gridX, gridY) {
    this.createItem(gridX, gridY, this.type + '-start', 'start');
};

Map.prototype.generateLevels = function(maxLevels) {
    for (let i=0; i<maxLevels; i++) {
        let position = this.getRandomPosition();
        if (position == null) {
            break;
        }

        this.createItem(position.gridX, position.gridY, 'castle', 'level', {name:'Chateau', id:this.type+'-'+i});
    }
};

Map.prototype.createItem = function(gridX, gridY, sprite, type, data) {
    if (type == undefined) {
        type = sprite;
    }
    let tile = this.tilesContainer.create(0, 0, "tile:" + sprite);
    tile.type = type;
    tile.scale.setTo(GAME.RATIO, GAME.RATIO);

    tile.x = (tile.width * gridX);
    tile.y = (tile.height * gridY);

    tile.gridX = gridX;
    tile.gridY = gridY;

    tile.inputEnabled = true;
    tile.events.onInputDown.add(this.onTileClick, this);

    if (data != undefined) {
        for (let index in data) {
            tile[index] = data[index];
        }
    }
};

Map.prototype.destroyFOW = function(tile) {
    if (tile != null) {
        tile.inputEnabled = false;

        this.game.add.tween(tile.scale).to({x:0, y:0}, 400).start();
        let tween = this.game.add.tween(tile).to({alpha:0}, 400).start();
        tween.onComplete.add(function() {
            tile.destroy();
            this.onMapDirty.dispatch(tile, 1);
        }, this);
    }
};

/* Getters */

Map.prototype.getRandomPosition = function() {
    let excludedTiles = this.getExcludedTiles();

    let tiles = new Array();
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            let isExcluded = false;
            excludedTiles.forEach(function(tile) {
                if (tile.gridX == gridX && tile.gridY == gridY) {
                    isExcluded = true;
                }
            }, this);

            if (!isExcluded) {
                tiles.push({gridX:gridX, gridY:gridY});
            }
        }
    }

    return tiles[this.game.rnd.integerInRange(0, tiles.length-1)];
};

Map.prototype.getExcludedTiles = function() {
    let excludedTiles = new Array();

    this.tilesContainer.forEach(function(tile) {
        excludedTiles.push({gridX:tile.gridX, gridY:tile.gridY});
        if (tile.type == 'start') {
            excludedTiles = excludedTiles.concat(this.getNeighboorsAt(tile.gridX, tile.gridY, false, 2));
        } else if (tile.type == 'level') {
            excludedTiles = excludedTiles.concat(this.getNeighboorsAt(tile.gridX, tile.gridY, false, 3));
        }
    }, this);

    return excludedTiles;
};

Map.prototype.getNeighboorsAt = function(gridX, gridY, onlyAdjacent, depth, excludeStartingPosition) {
    if (depth == undefined) { depth = 1; }
    if (onlyAdjacent == undefined) { onlyAdjacent = true; }
    if (excludeStartingPosition == undefined) { excludeStartingPosition = true; }

    let neighboors = new Array();
    for (let y=-depth; y<=depth; y++) {
        for (let x=-depth; x<=depth; x++) {
            if ((x == 0 && y == 0) && excludeStartingPosition) { continue; }
            if (onlyAdjacent && (x != 0 && y != 0)) { continue; }

            let newX = gridX + x;
            let newY = gridY + y;
            if (newX >= 0 && newX < this.gridWidth && newY >= 0 && newY < this.gridHeight) {
                neighboors.push({gridX:newX, gridY:newY});
            }
        }
    }
    return neighboors;
};

Map.prototype.getItems = function(type) {
    let items = this.tilesContainer.filter(function(tile) {
        return tile.type == type;
    });

    return items.list;
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

Map.prototype.onFOWClick = function(tile, pointer) {
    if (GAME.STAMINA > 0) {
        this.destroyFOW(tile);
        this.onFOWClicked.dispatch(this, 1);

        this.getItems('level').forEach(function(level) {
            if (tile.gridX == level.gridX && tile.gridY == level.gridY) {
                this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1, false).forEach(function(position) {
                    this.destroyFOW(this.getFOWAt(position.gridX, position.gridY));
                }, this);
            }
        }, this);
    }
};

Map.prototype.onTileClick = function(tile, pointer) {
    this.onTileClicked.dispatch(tile, 1);
};
