import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../entities/Enemy';
import Crosshair from '../objects/Crosshair';
import EnemyGroup from '../groups/EnemyGroup';
import GLOBALS from '../Globals';
import CountdownController from './CountdownController';
import SceneKeys from '../enums/SceneKeys'


export default class GameScene extends Phaser.Scene {
  public player: Player;
  public enemy: Enemy;

  private crosshair: Crosshair;

  //** @type {countdownController} */
  private countDown: CountdownController;
  private timerLabel: Phaser.GameObjects.Text;

  private enemyGroup: EnemyGroup;

  private timerEvents: Phaser.Time.TimerEvent[] = [];

  private firerateTick: number = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
  private tick: number = 0;

  private backgroundMusic: Phaser.Sound.BaseSound;
  public gunshotSound: Phaser.Sound.BaseSound;
  public playerHitSound: Phaser.Sound.BaseSound;
  public enemyHitSound: Phaser.Sound.BaseSound;
  public dodgeSound: Phaser.Sound.BaseSound;
  public dodgeCdSound: Phaser.Sound.BaseSound;

  private worldX: number = 32;
  private worldY: number = 96;
  private worldWidth: number = 2560 - 64;
  private worldHeight: number = 2560 - 136;

  constructor() {
    super(SceneKeys.Game);
  }

  create() {
    this.backgroundMusic = this.sound.add('music');
    this.backgroundMusic.play({
      loop: true,
      volume: 0.25
    });

    this.gunshotSound = this.sound.add('gunShot');
    this.playerHitSound = this.sound.add('playerHit');
    this.enemyHitSound = this.sound.add('enemyHit');
    this.dodgeSound = this.sound.add('dodge');
    this.dodgeCdSound = this.sound.add('dodgeCd');

    this.input.setPollAlways();

    // -- Map -- //
    this.setupMap();

    // world bounds

    this.physics.world.setBounds(this.worldX, this.worldY, this.worldWidth, this.worldHeight, true, true, true, true );

    // -- Entities -- //
    this.addPlayer(this, 100, 100);
    // this.addEnemy(this, 800, 500);

    // -- Groups -- //
    this.enemyGroup = new EnemyGroup(this);

    this.setupOverlaps();

    // -- Events -- //
    this.addEvents();

    // -- Camera -- //
    this.setupCamera();

    // this.timerEvents.push(this.time.addEvent({ delay: 250, callback: this.playerBullets.fireAimedBullet, callbackScope: this.playerBullets, loop: true, args: [this.player, this.crosshair] }));

    this.timerEvents.push(this.time.addEvent({ delay: 1000, callback: this.addEnemyToList, callbackScope: this, loop: true }));

    this.scene.sendToBack(SceneKeys.Game);
    this.scene.launch(SceneKeys.UI,this.player);
  }

  setupMap() {
    // this.add.tileSprite(-2560, -1600, 2560, 1600, 'map').setOrigin(0, 0).setDisplaySize(1280 * 8, 800 * 8);
    this.add.tileSprite(0, 0, 2560, 2560, 'map2').setOrigin(0, 0);
  }

  setupOverlaps() {
    this.physics.add.overlap(this.player.playerBullets, this.enemyGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
  }

  update(time: number, delta: number): void {
    this.pause();

    this.crosshair.update(time, delta);
    this.player.update(time, delta);
    this.enemyGroup.update(time, delta);
  }

  pause(){
    if(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC).isDown){
      //change the tranparency of the current scene 
      this.cameras.main.alpha = 0.5;  
      this.scene.sendToBack(SceneKeys.UI);
      this.scene.sendToBack(SceneKeys.Game);
      this.scene.pause(SceneKeys.Game);
      this.scene.pause(SceneKeys.UI);

      this.scene.launch(SceneKeys.Pause);
    }else{
      this.cameras.main.alpha = 1;
    }
  }

  setupCamera(): void {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 0.8;
  }

  addPlayer(scene: Phaser.Scene, x: number, y: number): void {
    this.player = new Player(scene, x, y);
    this.crosshair = new Crosshair(scene, 0, 0);
  }

  addEnemy(scene: Phaser.Scene, x: number, y: number): void {
    this.enemy = new Enemy(scene, x, y);
  }

  addEnemyToList(enemy: Enemy): void {
    this.enemyGroup.spawnEnemy(
      Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496)
    );

  }

  addEvents(): void {
    this.input.keyboard.addKey('1').onDown = () => {
      console.log(this.firerateTick)
      this.firerateTick = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
    }
    this.input.keyboard.addKey('2').onDown = () => {
      console.log(this.firerateTick)
      this.firerateTick = GLOBALS.PISTOL_FIRERATE;
    }
  }
}
