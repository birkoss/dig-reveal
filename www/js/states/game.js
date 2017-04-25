var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        console.log('Game.create: ' + GAME.level_id);

        this.config = {
             id: GAME.level_id,
             name: ""
        };

        console.log(this.config);
        if (GAME.music != null) {
            GAME.music.destroy();
        }

        this.mapContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createPanel();
        this.createMap();

        GAME.music = this.game.add.audio('music:' + this.config.type);
        GAME.music.play();

        this.showPanel();
    },
    update: function() {
        /* Keep the panel updated with the stamina amount */
        this.panel.updateStamina(GAME.STAMINA, GAME.STAMINA_MAX);

        GAME.tick();
    },

    /* Misc methods */

    createMap: function() {
        /* Get the best map size for the current resolution */
        let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));

        /* Get the best map height from the remaining space left UNDER the panel */
        let mapHeight = Math.floor((this.game.height-this.panelContainer.height) / (16 * GAME.RATIO));

        /* @TODO Remove levelConfig for this.config */
        let levelConfig = GAME.json['maps'][this.config.id];
        if (levelConfig == undefined) {
            levelConfig = this.config;
        }
        
        this.generator = new Generator(levelConfig, mapWidth, mapHeight);

        /* Load an existing level? */
        let mapData = this.generator.load();
        /* If it's not already generated, do it first */
        if (mapData == null) {
            this.generator.generate();
            mapData = this.generator.load();
        }

        this.generator.levelConfig.type = mapData.type;
        this.generator.levelConfig.name = mapData.name;

        this.config.type = this.generator.levelConfig.type;
        this.config.name = this.generator.levelConfig.name;

        console.log(levelConfig);
        console.log(this.config);
        /* Create the map */
        this.map = new Map(this.game, mapWidth, mapHeight, this.config.type);
        this.map.load(mapData);

        this.map.onTileClicked.add(this.onMapTileClicked, this);
        this.map.onMapDirty.add(this.onMapDirty, this);
        this.map.onStaminaSpent.add(this.onMapStaminaSpent, this);

        /* Create a background under the map */
        let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.width, 'tile:'+this.config.type+'-border-middle');
        background.scale.setTo(GAME.RATIO, GAME.RATIO);
        background.animations.add('idle', [0, 1], 2, true);
        background.play('idle');
        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.game.width - this.map.width)/2;
        this.map.y = this.panelContainer.height + 16;
    },
    createPanel: function() {
        this.panel = new Panel(this.game, this.config.name);
        this.panelContainer.addChild(this.panel);

        /* Hide the panel */
        this.panelContainer.y = -this.panelContainer.height;
    },
    showPanel: function() {
        this.panel.levelName.text = this.config.name;
        let tween = this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
        tween.onComplete.add(function() {
            this.map.show();
        }, this);
    },

    /* Level methods */
    saveLevel: function() {
        let data = {'version':1};
        data['config'] = this.config;
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
            data['levels'].push({id:tile.id, gridX:tile.gridX, gridY:tile.gridY});
        }, this);

        data['details'] = [];
        this.map.getItems('detail').forEach(function(tile) {
            data['details'].push({gridX:tile.gridX, gridY:tile.gridY});
        }, this);

        data['enemies'] = [];
        this.map.getItems('enemy').forEach(function(tile) {
            data['enemies'].push({gridX:tile.gridX, gridY:tile.gridY, health:tile.health, isActive:tile.isActive, sprite:tile.sprite});
        }, this);

        localStorage.setItem(this.getSaveName(this.map.gridWidth, this.map.gridHeight), JSON.stringify(data));
    },

    /* Events */

    onMapStaminaSpent: function(tile, amount) {
        GAME.STAMINA = Math.max(0, GAME.STAMINA - amount);
    },
    onMapTileClicked: function(tile, value) {
        console.log(tile);
        switch (tile.type) {
            case 'dungeon':
            case 'start':
                if (tile.levelID != null) {
                    GAME.level_id = tile.levelID;
                    GAME.save();

                    this.game.state.restart();
                }
                break;
        }
    },
    onMapDirty: function(tile, value) {
        this.generator.saveMap(this.map);
    }
};
