import PlayerStateName from "../enums/PlayerStateName";
import GameEntity from "./GameEntity";
import BulletGroup from "../groups/BulletGroup";
import GLOBALS from "../Globals";
export default class Player extends GameEntity {
    private SPEED: number = 500;
    private isInvulnerable: boolean = false;
    public health: number = 6;
    public totalHealth: number = 6;
    public dashCooldown: boolean = false;

    public healed: boolean = false;

    private isDashing: boolean = false;
    public isDead: boolean = false;

    private keys: any;

    private tick: number = 0;

    public firerateTick: number = GLOBALS.PISTOL_FIRERATE;

    public currentWeapon: number = 3;

    public playerBullets: BulletGroup;

    public currentCoins: number = 0;
    public potions: number = 0;

    public maxCoins: number = 10;
    public maxPotions: number = 3;

    public bonusMoveSpeed: number = 0;
    public bonusFireRate: number = 0;
    public bonusDamage: number = 0;
    public bonusDashCooldown: number = 0;
    public bonusIFrames: number = 0;

    public coinsPickedUp: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'knight');
        
        this.keys = this.scene.input.keyboard.addKeys('W, A, S, D, Q, E, X, SPACE, R, ONE, TWO, THREE, FOUR');

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
            this.move(-Math.PI / 2)
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['A'].isDown) {
            this.move(-Math.PI)
            this.flipX = true;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['S'].isDown) {
            this.move(Math.PI / 2)
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }
        if (this.keys['D'].isDown) {
            this.move();
            this.flipX = false;
            !this.anims.isPlaying && this.anims.play('knight_run', true);
        }

        // diagonal directions
        if (this.keys['D'].isDown && this.keys['W'].isDown){
            this.move(-Math.PI / 4)
        }
        if (this.keys['A'].isDown && this.keys['W'].isDown){
            this.move(-Math.PI * 3 / 4)
        }
        if (this.keys['A'].isDown && this.keys['S'].isDown){
            this.move(Math.PI * 3 / 4)
        }
        if (this.keys['D'].isDown && this.keys['S'].isDown){
            this.move(Math.PI / 4)
        }
        // change to idle animation if no keys are down
        if (this.keys['D']?.isUp && this.keys['A'].isUp && this.keys['S'].isUp && this.keys['W'].isUp) {
            !this.anims.isPlaying && this.anims.play('knight_idle', true);
        }
    }

    move(piAngle: number = 0): void {
        this.scene.physics.velocityFromRotation(-this.scene.cameras.main.rotation + piAngle, this.SPEED + this.bonusMoveSpeed, this.body.velocity)
    }

    handleDash(): void{
        if (this.keys['SPACE'].isDown){
            if (this.dashCooldown) return;

            if (this.isDashing){
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
        let originalSpeed = this.SPEED;
        let dashSpeed = (this.SPEED + this.bonusMoveSpeed) * 7.5;
        this.SPEED = dashSpeed;
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    this.SPEED = originalSpeed;
                    
                    this.isDashing = false;

                    this.clearTint();

                    this.tweenAlpha();
                }
            });
    }

    invulnerableCounter(): void {
        this.scene.time.addEvent({
            delay: 1000 + this.bonusIFrames,
            callback: () => {
                this.isInvulnerable = false;
            }
        });
    }

    // so you can't spam potions
    potionCounter(): void {
        this.scene.time.addEvent({
            delay: 10000,
            callback: () => {
                this.healed = false;
            }
        });
    }

    dashCooldownTimer(): void {
        this.scene.time.addEvent({
            delay: 5000 - this.bonusDashCooldown,
            callback: () => {
                this.flashBlue();
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
        if (this.scene.game.input.activePointer.isDown && this.tick >= this.firerateTick - this.bonusFireRate) {
            if (this.currentWeapon == 2)
                this.playerBullets.fireSpreadBullet(this, this.scene.crosshair, GLOBALS.PLAYER_BULLET_SPEED, 'player_bullet', GLOBALS.BULLET_DAMAGE + this.bonusDamage);
            else if (this.currentWeapon == 4)
                this.playerBullets.fireEightWayBullet(this, GLOBALS.PLAYER_BULLET_SPEED, 'player_bullet', GLOBALS.BULLET_DAMAGE + this.bonusDamage);
            else
                this.playerBullets.fireAimedBullet(this, this.scene.crosshair, GLOBALS.PLAYER_BULLET_SPEED, 'player_bullet', GLOBALS.BULLET_DAMAGE + this.bonusDamage);
                
            this.tick = 0;
        }
    }

    handleWeaponSwitch(): void {
        if (this.keys['ONE'].isDown) {
            this.firerateTick = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
            this.currentWeapon = 1;
            console.log('heavy machine gun');
        }
        if (this.keys['TWO'].isDown) {
            this.firerateTick = GLOBALS.SHOTGUN_FIRERATE;
            this.currentWeapon = 2;
            console.log('shotgun');
        }
        if (this.keys['THREE'].isDown) {
            this.firerateTick = GLOBALS.PISTOL_FIRERATE
            this.currentWeapon = 3;
            console.log('pistol');
        }
        if (this.keys['FOUR'].isDown) {
            this.firerateTick = GLOBALS.SHOTGUN_FIRERATE - 100;
            this.currentWeapon = 4;
            console.log('8 way');
        }
        if (this.keys['R'].isDown && this.potions > 0 && !this.healed)  {
            this.consumePotion();
        }
    }

    consumePotion(): void {
        this.scene.potionSound.play({volume: 0.5});
            this.health = 6;
            this.potions--;
            this.healed = true;
            this.potionCounter();
    }

    update(time: number, delta: number): void {
        this.tick += delta;
        this.handleMovement();
        this.handleCamera(delta);
        this.handleDash();
        this.handleShooting();
        this.handleWeaponSwitch();
        this.rotation = -this.scene.cameras.main.rotation;
    }    

    takeDamage(damage: number): void{
        if (this.isInvulnerable) return;

        this.health -= damage;

        this.isInvulnerable = true;
        this.spriteFlicker();
        this.tweenAlpha();
        this.invulnerableCounter();
        this.scene.playerHitSound.play({volume: 0.25});    

        if (this.health <= 0){
            this.isDead = true;
            this.scene.backgroundMusic.stop();
            return;
        }
    }

    addCoin(): void {
        this.currentCoins++;
        this.coinsPickedUp++;
    }

    addPotion(): void {
        this.potions++;
    }
}