export class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, name, maxHealth = 100, maxStamina = 50, friendly = true, collisionSize = { width: 32, height: 32 }) {
        super(scene, x, y, texture);

        // Add this character to the scene
        scene.add.existing(this);

        // Enable physics on the character
        scene.physics.world.enable(this);

        // Set up character properties
        this.name = name;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.maxStamina = maxStamina;
        this.stamina = maxStamina;
        this.friendly = friendly;
        this.collisionSize = collisionSize;

        // Configure collision size
        this.body.setSize(collisionSize.width, collisionSize.height);

        scene.physics.add.collider(this, scene.worldLayer);

         // Initial setup for wandering
         this.wanderDirection = new Phaser.Math.Vector2(0);
         this.wanderSpeed = 50; // Adjust speed as required
         this.setupWander();
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
            this.die();
        }
    }

    recoverHealth(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    useStamina(amount) {
        this.stamina -= amount;
        if (this.stamina < 0) {
            this.stamina = 0;
        }
    }

    recoverStamina(amount) {
        this.stamina += amount;
        if (this.stamina > this.maxStamina) {
            this.stamina = this.maxStamina;
        }
    }

    setupWander() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3000), // Change direction every 1-3 seconds
            callback: this.changeDirection,
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

    update(time, delta) {
        // Apply movement in the current direction
        this.body.setVelocity(this.wanderDirection.x * this.wanderSpeed, this.wanderDirection.y * this.wanderSpeed);
    }

    die() {
        this.destroy();
        console.log(`${this.name} has died.`);
    }
}
