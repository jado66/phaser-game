import { Monster } from "@/phaser/engine/Monster";

const greenMonsterProperties = {
    maxHealth: 50, 
    maxStamina: 30, 
    friendly: false, 
    wanderSpeed: 20,
    followSpeed: 40,
    sightRadius: 80,
    collisionSize: { width: 28, height: 28 },
    attackPower: 15
};

export class GreenMonster extends Monster {
    constructor(scene, x, y, name = 'GreenMonster', overrideProperties = {}) {
        super(scene, x, y, 'monsterTexture', name, {...greenMonsterProperties, ...overrideProperties});

        this.changeSightGraphicsColor(0x00ff00)

    }
}
