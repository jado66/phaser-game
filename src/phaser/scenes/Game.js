import GameUI from "@/ui/GameUi";
import { VW, VH, globalDebug } from "../PhaserGame";
import { addCenterLines } from "../debug/addCenterLines";
import Inventory from "../engine/Inventory";
import { enableCameraZoom } from "../debug/enableCameraZoom";
import { addDebugTileCollisionColors } from "../debug/colorCollisionTiles";
import { addPlayerCollisionBounds } from "../debug/addPlayerCollisionBounds";
import { Berry } from "../game-components/dropped-items/Berry";
import { Monster } from "../engine/Monster";

let cursors
export let player

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
        this.debug = globalDebug
    }
    init() {
    }
    preload() {
        this.load.image("background", '../assets/background.png');
        this.load.image('tiles', '../assets/dungeon_tiles16.png');
        this.load.image('berryTexture','../assets/berryTexture.png')
        this.load.image('monsterTexture','../assets/monster.png')
        this.load.tilemapTiledJSON('map', '../assets/map2.json');

        this.gameUI = new GameUI(this);
        this.gameUI.preload();

    }
    create() {

        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('dungeon', 'tiles')
        const worldLayer = map.createLayer('world', tileset)

        this.worldLayer = worldLayer
        this.worldLayer.setScale(4);

        this.worldLayer.setCollisionByProperty({ collides: true });

        const playerSize = 50
        const halfPlayerSize = playerSize/2

        player = this.add.polygon(VW/2, VH/2, [0, -halfPlayerSize, halfPlayerSize, halfPlayerSize, -halfPlayerSize, halfPlayerSize], 0xffffff);

        player.setOrigin(0, 3/halfPlayerSize); // move the player up just a tidge

        this.physics.add.existing(player);
        player.body.setSize(50, 50); // Set the size of the physics body
        player.body.setOffset(-25, -25); // Offset to center the collider

        // player.body.setCollideWorldBounds(true);

        this.physics.add.collider(player, this.worldLayer);

        const inventory = player.inventory = new Inventory();
        player.health = 100
        player.stamina = 100

        player.takeDamage = (amount) => {
            player.health -= amount;
            if (player.health < 0) {
                player.health = 0;
                alert("player is dead");
                this.restart();
            }
        };

        this.restart = () => {
            // Logic to reset the game state and restart the scene
            this.scene.restart(); // This will restart the scene
        };

        this.gameUI.create(player);

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

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

        if (this.debug){
            addCenterLines(this)
            addPlayerCollisionBounds(this)
            enableCameraZoom(this)
            addDebugTileCollisionColors(this, this.worldLayer)
        }
        
        // Set camera to follow the player
        this.cameras.main.startFollow(player);

        // Define deadzone for the camera to only move when player reaches edges
        this.cameras.main.setDeadzone(VW / 2, VH / 2);


        const berries = createRandomBerries(this, this.worldLayer, 10)

        const monster1 = new Monster(this, 200, 200, 'monsterTexture', 'Monster1')
        const monster2 = new Monster(this, 202, 300, 'monsterTexture', 'Monster2')
        this.monsters = [monster1, monster2]

    }
    update(time, delta) {

        this.gameUI.update()

        this.monsters.forEach(character => character.update(time, delta));

        let speed = 200;

        

        let moveX = 0;
        let moveY = 0;
    

        const playerAngle = player.rotation - Math.PI / 2; // Adjust rotation since we added PI/2 during the update

        if (this.shiftKey.isDown && player.stamina >= 0 && (cursors.up.isDown || this.wasdKeys.up.isDown)){
            player.stamina -= 1 * this.game.loop.delta / 1000 * 50
            speed = speed * 2
        }

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
    
        if (player.stamina < 100){

            if (!moveX && !moveY){
                player.stamina += 1 * this.game.loop.delta / 1000 * 5
            }
            else if (player.stamina > 10){
                player.stamina += 1 * this.game.loop.delta / 1000 * 2.5
            }
        }
       

    // Apply the calculated movements to the player's position.
        player.body.setVelocityX(moveX * (this.game.loop.delta / 20));
        player.body.setVelocityY(moveY * (this.game.loop.delta / 20));
    }
}

// Debug items
function getRandomPosition(scene, worldLayer) {
    let x, y, tile;
    do {
      x = Phaser.Math.Between(0, scene.scale.width);
      y = Phaser.Math.Between(0, scene.scale.height);
      tile = worldLayer.getTileAtWorldXY(x, y);
    } while (tile && tile.properties.collides);
    return { x, y };
  }
  
  function createRandomBerries(scene, worldLayer, count) {
    const berries = [];
    for (let i = 0; i < count; i++) {
      const { x, y } = getRandomPosition(scene, worldLayer);
      const berry = new Berry(scene, x, y);
      berry.setScale(4); // Scale the berry by a factor of 4

      berries.push(berry);

    }
    return berries;
  }