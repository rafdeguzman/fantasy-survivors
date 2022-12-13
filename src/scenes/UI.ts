import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
import CountdownController from './CountdownController'
import Player from '../entities/Player'
export default class UI extends Phaser.Scene {
    public player: Player;
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
        //healthStatus();
    }
    healthStatus() {
            switch (this.player.health) {
                case 5:
                    this.add.image(50, 50, 'health');
                    break;
                case 4:
                    this.add.image(50, 50, 'health4');
                    break;
                case 3:
                    this.add.image(50, 50, 'health3');
                    break;
                case 2:
                    this.add.image(50, 50, 'health2');
                    break;
                case 1:
                    this.add.image(50, 50, 'health1');
                    break;
                case 0:
                    break;
        }   
    }

    timetime() {
        this.timerLabel = this.add.text(50, 50, '0', { fontSize: '32px' });
        this.countDown = new CountdownController(this,this.timerLabel);
        this.countDown.start(this.handleCountdownFinished.bind(this));
    
      }
    
      handleCountdownFinished() {
        this.scene.stop(SceneKeys.Game);
        this.scene.stop(SceneKeys.UI);
        this.scene.stop(SceneKeys.Pause);
        this.scene.start(SceneKeys.Win);
      }
}
