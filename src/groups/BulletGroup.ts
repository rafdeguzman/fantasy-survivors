import Bullet from "../objects/Bullet";
import Enemy from "../entities/Enemy";
export default class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

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
        this.scene.cameras.main.shake(100, 0.005);
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.shootAimed(shooter, target);
        }
    }
}