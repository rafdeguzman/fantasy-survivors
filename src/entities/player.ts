import ISpriteConstructor from "../interfaces/ISprite";
import PlayerStateName from "../enums/PlayerStateName";
export default class Player extends Phaser.GameObjects.Sprite {
    readonly SPEED: number = 800;

    declare body: Phaser.Physics.Arcade.Body;

    public getBody(){
        return this.body;
    }

    private movementKeys = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    constructor(aParams: ISpriteConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
        this.scene.add.existing(this);
        this.initSprite();
        this.initPhysics();
        this.initState();
        this.initAnimations();
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'knight_idle_anim_f', start: 0, end: 3, zeroPad: 0}),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'run',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'knight_run_anim_f', start: 0, end: 7, zeroPad: 0}),
            frameRate: 10,
            repeat: -1
        });
    }

    initState(): void{
        this.setState(PlayerStateName.Idle);
    }

    initSprite(): void{
        this.setDisplayOrigin(0.5, 0.5);
        this.setDisplaySize(72, 112);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
    }

    handleInput(): void {
        this.movementKeys.up.on('down', () => {
            this.body.setVelocityY(-this.SPEED);
            !this.anims.isPlaying &&
                this.anims.play('run', true);
        });
        this.movementKeys.down.on('down', () => {
            this.body.setVelocityY(this.SPEED);
            !this.anims.isPlaying && this.anims.play('run', true);
        });
        this.movementKeys.left.on('down', () => {
            this.body.setVelocityX(-this.SPEED);
            !this.anims.isPlaying && this.anims.play('run', true);
        });
        this.movementKeys.right.on('down', () => {
            this.body.setVelocityX(this.SPEED);
            !this.anims.isPlaying && this.anims.play('run', true);
        });
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            !this.anims.isPlaying && this.anims.play('idle', true);
        }
    }

    update(time: number, delta: number): void {
        this.body.setVelocity(0);
        this.handleInput();
    }    
}