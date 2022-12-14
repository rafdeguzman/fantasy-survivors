import GLOBALS from "../Globals";
import BulletGroup from "../groups/BulletGroup";
import Bullet from "../objects/Bullet";
import Enemy from "./Enemy";
import GameEntity from "./GameEntity";

export default class Orc extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;

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
        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) { // walking right, facing rght
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {  // walking left, facing left
            this.setFlipX(true);
        } 
        
        this.rotation = -this.scene.cameras.main.rotation;

        !this.anims.isPlaying && this.anims.play('orc_run', true);
    }
}