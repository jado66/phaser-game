'use client';

// components/PhaserGame.js
import React, { useEffect } from 'react';
import Phaser from 'phaser';
import Game from './scenes/Game';

export const VW = 1400 //Viewport width
export const VH = 700 //Viewport height

const PhaserGame = () => {
  useEffect(() => {
    const config = {
        type: Phaser.AUTO,
        width: VW,
        height: VH,
        backgroundColor: '#AFE1AF', // Set your desired background color here
        scene: [Game]
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default PhaserGame;
