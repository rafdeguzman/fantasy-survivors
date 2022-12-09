import ISpriteConstructor from "../interfaces/ISprite";

export default class Enemy extends Phaser.GameObjects.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    public getBody(){
        return this.body;
    }

    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene.add.existing(this);
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
        this.body.setCollideWorldBounds(true);
    }


    // walk towards the player
    update(): void {

    }
}