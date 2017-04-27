var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        console.log('Game.create: ' + GAME.config.levelID);

        if (GAME.music != null) {
            GAME.music.destroy();
        }

        this.mapContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createPanel();
        this.createMap();

        GAME.music = this.game.add.audio('music:' + this.level.config.type, 1, true);
        GAME.music.play();

        this.showPanel();
    },
    update: function() {
        /* Keep the panel updated with the stamina amount */
        this.panel.updateStamina(GAME.config.stamina, GAME.config.staminaMax);

        GAME.tick();
    },

    /* Misc methods */

    createMap: function() {
        /* Get the best map size for the current resolution */
        let mapWidth = Math.floor(this.game.width / (16 * GAME.RATIO));

        /* Get the best map height from the remaining space left UNDER the panel */
        let mapHeight = Math.floor((this.game.height-this.panelContainer.height) / (16 * GAME.RATIO));

        this.level = new Level(GAME.config.levelID, mapWidth, mapHeight);

        /* Try to load an existing saved level */
        let levelData = this.level.load();
        if (levelData == null) {
            /* If it's not already generated, do it first */
            if (GAME.json['maps'][this.level.config.id] == null) {
                GAME.config.levelID = this.level.config.id = 'village';
                GAME.save();
            }
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
        this.game.add.tween(this.panelContainer).to({y:0}, 1000, Phaser.Easing.Bounce.Out).start();
    },

    /* Events */

    onMapStaminaSpent: function(tile, amount) {
        if (amount == 0) {
            this.panel.noMoreStamina();
        }
        GAME.config.stamina = Math.max(0, GAME.config.stamina - amount);
    },
    onMapTileClicked: function(tile, value) {
        switch (tile.type) {
            case 'chest':
                if (!tile.isOpen) {
                    let popup = new Popup(this.game);
                    popup.setImage("item:" + tile.item.sprite, tile.item.name);
                    popup.setContent("C'est un coffre: " + tile.item.name);
                    popup.addButton({text:"OK", callback:function() {
                        if (tile.item.equipable == true) {
                            Game.equip(tile.item.slot, tile.item);
                        } else if (tile.item.usable == true) {
                            if (tile.item.modifier != undefined && tile.item.modifier.stamina != undefined) {
                                GAME.config.stamina = Math.min(GAME.config.staminaMax, GAME.config.stamina + tile.item.modifier.stamina);
                            }
                        }
                        popup.close();
                    }, context:this});
                    popup.show();
                }
                break;
            case 'dungeon':
            case 'start':
                if (tile.levelID != null) {
                    GAME.config.levelID = tile.levelID;
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
