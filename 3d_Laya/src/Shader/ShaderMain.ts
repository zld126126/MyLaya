import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { Shader_Simple } from "./Shader_Simple";
import { Shader_GlowingEdge } from "./Shader_GlowingEdge";
import { Shader_Terrain } from "./Shader_Terrain";
import { Shader_MultiplePassOutline } from "./Shader_MultiplePassOutline";

export class ShaderMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页", "简单Shader", "边缘光照Shader", "地形Shader", "描边Shader"];

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
                Shader_Simple.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Shader_GlowingEdge.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Shader_Terrain.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Shader_MultiplePassOutline.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}