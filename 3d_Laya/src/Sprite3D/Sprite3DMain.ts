import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { SkinnedMeshSprite3DDemo } from "./SkinnedMeshSprite3DDemo";
import { Sprite3DParent } from "./Sprite3DParent";
import { TransformDemo } from "./TransformDemo";
import { PixelLineSprite3DDemo } from "./PixelLineSprite3DDemo";
import { Sprite3DClone } from "./Sprite3DClone";

export class Sprite3DMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页", "蒙皮精灵", "子父级关系", "变换示例", "克隆精灵", "像素线精灵"];

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

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
                SkinnedMeshSprite3DDemo.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Sprite3DParent.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                TransformDemo.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Sprite3DClone.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                PixelLineSprite3DDemo.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}