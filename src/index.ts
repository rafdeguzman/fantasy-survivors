import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Pause from './scenes/Pause';
import Preloader from './scenes/Preloader';
import UI from './scenes/UI';
import Title from './scenes/Title';

new Phaser.Game(
  Object.assign(config, {
    scene: [Preloader,Title,GameScene,UI,Pause]
  })
);
