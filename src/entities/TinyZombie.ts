import BulletGroup from "../groups/BulletGroup";
import Bullet from "../objects/Bullet";
import Enemy from "./Enemy";
import GameEntity from "./GameEntity";

export default class TinyZombie extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 200;
    private health: number = 1;
    private scene: any;

    private tick: number = 0;

    public enemyBullets: BulletGroup;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super(scene, x, y, 'tiny_zombie');
        
        this.scene = scene;

        this.enemyBullets = new BulletGroup(scene);

        this.initSprite();
        this.initPhysics();
        this.initAnimations();
    }

    initSprite(): void{
        this.originY = 0.6;
        this.body.setCircle(9);
        this.body.setOffset(0, 3);
        this.setDisplaySize(48, 64);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'tiny_zombie_run',
            frames: this.scene.anims.generateFrameNames('tiny_zombie', {prefix: 'tiny_zombie_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        this.tick += delta

        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) { // walking right, facing rght
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {  // walking left, facing left
            this.setFlipX(true);
        } 
        
        this.rotation = -this.scene.cameras.main.rotation;

        !this.anims.isPlaying && this.anims.play('tiny_zombie_run', true);
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
            this.destroy();
        }
    }

    spriteFlicker(): void{
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }

}