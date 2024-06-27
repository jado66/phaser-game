import { cameraZoom, debugContainer, player1, uiContainer } from "@/phaser/scenes/Game";

class GameUI {
    constructor(scene) {
        this.scene = scene;
        this.isShowInventory = false;
        this.inventoryText = ''

        this.create()
    }

    create() {

        if (!player1 || !player1.inventory) {
            alert('no player or inventory');
            return;
        }

        this.createMiniMapCamera()
        this.createHealthAndStamina()
        this.createBottomHotBar()
               
        // Add all elements to the container
        uiContainer.add([
            this.miniMapBackground,
            this.healthBarBackground,
            this.healthBar,
            this.staminaBarBackground,
            this.staminaBar,
            this.inventoryButtonBackground,
            this.inventoryButton,
            this.debugAddItemButtonBackground,
            this.debugAddItemButton
        ]);
    }

    createMiniMapCamera(){
        this.miniMapBackground = this.scene.add.rectangle(
            this.scene.sys.canvas.width - 100, 
            100, 
            150, 
            150, 
            0x808080
        ).setVisible(false);
        
        // Set up the viewport for the minimap camera using the miniMapBackground size
        const miniMapWidth = this.miniMapBackground.width;
        const miniMapHeight = this.miniMapBackground.height;
        
        this.miniMapCamera = this.scene.cameras.add(
            this.miniMapBackground.x - this.miniMapBackground.width / 2, 
            this.miniMapBackground.y - this.miniMapBackground.height / 2, 
            miniMapWidth, 
            miniMapHeight
        );
        this.miniMapCamera.setBackgroundColor(0x808080); // Example with black color
        this.miniMapCamera.startFollow(player1);
        this.miniMapCamera.setZoom(1.5 / cameraZoom);
        this.miniMapCamera.ignore([uiContainer, debugContainer]);
    }

    createHealthAndStamina(){
        const barWidth = 200

        this.healthBarBackground = this.scene.add.rectangle(18, 18, barWidth+4, 22, 0x000000);
        this.healthBarBackground.setOrigin(0, 0)
        this.healthBar = this.scene.add.rectangle(20, 20, barWidth, 18, 0xff0000);
        this.healthBar.setOrigin(0, 0)

        this.staminaBarBackground = this.scene.add.rectangle(18, 40, barWidth+4, 22, 0x000000);
        this.staminaBarBackground.setOrigin(0, 0)
        this.staminaBar = this.scene.add.rectangle(20, 42, barWidth, 18, 0x00ff00);
        this.staminaBar.setOrigin(0, 0)
    }

    createBottomHotBar(){
        // Create the background rectangle for the inventory button
        const buttonX = this.scene.sys.canvas.width / 2;
        const buttonY = this.scene.sys.canvas.height - 30;
        const buttonWidth = 150;
        const buttonHeight = 50;

        this.inventoryButtonBackground = this.scene.add.rectangle(
            buttonX,
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0x7c3f00 // Background color in hexadecimal (black in this case)
        );
        this.inventoryButtonBackground.setOrigin(0.5, 0.5)

        
        // Create inventory button text
        this.inventoryButton = this.scene.add.text(
            buttonX,
            buttonY,
            'Inventory',
            { fontSize: '24px', fill: '#ffffff' }
        );
        this.inventoryButton.setOrigin(0.5, 0.5)
        this.inventoryButton.setInteractive({ useHandCursor: true });

        this.inventoryDisplay = this.scene.add.text(
            buttonX, 
            buttonY-buttonHeight, 
            '', 
            { fontSize: '16px', fill: '#000000', backgroundColor: '#DAA06D', padding: { x: 10, y: 10 }, wordWrap: { width: 300 } }
        );
        this.inventoryDisplay.setOrigin(0.5, 0.5)
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
        this.debugAddItemButtonBackground.setOrigin(0.5, 0.5)

        this.debugAddItemButton = this.scene.add.text(
            buttonX+buttonWidth+5,
            buttonY,
            'Add Item',
            { fontSize: '24px', fill: '#000000' }
        );
        this.debugAddItemButton.setOrigin(0.5, 0.5)
        this.debugAddItemButton.setInteractive({ useHandCursor: true });

        this.debugAddItemButton.on('pointerdown', () => {
            player1.inventory.addItem(debugPickRandomItem())
            this.showInventoryJson()
        });
    }

    update() {
        // Update the health and stamina bars based on player's current values
        if (player1 && player1.inventory) {
            this.updateHealthBar(player1.health);
            this.updateStaminaBar(player1.stamina);
            this.inventoryText = player1.inventory.listItemsDebugJson();
            this.inventoryDisplay.setText(this.inventoryText);
        }
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

