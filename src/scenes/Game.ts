import Phaser from 'phaser';
import { Player } from '../entities/player';
import { Bullet } from '../objects/bullet';

export default class Demo extends Phaser.Scene {

  private player: Player;

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
    // const logo = this.add.image(400, 70, 'logo');

    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });

    var mouse = this.input.activePointer;
    var input = this.input;

    // world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Player bullets and enemy bullet groups
    var playerBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    var enemyBullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

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
    // Enemy
    var enemy = this.physics.add.sprite(800, 600, 'player');

    // Image and Sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);
    enemy.setOrigin(0.5, 0.5).setDisplaySize(100, 100).setCollideWorldBounds(true);

    // Set sprite variables
  }

  update(): void{
    this.player.update();
  }
}
