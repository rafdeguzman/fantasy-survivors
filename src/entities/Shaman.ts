import GLOBALS from "../Globals";
import BulletGroup from "../groups/BulletGroup";
import Enemy from "./Enemy";

export default class Shaman extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'shaman',
            frame: 0,
            maxHealth: GLOBALS.SHAMAN_HEALTH
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
            key: 'shaman_run',
            frames: this.scene.anims.generateFrameNames('shaman', {prefix: 'orc_shaman_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('shaman_run', true);
        this.handleShooting();
    }

    handleShooting(): void {
        if (this.firerateTick > GLOBALS.SHAMAN_FIRERATE) {
            this.shoot();
            this.firerateTick = 0;
        }
    }

    shoot(): void {
        this.enemyBullets.fireAimedBullet(this, this.scene.player, GLOBALS.ENEMY_BULLET_SPEED);
    }
}