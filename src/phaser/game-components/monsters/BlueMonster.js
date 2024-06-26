import { Monster } from "@/phaser/engine/Monster";

const blueMonsterProperties = {
    maxHealth: 50, 
    maxStamina: 30, 
    friendly: false, 
    wanderSpeed: 5,
    followSpeed: 10,
    sightRadius:200,
    collisionSize: { width: 28, height: 28 },
    attackPower: 15
};

export class BlueMonster extends Monster {
    constructor(scene, x, y, name = 'BlueMonster', overrideProperties = {}) {
        super(scene, x, y, 'monsterTexture3', name, {...blueMonsterProperties, ...overrideProperties});

        this.changeSightGraphicsColor(0x0000ff)

    }
}
