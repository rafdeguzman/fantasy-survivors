import Enemy from "./Enemy";
import GLOBALS from "../Globals";

export default class Chort extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 250;

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
    }

    handleMovement(): void {
        Phaser.Actions.RotateAround([this], {x: this.scene.player.x, y: this.scene.player.y}, 0.01);
    }
}