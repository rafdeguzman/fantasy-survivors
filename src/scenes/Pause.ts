import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Pause extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Pause)
    }
    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let background = this.add.image(screenCenterX, screenCenterY, "bgWP")

        background.setAlpha(0.5)
        
        background.displayWidth = this.sys.canvas.width +100;
        background.displayHeight = this.sys.canvas.height +100;

        
        this.add.text(screenCenterX, screenCenterY, 'GAME PAUSED', {
            fontFamily: 'VT323',
            fontSize: '80px',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 200, 'PRESS ESC TO CONTINUE', {
            fontFamily: 'VT323',
            fontSize: '50px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
        },this)

    }
}
