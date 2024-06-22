import Phaser from "phaser";
import { VW, VH } from "..";
import { addCenterLines } from "../debug/addCenterLines";

import backgroundUrl from '../../src/assets/background.png'

let player
let cursors

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
      }
    init() {
    }
    preload() {
        this.load.image("background", backgroundUrl);
    }
    create() {

        this.add.image(
            VW / 2,
            VH / 2,
            "background"
        );

        const playerSize = 50
        const halfPlayerSize = playerSize/2

        player = this.add.polygon(VW/2, VH/2, [0, -halfPlayerSize, halfPlayerSize, halfPlayerSize, -halfPlayerSize, halfPlayerSize], 0xffffff);

        player.setOrigin(0, 3/halfPlayerSize); // move the player up just a tidge

        this.input.on('pointermove', function (pointer) {
            //Make sure we aren't strafing            
            // Calculate the angle between the player and the pointer
            const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
            
          
            // Set the player's rotation to this angle
            player.rotation = angle + Math.PI / 2;
        });

        // Enable cursor keys for movement
        cursors = this.input.keyboard.createCursorKeys();

        // Enable WASD keys for movement
        this.wasdKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        const debug = false

        if (debug){
            addCenterLines(this)
        }
        
        // Set camera to follow the player
        this.cameras.main.startFollow(player);

        // Define deadzone for the camera to only move when player reaches edges
        this.cameras.main.setDeadzone(VW / 2, VH / 2);
    }
    update() {
        let speed = 200;
        let moveX = 0;
        let moveY = 0;
    

        const playerAngle = player.rotation - Math.PI / 2; // Adjust rotation since we added PI/2 during the update

        // Movement towards or away from the cursor
        if (cursors.up.isDown || this.wasdKeys.up.isDown) {
            moveX = Math.cos(playerAngle) * speed;
            moveY = Math.sin(playerAngle) * speed;
        } else if (cursors.down.isDown || this.wasdKeys.down.isDown) {
            moveX = -Math.cos(playerAngle) * speed;
            moveY = -Math.sin(playerAngle) * speed;
        }

        // Strafing left and right
        if (cursors.right.isDown || this.wasdKeys.right.isDown) {
            moveX += Math.cos(playerAngle + Math.PI / 2) * speed;
            moveY += Math.sin(playerAngle + Math.PI / 2) * speed;
        } else if (cursors.left.isDown || this.wasdKeys.left.isDown) {
            moveX -= Math.cos(playerAngle + Math.PI / 2) * speed;
            moveY -= Math.sin(playerAngle + Math.PI / 2) * speed;
        }
    

    // Apply the calculated movements to the player's position.
    player.x += moveX * (this.game.loop.delta / 1000);
    player.y += moveY * (this.game.loop.delta / 1000);
    }
}