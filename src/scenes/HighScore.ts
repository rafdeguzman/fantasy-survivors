import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class HighScore extends Phaser.Scene {

    private score: number;
    private name: string;
    private highScore: any;
    private highScoreArray: any;
    constructor() {
        super(SceneKeys.HighScore)
    }
    create() {

        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let background = this.add.image(screenCenterX, screenCenterY, "bgWP")

        background.setAlpha(0.5)
        
        background.displayWidth = this.sys.canvas.width +100;
        background.displayHeight = this.sys.canvas.height +100;

        let textEntryTitle = this.add.text(screenCenterX, screenCenterY , 'Enter your name:', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);


        //let textEntry = this.add.text(10, 50, '', { font: '32px Courier', });
        let textEntry = this.add.text(screenCenterX, screenCenterY +50 , '', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown', function (event) {
    
            // limit the name to 10 characters
            if (textEntry.text.length < 8)
            {
            if (event.keyCode === 8 && textEntry.text.length > 0)
            {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90))
            {
                textEntry.text += event.key;
            }
        }
        });

        this.input.keyboard.on('keydown-ENTER', () => {
            //get the high score array from local storage
            this.highScoreArray = JSON.parse(localStorage.getItem('highScoreArray'));
            this.score = Math.floor(Math.random() * 1000);
            this.name = textEntry.text;
            if(this.name.length > 0){
                //slap the new score on the end of the array
                this.highScoreArray.push({score: this.score, name: textEntry.text});

                //sort the array
                this.highScoreArray.sort(function(a, b) {
                    return b.score - a.score;
                });
                // let the array be no longer than 5
                this.highScoreArray = this.highScoreArray.slice(0, 5);

                //save the array back to local storage
                localStorage.setItem('highScoreArray', JSON.stringify(this.highScoreArray));
            }
        }
        ,this)
    }

}