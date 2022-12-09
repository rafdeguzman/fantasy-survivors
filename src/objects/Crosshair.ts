export default class Crosshair extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'crosshair');
        this.scene.add.existing(this);
    }
}