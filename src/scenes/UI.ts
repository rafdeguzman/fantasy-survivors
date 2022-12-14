import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
import CountdownController from './CountdownController'
import Player from '../entities/Player'
export default class UI extends Phaser.Scene {
    public player: Player;

    private timeLimit: number = 300000;
    private countDown: CountdownController;
    private timerLabel: Phaser.GameObjects.Text;
    constructor() {
        super(SceneKeys.UI)
    }
    
    init(data){
        
        console.log(data.player.health);
        this.player = data.player;
    }


    create() {
    // -- health -- //
    //add the health
    
    // -- timer -- //
    this.timetime();
    }

    update() {
        this.countDown.update();
        console.log(this.player.health)
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
                    this.add.image(150, 70, 'heart');
                    this.add.image(200, 70, 'heart');
                    this.add.image(250, 70, 'heart');
                    break;
                case 5:
                    this.add.image(150, 70, 'heart');
                    this.add.image(200, 70, 'heart');
                    this.add.image(250, 70, 'heartHalf');
                    break;
                case 4:
                    this.add.image(150, 70, 'heart');
                    this.add.image(200, 70, 'heart');
                    this.add.image(250, 70, 'heartEmpty');
                    break;
                case 3:
                    this.add.image(150, 70, 'heart');
                    this.add.image(200, 70, 'heartHalf');
                    this.add.image(250, 70, 'heartEmpty');
                    break;
                case 2:
                    this.add.image(150, 70, 'heart');
                    this.add.image(200, 70, 'heartEmpty');
                    this.add.image(250, 70, 'heartEmpty');
                    break;
                case 1:
                    this.add.image(150, 70, 'heartHalf');
                    this.add.image(200, 70, 'heartEmpty');
                    this.add.image(250, 70, 'heartEmpty');
                    break;
                case 0:
                    this.add.image(150, 70, 'heartEmpty');
                    this.add.image(200, 70, 'heartEmpty');
                    this.add.image(250, 70, 'heartEmpty');
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
