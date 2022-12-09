import { ISpriteConstructor } from "../interfaces/sprite.interface";
import { Bullet } from "../objects/bullet";
export class Player extends Phaser.GameObjects.Sprite {
    readonly SPEED: number = 800;

    declare body: Phaser.Physics.Arcade.Body;

    private shootKey: Phaser.Input.Keyboard.Key;

    private bullets: Bullet[];
    private isShooting: boolean;
    public getBullets(){
        return this.bullets;
    }

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
        this.body.setCollideWorldBounds(true);

        this.bullets = [];
        this.isShooting = false;

        this.shootKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
    
    private shoot(): void {
        this.bullets.push(
            new Bullet({
                scene: this.scene,
                x: this.x,
                y: this.y,
        )


}