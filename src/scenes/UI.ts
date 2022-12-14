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
    private dBar: Phaser.GameObjects.Rectangle;
    private dBoarder: Phaser.GameObjects.Rectangle;
    private screenCenterX : number = 0;
    private screenCenterY : number = 0;

    private cBar: Phaser.GameObjects.Rectangle;
    private cBoarder: Phaser.GameObjects.Rectangle;
    private fakeCoin : number = 50;
    private fakeMaxCoin : number = 150;

    private pBar: Phaser.GameObjects.Rectangle;
    private pBoarder: Phaser.GameObjects.Rectangle;

    private timeLimit: number = 300000;
    private countDown: CountdownController;
    private timerLabel: Phaser.GameObjects.Text;
    private istweenDash: boolean = false;

    private isPotionTweening: boolean = false;

    constructor() {
        super(SceneKeys.UI)
    }
    
    init(data: any){
        this.player = data.player;
    }


    create() {
    // get the top right position of the screen
    const { width } = this.scale;
    this.screenCenterX = (this.cameras.main.worldView.x + this.cameras.main.width) / 2;
    this.screenCenterY = (this.cameras.main.worldView.y + this.cameras.main.height) / 2;
    this.x = width ;
    this.y = 70;
    this.width = 148;
    this.height = 15;

    this.add.rectangle(this.screenCenterX/2, this.y, this.width,this.height  , 0x000000);
    this.dBar= this.add.rectangle(this.screenCenterX/2, this.y, 148, this.height, 0x00FFFF); 
    this.dBoarder = this.add.rectangle(this.screenCenterX/2, this.y, this.width, this.height);
    this.dBoarder.setStrokeStyle(5, 0x000000);

    this.add.rectangle(this.screenCenterX + this.screenCenterX/2 , this.y, this.width,this.height  , 0x000000);
    this.cBar= this.add.rectangle(this.screenCenterX +this.screenCenterX/2, this.y, 148, this.height, 0xFFBF00);
    this.cBoarder = this.add.rectangle(this.screenCenterX +this.screenCenterX/2 , this.y, this.width, this.height);
    this.cBoarder.setStrokeStyle(5, 0x000000);

    this.add.rectangle(this.screenCenterX / 2, this.y * 1.25, this.width,this.height  , 0x000000);
    this.pBar= this.add.rectangle(this.screenCenterX / 2, this.y * 1.25, 148, this.height, 0xff6699);
    this.pBoarder = this.add.rectangle(this.screenCenterX / 2, this.y * 1.25, this.width, this.height);
    this.pBoarder.setStrokeStyle(5, 0x000000);
    

    // -- timer -- //
    this.timetime();
    }

    update() {
        this.fakeCoin +=0.1;
        if(this.fakeCoin >= this.fakeMaxCoin){
            this.fakeCoin = 0;
        }
        if(this.player.currentCoins <= this.player.maxCoins){
        this.cBar.width = this.player.currentCoins / this.player.maxCoins * this.width;
        }
        if(this.player.currentCoins >= this.player.maxCoins){
            this.cBar.width = this.width;
        }

        this.countDown.update();
        if(this.player.dashCooldown){
            if(!this.istweenDash){
                this.tweens.add({
                    targets: this.dBar,
                    duration: 100,
                    width: 0.1,
                    yoyo: false,
                    repeat: 0,
                    ease: 'Power0',
                    onComplete: () => {
                        this.istweenDash = true;
                        //add new tween effect
                        this.tweens.add({
                            targets: this.dBar,
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

        // tween the heal
        if(this.player.healed) {
            if(!this.isPotionTweening) {
                this.tweens.add({
                    targets: this.pBar,
                    duration: 100,
                    width: 0.1,
                    yoyo: false,
                    repeat: 0,
                    ease: 'Power0',
                    onComplete: () => {
                        this.isPotionTweening = true;
                        //add new tween effect
                        this.tweens.add({
                            targets: this.pBar,
                            duration: 9900,
                            width: 148,
                            yoyo: false,
                            repeat: 0,
                            ease: 'Power0',
                            onComplete: () => {
                                this.isPotionTweening = false;
                            }
                        });
                    },
            
                });
                this.isPotionTweening = true;
            }
        }

        this.refreshUIScene();
        this.healthStatus();
        this.potionNumber();
    }

    healthStatus() {
        let heartOffsetX = [40,0,-40];
        let heartOffsetY = 50
        let healthLeft = this.player.health;

        for (let i = 0; i < this.player.totalHealth / 2; i++) {
                if (healthLeft > 1) {
                    this.add.image(this.screenCenterX-heartOffsetX[i], this.y+heartOffsetY, 'heart');
                }
                else if (healthLeft === 1) {
                    this.add.image(this.screenCenterX-heartOffsetX[i], this.y+heartOffsetY, 'heartHalf');
                }
                else {
                    this.add.image(this.screenCenterX-heartOffsetX[i],this.y+heartOffsetY, 'heartEmpty');
                }
                healthLeft -=2 ;
        }   
                // scale all images to 1.5 
        this.children.each(function (child) {
            if (child instanceof Phaser.GameObjects.Image) {
                child.setScale(2.5);
            }
        });        
    }

    potionNumber() {
        let potionOffsetX = [-40,0,40];
        let potionOffsetY = 84

        for (let i = 0; i < this.player.potions; i++) {
            this.add.image(this.screenCenterX + potionOffsetX[i], this.y + potionOffsetY, 'health_pot');
        }

        // scale all images to 1.5
        this.children.each(function (child) {
            if (child instanceof Phaser.GameObjects.Image) {
                child.setScale(2.5);
            }
        });
    }

    refreshUIScene(): void {
        this.children.each(function (child) {
            if (child instanceof Phaser.GameObjects.Image) {
                child.destroy();
            }
        });
    }

    timetime() {
        this.timerLabel = this.add.text(this.screenCenterX-40, this.y-40, '0', { fontSize: '65px',fontFamily: 'VT323',align: 'center', fill: '#ffffff' });

        this.countDown = new CountdownController(this,this.timerLabel);
        this.countDown.start(this.handleCountdownFinished.bind(this),this.timeLimit);
    }
    
      // go to gameover state
    handleCountdownFinished() {
        this.scene.stop(SceneKeys.Game);
        this.scene.stop(SceneKeys.UI);
        this.scene.stop(SceneKeys.Pause);
        this.scene.start(SceneKeys.GameOver);
    }
}
