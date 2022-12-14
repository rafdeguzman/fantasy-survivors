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

        let rectC = this.add.image(0, 0, 'cardbg');

        let increase_speed_title = this.add.text(0, -100, 'Increase\nSpeed', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        let increase_speed_description = this.add.text(0, 0, 'Increases player\nvelocity by 5', {
            fontFamily: 'VT323',
            fontSize: '15px',
            align: 'center',
            wordWrap: { width: 200, useAdvancedWrap: true }
            
        }).setOrigin(0.5);

        this.increase_speed_btn = this.add.text(0, 120, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
            });

        let cardC = this.add.container(screenCenterX, screenCenterY, [rectC, increase_speed_title, increase_speed_description, this.increase_speed_btn]);

        // firerate upgrade

        let rectR = this.add.image(0, 0, 'cardbg');

        let increase_firerate_title = this.add.text(0, -100, 'Increase\nFire Rate', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        let increase_firerate_description = this.add.text(0, 0, 'Increases fireate\nby 0.3', {
            fontFamily: 'VT323',
            fontSize: '15px',
            align: 'center',
            wordWrap: { width: 200, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.increase_firerate_btn = this.add.text(0, 120, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
            });

        let cardR = this.add.container(screenCenterX + 350, screenCenterY, [rectR, increase_firerate_title, increase_firerate_description, this.increase_firerate_btn]);
        
        // damage upgrade

        let rectL = this.add.image(0, 0, 'cardbg');

        let increase_damage_title = this.add.text(0, -100, 'Increase\nDamage', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5);

        let increase_damage_description = this.add.text(0, 0, 'Increases bullet \ndamage by 0.3', {
            fontFamily: 'VT323',
            fontSize: '15px',
            align: 'center',
            wordWrap: { width: 200, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.increase_damage_btn = this.add.text(0, 120, 'UPGRADE', {
            fontFamily: 'VT323',
            fontSize: '20px',
            align: 'center'
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            this.scene.resume(SceneKeys.UI)
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
            });

        let cardL = this.add.container(screenCenterX - 350, screenCenterY, [rectL, increase_damage_title, increase_damage_description, this.increase_damage_btn,]);
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