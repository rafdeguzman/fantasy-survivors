export default class Coin extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string = 'coin', frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.scene = scene;
    }


    initSprite(): void {
        this.setDisplaySize(100, 100);
        this.setOrigin(0.5, 0.5);
    }

    initAnimations(): void {
        this.scene.anims.create({
            key: 'coin_spin',
            frames: this.scene.anims.generateFrameNames('coin', { prefix: 'coin_anim_f', start: 0, end: 3 }),
            frameRate: 10,
        });
    }

    update(time: number, delta: number): void {
        !this.anims.isPlaying && this.anims.play('coin_spin', true);

        this.rotation = -this.scene.cameras.main.rotation;
    }

}