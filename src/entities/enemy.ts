import GameEntity from "./GameEntity";

export default class Enemy extends GameEntity{
    readonly SPEED: number = 100;
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number,
        y: number) {
        super(scene, x, y, 'enemy')

        scene.add.existing(this);
        
        this.initSprite();
        this.initPhysics();
    }

    initSprite(): void{
        this.setDisplayOrigin(0.5, 0.5);
        this.setDisplaySize(72, 112);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
    }


    // walk towards the player
    update(): void {
        this.body.setVelocity(0, 0);
        if (this.x < this.scene.player.x) {
            this.body.setVelocityX(this.SPEED);
        } else if (this.x > this.scene.player.x) {
            this.body.setVelocityX(-this.SPEED);
        }
        if (this.y < this.scene.player.y) {
            this.body.setVelocityY(this.SPEED);
        } else if (this.y > this.scene.player.y) {
            this.body.setVelocityY(-this.SPEED);
        }

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }
        
        this.rotation = -this.scene.cameras.main.rotation;
    }
}