import Enemy from "../entities/Enemy";
import GLOBALS from "../Globals";

export default class EnemyFactory extends Phaser.Physics.Arcade.Group {
    private entity: Function;
    public enemyType: string;
    constructor(scene: Phaser.Scene, enemyEntity: Function, enemyType: string) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: enemyEntity,
            frameQuantity: 1,
            key: enemyType,
            active: false,
            visible: false,
        });

        this.entity = enemyEntity;
        this.enemyType = enemyType;
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
            
        this.scene.physics.add.overlap(enemy, this.scene.player.playerBullets, (enemy: Enemy, bullet: Bullet) => {
            if (!bullet.active || !enemy.active) return;
            
            bullet.destroy();
            enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
        });
    }

    spawnEnemy(x: number, y: number): void {
        this.create(x, y, this.enemyType, 0, false, false);

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