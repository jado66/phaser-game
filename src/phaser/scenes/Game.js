import GameUI from "@/ui/GameUi";
import { VW, VH, globalDebug } from "../PhaserGame";
import { addCenterLines } from "../debug/addCenterLines";
import Inventory from "../engine/Inventory";
import { enableCameraZoom } from "../debug/enableCameraZoom";
import { addDebugTileCollisionColors } from "../debug/colorCollisionTiles";
import { addPlayerCollisionBounds } from "../debug/addPlayerCollisionBounds";
import { Berry } from "../game-components/dropped-items/Berry";
import { Monster } from "../engine/Monster";
import { GreenMonster } from "../game-components/monsters/GreenMonster";
import { RedMonster } from "../game-components/monsters/RedMonster";
import { BlueMonster } from "../game-components/monsters/BlueMonster";

let cursors;
export let player;
export let pathManager;
export let cameraZoom = 4


export let debugContainer
export let uiContainer
export let mainContainer

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
        this.debug = globalDebug;
    }
    init() {
    }
    preload() {
        this.load.image("background", '../assets/background.png');
        this.load.image('tiles', '../assets/dungeon_tiles16.png');
        this.load.image('berryTexture','../assets/berryTexture.png')
        this.load.image('monsterTexture','../assets/monster.png')
        this.load.image('monsterTexture2','../assets/monster2.png')
        this.load.image('monsterTexture3','../assets/monster3.png')

        this.load.image('spriteTextureForward','../assets/sprite-forward.png')
        this.load.tilemapTiledJSON('map', '../assets/map2.json');

        // this.gameUI.preload();
    }
    create() {

        mainContainer = this.add.container(0,0)
        uiContainer = this.add.container(0, 0);
        debugContainer = this.add.container(0, 0);

        var camera = this.cameras.main
        camera.setZoom(cameraZoom);  // Zooms the camera to 2x

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('dungeon', 'tiles');
        const worldLayer = map.createLayer('world', tileset);

        worldLayer.setCollisionByProperty({ collides: true });

        const meshShrinkAmount = 8; // Adjust this value based on your game's needs

        pathManager = this.navMeshPlugin.buildMeshFromTilemap("mesh", map, [worldLayer], undefined, meshShrinkAmount);

        this.worldLayer = worldLayer;

        pathManager.enableDebug();
        // pathManager.debugDrawMesh({
        //     drawCentroid: true,
        //     drawBounds: false,
        //     drawNeighbors: true,
        //     drawPortals: true
        //   });
        // pathManager.debugDrawPath(path, 0xffd900);

        const playerSize = 50;
        const halfPlayerSize = playerSize / 2;

        player = this.add.sprite(50, 50, 'spriteTextureForward');

        player.setScale(0.25);

        this.physics.add.existing(player);
        player.body.setSize(25, 50);


        this.physics.add.collider(player, this.worldLayer);

        const inventory = player.inventory = new Inventory();
        player.health = 100;
        player.stamina = 100;

        player.takeDamage = (amount) => {
            player.health -= amount;
            if (player.health < 0) {
                player.health = 0;
                alert("player is dead");
                this.restart();
            }
        };

        this.restart = () => {
            this.scene.restart();
        };


        // To store the last known position of the cursor
        this.pointerPosition = { x: player.x, y: player.y };

        this.input.on('pointermove', pointer => {
              // Calculate the angle between the player and the pointer
              const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
              // Set the player's rotation to this angle
              this.playerDirection = angle + Math.PI / 2;
           
            
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

        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        if (this.debug) {
            addCenterLines(this);
            addPlayerCollisionBounds(this);
            enableCameraZoom(this);
            addDebugTileCollisionColors(this, this.worldLayer);
        }

        // Set camera to follow the player
        this.mainCamera = this.cameras.main
        this.mainCamera.setZoom(cameraZoom);
        this.mainCamera.startFollow(player);


        this.gameUI = new GameUI(this);
        this.gameUI.create(player);


        this.uiCamera = this.cameras.add(0, 0, VW, VH)

        // Define deadzone for the camera to only move when player reaches edges
        // this.cameras.main.setDeadzone(VW / 2, VH / 2);

        const berries = createRandomBerries(this, this.worldLayer, 10);

        // const {x:x2, y:y2} = getRandomPosition(this, worldLayer)
        const monster1 = new GreenMonster(this, 265, 250)
        const monster2 = new RedMonster(this, 20, 400)
        const monster3 = new BlueMonster(this, 60, 80)

        monster1.setScale(.25)
        monster2.setScale(.25)
        monster3.setScale(.25)


        // const monster2 = new Monster(this, x2, y2, 'monsterTexture', 'Monster2');
        this.monsters = [monster1, monster2, monster3];
        
        mainContainer.add([this.worldLayer, player, ...berries, ...this.monsters]) // TODO don't know why this doens't work

        this.uiCamera.ignore([ mainContainer, debugContainer, this.monsters, berries, this.worldLayer, map, player])
        this.mainCamera.ignore(uiContainer)


    }
    update(time, delta) {

        this.gameUI.update()

        this.monsters.forEach(character => character.update(time, delta));

        let speed = 50;

        let moveX = 0;
        let moveY = 0;
    

        const playerAngle = this.playerDirection - Math.PI / 2; // Adjust rotation since we added PI/2 during the update

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
    const worldWidth = scene.physics.world.bounds.width;
    const worldHeight = scene.physics.world.bounds.height;
  
    do {
      x = Phaser.Math.Between(0, worldWidth);
      y = Phaser.Math.Between(0, worldHeight);
      tile = worldLayer.getTileAtWorldXY(x, y);
    } while (tile && tile.properties.collides);
    
    return { x, y };
}
  
function createRandomBerries(scene, worldLayer, count) {
    const berries = [];
    for (let i = 0; i < count; i++) {
      const { x, y } = getRandomPosition(scene, worldLayer);
      const berry = new Berry(scene, x, y);

      berries.push(berry);
    }
    return berries;
}