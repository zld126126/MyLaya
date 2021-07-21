import Car from "./Car";
import { GameEvent, MusicRes } from "./MyConst";

/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-11 11:28
*/
export default class Player extends Laya.Script {
    playerMinX = 200;
    playerMaxX = 750;
    isStartGame = false;
    initXArr = [200, 390, 575, 750];
    rig = null;

    constructor() {
        super();
    }

    onAwake() {
        Laya.SoundManager.playMusic(MusicRes.Background,0);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MouseDownClick);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.MouseUpClick);
        Laya.stage.on(GameEvent.GameStart, this, function () {
            this.isStartGame = true;
        });
        Laya.stage.on(GameEvent.GamePause, this, function () {
            this.isStartGame = false;
        });

        this.Reset();
        // 获取自身rigbody组件
        this.rig = this.owner.getComponent(Laya.RigidBody);
    }

    Reset() {
        // 随机小汽车初始位置
        var index = this.getRandom(0, this.initXArr.length - 1);
        var owner = (this.owner as Laya.Sprite);
        owner.pos(this.initXArr[index], 1360);
    }

    MouseDownClick() {
        if (!this.isStartGame) {
            return;
        }
        var mouseX = Laya.stage.mouseX;
        var width = Laya.stage.width;
        var force = 0;
        if (mouseX < width / 2) {
            // left
            force = -1;
        } else {
            force = 1;
        }
        this.rig.linearVelocity = { x: force * 8, y: 0 };
        Laya.Tween.to(this.owner, { rotation: force * 25 }, 300);
    }

    MouseUpClick() {
        this.rig.linearVelocity = { x: 0, y: 0 };
        Laya.Tween.to(this.owner, { rotation: 0 }, 300);
    }

    onUpdate() {
        var owner = (this.owner as Laya.Sprite);
        if (owner.x > this.playerMaxX) {
            owner.x = this.playerMaxX;
        }
        if (owner.x < this.playerMinX) {
            owner.x = this.playerMinX;
        }
    }

    /**
     * 获取指定区间随机数
     * @param {最小数} min 
     * @param {最大数} max 
     * @returns 
     */
    getRandom(min, max) {
        var value = Math.random() * (max - min);
        value = Math.round(value);
        return min + value;
    }

    onTriggerEnter(other) {
        if (other.label == "Car") {
            Laya.SoundManager.playSound(MusicRes.CarCrash,1);
            // 游戏结束
            Laya.stage.event(GameEvent.GameOver);
            this.isStartGame = false;
        }
        if (other.label == "Coin") {
            Laya.SoundManager.playSound(MusicRes.Bonus,1);
            other.owner.removeSelf();
            other.owner.getComponent(Car).recover();
            // 增加分数
            Laya.stage.event(GameEvent.AddScore, 10);
        }
    }
}