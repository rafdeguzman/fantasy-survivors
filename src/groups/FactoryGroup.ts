import Enemy from "../entities/Enemy";
import GLOBALS from "../Globals";
import Bullet from "../objects/Bullet";
import Player from "../entities/Player";
import EnemyTypes from "../enums/EnemyTypes";
import BigZombie from "../entities/BigZombie";
import Zombie from "../entities/Zombie";
import TinyZombie from "../entities/TinyZombie";
import Demon from "../entities/Demon";
import Shaman from "../entities/Shaman";
import Necromancer from "../entities/Necromancer";
import Orc from "../entities/Orc";
import Ogre from "../entities/Ogre";


export default class FactoryGroup extends Phaser.Physics.Arcade.Group {
    public key: string;
    constructor(scene: Phaser.Scene,key:string) {
        super(scene.physics.world, scene);
        this.key = key;
        switch(key) {
            case EnemyTypes.BigZombie:
                this.createMultiple({
                    classType: BigZombie,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                }); 
              break;
            case EnemyTypes.Zombie:
                this.createMultiple({
                    classType: Zombie,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                }); 
              break;
            case EnemyTypes.Zombie:
                this.createMultiple({
                    classType: TinyZombie,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                }); 
              break;
            case EnemyTypes.Demon:
                this.createMultiple({
                    classType: Demon,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                });
                break;
            case EnemyTypes.Shaman:
                this.createMultiple({
                    classType: Shaman,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                });
                break;
            case EnemyTypes.Necromancer:
                this.createMultiple({
                    classType: Necromancer,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                });
                break;
            case EnemyTypes.Orc:
                this.createMultiple({
                    classType: Orc,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                });
                break;
            case EnemyTypes.Ogre:
                this.createMultiple({
                    classType: Ogre,
                    frameQuantity: 1,
                    key: key,
                    active: false,
                    visible: false,
                });
                break;
            default:
              // code block
          }
    }

    initOverlaps(enemy: Enemy) : void {
        this.scene.physics.add.overlap(this.scene.player, enemy, () => {
            this.scene.player.takeDamage(GLOBALS.ENEMY_DAMAGE);
        });

        this.scene.physics.add.overlap(enemy.enemyBullets, this.scene.player, (player: Player, bullet: Bullet) => {
            if (!bullet.active || player.isInvulnerable) return;
            bullet.destroy();
            player.takeDamage(GLOBALS.BULLET_DAMAGE);
        });        
        
        this.scene.physics.add.overlap(enemy, this.scene.player.playerBullets, (enemy: Enemy, bullet: Bullet) => {
            if (!bullet.active || !enemy.active) return;
            
            bullet.destroy();
            enemy.takeDamage(GLOBALS.BULLET_DAMAGE);
            });
    }

    spawnEnemy(x: number, y: number,key : string): void {
        this.create(x, y, key , 0, false, false);

        console.log(key)

        const enemy = this.getFirstDead(false);

        this.initOverlaps(enemy);
        if (enemy) {
            enemy.spawn(x, y);
        }
    }

    update(time: number, delta: number): void {
        this.children.each((enemy: any) => {
            if (enemy.active) {
                enemy.update(time, delta);
            }
        });
    }
}

