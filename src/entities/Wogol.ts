import GLOBALS from "../Globals";
import Enemy from "./Enemy";

export default class Wogol extends Enemy {
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 175;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'wogol',
            frame: 0,
            maxHealth: GLOBALS.WOGOL_HEALTH
        });
    }

    initSprite(): void{
        this.originY = 0.6;
        this.body.setCircle(9);
        this.body.setOffset(0, 3);
        this.setDisplaySize(72, 84);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'wogol_run',
            frames: this.scene.anims.generateFrameNames('wogol', {prefix: 'wogol_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('wogol_run', true);
    }

    onDeath(): void {
        this.enemyBullets.fireEightWayBullet(this);
    }

}