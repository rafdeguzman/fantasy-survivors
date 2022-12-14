import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../entities/Enemy';
import Crosshair from '../objects/Crosshair';
import OrcGroup from '../groups/OrcGroup';
import GLOBALS from '../Globals';
import CountdownController from './CountdownController';
import SceneKeys from '../enums/SceneKeys'
import NecromancerGroup from '../groups/NecromancerGroup';
import BigZombieGroup from '../groups/BigZombieGroup';
import ZombieGroup from '../groups/ZombieGroup';
import TinyZombieGroup from '../groups/TinyZombieGroup';

export default class GameScene extends Phaser.Scene {
  public player: Player;
  public enemy: Enemy;

  private crosshair: Crosshair;

  //** @type {countdownController} */
  private countDown: CountdownController;
  private timerLabel: Phaser.GameObjects.Text;

  private orcGroup: OrcGroup;
  private necromancerGroup: NecromancerGroup;
  private bigZombieGroup: BigZombieGroup;
  private zombieGroup: ZombieGroup;
  private tinyZombieGroup: TinyZombieGroup;

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
    //add fade out effect
    this.cameras.main.fadeIn(1000, 0, 0, 0)

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
    this.addPlayer(this, this.worldWidth / 2, this.worldHeight / 2);

    // -- Groups -- //
    this.orcGroup = new OrcGroup(this);
    this.necromancerGroup = new NecromancerGroup(this);
    this.bigZombieGroup = new BigZombieGroup(this);
    this.zombieGroup = new ZombieGroup(this);
    this.tinyZombieGroup = new TinyZombieGroup(this);

    this.setupOverlaps();

    // -- Events -- //
    this.addEvents();

    // -- Camera -- //
    this.setupCamera();

    this.timerEvents.push(this.time.addEvent({ delay: 3000, callback: this.addOrcToGroup, callbackScope: this, loop: true }));
    this.timerEvents.push(this.time.addEvent({ delay: 5000, callback: this.addNecromancerToGroup, callbackScope: this, loop: true }));
    this.timerEvents.push(this.time.addEvent({ delay: 1000, callback: this.addBigZombieToGroup, callbackScope: this, loop: true }));

    this.scene.sendToBack(SceneKeys.Game);
    this.scene.launch(SceneKeys.UI,{player :this.player});
  }

  setupMap() {
    this.add.tileSprite(0, 0, 2560, 2560, 'map2').setOrigin(0, 0);
  }

  setupOverlaps() {
    this.physics.add.overlap(this.player.playerBullets, this.orcGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
    this.physics.add.overlap(this.player.playerBullets, this.necromancerGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });

    this.physics.add.overlap(this.player.playerBullets, this.bigZombieGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });

    this.physics.add.overlap(this.player.playerBullets, this.zombieGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
    this.physics.add.overlap(this.player.playerBullets, this.tinyZombieGroup, (bullet: Bullet, enemy: Enemy) => {
      if (!bullet.active || !enemy.active)
        return;

      bullet.destroy();
      enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
    });
  }

  update(time: number, delta: number): void {
    if(this.player.isDead){
      console.log("game over")
      this.gameOver();
    }
    this.pause();
    this.upgrade();

    this.crosshair.update(time, delta);
    this.player.update(time, delta);
    this.orcGroup.update(time, delta);
    this.necromancerGroup.update(time, delta);
    this.bigZombieGroup.update(time, delta);
    this.zombieGroup.update(time, delta);
    this.tinyZombieGroup.update(time, delta);
  }

  gameOver(){
    //delete all the scene
    this.scene.stop(SceneKeys.Game);
    this.scene.stop(SceneKeys.UI);
    this.scene.stop(SceneKeys.Pause);
    this.scene.start(SceneKeys.GameOver);
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
  upgrade(){
    if(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G).isDown){
      //change the tranparency of the current scene 
      this.cameras.main.alpha = 0.5;  
      this.scene.sendToBack(SceneKeys.UI);
      this.scene.sendToBack(SceneKeys.Game);
      
      this.scene.pause(SceneKeys.Game);
      this.scene.pause(SceneKeys.UI);

      this.scene.launch(SceneKeys.Upgrade);
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

  addOrcToGroup(): void {
    for(let i = 0; i < 3; i++){
      this.orcGroup.spawnEnemy(
        Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496));
    }
  }

  addNecromancerToGroup(): void {
    this.necromancerGroup.spawnEnemy(
      Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496));
  }

  addBigZombieToGroup(): void {
    this.bigZombieGroup.spawnEnemy(
      Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496));
  }

  addZombieToGroup(): void {
    this.zombieGroup.spawnEnemy(
      Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496));
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
