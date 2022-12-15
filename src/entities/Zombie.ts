import GLOBALS from "../Globals";
import BulletGroup from "../groups/BulletGroup";
import Bullet from "../objects/Bullet";
import Enemy from "./Enemy";
import GameEntity from "./GameEntity";

export default class Zombie extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 125;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super({
            scene,
            x,
            y,
            texture: 'zombie',
            frame: 0,
            maxHealth: GLOBALS.ZOMBIE_HEALTH
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
            key: 'zombie_run',
            frames: this.scene.anims.generateFrameNames('zombie', {prefix: 'zombie_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
        });
    }

    // walk towards the player
    update(time: number, delta: number): void {
        super.update(time, delta);

        !this.anims.isPlaying && this.anims.play('zombie_run', true);
    }

    onDeath(): void {
        for (let i = 0; i < 4; i++) {
            this.scene.tinyZombieGroup.spawnEnemy((this.x - 50) + (25 * i),
             (this.y - 50) + (25 * i));
        }
    }

}