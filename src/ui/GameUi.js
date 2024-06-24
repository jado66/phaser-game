class GameUI {
    constructor(scene) {
        this.scene = scene;
        this.isShowInventory = false;
        this.inventoryText = ''
        this.player = null
    }

    preload() {
        // No assets to load in this version
    }

    create(player) {
        this.player = player

        // Create a container for UI elements
        this.uiContainer = this.scene.add.container(0, 0);

        // Create a circular minimap
        const mapCircle = this.scene.add.circle(
            this.scene.sys.canvas.width - 100,
            100,
            50, // Radius of the circle
            0x00bfff // Light blue color
        );
        mapCircle.setScrollFactor(0);

        // Create health bar

        const barWidth = 200

        this.healthBarBackground = this.scene.add.rectangle(18, 18, barWidth+4, 22, 0x000000);
        this.healthBarBackground.setOrigin(0, 0).setScrollFactor(0);
        this.healthBar = this.scene.add.rectangle(20, 20, barWidth, 18, 0xff0000);
        this.healthBar.setOrigin(0, 0).setScrollFactor(0);

        // Create stamina bar
        this.staminaBarBackground = this.scene.add.rectangle(18, 40, barWidth+4, 22, 0x000000);
        this.staminaBarBackground.setOrigin(0, 0).setScrollFactor(0);
        this.staminaBar = this.scene.add.rectangle(20, 42, barWidth, 18, 0x00ff00);
        this.staminaBar.setOrigin(0, 0).setScrollFactor(0);

        // Create the background rectangle for the inventory button
        const buttonX = this.scene.sys.canvas.width / 2;
        const buttonY = this.scene.sys.canvas.height - 40;
        const buttonWidth = 150;
        const buttonHeight = 50;

        this.inventoryButtonBackground = this.scene.add.rectangle(
            buttonX,
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0x7c3f00 // Background color in hexadecimal (black in this case)
        );
        this.inventoryButtonBackground.setOrigin(0.5, 0.5).setScrollFactor(0);

        // Create inventory button text
        this.inventoryButton = this.scene.add.text(
            buttonX,
            buttonY,
            'Inventory',
            { fontSize: '24px', fill: '#ffffff' }
        );
        this.inventoryButton.setOrigin(0.5, 0.5).setScrollFactor(0);
        this.inventoryButton.setInteractive({ useHandCursor: true });

        this.inventoryDisplay = this.scene.add.text(
            buttonX, 
            buttonY-buttonHeight, 
            '', 
            { fontSize: '16px', fill: '#000000', backgroundColor: '#DAA06D', padding: { x: 10, y: 10 }, wordWrap: { width: 300 } }
        );
        this.inventoryDisplay.setOrigin(0.5, 0.5).setScrollFactor(0);
        this.inventoryDisplay.setVisible(false);

        // Event listener for button click
        this.inventoryButton.on('pointerdown', () => {

            const isShowInventory = this.isShowInventory = !this.isShowInventory

            if (isShowInventory){
                this.showInventoryJson()
            }
            else{
                this.hideInventory()
            }
        });

        // Add debug button
        this.debugAddItemButtonBackground = this.scene.add.rectangle(
            buttonX+buttonWidth+5,
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0xE97451 // Background color in hexadecimal (black in this case)
        );
        this.debugAddItemButtonBackground.setOrigin(0.5, 0.5).setScrollFactor(0);

        this.debugAddItemButton = this.scene.add.text(
            buttonX+buttonWidth+5,
            buttonY,
            'Add Item',
            { fontSize: '24px', fill: '#000000' }
        );
        this.debugAddItemButton.setOrigin(0.5, 0.5).setScrollFactor(0);
        this.debugAddItemButton.setInteractive({ useHandCursor: true });

        this.debugAddItemButton.on('pointerdown', () => {
            this.player.inventory.addItem(debugPickRandomItem())
            this.showInventoryJson()
        });

        // Add all elements to the container
        this.uiContainer.add([
            mapCircle,
            this.healthBarBackground,
            this.healthBar,
            this.staminaBarBackground,
            this.staminaBar,
            this.inventoryButtonBackground,
            this.inventoryButton
        ]);
    }

    update() {
        // Update the health and stamina bars based on player's current values
        this.updateHealthBar(this.player.health);
        this.updateStaminaBar(this.player.stamina);
        this.inventoryText = this.player.inventory.listItemsDebugJson()
        this.inventoryDisplay.setText(this.inventoryText);
    }

    
    showInventoryJson() {
        this.inventoryDisplay.setVisible(true);
        this.inventoryDisplay.setText(this.inventoryText);
    }
    hideInventory() {
        if (this.inventoryDisplay) {
            this.inventoryDisplay.setVisible(false);
        }
    }

    updateHealthBar(value) {
        // Update health bar width based on the value (e.g., player health)
        this.healthBar.width = value * 2; // assuming value is out of 100
    }

    updateStaminaBar(value) {
        // Update stamina bar width based on the value (e.g., player stamina)
        this.staminaBar.width = value * 2; // assuming value is out of 100
    }

    updateInventory(){
        
    }
}

export default GameUI;


const debugPickRandomItem = () =>{
    const availableItems = ['berry', 'mushroom','branch']

    const itemToAddIndex = Math.floor(Math.random()*availableItems.length)

    return availableItems[itemToAddIndex]
}