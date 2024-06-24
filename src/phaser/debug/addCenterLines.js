import { VH, VW } from '@/constants/globalConstants';

export function addCenterLines(scene){
    const graphics = scene.add.graphics();
        
    // Set line style: width, color, and alpha
    graphics.lineStyle(2, 0xff0000, 1); // Red color
    
  // Draw horizontal line at the center
  graphics.beginPath();
  graphics.moveTo(-VW * 1000, VH / 2);   // Start far left off-screen
  graphics.lineTo(VW * 1000, VH / 2);    // End far right off-screen
  graphics.closePath();
  graphics.strokePath();
  
  // Draw vertical line at the center
  graphics.beginPath();
  graphics.moveTo(VW / 2, -VH * 1000);   // Start far top off-screen
  graphics.lineTo(VW / 2, VH * 1000);    // End far bottom off-screen
  graphics.closePath();
  graphics.strokePath();
}
