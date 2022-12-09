import { IImageConstructor } from "../interfaces/IImage";
import GLOBALS from "../Globals";

export default class Bullet extends Phaser.GameObjects.Image {
    speed: number;
    born: number;
    direction: number;
    xSpeed: number;
    ySpeed: number;

    constructor(aParams: IImageConstructor){
        super(aParams.scene, aParams.x, aParams.y, aParams.texture = "../assets/bullets/bullet6.png", aParams.frame = 0);
        console.log(this.scene);
        // set fields
        this.speed = GLOBALS.BULLET_SPEED;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.setSize(12, 12);
    }

    fire(aShooter: Phaser.GameObjects.Sprite, aTarget: Phaser.GameObjects.Sprite){
        this.setPosition(aShooter.x, aShooter.y); // Initial position
        this.direction = Math.atan(
            (aTarget.x - this.x) / (aTarget.y - this.y)
        );
        if (aTarget.y >= this.y){
            this.direction += Math.PI;
        }
        this.xSpeed = this.speed * Math.sin(this.direction);
        this.ySpeed = this.speed * Math.cos(this.direction);
        this.rotation = this.direction + Math.PI / 2;
        this.born = 0;
    }

    update(time: number, delta: number): void {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.born += delta;
        if (this.born > 180){
            this.setActive(false);
            this.setVisible(false);
        }
    }

}