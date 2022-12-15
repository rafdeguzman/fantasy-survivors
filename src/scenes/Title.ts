import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Title extends Phaser.Scene {

    private knightSprite: Phaser.Physics.Arcade.Sprite;
    private playBtn :Phaser.GameObjects.Text;
    private knightFlipDirection: boolean = false;

    private demonSprite: Phaser.Physics.Arcade.Sprite;
    private chortSprite: Phaser.Physics.Arcade.Sprite;


    private backgroundMusic: Phaser.Sound.BaseSound;

    constructor() {
        super(SceneKeys.Title);
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.backgroundMusic = this.sound.add('title_music');
        this.backgroundMusic.play({
            loop: true,
            volume: 0.25
        });

        // background
        let background = this.add.image(screenCenterX, screenCenterY, "bgMap");
        
        this.knightSprite = this.physics.add.sprite(-200 , screenCenterY / 1.5, 'knight_idle_')
            .setScale(4);
        this.knightSprite.anims.create({
            key: 'knight_run',
            frames: this.anims.generateFrameNames('knight', {prefix: 'knight_run_', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.knightSprite.anims.play('knight_run', true);

        this.demonSprite = this.physics.add.sprite(this.sys.canvas.width + 300, screenCenterY / 2 + 20, 'demon_idle_')
            .setScale(6);

        this.demonSprite.anims.create({
            key: 'demon_run',
            frames: this.anims.generateFrameNames('demon', {prefix: 'big_demon_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.demonSprite.anims.play('demon_run', true);

        this.chortSprite = this.physics.add.sprite(-25, screenCenterY / 1.5, 'chort_idle_').setScale(4);
        this.chortSprite.anims.create({
            key: 'chort_run',
            frames: this.anims.generateFrameNames('chort', {prefix: 'chort_run_anim_f', start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.chortSprite.anims.play('chort_run', true);

        
        background.displayWidth = this.sys.canvas.width + 500;
        background.displayHeight = this.sys.canvas.height + 500;
    
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
                this.backgroundMusic.stop();
                this.scene.start(SceneKeys.Game);
            });
        });

        this.add.text(screenCenterX, screenCenterY + 250, 'How to play', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

    }

    knightGoLeft(): void {
        this.knightSprite.setVelocityX(-500);
        this.knightSprite.flipX = true;
    }

    knightGoRight(): void {
        this.knightSprite.setVelocityX(250);
        this.knightSprite.flipX = false;
    }

    demonGoLeft(): void {
        this.demonSprite.setVelocityX(-400);
        this.demonSprite.flipX = true;
    }

    demonReset(): void {
        console.log('demon reset')
        this.demonSprite.setVelocityX(0);
        this.demonSprite.flipX = false;
        this.demonSprite.body.position.x = this.sys.canvas.width + 300;
    }

    chortGoRight(): void {
        this.chortSprite.setVelocityX(250);
        this.chortSprite.flipX = false;
    }

    chortReset(): void {
        console.log('chort reset')
        this.chortSprite.setVelocityX(0);
        this.chortSprite.flipX = false;
        this.chortSprite.body.position.x = -25;
    }

    knightReset(): void {
        console.log('knight reset')
        this.knightSprite.setVelocityX(0);
        this.knightSprite.flipX = false;
        this.knightSprite.body.position.x = -200;
        this.knightFlipDirection = false;
    }
    update(time: number, delta: number) {
        // this.physics.moveTo(this.knightSprite, this.input.activePointer.x, this.input.activePointer.y, 100)

        if (!this.knightFlipDirection){
            this.knightGoRight();
            this.chortGoRight();
            if (this.knightSprite.body.position.x >= this.sys.canvas.width + 90){
                this.knightFlipDirection = true;
            }
        } 
        if (this.knightFlipDirection){
            console.log(this.demonSprite.body.position.x)
            this.knightGoLeft();
            this.demonGoLeft();
            if (this.demonSprite.body.position.x <= - 300){
                this.knightFlipDirection = false;
                this.demonReset();
                this.knightReset();
                this.chortReset();
            }
        }
        
        


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
