export default class Coin extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string = 'coin', frame?: string | number) {
        super(scene, x, y, 'coin', frame);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.initSprite();
        this.initAnimations();
    }

    initSprite(): void {
        this.setDisplaySize(32, 32);
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

    spawn(x: number, y: number): void {
        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.initSprite();
        this.initAnimations();

        this.setActive(true);
        this.setVisible(true);
    }

    pickup(): void {
        this.destroy();
    }
}