export default class Crosshair extends Phaser.Physics.Arcade.Sprite {
    declare body: Phaser.Physics.Arcade.Body; // set body as arcade body
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'crosshair');
        
        this.scene.add.existing(this);

        this.initPhysics();
    }

    initPhysics(){
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(false);
    }

    update(time: number, delta: number): void{
        super.update(time, delta);
        this.scene.input.mousePointer.updateWorldPoint(this.scene.cameras.main);
        this.x = this.scene.input.mousePointer.worldX;
        this.y = this.scene.input.mousePointer.worldY;

        this.rotation = -this.scene.cameras.main.rotation;
    }
}