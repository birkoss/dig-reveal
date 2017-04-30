function Inventory(game) {
    Overlay.call(this, game);

    this.setPosition('bottom');

    this.selectedSlot = '';

    this.items = {};

    this.ninepatch.removeBorders('bottom');

    this.createItems();

    this.setName("Épée en bois");
    
    //this.addStats("attack", "1", "2");
    //this.addStats("attack", "1", "2");

    this.setDescription("Épée en bois bla bla bla bla bla....");

    this.setStats();

    this.addButton({text: "Remplacer"});

    this.slot = "weapon";
    this.setItem('weapon');
    this.setItem('armor');

    this.selectItem('weapon');
};

Inventory.prototype = Object.create(Overlay.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.update = function() {
    /*
    if (GAME.config.weapon != this.items['weapon'].item.id) {
        //this.setItem('weapon');
    }
    if (GAME.config.armor != this.items['armor'].item.id) {
        //this.setItem('armor');
    }
    */
};

Inventory.prototype.createItems = function() {
    let paddingBetweenItems = 50;

    this.items.weapon = this.addItem({label:"Arme", item:GAME.json['items']['apple']}, paddingBetweenItems);
    this.items.weapon.enableClick(function() { 
        this.selectItem('weapon');
    }, this);

    this.items.armor = this.addItem({label:"Armure", item:GAME.json['items']['apple']}, paddingBetweenItems);
    this.items.armor.enableClick(function() { 
        this.selectItem('armor');
    }, this);
};


Inventory.prototype.setItem = function(slot) {
    let itemID = GAME.config[slot];
    if (itemID != null) {
        let item = GAME.json['items'][itemID];
        if (item != null) {
            console.log(slot);
            console.log(this.items);
            console.log(this.items[slot]);
            let sprite = this.items[slot].getChildAt(1);

            sprite.item = item;
            sprite.loadTexture('item:' + item.sprite);
        }
    }
};

Inventory.prototype.selectItem = function(slot) {
    if (slot != this.selectedSlot) {
        let group = this.getContainerGroup("images");
        for (let i=0; i<group.children.length; i++) {
            group.getChildAt(i).getChildAt(0).alpha = 1;
        }
        let position = (slot == 'weapon' ? 0 : 1);
        group.getChildAt(position).getChildAt(0).alpha = 0.5;
        let item = group.getChildAt(position).getChildAt(1).item;
        console.log(item);

        this.selectedSlot = slot;

        this.itemName.text = item.name;
        this.itemDescription.text = item.description;
    }
};

Inventory.prototype.onToggleClicked = function() {
    if (this.inventoryContainer.y == this.inventoryContainer.originalY) {
        this.hide();
    } else {
        this.reveal();
    }
};

Inventory.prototype.onBtnChangeItemClicked = function() {
    console.log('SHOULD DO SOMETHING...');
};
