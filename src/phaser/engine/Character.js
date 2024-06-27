import { globalDebug, onGlobalDebugChange } from "@/views";
import { debugContainer, pathManager, player, player1 } from "../scenes/Game";

export class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, name, { 
            maxHealth = 100, 
            maxStamina = 50, 
            friendly = true, 
            wanderSpeed = 15,
            followSpeed = 35,
            sightRadius = 100,
            collisionSize = { width: 32, height: 32 } 
        } = {}) {

        super(scene, x, y, texture);

        // Add this character to the scene
        scene.add.existing(this);

        // Enable physics on the character
        scene.physics.world.enable(this);
        scene.physics.add.collider(this, scene.worldLayer);
        this.body.setSize(collisionSize.width, collisionSize.height);

        // Set up character properties
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
        this.friendly = friendly;
        this.collisionSize = collisionSize;
        this.wanderSpeed = wanderSpeed; 
        this.sightRadius = sightRadius
        this.followSpeed = followSpeed,

        // Pathfinding
        this.path = null;
        this.followTarget = null
        this.setupFindNewPath()

        // Initial setup for wandering
        this.wanderDirection = null
        this.setupWander();
        
        // Debug visuals     

        this.sightGraphicsColor = 0xff0000

        this.sightGraphics = scene.add.graphics({ lineStyle: { width: .5, color: this.sightGraphicsColor, alpha: 1 } })
        this.stateText = scene.add.text(x-8, y - 20, 'wander', { fontSize: '8px', fill: '#fff' })
        this.pathGraphics = scene.add.graphics({ lineStyle: { width: .5, color: 0x00ff00, alpha: 1 } })
        this.currentState = 'wander';
        debugContainer.add([this.pathGraphics, this.sightGraphics, this.stateText])

        this.sightGraphics.setVisible(globalDebug.value);
        this.stateText.setVisible(globalDebug.value);
        this.pathGraphics.setVisible(globalDebug.value);

    }

    update(time, delta) {
        // Apply movement in the current direction

        this.body.setVelocity(this.wanderDirection.x * this.wanderSpeed, this.wanderDirection.y * this.wanderSpeed);

        if (this.currentState === 'following' && this.followTarget){
           let distanceToTarget = Phaser.Math.Distance.Between(this.x, this.y, this.followTarget.x, this.followTarget.y);
            let directFollowThreshold = 20; // Distance threshold to switch to direct follow

            if (distanceToTarget < directFollowThreshold) {
                // Move directly towards the target
                this.scene.physics.moveTo(this, this.followTarget.x, this.followTarget.y, this.followSpeed);
            } else {
                // Follow the path
                if (!this.path) {
                    this.path = pathManager.findPath(this, this.followTarget);
                }
                if (this.path && this.path.length > 0) {
                    // Move towards the next point in the path
                    this.scene.physics.moveTo(this, this.path[0].x, this.path[0].y, this.followSpeed);

                    // Check if the character reached the next point
                    if (Phaser.Math.Distance.Between(this.x, this.y, this.path[0].x, this.path[0].y) < 4) {
                        // Remove the reached point from the path
                        this.path.shift();
                    }
                }

                this.drawPath()
            }
        }

        this.drawDetectionRadius();
        this.updateStateText();
    }

    follow(target){
        this.followTarget = target
        this.changeState('following')
    }

    stopFollowing(){
        this.followTarget = null
         this.changeState('wander')

        if (this.pathGraphics){
            this.pathGraphics.clear();
        }
    }

    changeState(newState){
        this.stateText.text = newState
        this.currentState = newState
    }

    die() {
        this.destroy();
        console.log(`${this.name} has died.`);
    }

    // Pathfinding and movement
    setupWander() {
        this.wanderDirection = new Phaser.Math.Vector2(0);

        this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Change direction every 1-3 seconds
            callback: this.changeDirection,
            callbackScope: this,
            loop: true
        });
    }

    setupFindNewPath(){
        this.scene.time.addEvent({
            delay: 500,
            callback: this.updatePath,
            callbackScope: this,
            loop: true
        });
    }

    
    changeDirection() {
        const directions = [
            new Phaser.Math.Vector2(1, 0),
            new Phaser.Math.Vector2(-1, 0),
            new Phaser.Math.Vector2(0, 1),
            new Phaser.Math.Vector2(0, -1)
        ];
        this.wanderDirection = Phaser.Utils.Array.GetRandom(directions);
    }

    updatePath() {
        if (!this.currentState === 'following'){
            return
        }

        this.path = pathManager.findPath(this, player1);

        if (!this.path){
            const offsets = [6, 12, -6, -12];

            // Check for paths with slight offsets for 'this'.
            for (let offset of offsets) {
                this.path = pathManager.findPath(
                    { x: this.x + offset, y: this.y },
                    player1
                );
                if (this.path) return;
    
                this.path = pathManager.findPath(
                    { x: this.x, y: this.y + offset },
                    player1
                );
                if (this.path) return;
            }
    
            // Check for paths with slight offsets for 'player'.
            for (let offset of offsets) {
                this.path = pathManager.findPath(
                    this,
                    { x: player1.x + offset, y: player1.y }
                );
                if (this.path) return;
    
                this.path = pathManager.findPath(
                    this,
                    { x: player1.x, y: player1.y + offset }
                );
                if (this.path) return;
            }
        }
    }

    // Debug
    drawPath() {
        // Clear previous path graphics
        this.pathGraphics.clear();

        if (this.path && this.path.length > 0) {
            this.pathGraphics.beginPath();

            // Move to the first point in the path
            this.pathGraphics.moveTo(this.x, this.y);
            
            // Draw lines to each subsequent point in the path
            for (let i = 0; i < this.path.length; i++) {
                this.pathGraphics.lineTo(this.path[i].x, this.path[i].y);
            }

            this.pathGraphics.strokePath();
        }
    }

    updateStateText() {
        this.stateText.setPosition(this.x-8, this.y - 20);
    }

    changeSightGraphicsColor(color) {
        this.sightGraphicsColor = color;
        this.drawDetectionRadius();
    }
    
    
    drawDetectionRadius() {
        this.sightGraphics.clear();
        this.sightGraphics.fillStyle(this.sightGraphicsColor, 0.1); // 0.5 is the alpha for 50% transparency
    
        // Draw the filled circle
        this.sightGraphics.fillCircle(this.x, this.y, this.sightRadius);
        this.sightGraphics.lineStyle(.5, this.sightGraphicsColor); // Use this.sightGraphicsColor
        this.sightGraphics.strokeCircle(this.x, this.y, this.sightRadius);
    }

    
}