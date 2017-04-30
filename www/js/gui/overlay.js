function Overlay(game) {
    Phaser.Group.call(this, game);

    this.backgroundPosition = 'middle';

    this.containers = new Array();

    this.overlayContainer = this.game.add.group();
    this.add(this.overlayContainer);

    this.backgroundContainer = this.game.add.group();
    this.add(this.backgroundContainer);

    this.padding = 10 * GAME.RATIO;

    this.createOverlay();
    this.createBackground();

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

    let background = new Ninepatch(this.game);
    background.resize(16 * GAME.RATIO * 2, 16 * GAME.RATIO * 2);
    background.x = group.children.length * (background.width + paddingBetween);
    group.add(background);

    item = background.create(0, 0, 'item:' + itemData.item.sprite);
    item.item = itemData.item;
    item.scale.setTo(GAME.RATIO * 2, GAME.RATIO * 2);
    item.anchor.set(0.5, 0.5);
    item.x = background.width/2;
    item.y = background.height/2;
    item.x -= (item.width/GAME.RATIO / 2);
    item.y -= (item.height/GAME.RATIO / 2);

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
    this.getContainer("name").padding = this.padding/2;
    let group = this.getContainerGroup("name");
    this.itemName = this.game.add.bitmapText(0, 0, "font:gui", name, 10);
    group.add(this.itemName);
};

Overlay.prototype.setStats = function(itemModifier) {
    let stats = new Array();
    stats.push({label:'Attaque', id:'attack', value:0});
    stats.push({label:'Stamina', id:'stamina', value:0});
    stats.push({label:"Stamina\nMaximal", id:'staminaMax', value:0});

    let itemStats = {attack:0, stamina:0, staminaMax:0};

    let group = this.getContainerGroup("stats");

    let background = new Ninepatch(this.game);
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

Overlay.prototype.setDescription = function(description) {
    let group = this.getContainerGroup("description");

    let background = new Ninepatch(this.game);
    group.add(background);

    this.itemDescription = this.game.add.bitmapText(0, 0, "font:gui-multiline", description, 10);
    this.itemDescription.anchor.set(0, 0.5);
    this.itemDescription.x = this.padding/2;
    this.itemDescription.maxWidth = this.minWidth - (this.padding*2);
    group.add(this.itemDescription);

    background.resize(this.minWidth - (this.padding * 2), this.itemDescription.height + background.getCornerSize() + this.padding);
    this.itemDescription.y = (background.height/2) + 3;
};

Overlay.prototype.addButton = function(buttonData) {
    let group = this.getContainerGroup('buttons');

    let button = this.game.add.button(0, 0, 'popup:button', buttonData.callback, buttonData.context, 1, 0, 1, 0);
    button.x = group.children.length * (button.width + this.padding);
    button.scale.setTo(GAME.RATIO, GAME.RATIO);
    group.addChild(button);

    let label = this.game.add.bitmapText(0, 0, 'font:gui', buttonData.text, 10);
    label.anchor.set(0.5, 0.5);
    label.x = (button.width/2);
    label.y = (button.height/2);
    group.addChild(label);
};

Overlay.prototype.addStats = function(stat, from, to) {
    let statName = stat;
    switch(stat) {
        case "attack":
            statName = "Attaque";
            break;
        case "stamina":
            statName = "Stamina";
            break;
        case "staminaMax":
            statName = "Stamina\nmaximum";
            break;
    }

    let group = this.getContainerGroup("stats");

    let nbrStats = Math.floor(group.children.length/4);
    let textX = 0;
    let textY = group.height;
    if (textY > 0) {
        textY += this.padding;
    }

    let text = this.game.add.bitmapText(textX, textY, 'font:gui-multiline', statName + ": ", 10);
    group.addChild(text);
    textX += text.width + this.padding;
    let labelHeight = text.height;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', from, 10);
    text.y += (labelHeight - text.height) / 2;
    group.addChild(text);
    textX += text.width + this.padding;
    
    text = this.game.add.bitmapText(textX, textY, 'font:gui', "->", 10);
    text.y += (labelHeight - text.height) / 2;
    group.addChild(text);
    textX += text.width + this.padding;

    text = this.game.add.bitmapText(textX, textY, 'font:gui', to, 10);
    text.y += (labelHeight - text.height) / 2;
    group.addChild(text);
    textX += text.width + this.padding;
};

Overlay.prototype.generate = function() {
    /* Position each containers */

    let containerY = this.padding;

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
        singleContainer.group.y = containerY;

        containerY += singleContainer.group.height + paddingBottom;
    }, this);

    /* Resize the background */

    let backgroundWidth = this.minWidth;
    let backgroundHeight = containerY;
    this.ninepatch.resize(backgroundWidth, backgroundHeight);

    /* Position the background depending on the correct position */

    this.backgroundContainer.x = (this.overlayContainer.width - this.backgroundContainer.width)/2;
    if (this.backgroundPosition == 'middle') {
        this.backgroundContainer.y = (this.overlayContainer.height - this.backgroundContainer.height)/2;
    } else if (this.backgroundPosition == 'bottom') {
        this.backgroundContainer.y = (this.overlayContainer.height - this.backgroundContainer.height);
    }

    //this.hide(true);
};

Overlay.prototype.createBackground = function() {
    this.ninepatch = new Ninepatch(this.game);
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

Overlay.prototype.hide = function(skipAnimation) {
    this.overlayContainer.alpha = 0;
    this.overlayContainer.getChildAt(0).inputEnabled = false;

    let sound = this.game.add.audio('sound:popup-button');
    sound.play();
    
    let newY = this.overlayContainer.height - this.padding;
    if (skipAnimation == true) {
        this.backgroundContainer.y = newY;
    } else {
        this.game.add.tween(this.backgroundContainer).to({y:newY}, Overlay.SPEED).start();
    }
};
