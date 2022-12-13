import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
export default class Player extends GameEntity {
    private SPEED: number = 500;
    private isInvulnerable: boolean = false;
    private health: number = 100;

    private dashCooldown: boolean = false;

    private isDashing: boolean = false;


    private keys: any;
    private mouseDown: Phaser.Input.Pointer;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight');

        this.keys = this.scene.input.keyboard.addKeys('W, A, S, D, Q, E, X, SPACE');
        this.mouseDown = this.scene.input.activePointer;

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

    handleMovement(): void {
        this.body.setVelocity(0);



    }

    handleInput(): void {
        
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

            this.dashCooldown = true;

            this.isDashing = true;
            this.isInvulnerable = true;

            this.setTint(0x36454f);
            this.scene.dodgeSound.play({volume: 0.5});

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
                    this.scene.dodgeCdSound.play({volume: 0.5});
                }
            });
        }
        // if no key is down
        if (this.keyD?.isUp && this.keyA?.isUp && this.keyS?.isUp && this.keyW?.isUp) {
            !this.anims.isPlaying && this.anims.play('knight_idle', true);
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
            this.scene.playerHitSound.play({volume: 0.25});
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