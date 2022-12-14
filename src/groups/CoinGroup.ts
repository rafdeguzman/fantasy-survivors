import Coin from "../objects/Coin";
export default class CoinGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene: Phaser.Scene) {
        super(scene.physics.world, scene);
        
        this.createMultiple({
            classType: Coin,
            frameQuantity: 1,
            key: 'coin',
            active: false,
            visible: false,
        });
    }

    initOverlaps(coin: Coin) : void {
        this.scene.physics.add.overlap(this.scene.player, coin, () => {
            this.scene.player.addCoin();
            this.scene.coinSound.play({volume: 0.25});
            coin.pickup();
            coin.active = false;
            coin.visible = false;
            coin.destroy();
        });
    }

    spawnCoin(x: number, y: number): void {
        this.create(x, y);

        const coin = this.getFirstDead(false);

        this.initOverlaps(coin);

        if (coin) {
            coin.spawn(x, y);
        }
    }

    update(time: number, delta: number): void {
        this.children.each((coin: any) => {
            if (coin.active) {
                coin.update(time, delta);
            }
        });
    }
}