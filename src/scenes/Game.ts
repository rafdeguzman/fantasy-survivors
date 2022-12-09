import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../entities/Enemy';
import BulletGroup from '../groups/BulletGroup';

export default class GameScene extends Phaser.Scene {
  private player: Player;
  private enemy: Enemy;
  private playerBullets: BulletGroup;

  constructor() {
    super('GameScene');
  }

  // preloading sprites 
  preload() {
    this.load.image('player', '../assets/knight/knight_idle.png') // texture
    this.load.atlas('knight', '/assets/knight/knight.png', '/assets/knight/knight.json'); // atlas
    this.load.image('bullet', '../assets/bullets/bullet.png');
    this.load.image('background', '../assets/skies/underwater1.png');
    this.load.image('enemy', '../assets/necromancer/necromancer_idle_anim_f0.png');
  }

  create() {
    // world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Background
    var background = this.add.image(800, 600, 'background');

    // -- Entities -- //
    this.addPlayer(this, 100, 100);
    this.addEnemy();

    // -- Groups -- //
    this.playerBullets = new BulletGroup(this);

    // Image and Sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);

    // -- Events -- //
    this.addEvents();

    // -- Camera -- //
    this.setupCamera();
  }

  update(time: number, delta: number): void{
    this.player.update(time, delta);
  }

  setupCamera(): void{
    this.cameras.main.startFollow(this.player);
  }

  addPlayer(scene: Phaser.Scene, x: number, y: number): void{
    this.player = new Player(scene, x, y);
  }

  addEnemy(): void{
    // Enemy
    this.enemy = new Enemy({
      scene: this,
      x: 1200,
      y: 800,
      texture: 'enemy',
    });
  }

  addEvents(): void{
    // Events
    // add arrow keys
    this.input.keyboard.on('keydown-SPACE', () => {
      this.playerBullets.fireBullet(this.player.x, this.player.y);
    });
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.playerBullets.fireBullet(this.player.x, this.player.y);
    });
    this.input.mouse.disableContextMenu();

  }

}
