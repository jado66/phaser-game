export function getRandomNonCollidingPosition(scene, worldLayer) {
    let x, y, tile;
    const worldWidth = scene.physics.world.bounds.width;
    const worldHeight = scene.physics.world.bounds.height;
  
    do {
      x = Phaser.Math.Between(0, worldWidth);
      y = Phaser.Math.Between(0, worldHeight);
      tile = worldLayer.getTileAtWorldXY(x, y);
    } while (tile && tile.properties.collides);
    
    return { x, y };
}
  