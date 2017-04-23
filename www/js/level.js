function Level(game, type, name) {
    Phaser.Group.call(this, game);

    this.name = name;
    this.type = type;

    this.mapContainer = this.game.add.group();
    this.panelContainer = this.game.add.group();

    this.onStaminaChanged = new Phaser.Signal();
    this.onLoadMap = new Phaser.Signal();

    this.createPanel();
    this.createMap();
}

Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

Level.prototype.load = function(mapGridWidth, mapGridHeight) {
    let saveName = 'level_'+this.name+'_'+mapGridWidth+'x'+mapGridHeight;

    console.log('load:'+saveName);
    let data = localStorage.getItem(saveName);
    if (data != null) {
        data = JSON.parse(data);
    }
    return data;
};

Level.prototype.save = function() {
    let saveName = 'level_'+this.name+'_'+this.map.gridWidth+'x'+this.map.gridHeight;

    var data = {'version':1};
    data['name'] = this.name;
    data['type'] = this.type;
    data['mapWidth'] = this.map.gridWidth;
    data['mapHeight'] = this.map.gridHeight;
    
    this.map.getItems('start').forEach(function(tile) {
        data['start'] = {gridX:tile.gridX, gridY:tile.gridY}
    }, this);

    data['fow'] = [];
    this.map.FOWContainer.children.forEach(function(tile) {
        data['fow'].push({gridX:tile.gridX, gridY:tile.gridY});
    }, this);

    data['levels'] = [];
    this.map.getItems('level').forEach(function(tile) {
        data['levels'].push({gridX:tile.gridX, gridY:tile.gridY});
    }, this);

    data['details'] = [];
    this.map.getItems('detail').forEach(function(tile) {
        data['details'].push({gridX:tile.gridX, gridY:tile.gridY});
    }, this);

    localStorage.setItem(saveName, JSON.stringify(data));
};

Level.prototype.show = function() {
    this.showPanel();
};

Level.prototype.showPanel = function() {
    let tween = this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
    //let tween = this.game.add.tween(this.map).to({alpha:1}, 400).start();
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
    this.map = new Map(this.game, mapWidth, mapHeight, this.type);

    /* Load an existing level? */
    let data = this.load(mapWidth, mapHeight);
    console.log(data);
    //data = null;
    if (data != null) {
        console.log('loading map...');
        this.map.load(data);
    } else {
        this.map.generate();
        this.save();
    }

    this.map.onFOWClicked.add(this.onMapFOWClicked, this);
    this.map.onTileClicked.add(this.onMapTileClicked, this);
    this.map.onMapDirty.add(this.onMapDirty, this);

    /* Create a background under the map */
    let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.width, 'tile:'+this.type+'-border-middle');
    background.scale.setTo(GAME.RATIO, GAME.RATIO);
    background.animations.add('idle', [0, 1], 2, true);
    background.play('idle');
    this.mapContainer.addChild(background);
    this.mapContainer.addChild(this.map);

    this.map.x = (this.game.width - this.map.width)/2;
    this.map.y = this.panelContainer.height + 16;
};

Level.prototype.createPanel = function() {
    this.panel = new Panel(this.game, this.name);
    this.panelContainer.addChild(this.panel);

    /* Hide the panel */
    this.panelContainer.y = -this.panelContainer.height;
};

Level.prototype.onMapFOWClicked = function(tile, value) {
    this.onStaminaChanged.dispatch(this, value);
};

Level.prototype.onMapTileClicked = function(tile, value) {
    this.onLoadMap.dispatch(tile.type, tile);
};

Level.prototype.onMapDirty = function(tile, value) {
    this.save();
};
