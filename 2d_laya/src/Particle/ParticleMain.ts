import SingletonMainScene from "../SingletonMainScene";
import { Particle_T1 } from "./Particle_T1";
import { Particle_T2 } from "./Particle_T2";
import { Particle_T3 } from "./Particle_T3";
import { EventManager, EventType } from "../EventManager";

export class ParticleMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }


    private btnNameArr: Array<string> = [
        "返回主页", "粒子演示1", "粒子演示2", "粒子演示3"];

    // 加载例子
    LoadExamples() {
        for (let index = 0; index < this.btnNameArr.length; index++) {
            this.createButton(this.btnNameArr[index], this._onclick, index);
        }
    }

    /**
     * 
     * @param name 按钮名称
     * @param cb 绑定方法
     * @param index index游标
     * @param skin 按钮皮肤
     */
    private createButton(name: string, cb: Function, index: number, skin: string = "res/threeDimen/ui/button.png"): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
        btn.size(50, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        this.addChild(btn);
        return btn;
    }

    // 绑定点击事件
    private _onclick(name: string) {
        switch (name) {
            case this.btnNameArr[0]:
                this.Hide();
                EventManager.DispatchEvent(EventType.BACKTOMAIN);
                break;
            case this.btnNameArr[1]:
                Particle_T1.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Particle_T2.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Particle_T3.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}