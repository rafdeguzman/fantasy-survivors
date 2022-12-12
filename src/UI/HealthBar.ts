export default class HealthBar extends Phaser.GameObjects.Graphics {
    private value: number;
    private maxValue: number;
    
    constructor(scene: Phaser.Scene, x: number, y: number){
        super(scene, {x, y});
        this.scene = scene;
        this.scene.add.existing(this);
    }
}