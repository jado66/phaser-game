const config = {
    type: Phaser.AUTO,
    width: 1260,
    height: 565,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let cursors;

function preload() {
    // Load assets here
}

function create() {
    // Initialize your game scene here
    // Create a triangle in the middle of the screen
    player = this.add.polygon(630, 280, [0, -25, 25, 25, -25, 25], 0xffffff);

    player.setOrigin(0.5, 0.5);
    
    this.input.on('pointermove', function (pointer) {
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
}

function update() {
    let speed = 200;
    let moveX = 0;
    let moveY = 0;

    if (cursors.left.isDown || this.wasdKeys.left.isDown) {
        moveX = -speed;
    } else if (cursors.right.isDown || this.wasdKeys.right.isDown) {
        moveX = speed;
    }

    if (cursors.up.isDown || this.wasdKeys.up.isDown) {
        moveY = -speed;
    } else if (cursors.down.isDown || this.wasdKeys.down.isDown) {
        moveY = speed;
    }

    player.x += moveX * (this.game.loop.delta / 1000);
    player.y += moveY * (this.game.loop.delta / 1000);
}
