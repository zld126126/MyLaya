import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { Loader_ClearTextureRes } from "./Loader_ClearTextureRes";
import { Loader_SingleType } from "./Loader_SingleType";
import { Loader_MultipleType } from "./Loader_MultipleType";
import { Loader_Sequence } from "./Loader_Sequence";
import { Loader_ProgressAndErrorHandle } from "./Loader_ProgressAndErrorHandle";

export class LoaderMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "返回主页", "销毁Texture", "单一资源加载", "多种资源加载", "加载序列", "错误处理和进度"];

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
                Loader_ClearTextureRes.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Loader_SingleType.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Loader_MultipleType.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Loader_Sequence.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                Loader_ProgressAndErrorHandle.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}