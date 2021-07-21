import Car from "./Car";
import { GameEvent } from "./MyConst";
/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-11 15:13
*/
export default class GameManager extends Laya.Script {
    isStartGame = false;
    carPrefabArr = [];
    spawnCarArr = [];
    y = 0;
    x = 0;

    constructor() {
        super();
    }

    onAwake() {
        this.loadCarPrefab();
        Laya.stage.on(GameEvent.GameStart, this, function () {
            this.isStartGame = true;
        });


        Laya.stage.on(GameEvent.GameOver, this, function(){
            this.gameOver();
        });
    }

    loadCarPrefab() {
        var pathArr = [
            "prefab/Car_1.json",
            "prefab/Car_2.json",
            "prefab/Car_3.json",
            "prefab/Car_4.json",
            "prefab/Car_5.json",
            "prefab/Car_6.json",
            "prefab/Coin.json",
        ];
        var infoArr = [];
        for (var i = 0; i < pathArr.length; i++) {
            infoArr.push({ url: pathArr[i], type: Laya.Loader.PREFAB });
        }
        Laya.loader.load(infoArr, Laya.Handler.create(this, function (result) {
            for (var i = 0; i < pathArr.length; i++) {
                this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
            }

            this.ranTime = this.getRandom(500, 1000);
            Laya.timer.loop(this.ranTime, this, function () {
                this.spawn();
                this.ranTime = this.getRandom(500, 1000);
            })
        }))
    }

    spawn() {
        if (!this.isStartGame) {
            return;
        }
        var arrX = [200, 390, 575, 750];
        this.y = -300;
        this.x = arrX[this.getRandom(0, arrX.length - 1)];

        var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
        var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function () { return this.carPrefabArr[carIndex].create() }, this);
        Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
        car.getComponent(Car).Init(carIndex.toString());
        car.pos(this.x, this.y);
        this.spawnCarArr.push(car);
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

    gameOver() {
        this.isStartGame = false;
        this.spawnCarArr.forEach(element => {
            element.removeSelf();
        });
    }

    btnHomeClick() {
        this.gameOver();
    }

    btnRestartClick(){
        this.spawnCarArr.forEach(element => {
            element.removeSelf();
        });
    }
}