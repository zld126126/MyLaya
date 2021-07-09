import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { Interaction_Hold } from "./Interaction_Hold";
import { Interaction_Drag } from "./Interaction_Drag";
import { Interaction_Rotate } from "./Interaction_Rotate";
import { Interaction_Scale } from "./Interaction_Scale";
import { Interaction_Swipe } from "./Interaction_Swipe";
import { Interaction_CustomEvent } from "./Interaction_CustomEvent";
import { Interaction_Keyboard } from "./Interaction_Keyboard";
import { Interaction_Mouse } from "./Interaction_Mouse";
import { Interaction_FixInteractiveRegion } from "./Interaction_FixInteractiveRegion";
import { GlobalConfig } from "../GlobalConfig";

export class InteractionMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }


    private btnNameArr: Array<string> = [
        "返回主页", "Hold", "拖动", "双指旋转", "双指缩放",
        "滑动", "自定义事件", "键盘交互", "鼠标交互", "修正交互区域"
    ];

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
                Interaction_Hold.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Interaction_Drag.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Interaction_Rotate.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Interaction_Scale.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                Interaction_Swipe.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                Interaction_CustomEvent.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                Interaction_Keyboard.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                Interaction_Mouse.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                Interaction_FixInteractiveRegion.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}