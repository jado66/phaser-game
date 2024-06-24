import { DroppedItem } from "@/phaser/engine/DroppedItem";

export class Berry extends DroppedItem {
    constructor(scene, x, y) {
      super(scene, x, y, 'berryTexture'); // Assuming you have a texture named 'berryTexture'
      
      // Set the berry's name
      this.name = 'Berry';
    }
  }
  
  