import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Title extends Phaser.Scene {

    private playBtn :Phaser.GameObjects.Text;
    constructor() {
        super(SceneKeys.Title);
    }

    create() {
    
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // background
        let background = this.add.image(screenCenterX, screenCenterY, "bg")
        
        background.displayWidth = this.sys.canvas.width +100;
        background.displayHeight = this.sys.canvas.height +100;

        this.tweens.add({
            targets: background,
            displayWidth: 50+ this.sys.canvas.width,
            displayHeight: 50 + this.sys.canvas.height,
            duration: 2000,
            ease: 'Power2',
            yoyo: true,
            repeat: -1
        });
         
    
        this.add.text(screenCenterX, screenCenterY, ' DUNGEON \nSURVIVORS', {
            fontFamily: 'VT323',
            fontSize: '70px',
            align: 'center'
        }).setOrigin(0.5);

        this.playBtn=this.add.text(screenCenterX, screenCenterY + 175, 'Play', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            //add fade effect
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start(SceneKeys.Game);
            })
        });

        this.add.text(screenCenterX, screenCenterY + 250, 'How to play', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

    }

    update() {
        let playTmp= this.playBtn;

        this.playBtn.setAlpha(Math.abs(Math.sin(this.time.now/100)));
        this.playBtn.on('pointerover', function (pointer) {
            playTmp.setScale(1.5);
        })
        this.playBtn.on('pointerout', function (pointer) {
            playTmp.setScale(1);
        })
    }
}
