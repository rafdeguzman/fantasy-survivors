import GameItem from "./GameItem";

export default class Potion extends GameItem {
    declare body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'health_pot');
    }

    initSprite(): void {
        this.setDisplaySize(36, 36);
        this.setOrigin(0.5, 0.5);
        this.body.setSize(18, 18);
    }

    update(time: number, delta: number): void {
        super.update(time, delta);
    }

    pickup(): void {
        if (this.scene.player.potions >= this.scene.player.maxPotions) return;

        this.scene.player.addPotion();
        this.scene.potionPickupSound.play({volume: 0.5});
        super.pickup();
    }
}