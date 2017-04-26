var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        console.log('Game.create: ' + GAME.level_id);

        if (GAME.music != null) {
            GAME.music.destroy();
        }

        this.mapContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createPanel();
        this.createMap();

        GAME.music = this.game.add.audio('music:' + this.level.config.type);
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

        this.level = new Level(GAME.level_id, mapWidth, mapHeight);

        /* Try to load an existing saved level */
        let levelData = this.level.load();
        if (levelData == null) {
            /* If it's not already generated, do it first */
            this.level.generate(GAME.json['maps'][this.level.config.id]);
            levelData = this.level.load();
        }
        
        /* Create the map */
        this.map = new Map(this.game, mapWidth, mapHeight, this.level.config.type);
        this.map.load(levelData);

        this.map.onTileClicked.add(this.onMapTileClicked, this);
        this.map.onMapDirty.add(this.onMapDirty, this);
        this.map.onStaminaSpent.add(this.onMapStaminaSpent, this);

        /* Create a background under the map */
        let background = this.game.add.tileSprite(0, 0, this.game.width, this.game.width, 'tile:'+this.level.config.type+'-border-middle');
        background.scale.setTo(GAME.RATIO, GAME.RATIO);
        background.animations.add('idle', [0, 1], 2, true);
        background.play('idle');
        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.game.width - this.map.width)/2;
        this.map.y = this.panelContainer.height + 16;
    },
    createPanel: function() {
        this.panel = new Panel(this.game, "");
        this.panelContainer.addChild(this.panel);

        /* Hide the panel */
        this.panelContainer.y = -this.panelContainer.height;
    },
    showPanel: function() {
        this.panel.levelName.text = this.level.config.name;
        let tween = this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
        tween.onComplete.add(function() {
            this.map.show();
        }, this);
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
            case 'chest':
                console.log('do something...');
                break;
        }
    },
    onMapDirty: function(tile, value) {
        GAME.save();
        this.level.saveMap(this.map);
    }
};
