import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
import CountdownController from './CountdownController'
import Player from '../entities/Player'
export default class UI extends Phaser.Scene {
    public player: Player;
    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private rBar: Phaser.GameObjects.Rectangle;
    private rBack: Phaser.GameObjects.Rectangle;
    private rBoarder: Phaser.GameObjects.Rectangle;

    private timeLimit: number = 300000;
    private countDown: CountdownController;
    private timerLabel: Phaser.GameObjects.Text;
    private istweenDash: boolean = false;
    constructor() {
        super(SceneKeys.UI)
    }
    
    init(data){
        
        console.log(data.player.health);
        this.player = data.player;
    }


    create() {
    // get the top right position of the screen
    const { width } = this.scale;
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.x = width ;
    this.y = 70;
    this.width = 148;
    this.height = 15;

    this.rBack = this.add.rectangle(screenCenterX, this.y, this.width,this.height  , 0x000000);
    this.rBar= this.add.rectangle(screenCenterX, this.y, 148, this.height, 0xff6699);
    this.rBoarder = this.add.rectangle(screenCenterX, this.y, this.width, this.height);

    this.rBoarder.setStrokeStyle(5, 0x000000);

    // -- timer -- //
    this.timetime();
    }

    update() {
        this.countDown.update();
        if(this.player.dashCooldown){
            if(!this.istweenDash){
                console.log("tweens")
                this.tweens.add({
                    targets: this.rBar,
                    duration: 100,
                    width: 0.1,
                    yoyo: false,
                    repeat: 0,
                    ease: 'Power0',
                    onComplete: () => {
                        console.log("tweens callback")
                        this.istweenDash = true;
                        //add new tween effect
                        this.tweens.add({
                            targets: this.rBar,
                            duration: 4900,
                            width: 148,
                            yoyo: false,
                            repeat: 0,
                            ease: 'Power0',
                            onComplete: () => {
                                this.istweenDash = false;
                            }
                        });
                    },
            
                });
                this.istweenDash = true;
            }
        }
        this.healthStatus();
        
    }
    healthStatus() {

        //remove all images
        this.children.each(function (child) {
            if (child instanceof Phaser.GameObjects.Image) {
                child.destroy();
            }
        });

            switch (this.player.health) {
                case 6:
                    this.add.image(this.x-250, this.y, 'heart');
                    this.add.image(this.x-200, this.y, 'heart');
                    this.add.image(this.x-150, this.y, 'heart');
                    break;
                case 5:
                    this.add.image(this.x-250, this.y, 'heart');
                    this.add.image(this.x-200, this.y, 'heart');
                    this.add.image(this.x-150, this.y, 'heartHalf');
                    break;
                case 4:
                    this.add.image(this.x-250, this.y, 'heart');
                    this.add.image(this.x-200, this.y, 'heart');
                    this.add.image(this.x-150, this.y, 'heartEmpty');
                    break;
                case 3:
                    this.add.image(this.x-250, this.y, 'heart');
                    this.add.image(this.x-200, this.y, 'heartHalf');
                    this.add.image(this.x-150, this.y, 'heartEmpty');
                    break;
                case 2:
                    this.add.image(this.x-250, this.y, 'heart');
                    this.add.image(this.x-200, this.y, 'heartEmpty');
                    this.add.image(this.x-150, this.y, 'heartEmpty');
                    break;
                case 1:
                    this.add.image(this.x-250, this.y, 'heartHalf');
                    this.add.image(this.x-200, this.y, 'heartEmpty');
                    this.add.image(this.x-150, this.y, 'heartEmpty');
                    break;
                case 0:
                    this.add.image(this.x-250, this.y, 'heartEmpty');
                    this.add.image(this.x-200, this.y, 'heartEmpty');
                    this.add.image(this.x-150, this.y, 'heartEmpty');
                    break;
                default:
                break;
        }   
                // scale all images to 1.5 
                this.children.each(function (child) {
                    if (child instanceof Phaser.GameObjects.Image) {
                        child.setScale(2.5);
                    }
                });
    }

    timetime() {
        this.timerLabel = this.add.text(50, 50, '0', { fontSize: '32px' });

        this.countDown = new CountdownController(this,this.timerLabel);
        this.countDown.start(this.handleCountdownFinished.bind(this),this.timeLimit);
    
      }
    
      handleCountdownFinished() {
        this.scene.stop(SceneKeys.Game);
        this.scene.stop(SceneKeys.UI);
        this.scene.stop(SceneKeys.Pause);
        this.scene.start(SceneKeys.Win);
      }
}
