import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 1600,
    height: 1200,
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
