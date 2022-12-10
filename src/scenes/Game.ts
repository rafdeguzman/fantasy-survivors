import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../entities/Enemy';
import BulletGroup from '../groups/BulletGroup';
import Crosshair from '../objects/Crosshair';
import EnemyGroup from '../groups/EnemyGroup';
import GLOBALS from '../Globals';

export default class GameScene extends Phaser.Scene {
  public player: Player;
  public enemy: Enemy;

  private enemyList: Enemy[] = [];

  private playerBullets: BulletGroup;
  private crosshair: Crosshair;

  private enemyGroup: EnemyGroup;

  private timerEvents: Phaser.Time.TimerEvent[] = [];

  private bulletCollider: Phaser.Physics.Arcade.Collider;

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
    this.load.image('crosshair', '../assets/crosshair/crosshair.png');
  }

  create() {
    this.input.setPollAlways();

    // world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Background
    var background = this.add.image(800, 600, 'background');

    // -- Entities -- //
    this.addPlayer(this, 100, 100);
    // this.addEnemy(this, 800, 500);

    // -- Groups -- //
    this.playerBullets = new BulletGroup(this);
    this.enemyGroup = new EnemyGroup(this);
    
    this.setupCollisions();

    // Image and Sprite properties
    background.setOrigin(0.5, 0.5).setDisplaySize(1600, 1200);

    // -- Events -- //
    this.addEvents();

    // -- Camera -- //
    this.setupCamera();

    // this.timerEvents.push(this.time.addEvent({ delay: 250, callback: this.playerBullets.fireAimedBullet, callbackScope: this.playerBullets, loop: true, args: [this.player, this.crosshair] }));

    this.timerEvents.push(this.time.addEvent({ delay: 1000, callback: this.addEnemyToList, callbackScope: this, loop: true }));
  }

  setupCollisions(){
    this.physics.add.overlap(this.playerBullets, this.enemyGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active) 
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
      
    this.physics.add.collider(this.player, this.enemyGroup);
  }

  update(time: number, delta: number): void{
    this.crosshair.update(time, delta);
    this.player.update(time, delta);
    this.enemyGroup.update(time, delta);
  }

  setupCamera(): void{
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 0.8;
  }

  addPlayer(scene: Phaser.Scene, x: number, y: number): void{
    this.player = new Player(scene, x, y);
    this.crosshair = new Crosshair(scene, 0, 0);
  }

  addEnemy(scene: Phaser.Scene, x: number, y: number): void{
    this.enemy = new Enemy(scene, x, y);
  }

  addEnemyToList(enemy: Enemy): void{
    let camera = this.cameras.main;

    let cameraWidth = this.cameras.main.width;
    let cameraHeight = this.cameras.main.height;

    let cameraBounds = camera.getBounds();

    let top = cameraBounds.top;
    let bottom = cameraBounds.bottom;
    let left = cameraBounds.left;
    let right = cameraBounds.right;

    this.enemyGroup.spawnEnemy(Phaser.Math.Between(0, 1600), Phaser.Math.Between(0, 1200));

    // this.enemyList.push(new Enemy(this, Phaser.Math.Between(0, 1600), Phaser.Math.Between(0, 1200)));
  }

  addEvents(): void{
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.playerBullets.fireAimedBullet(this.player, this.crosshair);
    });    
  }
}
