import BulletGroup from "../groups/BulletGroup";
import Enemy from "./Enemy";
import ZombieGroup from "../groups/ZombieGroup";
import GLOBALS from "../Globals";

export default class Ogre extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 75;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'ogre',
            frame: 0,
            maxHealth: GLOBALS.OGRE_HEALTH
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
            key: 'ogre_run',
            frames: this.scene.anims.generateFrameNames('ogre', {prefix: 'ogre_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
       super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('ogre_run', true);
    }
}