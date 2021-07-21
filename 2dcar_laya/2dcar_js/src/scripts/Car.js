import { GameEvent } from "./MyConst";
/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-11 14:17
*/
export default class Car extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:speed, tips:"指定速度", type:number}*/
        this.speed = 15;
    }

    onAwake(){
        Laya.timer.frameLoop(1,this,this.frameLoop);
    }

    Init(sign){
        this.sign = sign;
    }

    frameLoop() {
        this.owner.y += this.speed;
    }

    onTriggerExit(other){
        if (other.label == "BottomCollider"){
            this.owner.removeSelf();
            this.recover();
            Laya.stage.event(GameEvent.AddScore);
        }
    }

    // 回收
    recover(){
        Laya.Pool.recover(this.sign,this.owner);
    }
}