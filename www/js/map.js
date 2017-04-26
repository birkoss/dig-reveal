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

    this.effectsContainer = this.game.add.group();
    this.add(this.effectsContainer);

    this.onTileClicked = new Phaser.Signal();
    this.onMapDirty = new Phaser.Signal();
    this.onStaminaSpent = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.load = function(data) {
    console.log(data);

    data['fow'].forEach(function(position) {
            this.createFOW(position.gridX, position.gridY);
    }, this);

    this.createStartPosition(data['start'].gridX, data['start'].gridY, {levelID:data['start'].levelID});

    data['details'].forEach(function(position) {
        this.createItem(position.gridX, position.gridY, this.type+'-detail', 'detail');
    }, this);

    data['dungeons'].forEach(function(dungeon) {
        this.createItem(dungeon.gridX, dungeon.gridY, this.type + '-dungeon', 'dungeon', {levelID:dungeon.levelID});
    }, this);

    data['chests'].forEach(function(c) {
        let item = GAME.json['items'][c.itemID];
        this.createItem(c.gridX, c.gridY, this.type + '-chest', 'chest', {isOpen:c.isOpen, item:item});
    }, this);

    data['enemies'].forEach(function(e) {
        let enemy = GAME.json['enemies'][e.enemyID];
        this.createEnemy(e.gridX, e.gridY, enemy.sprite, {health:e.health, enemy:enemy});
    }, this);
};

/* @TODO Rename to start, or something more pertinent */
/* @TODO Should not be called when the map is loading, only when created or opened for the first time */
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

    fow.alpha = 0.5;

    fow.inputEnabled = true;
    fow.events.onInputDown.add(this.onFOWClick, this);
};

Map.prototype.createStartPosition = function(gridX, gridY, data) {
    this.createItem(gridX, gridY, this.type + '-start', 'start', data);
};

Map.prototype.createEnemy = function(gridX, gridY, sprite, data) {
    let enemy = this.createItem(gridX, gridY, sprite, 'enemy', data);

    enemy.animations.add('idle', [0, 1], 2, true);
    if (this.getFOWAt(gridX, gridY) == null && enemy.health > 0) {
        enemy.animations.play('idle');
    } else if (enemy.health <= 0) {
        this.destroyEnemy(enemy);
    }
};

Map.prototype.createItem = function(gridX, gridY, sprite, type, data) {
    if (type == undefined) {
        type = sprite;
    }
    let tile = this.tilesContainer.create(0, 0, (type == 'enemy' ? 'enemy:' : 'tile:') + sprite);
    tile.type = type;
    tile.sprite = sprite;
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

    return tile;
};

Map.prototype.destroyEnemy = function(tile) {
    tile.loadTexture('effect:dead');
    /* @TODO: Choose a random frame (0-3) */
};

Map.prototype.destroyFOW = function(tile) {
    if (tile != null) {
        tile.inputEnabled = false;

        let sound = this.game.add.audio('sound:fow');
        sound.play();

        this.game.add.tween(tile.scale).to({x:0, y:0}, 400).start();
        let tween = this.game.add.tween(tile).to({alpha:0}, 400).start();
        tween.onComplete.add(function() {
            tile.destroy();
            this.onMapDirty.dispatch(tile, 1);
        }, this);
    }
};

Map.prototype.noMoreStamina = function() {
    let sound = this.game.add.audio('sound:empty');
    sound.play();

    this.onStaminaSpent.dispatch(this, 0);
}

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
        } else if (tile.type == 'dungeon') {
            excludedTiles = excludedTiles.concat(this.getNeighboorsAt(tile.gridX, tile.gridY, false, 3));
        } else if (tile.type == 'enemy') {
            excludedTiles = excludedTiles.concat(this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1));
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
        let hasEnemyActive = false;
        this.getItems('enemy').forEach(function(enemy) {
            if (this.getFOWAt(enemy.gridX, enemy.gridY) == null && enemy.health > 0) {
                hasEnemyActive = true;
            }
        }, this);

        /* Can't explore when at least ONE enemy is active */
        if (!hasEnemyActive) {
            this.destroyFOW(tile);

            this.getItems('dungeon').forEach(function(dungeon) {
                if (tile.gridX == dungeon.gridX && tile.gridY == dungeon.gridY) {
                    this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1, false).forEach(function(position) {
                        this.destroyFOW(this.getFOWAt(position.gridX, position.gridY));
                    }, this);
                }
            }, this);

            this.getItems('enemy').forEach(function(enemy) {
                if (tile.gridX == enemy.gridX && tile.gridY == enemy.gridY) {
                    this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1, false).forEach(function(position) {
                        this.destroyFOW(this.getFOWAt(position.gridX, position.gridY));
                    }, this);

                    enemy.animations.play('idle');
                }
            }, this);

            this.getItems('chest').forEach(function(chest) {
                if (tile.gridX == chest.gridX && tile.gridY == chest.gridY) {
                    this.getNeighboorsAt(tile.gridX, tile.gridY, false, 1, false).forEach(function(position) {
                        this.destroyFOW(this.getFOWAt(position.gridX, position.gridY));
                    }, this);
                }
            }, this);

            this.onStaminaSpent.dispatch(this, 1);
        }
    } else {
        this.noMoreStamina();
    }
};

Map.prototype.onTileClick = function(tile, pointer) {
    this.onTileClicked.dispatch(tile, 1);

    if (tile.type == 'enemy' && tile.health > 0) {
        if (GAME.STAMINA >= 5) {
            this.onStaminaSpent.dispatch(this, 5);
            /* @TODO: Use the weapon stats */
            tile.health = Math.max(0, tile.health-1);

            console.log(tile.enemy);
            if (tile.enemy.sounds && tile.enemy.sounds[tile.health == 0 ? 'death' : 'hit']) {
                let sound = this.game.add.audio('sound:' + tile.enemy.sounds[tile.health == 0 ? 'death' : 'hit']);
                sound.play();
            }

            let effect = this.effectsContainer.create(0, 0, 'effect:attack');
            effect.scale.setTo(GAME.RATIO, GAME.RATIO);

            effect.animations.add('attacking', [0, 1, 0, 1, 0, 1], 10, false);
            effect.events.onAnimationComplete.add(function() {
                effect.destroy();
            }, this);
            effect.animations.play('attacking');

            effect.x = tile.x;
            effect.y = tile.y;

            if (tile.health <= 0) {
                this.destroyEnemy(tile);
            }
            this.onMapDirty.dispatch(tile, 1);
        } else {
            this.noMoreStamina();
        }
    }
};
