/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-11 11:12
*/
export default class AutoMove extends Laya.Script {
    moveSpeed = 20;
    height = 0;
    constructor() {
        super();
    }

    onAwake() {
        this.height = (this.owner as Laya.Sprite).height;
        Laya.timer.frameLoop(1, this, this.frameLoop);
    }

    frameLoop() {
        var owner = (this.owner as Laya.Sprite);
        owner.y += this.moveSpeed;
        if (owner.y >= this.height) {
            owner.y -= this.height * 2;
        }
    }
}