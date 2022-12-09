import Bullet from "../objects/Bullet";
export default class BulletGroup extends Phaser.Physics.Arcade.Group {

    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
            classType: Bullet,
            frameQuantity: 10,
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
}