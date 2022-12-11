import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
export default class Player extends GameEntity {
    private SPEED: number = 500;
    private isInvulnerable: boolean = false;
    private health: number = 100000;

    private dashCooldown: boolean = false;

    private isDashing: boolean = false;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keyQ: Phaser.Input.Keyboard.Key;
    private keyE: Phaser.Input.Keyboard.Key;
    private keyX: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;
    private key1: Phaser.Input.Keyboard.Key;
    private key2: Phaser.Input.Keyboard.Key;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight');

        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        this.keyQ = this.scene.input.keyboard.addKey('Q');
        this.keyE = this.scene.input.keyboard.addKey('E');
        this.keyX = this.scene.input.keyboard.addKey('X');
        this.key1 = this.scene.input.keyboard.addKey('1');
        this.key2 = this.scene.input.keyboard.addKey('2');
        this.keySpace = this.scene.input.keyboard.addKey('SPACE');

        this.scene.add.existing(this);
        
        this.initState();
        this.initPhysics();
        this.initAnimations();
    }

    initPhysics(){
        // this.body.setSize(10, 10);
        this.originY = 0.6
        this.body.setCircle(3);
        this.body.setOffset(5, 16);
        this.setDisplaySize(72, 112);
    }

    initAnimations(): void{
        this.scene.anims.create({
            key: 'knight_idle',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'knight_idle_', start: 0, end: 3}),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'knight_run',
            frames: this.scene.anims.generateFrameNames('knight', {prefix: 'knight_run_', start: 0, end: 3}),
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
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }

        if (this.keyA?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI, this.SPEED, this.body.velocity)
            this.flipX = true;
            // this.body.setOffset(48, 15);
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }

        if (this.keyS?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI / 2, this.SPEED, this.body.velocity)
            // this.body.velocity.y = this.SPEED;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keyD?.isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation, this.SPEED, this.body.velocity)
            // this.body.velocity.x = this.SPEED;
            this.flipX = false;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
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
            this.scene.cameras.main.rotation += 0.025;
        }
        if (this.keyE?.isDown) {
            this.scene.cameras.main.rotation -= 0.025;
        
        }
        if (this.keyX?.isDown) {
            this.scene.cameras.main.rotation = 0;
        
        }
        // if space is down
        if (this.keySpace?.isDown){
            if (this.dashCooldown) return;

            if (this.isDashing){
                console.log('already dashing')
                return;
            }
            console.log('dash')

            this.dashCooldown = true;

            this.isDashing = true;
            this.isInvulnerable = true;

            this.setTint(0x36454f);
            // 808080

            this.SPEED *= 5
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    this.SPEED /= 5;
                    
                    this.isDashing = false;

                    this.clearTint();

                    this.tweenAlpha();
                }
            });
            this.scene.time.addEvent({
                delay: 1000,
                callback: () => {
                    console.log('no longe invulnerable')
                    this.isInvulnerable = false;
                }
            });
            this.scene.time.addEvent({
                delay: 5000,
                callback: () => {
                    console.log('dash cooldown over')
                    this.flashWhite();
                    this.dashCooldown = false;
                }
            });
        }
        // if no key is down
        if (this.keyD?.isUp && this.keyA?.isUp && this.keyS?.isUp && this.keyW?.isUp) {
            !this.anims.isPlaying && this.anims.play('knight_idle', true);
        }

        if (this.key1?.isDown){
            console.log('heavy machine gun')
            this.scene.firerateTick = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
        }
    }

    update(time: number, delta: number): void {
        this.handleInput();
        this.rotation = -this.scene.cameras.main.rotation;
    }    

    takeDamage(damage: number): void{
        if (this.isInvulnerable){
            console.log('invulnerable')
            return;
        } 

        if (this.health <= 0){
            console.log('dead')
        }
        else{
            this.health -= damage;
            console.log('taking damage')
            this.spriteFlicker();
        }
    }

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
            yoyo: true
        });
    }

    flashWhite(): void{
        
        // set light blue tint
        this.setTint(0x1f51ff);
        



        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
    }
}