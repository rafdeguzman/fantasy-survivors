import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Win extends Phaser.Scene {
    private backgroundMusic: Phaser.Sound.BaseSound;
    public player: any;
    private knightSprite: Phaser.Physics.Arcade.Sprite;
    constructor() {
        super(SceneKeys.Win)
    }
    init(data: any){
        this.player = data.player;
    }

    create() {
        this.backgroundMusic = this.sound.add('victory_music');
        this.backgroundMusic.play({
            loop: true,
            volume: 0.25
        });
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2

        let background = this.add.image(screenCenterX, screenCenterY, "bgMap").setScale(4);
        background.y = screenCenterY + 75
        
        this.knightSprite = this.physics.add.sprite(screenCenterX, screenCenterY / 1.5, 'knight_idle_')
            .setScale(4);
        this.knightSprite.anims.create({
            key: 'knight_idle',
            frames: this.anims.generateFrameNames('knight', {prefix: 'knight_idle_', start: 0, end: 6}),
            frameRate: 10,
            repeat: -1
        });
        this.knightSprite.anims.play('knight_idle', true);
        
        this.add.text(screenCenterX, screenCenterY, 'Victory', {
            fontFamily: 'VT323',
            fontSize: '80px',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 200, 'PRESS ENTER TO CONTINUE', {
            fontFamily: 'VT323',
            fontSize: '50px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.backgroundMusic.stop();
            this.scene.start(SceneKeys.HighScore, {player: this.player})
        });
    }
}
