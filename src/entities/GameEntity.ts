// import ISpriteConstructor from "../interfaces/ISprite";
export default class GameEntity extends Phaser.Physics.Arcade.Sprite{
    declare body: Phaser.Physics.Arcade.Body; // set body as arcade body

    constructor(scene: Phaser.Scene, x: number,
        y: number, texture: string, frame?: string | number) {
       super(scene, x, y, texture, frame);
   
       scene.add.existing(this);
       scene.physics.add.existing(this);
    }
    
    // taking damage
    spriteFlicker(): void{
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }
        
    tweenAlpha(): void{
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 100,
            ease: 'Linear',
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.alpha = 1;
            }
        });
    }

    flashBlue(): void{
        this.setTint(0x1f51ff);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
    }
}