import { player } from "../scenes/Game";

export class DroppedItem extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      
      // Add this item to the scene
      scene.add.existing(this);
      
      // Enable physics on the item
      scene.physics.world.enable(this);
  
      // Set item properties
      this.name = ''; // Each item should override and set its own name
  
      // Set up collision with player
      this.scene.physics.add.overlap(this, player, this.collectItem, null, this);

   
    }
    collectItem(item) {
      player1.inventory.addItem(item.name);
      item.destroy();
  }
  }

 