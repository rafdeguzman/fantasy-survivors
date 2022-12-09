import { ISpriteConstructor } from "../interfaces/ISprite";
import PlayerStateName from "../enums/PlayerStateName";
import { Bullet } from "../objects/Bullet";

export class Player extends Phaser.GameObjects.Sprite {
    readonly SPEED: number = 800;

    declare body: Phaser.Physics.Arcade.Body;

    playerBullets: Phaser.Physics.Arcade.Group;

    bullet: Bullet;

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
        this.initBullets();
        this.initMouseInput();

    }

    initBullets(): void{
        this.bullet = new Bullet({ scene: this.scene, x: 0, y: 0, texture: '/assets/bullets/bullet6.png', frame: 0 })
        this.playerBullets = this.scene.physics.add.group({ classType: Bullet, runChildUpdate: true });
    }

    initMouseInput(): void{
        this.scene.input.on('pointerdown',  (pointer: Phaser.Input.Pointer, time: number, lastFired: number) => {
            // Get bullet from bullets group
            var bullet = this.playerBullets.get().setActive(true).setVisible(true);
    
            if (bullet)
            {
                console.log('fired!');
                bullet.fire(this, pointer);
                // this.physics.add.collider(enemy, bullet, enemyHitCallback);
            }
        }, this.scene);
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
        });
        this.movementKeys.down.on('down', () => {
            this.body.setVelocityY(this.SPEED);
        });
        this.movementKeys.left.on('down', () => {
            this.body.setVelocityX(-this.SPEED);
        });
        this.movementKeys.right.on('down', () => {
            this.body.setVelocityX(this.SPEED);
        });

        if (this.movementKeys.up.isUp && this.movementKeys.down.isUp) {
            this.body.setVelocityY(0);
        }   
        if (this.movementKeys.left.isUp && this.movementKeys.right.isUp) {
            this.body.setVelocityX(0);
        }
    }

    update(): void {
        this.handleInput();

    }    
}