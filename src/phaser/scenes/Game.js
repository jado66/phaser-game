import GameUI from "@/ui/GameUi";
import { VW, VH } from "../PhaserGame";
import { addCenterLines } from "../debug/addCenterLines";
import { enableCameraZoom } from "../debug/enableCameraZoom";
import { addDebugTileCollisionColors } from "../debug/colorCollisionTiles";
import { addPlayerCollisionBounds } from "../debug/addPlayerCollisionBounds";
import { createRandomBerries } from "../game-components/dropped-items/Berry";
import { GreenMonster } from "../game-components/monsters/GreenMonster";
import { RedMonster } from "../game-components/monsters/RedMonster";
import { BlueMonster } from "../game-components/monsters/BlueMonster";
import Player from "../game-components/player/Player";
import { onGlobalDebugChange, globalDebug } from "@/views";

export let player1;
export let pathManager;
export let cameraZoom = 4

export let debugContainer
export let uiContainer
export let mainContainer

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
        onGlobalDebugChange(this.onGlobalDebugChange.bind(this));
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
    }
    create() {

        this.createContainers() //Creates three groups debug, ui, and main container for handling what is shown on each cameras

        this.createMap()
        this.createPlayer()
        this.createGameObjects() //Enemies, Objects, etc.

        this.gameUI = new GameUI(this, mainContainer, debugContainer);

        this.createCameras()

        if (globalDebug.value) {
            this.addDebugItems()
        }
    }

    createContainers(){
        mainContainer = this.add.container(0,0)
        uiContainer = this.add.container(0, 0);
        debugContainer = this.add.container(0, 0);
    }

    createPlayer(){
        player1 = new Player(this, 20, 60);
        mainContainer.add(player1) 
    }

    createGameObjects(){
        this.berries = createRandomBerries(this, this.worldLayer, 10);

        this.monsters = []
        const monster1 = new GreenMonster(this, 265, 250)
        const monster2 = new RedMonster(this, 20, 400)
        const monster3 = new BlueMonster(this, 60, 280)
        this.monsters.push(monster2)
        this.monsters.push(monster3)
        this.monsters.push(monster1)
        
        mainContainer.add([ ...this.berries, ...this.monsters]) 
    }

    createCameras(){
        this.mainCamera = this.cameras.main
        this.mainCamera.setZoom(cameraZoom);
        this.mainCamera.startFollow(player1);
        this.mainCamera.setDeadzone(VW / 16, VH / 16);
        this.mainCamera.ignore(uiContainer)

        this.uiCamera = this.cameras.add(0, 0)
        this.uiCamera.ignore([ mainContainer, debugContainer, this.monsters, this.berries, this.worldLayer, player1])
    }

    createMap(){
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('dungeon', 'tiles');
        this.worldLayer = map.createLayer('world', tileset);
        this.worldLayer.setCollisionByProperty({ collides: true });

        const meshShrinkAmount = 8; // Adjust this value based on your game's needs
        pathManager = this.navMeshPlugin.buildMeshFromTilemap("mesh", map, [this.worldLayer], undefined, meshShrinkAmount);
        pathManager.enableDebug();

        mainContainer.add(this.worldLayer) 

        // For visualizing the navmesh
        // pathManager.debugDrawMesh({ drawCentroid: true, drawBounds: false, drawNeighbors: true, drawPortals: true});
        // pathManager.debugDrawPath(path, 0xffd900);
    }

    addDebugItems(){
        addCenterLines(this);
        addPlayerCollisionBounds(this);
        enableCameraZoom(this);
        addDebugTileCollisionColors(this, this.worldLayer);
    }

    update(time, delta) {
        this.gameUI.update()
        this.monsters.forEach(character => character.update(time, delta));
        player1.update(time, delta);
    }
    
    onGlobalDebugChange(isDebug) {
        if (debugContainer){
            debugContainer.visible = isDebug;
        }   
    }

    resetGame() {
        this.scene.restart();
    }
}
