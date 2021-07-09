import SingletonMainScene from "../SingletonMainScene";
import { Filters_Blur } from "./Filters_Blur";
import { Filters_Color } from "./Filters_Color";
import { Filters_Glow } from "./Filters_Glow";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";

export class FiltersMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }


    private btnNameArr: Array<string> = [
        "返回主页","发光滤镜", "模糊滤镜", "颜色滤镜"];

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
    private createButton(name: string, cb: Function, index: number, skin: string = GlobalConfig.ResPath + "res/threeDimen/ui/button.png"): Laya.Button {
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
                Filters_Glow.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Filters_Blur.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Filters_Color.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}