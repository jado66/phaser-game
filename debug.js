import { VH, VW } from "./src";

export default class Debug {
    constructor(scene) {
        this.scene = scene;
    }

    drawDebugLines() {
        const graphics = this.scene.add.graphics();
        graphics.lineBetween(0, VH/2, VW, VH/2);
        graphics.lineBetween(VW/2, 0, VW/2, VH);
    }
}