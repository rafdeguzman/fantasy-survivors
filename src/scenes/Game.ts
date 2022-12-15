import Phaser from 'phaser';
import Player from '../entities/Player';
import Bullet from '../objects/Bullet';
import Enemy from '../entities/Enemy';
import Crosshair from '../objects/Crosshair';
import GLOBALS from '../Globals';
import CountdownController from './CountdownController';
import SceneKeys from '../enums/SceneKeys'
import OrcGroup from '../groups/OrcGroup';
import NecromancerGroup from '../groups/NecromancerGroup';
import BigZombieGroup from '../groups/BigZombieGroup';
import ZombieGroup from '../groups/ZombieGroup';
import TinyZombieGroup from '../groups/TinyZombieGroup';
import DemonGroup from '../groups/DemonGroup';
import OgreGroup from '../groups/OgreGroup';
import ShamanGroup from '../groups/ShamanGroup';
import CoinGroup from '../groups/CoinGroup';
import FactoryGroup from '../groups/FactoryGroup';
import EnemyTypes from '../enums/EnemyTypes';

export default class GameScene extends Phaser.Scene {
  public player: Player;
  public enemy: Enemy;

  private crosshair: Crosshair;

  //** @type {countdownController} */
  private countDown: CountdownController;
  private timerLabel: Phaser.GameObjects.Text;

  private orcGroup: FactoryGroup
  private necromancerGroup: FactoryGroup;
  private bigZombieGroup: FactoryGroup;
  private zombieGroup: FactoryGroup;
  private tinyZombieGroup: FactoryGroup;
  private ogreGroup: FactoryGroup;
  private shamanGroup: FactoryGroup;
  private demonGroup: FactoryGroup;
  public coinGroup: FactoryGroup;

  private orcTimer: Phaser.Time.TimerEvent;
  private necromancerTimer: Phaser.Time.TimerEvent;
  private bigZombieTimer: Phaser.Time.TimerEvent;
  private ogreTimer: Phaser.Time.TimerEvent;
  private shamanTimer: Phaser.Time.TimerEvent;
  private demonTimer: Phaser.Time.TimerEvent;

  private factoryGroups: FactoryGroup[] = [];

  private timerEvents: Phaser.Time.TimerEvent[] = [];

  private firerateTick: number = GLOBALS.HEAVY_MACHINE_GUN_FIRERATE;
  private tick: number = 0;

  private backgroundMusic: Phaser.Sound.BaseSound;
  public gunshotSound: Phaser.Sound.BaseSound;
  public playerHitSound: Phaser.Sound.BaseSound;
  public enemyHitSound: Phaser.Sound.BaseSound;
  public dodgeSound: Phaser.Sound.BaseSound;
  public dodgeCdSound: Phaser.Sound.BaseSound;
  public coinSound: Phaser.Sound.BaseSound;

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
    this.coinSound = this.sound.add('pickup');

    this.input.setPollAlways();

    // -- Map -- //
    this.setupMap();

    // world bounds

    this.physics.world.setBounds(this.worldX, this.worldY, this.worldWidth, this.worldHeight, true, true, true, true );

    // -- Entities -- //
    this.addPlayer(this, this.worldWidth / 2, this.worldHeight / 2);

    // -- Groups -- //
    this.factoryGroups = [
    this.orcGroup = new FactoryGroup(this, EnemyTypes.Orc),
    this.necromancerGroup = new FactoryGroup(this, EnemyTypes.Necromancer),
    this.bigZombieGroup = new FactoryGroup(this, EnemyTypes.BigZombie),
    this.ogreGroup = new FactoryGroup(this, EnemyTypes.Orc),
    this.shamanGroup = new FactoryGroup(this, EnemyTypes.Shaman),
    this.demonGroup = new FactoryGroup(this, EnemyTypes.Demon),
    ]


    this.coinGroup = new CoinGroup(this);

    // -- Events -- //
    // do something here later i think idk

    // -- Camera -- //
    this.setupCamera();

    // -- Timers -- //
    
     this.orcTimer = this.time.addEvent({ delay: 3000, callback: ()=>{this.addToFactory(EnemyTypes.Orc)}, callbackScope: this, loop: true })
    this.necromancerTimer = this.time.addEvent({ delay: 10000, callback: ()=>{this.addToFactory(EnemyTypes.Necromancer)}, callbackScope: this, loop: true });
    this.bigZombieTimer = this.time.addEvent({ delay: 5000, callback: ()=>{this.addToFactory(EnemyTypes.BigZombie)}, callbackScope: this, loop: true });
    this.ogreTimer = this.time.addEvent({ delay: 10000, callback: ()=>{this.addToFactory(EnemyTypes.Ogre)}, callbackScope: this, loop: true });
    this.shamanTimer = this.time.addEvent({ delay: 5000, callback: ()=>{this.addToFactory(EnemyTypes.Shaman)}, callbackScope: this, loop: true });
    this.demonTimer = this.time.addEvent({ delay: 500000, callback: ()=>{this.addToFactory(EnemyTypes.Demon)}, callbackScope: this, loop: true });

    this.timerEvents.push(this.orcTimer);
    this.timerEvents.push(this.necromancerTimer);
    this.timerEvents.push(this.bigZombieTimer);
    this.timerEvents.push(this.ogreTimer);
    this.timerEvents.push(this.shamanTimer);
    this.timerEvents.push(this.demonTimer);


    this.scene.sendToBack(SceneKeys.Game);
    this.scene.launch(SceneKeys.UI,{player :this.player});
  }

  setupMap() {
    this.add.tileSprite(0, 0, 2560, 2560, 'map').setOrigin(0, 0);
  }

  update(time: number, delta: number): void {
    if(this.player.isDead){
      this.gameOver();
    }

    this.pause();
    this.upgrade();

    this.crosshair.update(time, delta);
    this.player.update(time, delta);

    this.factoryGroups.forEach((group) => {
      group.update(time, delta);
    });

    this.coinGroup.update(time, delta);
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
    if(this.player.currentCoins >= this.player.maxCoins){
      //change the tranparency of the of scene UI and 0.5
      this.cameras.main.alpha = 0.5;  
      this.scene.sendToBack(SceneKeys.UI);
      this.scene.sendToBack(SceneKeys.Game);
      
      this.scene.pause(SceneKeys.Game);
      this.scene.pause(SceneKeys.UI);

      this.scene.launch(SceneKeys.Upgrade);
      this.player.currentCoins = 0;
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

  addToFactory(type){

    console.log("in add to factory")

    switch(type){
      case EnemyTypes.Orc:
        for(let i = 0; i < 3; i++){
          this.factoryGroups[0].spawnEnemy(Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496),type);
        }
        break;
      case EnemyTypes.Demon:
        this.factoryGroups[5].spawnEnemy(Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496),type);
        this.orcTimer.remove();
        this.necromancerTimer.remove();
        this.bigZombieTimer.remove();
  
        this.factoryGroups[0].clear(true, true);
        this.factoryGroups[1].clear(true, true);
        this.factoryGroups[2].clear(true, true);
          break;
      case EnemyTypes.Necromancer:
      case EnemyTypes.BigZombie:
      case EnemyTypes.Ogre:
      case EnemyTypes.Shaman:
        this.factoryGroups.forEach(factory => {
          if(factory.key === type){
            factory.spawnEnemy(Phaser.Math.Between(this.worldX, 2501), Phaser.Math.Between(this.worldY, 2496),type);
          }
        });
        break;
      default:
      }
    }
  }
