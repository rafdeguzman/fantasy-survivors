import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Title extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Title);
    }

    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
                
    
       // this.physics.add.sprite(screenCenterX, screenCenterY - 90, 'player').setScale(0.6);
        this.add.text(screenCenterX, screenCenterY, ' DUNGEON \nSURVIVORS', {
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 200, 'Play', {
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.scene.start(SceneKeys.Game);
        });

        this.add.text(screenCenterX, screenCenterY + 250, 'How to play', {
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

    }

    update() {
    }


}
