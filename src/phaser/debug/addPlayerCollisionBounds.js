import { debugContainer } from "../scenes/Game";

export function addPlayerCollisionBounds(scene){
    
    const worldDebug = scene.physics.world.createDebugGraphic().setVisible(true);


    debugContainer.add(worldDebug)
}