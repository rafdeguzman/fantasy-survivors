import BulletGroup from "../groups/BulletGroup";
import Enemy from "./Enemy";


export default class Demon extends Enemy {
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 150;
    private health: number = 300;
    private scene: any;

    private tick: number = 0;
    private laserTick: number = 0;

    public enemyBullets: BulletGroup;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super(scene, x, y, 'demon');
        
        this.scene = scene;

        this.enemyBullets = new BulletGroup(scene);

        this.initSprite();
        this.initPhysics();
        this.initAnimations();
    }

    initSprite(): void{
        this.originY = 0.8;
        this.body.setCircle(16);
        this.body.setOffset(0, 10);
        this.setDisplaySize(170, 224);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'demon_run',
            frames: this.scene.anims.generateFrameNames('demon', {prefix: 'big_demon_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        this.tick += delta;
        this.laserTick += delta;
        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) { // walking right, facing rght
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {  // walking left, facing left
            this.setFlipX(true);
        } 
        
        this.rotation = -this.scene.cameras.main.rotation;

        !this.anims.isPlaying && this.anims.play('demon_run', true);

        this.handleShooting();
        this.handleLaserShooting();
    }

    spawn(x: number, y: number): void {
        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        
        this.initSprite();
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        this.scene.enemyHitSound.play({volume: 0.5});
        this.spriteFlicker();
        if (this.health <= 0) {
            console.log("demon dead");
            this.destroy();
        }
    }

    spriteFlicker(): void{
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }

    handleShooting(): void {
        if (this.tick > 500) {
            this.shoot();
            this.scene.gunshotSound.play({volume: 0.1});
            this.tick = 0;
        }
    }

    shoot(): void {
        this.enemyBullets.fireEightWayRotatingBullet(this, 500);
    }

    shootLaser(): void {
        this.enemyBullets.fireAimedBullet(this, this.scene.player, 800);
    }

    handleLaserShooting(): void {
        if (this.laserTick > 50) {
            this.shootLaser();
            this.scene.gunshotSound.play({volume: 0.1});
            this.laserTick = 0;
        }
    }

}