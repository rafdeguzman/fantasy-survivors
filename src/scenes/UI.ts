import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
import CountdownController from './CountdownController'
export default class UI extends Phaser.Scene {

    private countDown: CountdownController;
    private timerLabel: Phaser.GameObjects.Text;
    constructor() {
        super(SceneKeys.UI)
    }
    
    init(data){
        console.log(data);
    }


    create() {

    // -- timer -- //
    this.timetime();
    }

    update() {
        this.countDown.update();
    }

    timetime() {
        this.timerLabel = this.add.text(50, 50, '0', { fontSize: '32px' });
        this.countDown = new CountdownController(this,this.timerLabel,);
        this.countDown.start(this.handleCountdownFinished.bind(this),1000);
    
      }
    
      handleCountdownFinished() {
        this.scene.stop(SceneKeys.Game);
        this.scene.stop(SceneKeys.UI);
        this.scene.stop(SceneKeys.Pause);
        this.scene.start(SceneKeys.Win);
      }
}
