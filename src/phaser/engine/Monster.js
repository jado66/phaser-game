import { player } from '../scenes/Game';
import { Character } from './Character';

export class Monster extends Character {
    constructor(scene, x, y, texture, name, maxHealth = 100, maxStamina = 50, attackPower = 1, loot = null) {
        super(scene, x, y, texture, name, maxHealth, maxStamina, false); // Monsters are not friendly by default

        // Additional monster-specific properties
        this.attackPower = attackPower;
        this.loot = loot;

        scene.physics.add.overlap(this, player, this.attackPlayer, null, this);

    }

    attackPlayer(){
        player.takeDamage(this.attackPower)
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