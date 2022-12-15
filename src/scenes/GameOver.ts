import Phaser from 'phaser'
import Player from '../entities/Player';
import SceneKeys from '../enums/SceneKeys'
export default class GameOver extends Phaser.Scene {
    private knightSprite: Phaser.Physics.Arcade.Sprite;
    private playBtn :Phaser.GameObjects.Text;
    private knightFlipDirection: boolean = false;

    private demonSprite: Phaser.Physics.Arcade.Sprite;
    private chortSprite: Phaser.Physics.Arcade.Sprite;

    private backgroundMusic: Phaser.Sound.BaseSound;


    public player: Player;
    constructor() {
        super(SceneKeys.GameOver)
    }
    init(data: any){
        this.player = data.player;
    }
    create() {
        this.backgroundMusic = this.sound.add('gameover_music');
        this.backgroundMusic.play({
            loop: true,
            volume: 0.25
        });

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        // background
        let background = this.add.image(screenCenterX, screenCenterY, "bgMap").setScale(4);
        background.y = screenCenterY + 75

        this.knightSprite = this.physics.add.sprite(-200 , screenCenterY / 1.5, 'knight_idle_')
            .setScale(4);
        this.knightSprite.anims.create({
            key: 'knight_run',
            frames: this.anims.generateFrameNames('knight', {prefix: 'knight_run_', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.knightSprite.anims.play('knight_run', true);

        this.demonSprite = this.physics.add.sprite(-600, screenCenterY / 2 + 20, 'demon_idle_')
            .setScale(6);

        this.demonSprite.anims.create({
            key: 'demon_run',
            frames: this.anims.generateFrameNames('demon', {prefix: 'big_demon_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.demonSprite.anims.play('demon_run', true);

        this.chortSprite = this.physics.add.sprite(-400, screenCenterY / 1.5, 'chort_idle_').setScale(4);
        this.chortSprite.anims.create({
            key: 'chort_run',
            frames: this.anims.generateFrameNames('chort', {prefix: 'chort_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.chortSprite.anims.play('chort_run', true);

        this.add.text(screenCenterX, screenCenterY, 'GameOver', {
            fontFamily: 'VT323',
            fontSize: '80px',
            align: 'center',
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY + 200, 'PRESS ENTER TO CONTINUE', {
            fontFamily: 'VT323',
            fontSize: '50px',
            align: 'center',
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start(SceneKeys.HighScore, {player: this.player})
        });
    }

    knightGoLeft(): void {
        this.knightSprite.setVelocityX(-500);
        this.knightSprite.flipX = true;
    }

    knightGoRight(): void {
        this.knightSprite.setVelocityX(500);
        this.knightSprite.flipX = false;
    }

    demonGoLeft(): void {
        this.demonSprite.setVelocityX(-500);
        this.demonSprite.flipX = true;
    }

    demonGoRight(): void {
        this.demonSprite.setVelocityX(500);
        this.demonSprite.flipX = false;
    }

    demonReset(): void {
        console.log('demon reset')
        this.demonSprite.setVelocityX(0);
        this.demonSprite.flipX = false;
        this.demonSprite.body.position.x = this.chortSprite.body.position.x - 250;
    }

    chortGoRight(): void {
        this.chortSprite.setVelocityX(500);
        this.chortSprite.flipX = false;
    }

    chortGoLeft(): void {
        this.chortSprite.setVelocityX(-500);
        this.chortSprite.flipX = true;
    }

    chortReset(): void {
        console.log('chort reset')
        this.chortSprite.setVelocityX(0);
        this.chortSprite.flipX = false;
        this.chortSprite.body.position.x = this.knightSprite.body.position.x - 200;
    }
    knightReset(): void {
        console.log('knight reset')
        this.knightSprite.setVelocityX(0);
        this.knightSprite.flipX = false;
        this.knightSprite.body.position.x = -200;
        this.knightFlipDirection = false;
    }

    update(time: number, delta: number) {
        if (!this.knightFlipDirection){
            this.knightGoRight();
            this.chortGoRight();
            this.demonGoRight();
            if (this.demonSprite.body.position.x >= this.sys.canvas.width + 150){
                console.log('flip')
                this.knightFlipDirection = true;
            }
        } 
        if (this.knightFlipDirection){
            this.chortSprite.body.position.x = this.knightSprite.body.x + 200;
            this.demonSprite.body.position.x = this.knightSprite.body.x + 400;
            this.knightGoLeft();
            this.demonGoLeft();
            this.chortGoLeft();
            if (this.demonSprite.body.position.x <= - 200){
                this.knightFlipDirection = false;
                this.demonReset();
                this.knightReset();
                this.chortReset();
            }
        }
    }
}
