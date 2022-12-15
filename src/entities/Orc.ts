import GLOBALS from "../Globals";
import Enemy from "./Enemy";
export default class Orc extends Enemy {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        // super(scene, x, y, 'orc');
        super({
            scene,
            x,
            y,
            texture: 'orc',
            frame: 0,
            maxHealth: GLOBALS.ORC_HEALTH
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
            key: 'orc_run',
            frames: this.scene.anims.generateFrameNames('orc', {prefix: 'orc_run_', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('orc_run', true);
    }
}