import { DroppedItem } from "@/phaser/engine/DroppedItem";
import { getRandomNonCollidingPosition } from "@/phaser/util/getRandomNonCollidingPosition";

export class Berry extends DroppedItem {
    constructor(scene, x, y) {
      super(scene, x, y, 'berryTexture'); // Assuming you have a texture named 'berryTexture'
      
      // Set the berry's name
      this.name = 'Berry';
    }
  }
  
export function createRandomBerries(scene, worldLayer, count) {
    const berries = [];
    for (let i = 0; i < count; i++) {
      const { x, y } = getRandomNonCollidingPosition(scene, worldLayer);
      const berry = new Berry(scene, x, y);

      berries.push(berry);
    }
    return berries;
}