import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class HighScore extends Phaser.Scene {

    private score: number;
    private name: string;
    private highScore: any;
    private highScoreArray: any;
    private screenCenterX : number = 0;
    private screenCenterY : number = 0;
    constructor() {
        super(SceneKeys.HighScore)
    }
    init(data: any){
        this.score = data.player.coinsPickedUp;
    }
    create() {
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        let background = this.add.image(this.screenCenterX, this.screenCenterY, "bgWP")

        background.setAlpha(0.5)
        
        background.displayWidth = this.sys.canvas.width +100;
        background.displayHeight = this.sys.canvas.height +100;

        let textEntryTitle = this.add.text(this.screenCenterX,this.screenCenterY , 'Enter your name:', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);


        //let textEntry = this.add.text(10, 50, '', { font: '32px Courier', });
        let textEntry = this.add.text(this.screenCenterX, this.screenCenterY +50 , '', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.on('keydown', function (event) {

            //limit the number of characters
            if (textEntry.text.length < 3) {
            // let user input only letters
                if (event.keyCode >= 65 && event.keyCode <= 90) {
                    textEntry.text += event.key;
                }
            }

            // let user remove letters
            if (event.keyCode == 8 && textEntry.text.length > 0) {
                textEntry.text = textEntry.text.substr(0, textEntry.text.length - 1);
            }


        });

        this.input.keyboard.on('keydown-ENTER', () => {
            //get the high score array from local storage
            this.highScoreArray = JSON.parse(localStorage.getItem('highScoreArray'));
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

                //disable keyboard input
                this.input.keyboard.removeAllListeners('keydown');
                this.input.keyboard.removeAllListeners('keydown-ENTER');
                // expect the escape key to be pressed
                this.input.keyboard.on('keydown-ESC', () => {
                    this.scene.start(SceneKeys.Title)
                });
            
                //set the all current text to invisible
                textEntryTitle.visible = false;
                textEntry.visible = false;

                this.showRanking();
            }
        }
        ,this)
    }

    showRanking(){
        //get the high score array from local storage
        this.highScoreArray = JSON.parse(localStorage.getItem('highScoreArray'));
        

        console.log(this.highScoreArray)
        let rectangleBg = this.add.image(0, 200, 'cardbg').setScale(3,2)

        //create the text object
        let highScoreText = this.add.text(0,0, 'High Score', {
            fontFamily: 'VT323',
            fontSize: '40px',
            align: 'center'
        }).setOrigin(0.5)


        let scoreTitle = this.add.text(-100, 50, 'Score', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        let playerNameTitle = this.add.text(100, 50, 'Play', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5)

        let textC = this.add.container(0,0, [scoreTitle,playerNameTitle,highScoreText]).setScale(2);

        let leaderBoard = this.labelGenerator();

        let leaderBoardContainer = this.add.container(this.screenCenterX, this.screenCenterY-250, [rectangleBg,textC,leaderBoard])
    
        this.add.text(this.screenCenterX, 50 , 'PRESS ESC TO CONTINUE', {
            fontFamily: 'VT323',
            fontSize: '50px',
            align: 'center'
        }).setOrigin(0.5);

    }
            //create label generator
            labelGenerator(){
                let labelContainer = this.add.container(0,0).setScale(2);
                
                for (let i = 0; i < this.highScoreArray.length; i++) {
                    let score = this.add.text(-100, 100 + (i * 35), this.highScoreArray[i].score, {
                        fontFamily: 'VT323',
                        fontSize: '20px',
                        align: 'center'
                    }).setOrigin(0.5);
                    let name = this.add.text(100, 100 + (i * 35), this.highScoreArray[i].name, {
                        fontFamily: 'VT323',
                        fontSize: '20px',
                        align: 'center'
                    }).setOrigin(0.5);
                    labelContainer.add([score,name])
                }
                return labelContainer;
    }   

}