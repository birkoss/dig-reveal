function Generator(levelConfig, gridWidth, gridHeight) {
    this.levelConfig = levelConfig;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;

    this.init();

    this.generate();
};

Generator.prototype = {
    generate: function() {
        /* Starting position */
        let position = this.getRandomPosition();
        if (position != null) {
            this.setTypeAt(position.gridX, position.gridY, "start");
        }

        /* Details */
        for (let i=0; i<this.getRandomBetween(15, 25); i++) {
            let position = this.getRandomPosition();
            if (position != null) {
                this.setTypeAt(position.gridX, position.gridY, "detail");
            }
        }

        if (this.levelConfig.type == "map") {
            /* Levels */
            let parent_id = this.levelConfig.id;
            let maxSubLevels = 5;
            let nbrSubLevels = 0;

            for (let i=0; i<maxSubLevels; i++) {
                let position = this.getRandomPosition();
                if (position == null) {
                    break;
                }

                let subLevelConfig = {id:parent_id+"-dungeon-"+i, name:"Chateau", type:"dungeon", parent:parent_id};
                let sublevel = new Generator(subLevelConfig, this.gridWidth, this.gridHeight);
                this.setTypeAt(position.gridX, position.gridY, 'dungeon', {level:subLevel});
                nbrSubLevels++;
            }
    },
    getExcludedPositions: function() {
        let excludedPositions = new Array();

        this.grid.forEach(function(position) {
            if (position.type != "") {
                excludedPositions.push({gridX:position.gridX, gridY:position.gridY});
                if (position.type == "start") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 2));
                } else if (position.type == "level") {
                    excludedPositions = excludedPositions.concat(this.getNeighboorsAt(position.gridX, position.gridY, false, 3));
                } else if (position.type == "enemy") {
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
    }


};
