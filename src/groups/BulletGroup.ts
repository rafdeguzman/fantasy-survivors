import Bullet from "../objects/Bullet";
export default class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Bullet,
            frameQuantity: 50,
            key: 'bullet',
            active: false,
            visible: false,
        });
    }

    fireBullet(x: number, y: number): void {
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.shoot(x, y);
        }
    }

    fireAimedBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject): void {
        const bullet = this.getFirstDead(false);

        if (bullet) {
            bullet.shootAimed(shooter, target);
        }
    }
}