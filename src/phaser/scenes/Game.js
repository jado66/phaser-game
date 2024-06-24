import GameUI from "@/ui/GameUi";
import { VW, VH, globalDebug } from "../PhaserGame";
import { addCenterLines } from "../debug/addCenterLines";
import Inventory from "../engine/Inventory";
import { enableCameraZoom } from "../debug/enableCameraZoom";

let player
let cursors

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
        this.load.tilemapTiledJSON('map', '../assets/map2.json');

        this.gameUI = new GameUI(this);
        this.gameUI.preload();

    }
    create() {

        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('dungeon', 'tiles')
        const worldLayer = map.createLayer('world', tileset)

          // Create the tilemap from the loaded JSON file
        // const map = this.make.tilemap({ key: 'map' });
        // const tileset = map.addTilesetImage('dungeon_tiles16', 'tilesImage');

        // Add the tileset image to the map

        // Create one or more layers, depending on how many layers you have in Tiled
        // const worldLayer = map.createLayer('World Layer', tileset, 0, 0);
      
        // Optionally, set collision on a layer
        worldLayer.setScale(4);

        worldLayer.setCollisionByProperty({ collides: true });

        // Debug graphics
        if (this.debug){
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            worldLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
    
            worldLayer.forEachTile(tile => {
                if (tile.properties.collides) {
                  console.log(`Tile ${tile.id} at ${tile.x},${tile.y} collides`);
                }
              });

              this.physics.world.createDebugGraphic().setVisible(true);

        }
       
        // this.add.image(
        //     VW / 2,
        //     VH / 2,
        //     "background"
        // );


        const playerSize = 50
        const halfPlayerSize = playerSize/2

        player = this.add.polygon(VW/2, VH/2, [0, -halfPlayerSize, halfPlayerSize, halfPlayerSize, -halfPlayerSize, halfPlayerSize], 0xffffff);

        player.setOrigin(0, 3/halfPlayerSize); // move the player up just a tidge

        this.physics.add.existing(player);
        player.body.setSize(50, 50); // Set the size of the physics body
        // player.body.setCollideWorldBounds(true);

        this.physics.add.collider(player, worldLayer);

        const inventory = player.inventory = new Inventory();
        player.health = 100
        player.stamina = 100

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
            enableCameraZoom(this)
        }
        
        // Set camera to follow the player
        this.cameras.main.startFollow(player);

        // Define deadzone for the camera to only move when player reaches edges
        this.cameras.main.setDeadzone(VW / 2, VH / 2);
    }
    update() {

        this.gameUI.update()

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