function Overlay(game, spriteSheet) {
    Phaser.Group.call(this, game);

    this.backgroundPosition = 'middle';

    this.containers = new Array();

    this.overlayContainer = this.game.add.group();
    this.add(this.overlayContainer);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.padding = 10 * GAME.RATIO;

    this.openOnShow = false;

    this.createOverlay();
    this.createBackground(spriteSheet);
};

Overlay.prototype = Object.create(Phaser.Group.prototype);
Overlay.prototype.constructor = Overlay;

Overlay.SPEED = 250;

Overlay.prototype.setPosition = function(newPosition) {
    this.backgroundPosition = newPosition;
};

Overlay.prototype.getContainer = function(containerName) {
    let container = null;
    this.containers.forEach(function(singleContainer) {
        if (singleContainer.name == containerName) {
            container = singleContainer;
        }
    }, this);

    if (container == null) {
        let group = this.game.add.group();
        this.backgroundContainer.add(group);

        container = {group:group, name:containerName};
        this.containers.push(container);
    }

    return container;
};

Overlay.prototype.getContainerGroup = function(containerName) {
    return this.getContainer(containerName).group;
};

/* UI Creator */

Overlay.prototype.addItem = function(itemData, paddingBetween) {
    if (paddingBetween == undefined) { paddingBetween = this.padding/2; }
    let group = this.getContainerGroup('images');

    let frameMaxWidth = 3;
    let frameSize = 2;
    if (itemData.size != undefined) {
        frameSize = itemData.size;
        frameMaxWidth = 5;
    }

    let frameY = Math.floor(group.children.length / frameMaxWidth);
    let frameX = group.children.length - (frameY * frameMaxWidth);

    let background = new Ninepatch(this.game, "ninepatch:light-gray");
    background.resize(16 * frameSize * GAME.RATIO, 16 * frameSize * GAME.RATIO);
    background.x = frameX * (background.width + paddingBetween);
    background.y = frameY * (background.height + paddingBetween);
    group.add(background);

    if (itemData.item != undefined) {
        background.item = itemData.item;

        let sprite = background.create(0, 0, 'item:' + itemData.item.sprite);
        sprite.scale.setTo(frameSize * GAME.RATIO, frameSize * GAME.RATIO);
        sprite.anchor.set(0.5, 0.5);
        sprite.x = background.width/2;
        sprite.y = background.height/2;
        sprite.x -= (sprite.width / 2 / GAME.RATIO);
        sprite.y -= (sprite.height / 2 / GAME.RATIO);
    }

    if (itemData.label != undefined) {
        let label = this.game.add.bitmapText(0, 0, 'font:gui', itemData.label, 10);
        label.anchor.set(0.5, 0);
        label.y = -(this.padding/2) - label.height;
        label.x = background.width/2;
        background.addChild(label);
        background.y += (this.padding/2) + label.height;
    }

    return background;
};

Overlay.prototype.setName = function(name) {
    this.getContainer("name").x = 0;
    this.getContainer("name").padding = this.padding/2;
    let group = this.getContainerGroup("name");
    this.itemName = this.game.add.bitmapText(0, 0, "font:gui", name, 10);
    this.itemName.anchor.set(0.5, 0);
    this.itemName.x = this.minWidth/2;
    group.add(this.itemName);
};

Overlay.prototype.createStats = function() {
    let stats = new Array();
    stats.push({label:'Attaque', id:'attack', value:0});
    stats.push({label:'Stamina', id:'stamina', value:0});
    stats.push({label:"Stamina\nMaximal", id:'staminaMax', value:0});

    let itemStats = {attack:0, stamina:0, staminaMax:0};

    let group = this.getContainerGroup("stats");

    let background = new Ninepatch(this.game, "ninepatch:light-gray");
    group.add(background);

    let title = this.game.add.bitmapText(0, 0, 'font:gui', "Statistiques", 10);
    group.add(title);

    let statsContainer = this.game.add.group();
    group.add(statsContainer);

    this.itemStats = {};
    let statY = 0;
    stats.forEach(function(singleStat) {
        let label = this.game.add.bitmapText(0, statY, "font:gui", singleStat.label + ":", 10);
        label.anchor.set(1, 0.5);
        label.x = this.minWidth/2;
        label.maxWidth = this.minWidth - (this.padding*4);
        statsContainer.add(label);

        this.itemStats[singleStat.id] = this.game.add.bitmapText(0, statY, "font:gui", itemStats.attack+"", 10);
        this.itemStats[singleStat.id].anchor.set(0, 0.5);
        this.itemStats[singleStat.id].x = this.minWidth/2;
        this.itemStats[singleStat.id].maxWidth = this.minWidth - (this.padding*4);
        statsContainer.add(this.itemStats[singleStat.id]);

        label.y += label.height/2;
        this.itemStats[singleStat.id].y += label.height/2;

        statY += label.height + (this.padding/2);
    }, this);

    background.resize(this.minWidth - (this.padding*2), statsContainer.height + (this.padding));

    statsContainer.y = (background.height-statsContainer.height)/2;

    background.y = title.height + this.padding/2;
    statsContainer.y += background.y;

    title.x = (group.width-title.width)/2;
};

