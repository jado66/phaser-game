const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
    // Create a circle in the middle of the screen
    player = this.add.circle(400, 300, 25, 0xffffff);

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
