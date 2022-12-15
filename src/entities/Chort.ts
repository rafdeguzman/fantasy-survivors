import Enemy from "./Enemy";
import GLOBALS from "../Globals";

export default class Chort extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;
    private approachPlayer: boolean = true;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'chort',
            frame: 0,
            maxHealth: GLOBALS.CHORT_HEALTH
        });
    }

    initSprite(): void{
        this.body.setCircle(8.5);
        this.setDisplaySize(70, 64);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'chort_run',
            frames: this.scene.anims.generateFrameNames('chort', {prefix: 'chort_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('chort_run', true);

        if (this.isCloseToPlayer()) {
            console.log(this.approachPlayer)
            this.approachPlayer = false;
            this.handleShooting();
        }
        if (this.isFarFromPlayer()){
            this.approachPlayer = true;
            this.moveTowardsPlayer();
        }
    }

    handleMovement(): void {
        Phaser.Actions.RotateAround([this], {x: this.scene.player.x, y: this.scene.player.y}, 0.0032);
    }

    moveTowardsPlayer(): void {
        if (this.approachPlayer)
            this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);
    }

    handleShooting(): void {
        if (this.firerateTick > GLOBALS.CHORT_FIRERATE) {
            this.shoot();
            this.firerateTick = 0;
        }
    }

    shoot(): void {
        this.enemyBullets.fireAimedBullet(this, this.scene.player, GLOBALS.ENEMY_BULLET_SPEED);
    }

    isCloseToPlayer(): boolean {
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) <= 500
    }

    isFarFromPlayer() : boolean {
        return Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) > 500
    }

}