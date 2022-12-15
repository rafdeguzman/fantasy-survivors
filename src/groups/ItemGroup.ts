import Coin from "../objects/Coin";
import GameObject from "../objects/GameItem";
export default class ItemGroup extends Phaser.Physics.Arcade.Group {
    private entity: Function;
    public itemType: string;
    constructor(scene: Phaser.Scene, entity: Function, itemType: string) {
        super(scene.physics.world, scene);
        
        this.createMultiple({
            classType: entity,
            frameQuantity: 1,
            key: itemType,
            active: false,
            visible: false,
        });

        this.entity = entity;
        this.itemType = itemType;
    }

    initOverlaps(item: GameObject) : void {
        this.scene.physics.add.overlap(this.scene.player, item, () => {
            item.pickup();
        });
    }

    spawnItem(x: number, y: number): void {
        this.create(x, y, this.itemType, 0, false, false);

        const item = this.getFirstDead(false);

        this.initOverlaps(item);

        if (item) {
            item.spawn(x, y);
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