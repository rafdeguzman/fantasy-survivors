import Bullet from "../objects/Bullet";
import Enemy from "../entities/Enemy";
export default class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

        // this.create(0, 0, 'bullet', 0, false, false);


        this.createMultiple({
            classType: Bullet,
            frameQuantity: 5,
            key: 'bullet',
            active: false,
            visible: false,
        });
    }

    fireAimedBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject): void {
        this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.shootAimed(shooter, target);
        }
    }

    onBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
        if (bullet.active === false || enemy.active === false){
            console.log("bullet or enemy not active")
            return;
        }
            
        console.log("bullet hit enemy");
        enemy.takeDamage(1, bullet);
        bullet.setActive(false);
        bullet.setVisible(false);
    }
}