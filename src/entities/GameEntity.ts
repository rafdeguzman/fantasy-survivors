// import ISpriteConstructor from "../interfaces/ISprite";
export default class GameEntity extends Phaser.Physics.Arcade.Sprite{
    declare body: Phaser.Physics.Arcade.Body; // set body as arcade body

    constructor(scene: Phaser.Scene, x: number,
        y: number, texture: string, frame?: string | number) {
       super(scene, x, y, texture, frame);
   
       scene.add.existing(this);
       scene.physics.add.existing(this);
    }
}