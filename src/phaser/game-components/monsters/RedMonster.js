import { Monster } from "@/phaser/engine/Monster";

const redMonsterProperties = {
    maxHealth: 50, 
    maxStamina: 30, 
    friendly: false, 
    wanderSpeed: 30,
    followSpeed: 80,
    sightRadius: 60,
    collisionSize: { width: 28, height: 28 },
    attackPower: 15
};

export class RedMonster extends Monster {
    constructor(scene, x, y, name = 'RedMonster', overrideProperties = {}) {
        super(scene, x, y, 'monsterTexture2', name, {...redMonsterProperties, ...overrideProperties});
    }
}
