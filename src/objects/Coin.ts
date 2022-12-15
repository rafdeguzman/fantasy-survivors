import GameItem from "./GameItem";

export default class Coin extends GameItem {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'coin');
    }

    initSprite(): void {
        this.setDisplaySize(32, 32);
        this.setOrigin(0.5, 0.5);
        this.body.setSize(16, 16);
    }

    initAnimations(): void {
        this.scene.anims.create({
            key: 'coin_spin',
            frames: this.scene.anims.generateFrameNames('coin', { prefix: 'coin_anim_f', start: 0, end: 3 }),
            frameRate: 10,
        });
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
        !this.anims.isPlaying && this.anims.play('coin_spin', true);
    }

    pickup(): void {
        super.pickup();
        this.scene.player.addCoin();
        this.scene.coinSound.play({volume: 0.25});
    }
}