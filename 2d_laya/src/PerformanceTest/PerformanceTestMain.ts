import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { PerformanceTest_Maggots } from "./PerformanceTest_Maggots";
import { PerformanceTest_Cartoon } from "./PerformanceTest_Cartoon";
import { PerformanceTest_Cartoon2 } from "./PerformanceTest_Cartoon2";
import { PerformanceTest_Skeleton } from "./PerformanceTest_Skeleton";
import { GlobalConfig } from "../GlobalConfig";

export class PerformanceTestMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "返回主页", "虫子", "卡通人物", "卡通人物2", "骨骼"];

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
                new PerformanceTest_Maggots();
                break;
            case this.btnNameArr[2]:
                new PerformanceTest_Cartoon();
                break;
            case this.btnNameArr[3]:
                new PerformanceTest_Cartoon2();
                break;
            case this.btnNameArr[4]:
                new PerformanceTest_Skeleton();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}