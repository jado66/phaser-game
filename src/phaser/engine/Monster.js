import { player1 } from '../scenes/Game';
import { Character } from './Character';
  
const defaultProperties = {
    maxHealth: 100, 
    maxStamina: 50, 
    friendly: false, 
    wanderSpeed: 15,
    followSpeed: 35,
    sightRadius: 100,
    collisionSize: { width: 32, height: 32 },
    attackPower: 50,
    loot: null
};

export class Monster extends Character {
    constructor(scene, x, y, texture, name, overrideProperities = {}) {
        const properties = { ...defaultProperties, ...overrideProperities };
        super(scene, x, y, texture, name, properties); 

        const { attackPower, loot } = properties;

        // Additional monster-specific properties
        this.attackPower = attackPower;
        this.loot = loot;

        scene.physics.add.overlap(this, player1, this.attackPlayer, null, this);
    }


    update(time, delta) {
        super.update();

        if (Phaser.Math.Distance.Between(this.x,this.y,player1.x,player1.y)< this.sightRadius){
            this.follow(player1)
        }
        else{
            this.stopFollowing()
        }    
    }
 
    attackPlayer(){
        player1.takeDamage(this.attackPower)
    }

    attack(target) {
        if (target instanceof Character && !this.friendly) {
            target.takeDamage(this.attackPower);
            console.log(`${this.name} attacked ${target.name} for ${this.attackPower} damage.`);
        }
    }

    die() {
        super.die();
        if (loot){
            this.dropLoot();
        }
    }

    dropLoot() {
        this.loot.forEach(item => {
            const droppedItem = new DroppedItem(this.scene, this.x, this.y, item.texture);
            droppedItem.name = item.name; // Set the name of the dropped item
        });
        console.log(`${this.name} dropped its loot.`);
    }
}