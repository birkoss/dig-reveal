function Generator(levelConfig, gridWidth, gridHeight) {
    this.levelConfig = levelConfig;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.grid = new Array();
};

Generator.prototype = {
    addItem: function(gridType, gridData) {
        let position = this.getRandomPosition();
        if (position != null) {
            this.setTypeAt(position.gridX, position.gridY, gridType, gridData);
        }
    },
    fillArrayWithPool: function(array, pool, limit, data) {
        for (let i=0; i<limit; i++) {
            let element_id = pool[this.getRandomBetween(0, pool.length-1)];
            if (data[element_id] != undefined) {
                array.push(data[element_id]);
            }
        }
    },
    load: function() {
        let data = localStorage.getItem(this.getSaveName());
        if (data != null) {
            data = JSON.parse(data);
        }
        return data;
    },
    generate: function() {
        this.init();

        /* Starting position */
        let position = this.getRandomPosition();
        if (position != null) {
            this.setTypeAt(position.gridX, position.gridY, "start");
        }

        /* Details */
        for (let i=0; i<this.getRandomBetween(15, 25); i++) {
            let position = this.getRandomPosition();
            if (position == null) {
                break;
            }
            this.setTypeAt(position.gridX, position.gridY, "detail");
        }

        if (this.levelConfig.type == "map") {
            /* Enemies */
            let enemies = new Array();

            /* Get the boss if it's available */
            if (this.levelConfig.boss != undefined && GAME.json['enemies'][this.levelConfig.boss] != null) {
                enemies.push(GAME.json['enemies'][this.levelConfig.boss]);
            }

            /* Generate an array with all the possible enemies */
            let enemiesPool = new Array();
            if (this.levelConfig.enemies != null) {
                for (let i=0; i<this.levelConfig.enemies.length; i++) {
                    for (let enemy_id in this.levelConfig.enemies[i]) {
                        for (let j=0; j<this.levelConfig.enemies[i][enemy_id]; j++) {
                            enemiesPool.push(enemy_id);
                        }
                    }
                }
            }

            /* Items */
            let items = new Array();

            /* Get the unique items */
            if (this.levelConfig.items != undefined) {
                for (let i=0; i<this.levelConfig.items.length; i++) {
                    let item = GAME.json['items'][this.levelConfig.items[i]];
                    if (item != null) {
                        items.push(item);
                    }
                }
            }

            /* Generate an array with all the possible items */
            let itemsPool = new Array();
            if (this.levelConfig.chests != null) {
                for (let i=0; i<this.levelConfig.chests.length; i++) {
                    for (let item_id in this.levelConfig.chests[i]) {
                        for (let j=0; j<this.levelConfig.chests[i][item_id]; j++) {
                            itemsPool.push(item_id);
                        }
                    }
                }
            }

            /* Dungeons */
            let parent_id = this.levelConfig.id;
            let maxDungeons = 5;

            let dungeons = new Array();
            for (let i=0; i<maxDungeons; i++) {
                let position = this.getRandomPosition();
                if (position == null) {
                    break;
                }

                let dungeonConfig = {id:parent_id+"-dungeon-"+i, name:"Chateau", type:"dungeon", parent:parent_id};
                let dungeon = new Generator(dungeonConfig, this.gridWidth, this.gridHeight);
                dungeon.generate();
                this.setTypeAt(position.gridX, position.gridY, 'dungeon', {dungeon:dungeon});

                dungeons.push(dungeon);
            }

            /* Pick enemies PER dungeon */
            let nbrEnemiesPerDungeon = 10;
            this.fillArrayWithPool(enemies, enemiesPool, (nbrEnemiesPerDungeon*dungeons.length), GAME.json['enemies']);

            /* Pick items PER dungeon */
            let nbrItemsPerDungeon = 3;
            this.fillArrayWithPool(items, itemsPool, (nbrItemsPerDungeon*dungeons.length), GAME.json['items']);

            /* Place items and enemies in each dungeon */
            for (let i=0; i<dungeons.length; i++) {
                for (let j=0; j<nbrEnemiesPerDungeon; j++) {
                    if (enemies.length == 0) {
                        break;
                    }
                    let enemy = enemies.shift();
                    dungeons[i].addItem('enemy', {enemy: enemy});
                }
                for (let j=0; j<nbrItemsPerDungeon; j++) {
                    if (items.length == 0) {
                        break;
                    }
                    let item = items.shift();
                    dungeons[i].addItem('chest', {item: item});
                }
            }

            /* Save the map and its dungeons */
            this.save();
            for (let i=0; i<dungeons.length; i++) {
                dungeons[i].save();
            }
        }

    },
    getExcludedPositions: function() {
        let excludedPositions = new Array();

        this.grid.forEach(function(position) {
            if (position.type != "") {
                excludedPositions.push({gridX:position.gridX, gridY:position.gridY});
                if (position.type == "start") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 2));
                } else if (position.type == "dungeon") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 3));
                } else if (position.type == "enemy") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 1));
                } else if (position.type == "chest") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 1));
                }
            }
        }, this);

        return excludedPositions;
    },
    getNeighboorsAt: function(gridX, gridY, onlyAdjacent, depth, excludeStartingPosition) {
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
    },
    getRandomBetween: function(start, end) {
        return Math.floor(Math.random() * end) + start;
    },
    getRandomPosition: function() {
        let excludedPositions = this.getExcludedPositions();

        let grid = new Array();
        for (let gridY=0; gridY<this.gridHeight; gridY++) {
            for (let gridX=0; gridX<this.gridWidth; gridX++) {
                let isExcluded = false;
                excludedPositions.forEach(function(position) {
                    if (position.gridX == gridX && position.gridY == gridY) {
                        isExcluded = true;
                    }
                }, this);

                if (!isExcluded) {
                    grid.push({gridX:gridX, gridY:gridY});
                }
            }
        }

        return grid[this.getRandomBetween(0, grid.length-1)];
    },
    getSaveName: function() {
        return 'level_' + this.levelConfig.id + '_' + this.gridWidth + 'x' + this.gridHeight;
    },
    init: function() {
        this.grid = new Array();

        for (let y=0; y<this.gridHeight; y++) {
            for (let x=0; x<this.gridWidth; x++) {
                let gridType = "";
                if (x == 0 || y == 0 || x == this.gridWidth-1 || y == this.gridHeight-1) {
                    gridType = "border";
                }
                this.grid.push({gridX:x, gridY:y, type:gridType});
            }
        }
    },
    setTypeAt: function(gridX, gridY, gridType, gridData) {
        this.grid[(gridY * this.gridWidth) + gridX]["type"] = gridType;

        if (gridData != undefined) {
            for (let index in gridData) {
                this.grid[(gridY * this.gridWidth) + gridX][index] = gridData[index];
            }
        }
    },
    save: function() {
        let data = this.saveHeaders();

        this.grid.forEach(function(g) {
            data['fow'].push({gridX:g.gridX, gridY:g.gridY});

            let item = {gridX:g.gridX, gridY:g.gridY};
            switch(g.type) {
                case 'start':
                    if (this.levelConfig.parent != undefined) {
                        item.levelID = this.levelConfig.parent;
                    }
                    data['start'] = item;
                    break;
                case 'dungeon':
                    item.name = g.dungeon.levelConfig.name;
                    item.levelID = g.dungeon.levelConfig.id;
                    data['dungeons'].push(item);
                    break;
                case 'enemy':
                    item.enemyID = g.enemy.id;
                    item.health = g.enemy.health;
                    data['enemies'].push(item);
                    break;
                case 'chest':
                    item.itemID = g.item.id;
                    item.isOpen = false;
                    data['chests'].push(item);
                    break;
                case 'detail':
                    data['details'].push(item);
                    break;
            }
        }, this);
        
        this.saveJSON(this.getSaveName(), JSON.stringify(data));
    },
    saveHeaders: function() {
        let data = {version:"1.0"};
        data['id'] = this.levelConfig.id;
        data['name'] = this.levelConfig.name;
        data['type'] = this.levelConfig.type;
        data['gridWidth'] = this.gridWidth;
        data['gridHeight'] = this.gridHeight;
        if (this.levelConfig.parent != undefined) {
            data['parent'] = this.levelConfig.parent;
        }

        data['start'] = {};
        data['fow'] = [];
        data['dungeons'] = [];
        data['details'] = [];
        data['enemies'] = [];
        data['chests'] = [];

        return data;
    },
    saveMap: function(map) {
        let data = this.saveHeaders();

        map.getItems('start').forEach(function(tile) {
            data['start'] = {gridX:tile.gridX, gridY:tile.gridY, levelID:tile.levelID}
        }, this);

        map.FOWContainer.children.forEach(function(tile) {
            data['fow'].push({gridX:tile.gridX, gridY:tile.gridY});
        }, this);

        map.getItems('dungeon').forEach(function(tile) {
            data['dungeons'].push({levelID:tile.levelID, name:tile.name, gridX:tile.gridX, gridY:tile.gridY});
        }, this);

        map.getItems('detail').forEach(function(tile) {
            data['details'].push({gridX:tile.gridX, gridY:tile.gridY});
        }, this);

        map.getItems('enemy').forEach(function(tile) {
            data['enemies'].push({gridX:tile.gridX, gridY:tile.gridY, health:tile.health, enemyID:tile.enemy.id});
        }, this);

        map.getItems('chest').forEach(function(tile) {
            data['chests'].push({gridX:tile.gridX, gridY:tile.gridY, isOpen:tile.isOpen, itemID:tile.item.id});
        }, this);

        this.saveJSON(this.getSaveName(), JSON.stringify(data));
    },
    saveJSON: function(filename, json) {
        localStorage.setItem(filename, json);
    }
};
