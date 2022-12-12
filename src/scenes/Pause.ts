import Phaser from 'phaser'
import SceneKeys from '../enums/SceneKeys'
export default class Pause extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Pause)
    }
    create() {

        this.add.text(100, 100, 'PAUSE', { fontSize: '32px', fill: '#fff' })
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.resume(SceneKeys.Game)
            this.scene.stop()
        })

    }
}
