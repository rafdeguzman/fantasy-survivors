import GLOBALS from "../Globals";
import BulletGroup from "../groups/BulletGroup";
import Enemy from "./Enemy";

export default class Necromancer extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'necromancer',
            frame: 0,
            maxHealth: GLOBALS.NECROMANCER_HEALTH
        });
    }

    initSprite(): void{
        this.originY = 0.6;
        this.body.setCircle(9);
        this.body.setOffset(0, 3);
        this.setDisplaySize(72, 112);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'necromancer_run',
            frames: this.scene.anims.generateFrameNames('necromancer', {prefix: 'necromancer_run_', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        this.firerateTick += delta

        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) { // walking right, facing rght
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {  // walking left, facing left
            this.setFlipX(true);
        } 
        
        this.rotation = -this.scene.cameras.main.rotation;

        !this.anims.isPlaying && this.anims.play('necromancer_run', true);

        this.handleShooting();
    }

    handleShooting(): void {
        if (this.firerateTick > GLOBALS.NECROMANCER_FIRERATE) {
            this.shoot();
            this.firerateTick = 0;
        }
    }

    shoot(): void {
        this.enemyBullets.fireSpreadBullet(this, this.scene.player, 500);
    }
}