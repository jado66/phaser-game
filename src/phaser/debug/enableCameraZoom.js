export function enableCameraZoom(scene) {
    const camera = scene.cameras.main;

    // Set initial camera zoom level
    // camera.setZoom();

    // Add a key input listener for the "-" key to zoom out
    const zoomOutKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.MINUS);

    zoomOutKey.on('down', () => {
        // Decrease the zoom level incrementally
        let currentZoom = camera.zoom;
        if (currentZoom > 0.1) { // Limit the minimum zoom level
            camera.setZoom(currentZoom - 0.05);
        }
    });

    // Optionally, you can also add a "+" key to zoom in
    const zoomInKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PLUS);
    
    zoomInKey.on('down', () => {
        // Increase the zoom level incrementally
        let currentZoom = camera.zoom;
        camera.setZoom(currentZoom + 0.05);
    });
}