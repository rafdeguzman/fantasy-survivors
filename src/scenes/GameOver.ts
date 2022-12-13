import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class GameOver extends Phaser.Scene {
    constructor() {
        super(SceneKeys.GameOver)
    }
    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        
        this.add.text(screenCenterX, screenCenterY, 'GameOver', {
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 200, 'PRESS ENTRE TO CONTINUE', {
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start(SceneKeys.Title)
        });
    }
}
