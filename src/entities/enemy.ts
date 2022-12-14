import BulletGroup from "../groups/BulletGroup";
import Bullet from "../objects/Bullet";
import GameEntity from "./GameEntity";

export default class Enemy extends GameEntity{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;
    private scene: any;

    public enemyBullets: BulletGroup;

    constructor(scene: Phaser.Scene, x: number,
        y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);
        
        this.scene = scene;

        this.initPhysics();
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        this.scene.enemyHitSound.play({volume: 0.5});
        this.spriteFlicker();
        if (this.health <= 0) {
            this.destroy();
        }
    }

    spriteFlicker(): void{
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }

    spawn(x: number, y: number): void {
        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
    }

    dropCoin(): void {
        if (Math.random() < 0.2)

        this.scene.coinGroup.spawnCoin(this.x, this.y);
    }

    destroy(): void {
        this.dropCoin();
        this.scene.physics.world.disable(this);
        this.setActive(false);
        this.setVisible(false);
    }
}