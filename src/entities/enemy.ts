import Bullet from "../objects/Bullet";
import GameEntity from "./GameEntity";

export default class Enemy extends GameEntity{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;
    private health: number = 1;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super(scene, x, y, 'orc')
        
        this.initSprite();
        this.initPhysics();
        this.initAnimations();
    }

    initSprite(): void{
        this.originY = 0.6;
        this.body.setCircle(9);
        this.body.setOffset(0, 3);
        this.setDisplaySize(72, 112);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'orc_run',
            frames: this.scene.anims.generateFrameNames('orc', {prefix: 'orc_run_', start: 0, end: 3}),
            frameRate: 10,
        })
    }

    // walk towards the player
    update(): void {
        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }

        this.rotation = -this.scene.cameras.main.rotation;

        !this.anims.isPlaying && this.anims.play('orc_run', true);
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

        if (this.health <= 0) {
            this.destroy();
        }
    }
}