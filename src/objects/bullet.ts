export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    private SPEED: number = 1400;
    private activeTime: number = 0;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bullet');
    }

    shoot(x: number, y: number): void {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI / 2, this.SPEED, this.body.velocity);
    }

    shootAimed(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject): void {
        this.body.reset(shooter.x, shooter.y);

        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.moveToObject(this, target, this.SPEED);
    }
    
    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        this.activeTime += delta;

        if (this.activeTime >= 1000) {
            this.setActive(false);
            this.setVisible(false);
            this.activeTime = 0;
        }
    }
}