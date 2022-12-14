import BulletGroup from "../groups/BulletGroup";
import Bullet from "../objects/Bullet";
import GameEntity from "./GameEntity";
import GLOBALS from "../Globals";

export default class Enemy extends GameEntity{
    declare body: Phaser.Physics.Arcade.Body;
    private health: number;
    readonly SPEED: number = 100;
    public readonly scene: Phaser.Scene;
    private maxHealth: number;

    public enemyBullets: BulletGroup;
    public firerateTick = 0;

    constructor({
        scene,
        x,
        y,
        texture,
        frame,
        maxHealth
    })
    {
        super(scene, x, y, texture, frame);
        
        this.maxHealth = maxHealth;
        
        this.scene = scene;

        this.initPhysics();
        this.initSprite();
        this.initAnimations();

        this.enemyBullets = new BulletGroup(scene);
    }

    initPhysics(): void{
        this.scene.physics.add.existing(this);
        this.scene.physics.world.disable(this);
    }

    takeDamage(damage: number): void {
        this.health -= damage;
        this.scene.enemyHitSound.play({volume: 0.5});
        this.spriteFlicker();
        if (this.health <= 0) {
            this.onDeath();
            this.destroy();
        }
    }
    
    spawn(x: number, y: number): void {
        this.health = this.maxHealth;

        this.scene.physics.world.enable(this);
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.initSprite();
    }

    dropCoin(): void {
        if (Math.random() < 0.2)

        this.scene.coinGroup.spawnCoin(this.x, this.y);
    }

    destroy(): void {
        this.dropCoin();
        this.scene.physics.world.disable(this);
        this.setActive(false);
        this.setVisible(false);
    }

    // to override for specific enemies
    onDeath(): void {
        
    }

    // to override for all enemies
    initSprite(): void{
        
    }

    // to override for all enemies
    initAnimations(): void{

    }

    // call from child classes, moves enemy towards player &&
    // update the firerate tick
    update(time: number, delta: number): void {
        this.firerateTick += delta;

        this.scene.physics.moveToObject(this, this.scene.player, this.SPEED);

        if (this.body.velocity.x > 0) { // walking right, facing rght
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {  // walking left, facing left
            this.setFlipX(true);
        } 
        
        this.rotation = -this.scene.cameras.main.rotation;
    }
}