export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    public SPEED: number = 1400;
    public DAMAGE: number = 1;
    private activeTime: number = 0;
    private isAngular: boolean = false;
    private rotationSpeed: number = 0;
    constructor(scene: Phaser.Scene, x: number, y: number, isAngular = false) {
        super(scene, x, y, 'bullet');
        this.initPhysics();
        this.isAngular = isAngular;
    }

    initPhysics(){
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    shootAimed(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject): void {
        this.scene.physics.world.enable(this);
        this.enableBody(true, shooter.x, shooter.y, true, true);
        this.body.reset(shooter.x, shooter.y);

        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.moveToObject(this, target, this.SPEED);
    }
    
    shootAngled(shooter: Phaser.GameObjects.GameObject, angle: number): void{
        this.scene.physics.world.enable(this);
        this.enableBody(true, shooter.x, shooter.y, true, true);
        this.body.reset(shooter.x, shooter.y);

        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.velocityFromAngle(angle, this.SPEED, this.body.velocity);
    }
    
    shootAngledAimed(shooter: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject, angle: number): void{
        this.scene.physics.world.enable(this);
        this.enableBody(true, shooter.x, shooter.y, true, true);
        this.body.reset(shooter.x, shooter.y);

        this.setActive(true);
        this.setVisible(true);

        

        // console.log(Phaser.Math.Angle.BetweenPoints(this, target));

        this.scene.physics.velocityFromAngle(angle, this.SPEED, this.body.velocity);    


        // this.scene.physics.velocityFromAngle(angle * angleBetween, this.SPEED, this.body.velocity);

        this.rotationSpeed = Phaser.Math.Angle.BetweenPoints(this, target) * 0.5;
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta);

        this.activeTime += delta;

        if (this.activeTime >= 1400) {
            this.setActive(false);
            this.setVisible(false);
            this.activeTime = 0;
        }
    }

    setSpeed(speed: number): void {
        this.SPEED = speed;
    }

}