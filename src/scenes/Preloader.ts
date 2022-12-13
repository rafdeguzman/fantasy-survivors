import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Preloader)
    }

    preload() {
        this.load.atlas('knight', './assets/knight/knight.png', './assets/knight/knight.json'); // atlas
    
        this.load.atlas('orc', './assets/orc/orc.png', './assets/orc/orc.json'); // atlas
    
        this.load.image('bullet', './assets/bullets/bullet.png');
        this.load.image('background', './assets/skies/underwater1.png');
        this.load.image('map', './assets/map/map.png');

        this.load.image('crosshair', './assets/crosshair/crosshair.png');
        this.load.image('healthBar', './assets/healthBar/healthBar.png');

        //ref:https://www.artstation.com/artwork/QrYv8E
        this.load.image('bg', './assets/title/bg.jpeg');

        //--Heart--//
        this.load.image('heart', './assets/hearts/ui_heart_full.png');
        this.load.image('heartEmpty', './assets/hearts/ui_heart_empty.png');
        this.load.image('heartHalf', './assets/hearts/ui_heart_half.png');

        this.load.audio('music', './assets/sound/music/abc.mp3');  // abc polyphia 8bit ver

    
        this.load.audio('playerHit', './assets/sound/playerHit.wav');
        this.load.audio('gunShot', './assets/sound/gunShot.wav');
        this.load.audio('enemyHit', './assets/sound/enemyHit.wav');
        this.load.audio('pickup', './assets/sound/pickup.wav');
        this.load.audio('dodge', './assets/sound/dodge.wav')
        this.load.audio('dodgeCd', './assets/sound/dodgeBack.wav')
    
        this.load.image('map2', './assets/map/map3.png');
    }

    create() {
        this.scene.start(SceneKeys.Title)
    }
}
