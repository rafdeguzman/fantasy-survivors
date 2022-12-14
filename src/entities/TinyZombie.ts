import Enemy from "./Enemy";
import GLOBALS from "../Globals";

export default class TinyZombie extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 250;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'tiny_zombie',
            frame: 0,
            maxHealth: GLOBALS.TINY_ZOMBIE_HEALTH
        });
    }

    initSprite(): void{
        this.body.setCircle(8.5);
        this.setDisplaySize(70, 64);
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
        super.update(time, delta);
        !this.anims.isPlaying && this.anims.play('tiny_zombie_run', true);
    }
}