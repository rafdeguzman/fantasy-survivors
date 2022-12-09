import ISpriteConstructor from "../interfaces/ISprite";
import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
export default class Player extends GameEntity {
    readonly SPEED: number = 800;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;


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
            this.body.velocity.y = -this.SPEED;
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyA?.isDown) {
            this.body.velocity.x = -this.SPEED;
            this.flipX = true;
            // this.body.setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyS?.isDown) {
            this.body.velocity.y = this.SPEED;
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        if (this.keyD?.isDown) {
            this.body.velocity.x = this.SPEED;
            this.flipX = false;
            !this.anims.isPlaying && this.anims.play('run', true);
        }

        // if no key is down
        if (this.keyD?.isUp && this.keyA?.isUp && this.keyS?.isUp && this.keyW?.isUp) {
            !this.anims.isPlaying && this.anims.play('idle', true);
        }
    }

    update(time: number, delta: number): void {
        this.handleInput();
    }    
}