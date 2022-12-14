import BulletGroup from "../groups/BulletGroup";
import Enemy from "./Enemy";
import ZombieGroup from "../groups/ZombieGroup";
import GLOBALS from "../Globals";

export default class BigZombie extends Enemy{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 75;
    public enemyBullets: BulletGroup;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        // super(scene, x, y, 'big_zombie');
        super({
            scene,
            x,
            y,
            texture: 'big_zombie',
            frame: 0,
            maxHealth: GLOBALS.BIG_ZOMBIE_HEALTH
        });

        this.enemyBullets = new BulletGroup(scene);

        this.initSprite();
        this.initAnimations();
    }

    initSprite(): void{
        this.originY = 0.8;
        this.body.setCircle(16);
        this.body.setOffset(0, 10);
        this.setDisplaySize(170, 224);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'big_zombie_run',
            frames: this.scene.anims.generateFrameNames('big_zombie', {prefix: 'big_zombie_run_anim_f', start: 0, end: 3}),
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

        !this.anims.isPlaying && this.anims.play('big_zombie_run', true);
    }

    onDeath(): void {
        this.scene.zombieGroup.spawnEnemy(this.x, this.y);
        this.scene.zombieGroup.spawnEnemy(this.x + 50, this.y + 50);
    }
}