import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';

export default class GameScene extends Phaser.Scene {

  private player: Player;
  private playerBullets: any;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', '../assets/phaser3-logo.png');
    this.load.image('player', '../assets/knight/knight_f_idle_anim_f0.png');
    this.load.image('bullet', '../assets/bullets/bullet6.png');
    this.load.image('background', '../assets/skies/underwater1.png');
  }

  create() {

    // world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Background
    var background = this.add.image(800, 600, 'background');

    // -- Entities -- //

    // Player
    this.player = new Player({
      scene: this,
      x: 400,
      y: 300,
      texture: 'player',
    });

    this.playerBullets = this.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    })

    // Enemy
    // var enemy = this.physics.add.sprite(800, 600, 'player');

    // -- Groups -- //

    // Player Bullets
    this.playerBullets = this.physics.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, time: number, lastFired: number) => {
      if (this.player.active === false) {
        return;
      }

      // Get bullet from bullets group
      var bullet = this.playerBullets.get().setActive(true).setVisible(true);

      if (bullet) {
        bullet.fire(this.player, pointer);
      }
    });


    // Image and Sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
    // enemy.setOrigin(0.5, 0.5).setDisplaySize(100, 100).setCollideWorldBounds(true);

    // Set sprite variables
  }

  update(time: number, delta: number): void{
    this.player.update(time, delta);
  }
}
