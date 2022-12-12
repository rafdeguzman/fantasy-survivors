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

  

  private playerBullets: BulletGroup;
  private crosshair: Crosshair;

  private enemyGroup: EnemyGroup;
  public enemyBullets: BulletGroup;

  private timerEvents: Phaser.Time.TimerEvent[] = [];

  private bulletCollider: Phaser.Physics.Arcade.Collider;

  private firerateTick: number = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
  private tick: number = 0;

  private backgroundMusic: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');
  }

  // preloading sprites 
  preload() {
    this.load.image('player', '../assets/knight/knight_idle.png') // texture
    this.load.atlas('knight', '/assets/knight/knight.png', '/assets/knight/knight.json'); // atlas

    this.load.image('enemy', '../assets/necromancer/necromancer_idle_anim_f0.png');
    this.load.atlas('orc', '/assets/orc/orc.png', '/assets/orc/orc.json'); // atlas

    this.load.image('bullet', '../assets/bullets/bullet.png');
    this.load.image('background', '../assets/skies/underwater1.png');
    this.load.image('map', '../assets/map/map.png');
    
    this.load.image('crosshair', '../assets/crosshair/crosshair.png');

    this.load.audio('music', '../assets/sound/music/abc.mp3');
  }

  create() {
    this.backgroundMusic = this.sound.add('music');
    this.backgroundMusic.play({
      loop: true,
      volume: 0.25
    });



    this.input.setPollAlways();

    // -- Map -- //
    this.setupMap();

    // world bounds
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // -- Entities -- //
    this.addPlayer(this, 100, 100);
    // this.addEnemy(this, 800, 500);

    // -- Groups -- //
    this.playerBullets = new BulletGroup(this);
    this.enemyGroup = new EnemyGroup(this);
    this.enemyBullets = new BulletGroup(this);
    
    this.setupCollisions();

    // -- Events -- //
    this.addEvents();

    // -- Camera -- //
    this.setupCamera();

    // this.timerEvents.push(this.time.addEvent({ delay: 250, callback: this.playerBullets.fireAimedBullet, callbackScope: this.playerBullets, loop: true, args: [this.player, this.crosshair] }));

    this.timerEvents.push(this.time.addEvent({ delay: 1000, callback: this.addEnemyToList, callbackScope: this, loop: true }));
  }

  setupMap(){
    this.add.tileSprite(-2560, -1600, 2560, 1600, 'map').setOrigin(0, 0).setDisplaySize(1280 * 8, 800 * 8);
  }

  setupCollisions(){
    this.physics.add.overlap(this.playerBullets, this.enemyGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active) 
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
      
    this.physics.add.overlap(this.player, this.enemyGroup, this.enemyPlayerCollision, null, this);

    this.physics.add.overlap(this.enemyBullets, this.player, this.enemyPlayerCollision, null, this);
  }

  update(time: number, delta: number): void{
    this.crosshair.update(time, delta);
    this.player.update(time, delta);
    this.enemyGroup.update(time, delta);

    this.tick++;

    if (this.game.input.activePointer.isDown && this.tick >= this.firerateTick){
      this.playerBullets.fireAimedBullet(this.player, this.crosshair);  
      this.tick = 0;
    }
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

    // i want to spawn enemies outside of the camera bounds
    this.enemyGroup.spawnEnemy(
      Phaser.Math.Between(0, 1600), Phaser.Math.Between(0, 1200)
      );

    // this.enemyList.push(new Enemy(this, Phaser.Math.Between(0, 1600), Phaser.Math.Between(0, 1200)));
  }

  addEvents(): void{
    this.input.keyboard.addKey('1').onDown = () => {
      console.log(this.firerateTick)
      this.firerateTick = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
    }
    this.input.keyboard.addKey('2').onDown = () => {
      console.log(this.firerateTick)
      this.firerateTick = GLOBALS.PISTOL_FIRERATE;
    }
  }

  enemyPlayerCollision(player: Player, enemy: Enemy): void{
    player.takeDamage(GLOBALS.ENEMY_DAMAGE);
  }
}
