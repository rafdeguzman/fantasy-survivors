import ISpriteConstructor from "../interfaces/ISprite";
import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
export default class Player extends GameEntity {
    readonly SPEED: number = 800;

    

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keyX: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    private movementKeys = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight');

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');
        this.keyX = this.scene.input.keyboard.addKey('X');
        this.keySpace = this.scene.input.keyboard.addKey('SPACE');


        this.scene.add.existing(this);
        
        this.initState();
        this.initPhysics();
        this.initAnimations();
    }

    initPhysics(){
        this.body.setSize(72 / 2, 112 / 4);
        this.body.setOffset(0, 0);
        this.setDisplaySize(72, 112);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'idle', start: 0, end: 3}),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'run', start: 0, end: 3}),
            frameRate: 10,
            repeat: 0
        });
    }

    initState(): void{
        this.setState(PlayerStateName.Idle);
    }

    handleInput(): void {
        this.body.setVelocity(0);

        if (this.keyW?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI / 2, this.SPEED, this.body.velocity)
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyA?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI, this.SPEED, this.body.velocity)
            this.flipX = true;
            // this.body.setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyS?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI / 2, this.SPEED, this.body.velocity)
            // this.body.velocity.y = this.SPEED;
            !this.anims.isPlaying && this.anims.play('run', true);
        }
        if (this.keyD?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation, this.SPEED, this.body.velocity)
            // this.body.velocity.x = this.SPEED;
            this.flipX = false;
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyD.isDown && this.keyW.isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI / 4, this.SPEED, this.body.velocity)
        }
        if (this.keyA.isDown && this.keyW.isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI * 3 / 4, this.SPEED, this.body.velocity)
        }
        if (this.keyA.isDown && this.keyS.isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI * 3 / 4, this.SPEED, this.body.velocity)
        }
        if (this.keyD.isDown && this.keyS.isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI / 4, this.SPEED, this.body.velocity)
        }

        if (this.keyQ?.isDown) {
            this.scene.cameras.main.rotation += 0.05;
        }
        if (this.keyE?.isDown) {
            this.scene.cameras.main.rotation -= 0.05;
        }
        if (this.keyX?.isDown) {
            this.scene.cameras.main.rotation = 0;
        }
        // if no key is down
        if (this.keyD?.isUp && this.keyA?.isUp && this.keyS?.isUp && this.keyW?.isUp) {
            !this.anims.isPlaying && this.anims.play('idle', true);
        }
    }

    update(time: number, delta: number): void {
        this.handleInput();
        this.rotation = -this.scene.cameras.main.rotation;
    }    
}