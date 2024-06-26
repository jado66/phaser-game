'use client';

import React, { useEffect, useState } from 'react';

export const VW = 1400;
export const VH = 600;

const PhaserGame = () => {
  const [gameInstance, setGameInstance] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('phaser').then((Phaser) => {
        import('phaser-navmesh').then(({ PhaserNavMeshPlugin }) => {
          import('./scenes/Game').then((GameModule) => {
            const Game = GameModule.default;

            const config = {
              type: Phaser.AUTO,
              width: '100%',
              height: '100%',
              backgroundColor: '#AFE1AF',
              scene: [Game],
              parent: 'phaser-game',
              physics: {
                default: 'arcade',
              },
              plugins: {
                scene: [
                  {
                    key: "NavMeshPlugin",
                    plugin: PhaserNavMeshPlugin,
                    mapping: "navMeshPlugin",
                    start: true,
                  },
                ],
              },
              callbacks: {
                postBoot: function (game) {
                  game.canvas.style.width = '100%';
                  game.canvas.style.height = '100%';
                }
              }
            };

            const game = new Phaser.Game(config);
            setGameInstance(game);
          });
        });
      });
    }

    return () => {
      if (gameInstance) {
        gameInstance.destroy(true);
      }
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
        width:'100%',
        height:'100%'
      }}
    />
  );
};

export default PhaserGame;