Overlay.prototype.setStats = function(modifier) {
    let group = this.getContainerGroup("stats");
    if (group.height == 0) {
        this.createStats();
    }

    for (let stat in this.itemStats) {
        this.itemStats[stat].text = "0";
    }

    for (let stat in modifier) {
        this.itemStats[stat].text = modifier[stat];
    }
};

Overlay.prototype.setDescription = function(description) {
    let group = this.getContainerGroup("description");

    let background = new Ninepatch(this.game, "ninepatch:light-gray");
    group.add(background);

    this.itemDescription = this.game.add.bitmapText(0, 0, "font:gui-multiline", description, 10);
    this.itemDescription.anchor.set(0, 0.5);
    this.itemDescription.x = this.padding/2;
    this.itemDescription.maxWidth = this.minWidth - (this.padding*3);
    group.add(this.itemDescription);

    background.resize(this.minWidth - (this.padding * 2), (description == "#" ? this.itemDescription.height*3 : this.itemDescription.height) + background.getCornerSize() + (this.padding*2));
    this.itemDescription.y = (background.height/2) + 3;
};

Overlay.prototype.addButton = function(buttonData) {
    let group = this.getContainerGroup('buttons');

    let button = this.game.add.button(0, 0, 'popup:button', buttonData.callback, buttonData.context, 1, 0, 1, 0);
    button.x = group.children.length * (button.width + (this.padding/2));
    button.scale.setTo(GAME.RATIO, GAME.RATIO);
    group.addChild(button);

    let label = this.game.add.bitmapText(0, 0, 'font:gui', buttonData.text, 10);
    label.anchor.set(0.5, 0.5);
    label.x = button.x + (button.width/2);
    label.y = (button.height/2);
    group.addChild(label);

    return button;
};

Overlay.prototype.generate = function() {
    /* Position each containers */

    let containerY = this.padding;

    let outsideContainerHeight = 0;

    this.containers.forEach(function(singleContainer) {
            let paddingBottom = this.padding;
            if (singleContainer.padding != undefined) {
                paddingBottom = this.padding/2;
            }
            if (singleContainer.x != undefined) {
                singleContainer.group.x = singleContainer.x;
            } else {
                singleContainer.group.x = (this.minWidth - singleContainer.group.width) / 2;
            }

            if (singleContainer.outside === true) {
                outsideContainerHeight += singleContainer.group.height;
            } else {
                singleContainer.group.y = containerY;

                containerY += singleContainer.group.height + paddingBottom;
            }
    }, this);

    /* Resize the background */

    let backgroundWidth = this.minWidth;
    let backgroundHeight = containerY;
    this.ninepatch.resize(backgroundWidth, backgroundHeight);

    /* Position the background depending on the correct position */

    this.backgroundContainer.x = (this.overlayContainer.width - this.backgroundContainer.width)/2;
    if (this.backgroundPosition == 'middle') {
        this.backgroundContainer.y = (this.overlayContainer.height - this.backgroundContainer.height)/2;
        this.backgroundContainer.destinationY = -this.overlayContainer.height;
    } else if (this.backgroundPosition == 'bottom') {
        this.backgroundContainer.y = (this.overlayContainer.height - this.backgroundContainer.height) + outsideContainerHeight;
        this.backgroundContainer.destinationY = this.overlayContainer.height - this.padding;
    }

    this.backgroundContainer.originalY = this.backgroundContainer.y;

    this.hide(true);

    if (this.openOnShow) {
        this.reveal();
    }
};

Overlay.prototype.createBackground = function(spriteSheet) {
    this.ninepatch = new Ninepatch(this.game, spriteSheet);
    this.backgroundContainer.add(this.ninepatch);
};

Overlay.prototype.createOverlay = function() {
    let sprite = this.overlayContainer.create(0, 0, 'popup:background');
    //let sprite = this.overlayContainer.create(0, 0, 'popup:background');
    sprite.width = this.game.width;
    sprite.height = this.game.height;
    sprite.tint = 0x000000;
    sprite.alpha = 0.5;
    sprite.inputEnabled = true;

    this.minWidth = this.overlayContainer.width - (this.padding*4);
};

/* Vibility modifiers */

Overlay.prototype.show = function() {
    console.log('Overlay.show()');
    this.generate();
};

Overlay.prototype.reveal = function() {
    this.overlayContainer.alpha = 0.8;
    this.overlayContainer.getChildAt(0).inputEnabled = true;

    this.game.add.tween(this.backgroundContainer).to({y:this.backgroundContainer.originalY}, Overlay.SPEED).start();
};

Overlay.prototype.hide = function(skipAnimation, destroyWhenCompleted) {
    this.overlayContainer.alpha = 0;
    this.overlayContainer.getChildAt(0).inputEnabled = false;

    let sound = this.game.add.audio('sound:popup-button');
    sound.play();
    
    if (skipAnimation == true) {
        this.backgroundContainer.y = this.backgroundContainer.destinationY;
    } else {
        let tween = this.game.add.tween(this.backgroundContainer).to({y:this.backgroundContainer.destinationY}, Overlay.SPEED);
        tween.onComplete.add(function() {
            if (destroyWhenCompleted) {
                this.destroy();
            }
        }, this);
        tween.start();
    }
};

/* Hide and destroy the overlay */
Overlay.prototype.close = function() {
    let sound = this.game.add.audio('sound:popup-button');
    sound.play();

    this.hide(false, true);
};
