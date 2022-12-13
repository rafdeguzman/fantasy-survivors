import Enemy from "../entities/Enemy";
import GLOBALS from "../Globals";
import Bullet from "../objects/Bullet";
import Player from "../entities/Player";
export default class EnemyGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
        
        this.createMultiple({
            classType: Enemy,
            frameQuantity: 2,
            key: 'enemy',
            active: false,
            visible: false,
        });
    }

    initOverlaps(enemy: Enemy) : void {
        this.scene.physics.add.overlap(this.scene.player, enemy, () => {
            this.scene.player.takeDamage(GLOBALS.ENEMY_DAMAGE);
        });

        this.scene.physics.add.overlap(enemy.enemyBullets, this.scene.player, (player: Player, bullet: Bullet) => {
            if (!bullet.active || player.isInvulnerable) return;
            bullet.destroy();
            player.takeDamage(GLOBALS.BULLET_DAMAGE);
        });        
    }

    spawnEnemy(x: number, y: number): void {
        this.create(x, y, 'enemy', 0, false, false);
        
        const enemy = this.getFirstDead(false);

        this.initOverlaps(enemy);

        if (enemy) {
            enemy.spawn(x, y);
        }
    }

    update(time: number, delta: number): void {
        this.children.each((enemy: any) => {
            if (enemy.active) {
                enemy.update(time, delta);
            }
        });
    }
}