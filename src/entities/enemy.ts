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
        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }
        
        this.rotation = -this.scene.cameras.main.rotation;
    }
}