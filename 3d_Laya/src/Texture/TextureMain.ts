import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { TextureDemo } from "./TextureDemo";
import { TextureGPUCompression } from "./TextureGPUCompression";
import { HalfFloatTexture } from "./HalfFloatTexture";
import { GPUCompression_ASTC } from "./GPUCompression_ASTC";
import { GPUCompression_ETC2 } from "./GPUCompression_ETC2";

export class TextureMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页", "纹理示例", "纹理压缩", "半浮点数纹理", "GPU压缩ASTC", "GPU压缩ETC2"];

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
                TextureDemo.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                TextureGPUCompression.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                HalfFloatTexture.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                GPUCompression_ASTC.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                GPUCompression_ETC2.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}