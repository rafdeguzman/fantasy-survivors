import GLOBALS from "../Globals";
import Enemy from "./Enemy";


export default class Demon extends Enemy {
    declare body: Phaser.Physics.Arcade.Body;
    private SPEED: number = 150;
    private laserTick: number = 0;
    private isShootingLaser: boolean = false;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'demon',
            frame: 0,
            maxHealth: GLOBALS.DEMON_HEALTH
        });
    }

    initSprite(): void{
        this.originY = 0.8;
        this.body.setCircle(16);
        this.body.setOffset(0, 10);
        this.setDisplaySize(170, 224);
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
        super.update(time, delta);

        this.laserTick += delta;
        !this.anims.isPlaying && this.anims.play('demon_run', true);

        if (this.isFarFromPlayer()) {
            this.isShootingLaser = false;
            this.SPEED = 500;
        }
            
        if (this.isCloseToPlayer()) {
            this.isShootingLaser = true;
            this.SPEED = 150;
        }
            
        
        this.handleShooting();
        this.handleLaserShooting();
    }

    isCloseToPlayer(): boolean {
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 1000
    }

    isFarFromPlayer() : boolean {
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 2000
    }

    handleShooting(): void {
        if (this.firerateTick > GLOBALS.DEMON_FIRERATE) {
            this.shoot();
            this.firerateTick = 0;
        }
    }

    shoot(): void {
        this.enemyBullets.fireEightWayRotatingBullet(this, GLOBALS.ENEMY_BULLET_SPEED);
    }

    shootLaser(): void {
        this.enemyBullets.fireAimedBullet(this, this.scene.player, GLOBALS.ENEMY_BULLET_SPEED * 1.5);
    }

    handleLaserShooting(): void {
        if (!this.isShootingLaser) return;

        if (this.laserTick > GLOBALS.DEMON_LASER_FIRERATE) {
            this.shootLaser();
            this.laserTick = 0;
        }
    }
    
    // win condition
    onDeath(): void {
        this.scene.winEvent();
    }

}