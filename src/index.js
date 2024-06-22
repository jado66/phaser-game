import Phaser from "phaser";
import Game from './scenes/Game.js';

export const VW = 1400 //Viewport width
export const VH = 700 //Viewport height

window.onload = function() {
const config = {
    type: Phaser.AUTO,
    width: VW,
    height: VH,
    backgroundColor: '#AFE1AF', // Set your desired background color here
    scene: [Game]
};

new Phaser.Game(config);
};