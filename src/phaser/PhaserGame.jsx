'use client';

// components/PhaserGame.js
import React, { useEffect } from 'react';
import Phaser from 'phaser';
import Game from './scenes/Game';

export const VW = 1400 //Viewport width
export const VH = 800 //Viewport height

const PhaserGame = () => {
  useEffect(() => {
    const config = {
        type: Phaser.AUTO,
        width: VW,
        height: VH,
        backgroundColor: '#AFE1AF', // Set your desired background color here
        scene: [Game],
        parent: 'phaser-game', // Attach the canvas to the specified div,
        physics: {
            default: 'arcade',
            arcade: {
                debug: false
            }
        },
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div 
        id="phaser-game" 
        style={{
            borderRadius:'2.5em', 
            overflow:'hidden',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
            border:'1px solid black',
            width:VW,
            height:VH
        }}/>
    );
};

export default PhaserGame;
