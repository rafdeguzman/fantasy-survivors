import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Upgrade extends Phaser.Scene {

    //make all the private variables for the btn
    private increase_speed_btn:Phaser.GameObjects.Text
    private increase_firerate_btn:Phaser.GameObjects.Text
    private increase_damage_btn:Phaser.GameObjects.Text
    

    constructor() {
        super(SceneKeys.Upgrade)
    }
    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        let background = this.add.image(screenCenterX, screenCenterY, "bgWP")

        background.setAlpha(0.5)
        
        background.displayWidth = this.sys.canvas.width +100;
        background.displayHeight = this.sys.canvas.height +100;
        
        this.add.text(screenCenterX, screenCenterY - 200, 'UPGRADES', {
            fontFamily: 'VT323',
            fontSize: '80px',
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(screenCenterX, screenCenterY - 150, 'Choose your upgrade!', {
            fontFamily: 'VT323',
            fontSize: '30px',
            align: 'center'
        }).setOrigin(0.5);

        // speed upgrade

        let rectC = this.add.image(0, 0, 'cardbg')

        let increase_speed_title = this.add.text(0, -50, 'Increase\nSpeed', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.increase_speed_btn = this.add.text(0, 60, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            // speed upgrade

            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
            });
        let textC = this.add.container(0,0, [increase_speed_title, this.increase_speed_btn]).setScale(2);
        let cardC = this.add.container(screenCenterX, screenCenterY+50, [rectC,textC]).setScale(0.75);

        // firerate upgrade

        let rectR = this.add.image(0, 0, 'cardbg');

        let increase_firerate_title = this.add.text(0, -50, 'Increase\nFire Rate', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.increase_firerate_btn = this.add.text(0, 60, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
        
            // increase firerate
            
            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
            });
        let textR = this.add.container(0,0, [increase_firerate_title, this.increase_firerate_btn]).setScale(1.75);
        let cardR = this.add.container(screenCenterX + 350, screenCenterY+50, [rectR, textR]).setScale(0.75);
        
        // damage upgrade

        let rectL = this.add.image(0, 0, 'cardbg');

        let increase_damage_title = this.add.text(0, -50, 'Increase\nDamage', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        this.increase_damage_btn = this.add.text(0, 60, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            // increase damage

            this.scene.resume(SceneKeys.Game)
            this.scene.resume(SceneKeys.UI)
            this.scene.stop()
            });

        let textL = this.add.container(0,0, [increase_damage_title, this.increase_damage_btn]).setScale(1.75);
        let cardL = this.add.container(screenCenterX - 350, screenCenterY+50, [rectL,textL]).setScale(0.75);
    }
    update() {
        let increase_speed_btn_tmp = this.increase_speed_btn
        let increase_firerate_btn_tmp = this.increase_firerate_btn
        let increase_damage_btn_tmp = this.increase_damage_btn

        // speed upgrade button
        this.increase_speed_btn.on('pointerover', function () {
            increase_speed_btn_tmp.setScale(1.5);
        })

        this.increase_speed_btn.on('pointerout', function () {
            increase_speed_btn_tmp.setScale(1);
        })

        // firerate  upgrade button
        this.increase_firerate_btn.on('pointerover', function () {
            increase_firerate_btn_tmp.setScale(1.5);
        })

        this.increase_firerate_btn.on('pointerout', function () {
            increase_firerate_btn_tmp.setScale(1);
        })

        // damage upgrade button
        this.increase_damage_btn.on('pointerover', function () {
            increase_damage_btn_tmp.setScale(1.5);
        })

        this.increase_damage_btn.on('pointerout', function () {
            increase_damage_btn_tmp.setScale(1);
        })

    }
}