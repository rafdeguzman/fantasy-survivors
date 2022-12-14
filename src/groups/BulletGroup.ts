import GLOBALS from "../Globals";
import Bullet from "../objects/Bullet";
export default class BulletGroup extends Phaser.Physics.Arcade.Group {

    private rotatorAngle: number = 0;

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

    fireAimedBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {
        this.create(shooter.x, shooter.y, 'bullet', 0, false, false);

        let recoilX = target.x + Phaser.Math.Between(-25, 25);
        let recoilY = target.y + Phaser.Math.Between(-25, 25);

        let userRecoil = {
            x: shooter.x + Phaser.Math.Between(-25, 25), 
            y: shooter.y + Phaser.Math.Between(-25, 25)
        }

        let temp = {x: recoilX, y: recoilY};    // this temp is supposed to be the target with recoil

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });
        
        const bullet = this.getFirstDead(false);

        if (bullet) {
            if (texture) bullet.setTexture(texture);
            bullet.setSpeed(speed);
            // this is where you want to change bullet speed
            bullet.shootAimed(userRecoil, temp);
        }
    }

    fireSpreadBullet(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {

        // create 5 bullets, change shooter x and y to randomize the spread
        for (let i = 0; i < 5; i++) {
            this.create(shooter.x + Phaser.Math.Between(-25, 25), shooter.y + Phaser.Math.Between(-25, 25), 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });

        // shoot each bullet
        for (let i = 0; i < 5; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                if (texture) bullet.setTexture(texture);
                bullet.setSpeed(speed);
                // we subtract 30 so that the 3rd bullet is the center
                bullet.shootAngledAimed(shooter, target, (15 * i) - 30);
            }
        }
    }

    fireEightWayRotatingBulletv2(shooter: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {
        for (let i = 0; i < 8; i++) {
            this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });

        for (let i = 0; i < 8; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                if (texture) bullet.setTexture(texture);
                bullet.setSpeed(speed);
                bullet.shootAngled(shooter, 45 * i - this.rotatorAngle);
                this.rotatorAngle > 360 ? this.rotatorAngle = 0 : this.rotatorAngle += 30;
            }
        }
    }

    fireEightWayRotatingBullet(shooter: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {
        for (let i = 0; i < 8; i++) {
            this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });

        for (let i = 0; i < 8; i++) {
            this.rotatorAngle += 30;
            const bullet = this.getFirstDead(false);
            if (bullet) {
                if (texture) bullet.setTexture(texture);
                bullet.setSpeed(speed);
                bullet.shootAngled(shooter, 45 - this.rotatorAngle);
            }
        }
    }

    fireEightWayRotatingBulletv3(shooter: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {
        for (let i = 0; i < 8; i++) {
            this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });

        for (let i = 0; i < 8; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                if (texture) bullet.setTexture(texture);
                bullet.setSpeed(speed);
                bullet.shootAngled(shooter, (45 * i) - this.rotatorAngle);
                this.rotatorAngle += 30;
            }
        }
    }

    fireEightWayBullet(shooter: Phaser.GameObjects.GameObject, speed: number = GLOBALS.BULLET_SPEED, texture?: string): void {

        for (let i = 0; i < 8; i++) {
            this.create(shooter.x, shooter.y, 'bullet', 0, false, false);
        }

        this.scene.cameras.main.shake(100, 0.005);
        this.scene.gunshotSound.play({ volume: 0.25 });

        for (let i = 0; i < 8; i++) {
            const bullet = this.getFirstDead(false);
            if (bullet) {
                if (texture) bullet.setTexture(texture);
                bullet.setSpeed(speed);
                bullet.shootAngled(shooter, 45 * i);
            }
        }
    }
}