import { VH, VW } from '@/constants/globalConstants';

export function addCenterLines(scene){
    const graphics = scene.add.graphics();
        
    // Set line style: width, color, and alpha
    graphics.lineStyle(2, 0xff0000, 1); // Red color
    
    // Draw horizontal line at the center
    graphics.beginPath();
    graphics.moveTo(0, VH / 2);
    graphics.lineTo(VW, VH / 2);
    graphics.closePath();
    graphics.strokePath();
    
    // Draw vertical line at the center
    graphics.beginPath();
    graphics.moveTo(VW / 2, 0);
    graphics.lineTo(VW / 2, VH);
    graphics.closePath();
    graphics.strokePath();
}
