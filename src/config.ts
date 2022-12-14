import Phaser from 'phaser';

export default {
  antialias: false,
  antialiasGL: false,
  type: Phaser.AUTO,
  willReadFrequently: true,
  backgroundColor: '#000000',
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
      debug: true
    }
  },
  fps: {
    target: 60,
  }
};
