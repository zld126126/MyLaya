/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-11 11:12
*/
export default class AutoMove extends Laya.Script {

    constructor() {
        super();
        this.moveSpeed = 20;
    }

    onAwake() {
        this.height = this.owner.height;
    }

    onUpdate() {
        this.owner.y += this.moveSpeed;
        if (this.owner.y >= this.height) {
            this.owner.y -= this.height * 2;
        }
    }
}