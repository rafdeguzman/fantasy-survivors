import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
import BulletGroup from "../groups/BulletGroup";
import GLOBALS from "../Globals";
export default class Player extends GameEntity {
    private SPEED: number = 500;
    private isInvulnerable: boolean = false;
    public health: number = 6;

    private dashCooldown: boolean = false;

    private isDashing: boolean = false;
    public isDead: boolean = false;

    private keys: any;

    private tick: number = 0;
    public firerateTick: number = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;

    public playerBullets: BulletGroup;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight');

        this.keys = this.scene.input.keyboard.addKeys('W, A, S, D, Q, E, X, SPACE, L');

        this.scene.add.existing(this);
        
        this.playerBullets = new BulletGroup(this.scene);


        this.initState();
        this.initPhysics();
        this.initAnimations();
    }

    initPhysics(){
        this.originY = 0.6
        this.body.setCircle(3);
        this.body.setOffset(5, 16);
        this.setDisplaySize(72, 112);
        this.setCollideWorldBounds(true);
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

        // cardinal directions
        if (this.keys['W'].isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI / 2, this.SPEED, this.body.velocity)
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['A'].isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI, this.SPEED, this.body.velocity)
            this.flipX = true;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['S'].isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI / 2, this.SPEED, this.body.velocity)
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['D'].isDown) {
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation, this.SPEED, this.body.velocity)
            this.flipX = false;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }

        // diagonal directions
        if (this.keys['D'].isDown && this.keys['W'].isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI / 4, this.SPEED, this.body.velocity)
        }
        if (this.keys['A'].isDown && this.keys['W'].isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation - Math.PI * 3 / 4, this.SPEED, this.body.velocity)
        }
        if (this.keys['A'].isDown && this.keys['S'].isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI * 3 / 4, this.SPEED, this.body.velocity)
        }
        if (this.keys['D'].isDown && this.keys['S'].isDown){
            this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + Math.PI / 4, this.SPEED, this.body.velocity)
        }
        // change to idle animation if no keys are down
        if (this.keys['D']?.isUp && this.keys['A'].isUp && this.keys['S'].isUp && this.keys['W'].isUp) {
            !this.anims.isPlaying && this.anims.play('knight_idle', true);
        }
    }

    handleDash(): void{
        if (this.keys['SPACE'].isDown){
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

            this.dashMovement();
            this.invulnerableCounter();
            this.dashCooldownTimer(); 
        }
    }

    dashMovement(): void {
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
    }

    invulnerableCounter(): void {
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.isInvulnerable = false;
            }
        });
    }

    dashCooldownTimer(): void {
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

    handleCamera(delta: number): void {
        if (this.keys['Q'].isDown) {
            this.scene.cameras.main.rotation += (0.0032 * delta);
        }
        if (this.keys['E'].isDown) {
            this.scene.cameras.main.rotation -= (0.0032 * delta);
        }
        if (this.keys['X'].isDown) {
            this.scene.cameras.main.rotation = 0;
        }
    }

    handleShooting(): void {
        if (this.scene.game.input.activePointer.isDown && this.tick >= this.firerateTick) {
            this.scene.gunshotSound.play({ volume: 0.1 });
            this.playerBullets.fireAimedBullet(this, this.scene.crosshair);
            this.tick = 0;
        }
    }

    update(time: number, delta: number): void {
        this.tick += delta;
        this.handleMovement();
        this.handleCamera(delta);
        this.handleDash();
        this.handleShooting();
        this.rotation = -this.scene.cameras.main.rotation;
    }    

    takeDamage(damage: number): void{
        if (this.health <= 0){
            this.isDead = true;
        }
        
        if (this.isInvulnerable) return

        else{
            this.health -= damage;
            this.isInvulnerable = true;
            this.spriteFlicker();
            this.tweenAlpha();
            this.invulnerableCounter();
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
            yoyo: true,
            onComplete: () => {
                this.alpha = 1;
            }
        });
    }

    flashWhite(): void{
        this.setTint(0x1f51ff);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
    }
}