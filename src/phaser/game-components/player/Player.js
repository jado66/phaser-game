import Inventory from "@/phaser/engine/Inventory";
let cursors;

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, 'spriteTextureForward');
        this.scene = scene;
        
        // Add this sprite to the scene
        scene.add.existing(this);
        // Enable physics on this sprite
        scene.physics.add.existing(this);
        
        this.initPlayer();
        this.setupInput();
    }

    initPlayer() {
        this.setScale(0.25);
        
        // Now we can safely set the body size
        this.body.setSize(25, 50);

        this.scene.physics.add.collider(this, this.scene.worldLayer);

        this.inventory = new Inventory();
        this.health = 100;
        this.stamina = 100;

        this.takeDamage = this.takeDamage.bind(this);

        // Store the last known position of the cursor
        this.pointerPosition = { x: this.x, y: this.y };
    }

    setupInput() {
        this.scene.input.on('pointermove', pointer => {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
            this.playerDirection = angle + Math.PI / 2;
        });

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.wasdKeys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.scene.input.keyboard.on('keydown', (event) => {
            console.log(`${event.key} was pressed`);
        });

        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    
        // this.scene.mainCamera.startFollow(this);

    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.handleDeath() 
        }
    }

    update(time, delta) {
        let speed = 50;
        let moveX = 0;
        let moveY = 0;

        const playerAngle = this.playerDirection - Math.PI / 2;

        if (this.shiftKey.isDown && this.stamina >= 0 && (this.cursors.up.isDown || this.wasdKeys.up.isDown)){
            this.stamina -= 1 * this.scene.game.loop.delta / 1000 * 50;
            speed *= 2;
        }

        if (this.cursors.up.isDown || this.wasdKeys.up.isDown) {
            moveX = Math.cos(playerAngle) * speed;
            moveY = Math.sin(playerAngle) * speed;
        } else if (this.cursors.down.isDown || this.wasdKeys.down.isDown) {
            moveX = -Math.cos(playerAngle) * speed;
            moveY = -Math.sin(playerAngle) * speed;
        }

        if (this.cursors.right.isDown || this.wasdKeys.right.isDown) {
            moveX += Math.cos(playerAngle + Math.PI / 2) * speed;
            moveY += Math.sin(playerAngle + Math.PI / 2) * speed;
        } else if (this.cursors.left.isDown || this.wasdKeys.left.isDown) {
            moveX -= Math.cos(playerAngle + Math.PI / 2) * speed;
            moveY -= Math.sin(playerAngle + Math.PI / 2) * speed;
        }

        if (this.stamina < 100){
            if (!moveX && !moveY){
                this.stamina += 1 * this.scene.game.loop.delta / 1000 * 5;
            } else if (this.stamina > 10){
                this.stamina += 1 * this.scene.game.loop.delta / 1000 * 2.5;
            }
        }

        this.body.setVelocityX(moveX * (this.scene.game.loop.delta / 20));
        this.body.setVelocityY(moveY * (this.scene.game.loop.delta / 20));
    }

    handleDeath() {
        this.scene.resetGame();
    }
}