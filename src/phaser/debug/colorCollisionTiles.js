export function addDebugTileCollisionColors(scene, worldLayer){
    const debugGraphics = scene.add.graphics().setAlpha(0.75);
    worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    worldLayer.forEachTile(tile => {
        if (tile.properties.collides) {
            console.log(`Tile ${tile.id} at ${tile.x},${tile.y} collides`);
        }
    });
}

