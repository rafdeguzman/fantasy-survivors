import GLOBALS from "../Globals";
import Bullet from "../objects/Bullet";
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

    fireAimedBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED): void {
        this.create(shooter.x, shooter.y, 'bullet', 0, false, false);

        let recoilX = target.x + Phaser.Math.Between(-25, 25);
        let recoilY = target.y + Phaser.Math.Between(-25, 25);

        let userRecoil = {
            x: shooter.x + Phaser.Math.Between(-25, 25), 
            y: shooter.y + Phaser.Math.Between(-25, 25)
        }

        let temp = {x: recoilX, y: recoilY};    // this temp is supposed to be the target with recoil

        this.scene.cameras.main.shake(100, 0.005);
        const bullet = this.getFirstDead(false);

        if (bullet) {
            // this is where you want to change bullet speed
            console.log(speed)
            bullet.shootAimed(userRecoil, temp);
        }
    }

    fireSpreadBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED): void {

        // create 5 bullets, change shooter x and y to randomize the spread
        for (let i = 0; i < 5; i++) {
            this.create(shooter.x + Phaser.Math.Between(-25, 25), shooter.y + Phaser.Math.Between(-25, 25), 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);

        let angleBetween = Phaser.Math.Angle.Normalize(Phaser.Math.Angle.BetweenPoints(shooter, target));

        let angle1 = angleBetween + Phaser.Math.DegToRad(15);

        let completeAngle = Phaser.Math.Wrap(angle1, -Math.PI, Math.PI);

        // shoot each bullet
        for (let i = 0; i < 5; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                bullet.setSpeed(speed);
                // we subtract 60 so that the 3rd bullet is the center
                bullet.shootAngledAimed(shooter, target, (15 * i) - 60);
            }
        }
    }


    fireEightWayBullet(shooter: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED): void {

        for (let i = 0; i < 8; i++) {
            this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);

        for (let i = 0; i < 8; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                bullet.setSpeed(speed);
                bullet.shootAngled(shooter, 45 * i);
            }
        }
    }
}