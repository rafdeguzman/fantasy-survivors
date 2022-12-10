import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#2d2d2d',
  scale: {
    width: 1280,
    height: 800,
    mode: Phaser.Scale.Center,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  zoom: 4,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};
