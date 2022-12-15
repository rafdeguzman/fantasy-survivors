export default class GameItem extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body; // set body as arcade body

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    // override these methods
    initSprite(): void {

    }

    initAnimations(): void {

    }

    update(time: number, delta: number): void {
        this.rotation = -this.scene.cameras.main.rotation;
    }

    spawn(x: number, y: number): void {
        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.initSprite();
        this.initAnimations();
    }

    pickup(): void {

        this.scene.physics.world.disable(this);
        this.setActive(false);
        this.setVisible(false);
    }
}