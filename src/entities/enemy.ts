import Bullet from "../objects/Bullet";
import GameEntity from "./GameEntity";

export default class Enemy extends GameEntity{
    declare body: Phaser.Physics.Arcade.Body;
    readonly SPEED: number = 100;
    private health: number = 1;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super(scene, x, y, 'enemy')
        
        this.initSprite();
        this.initPhysics();
    }

    initSprite(): void{
        this.originY = 0.7;
        this.body.setCircle(9);
        this.body.setOffset(0, 3);
        this.setDisplaySize(72, 112);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }


    // walk towards the player
    update(): void {
        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }

        this.rotation = -this.scene.cameras.main.rotation;
    }

    spawn(x: number, y: number): void {
        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);
        
        this.initSprite();
    }

    takeDamage(damage: number, bullet: Bullet): void {
        this.health -= damage;

        bullet.disableBody(true, true);

        if (this.health <= 0) {
            this.disableBody(true, true);
            this.disableInteractive();
            this.setActive(false);
            this.setVisible(false);
        }
    }
}