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

function preload() {
    // Load assets here
}

function create() {
    // Initialize your game scene here
    this.add.text(100, 100, 'Hello, Phaser!', { fill: '#0f0' });
}

function update() {
    // Game loop logic here
}
