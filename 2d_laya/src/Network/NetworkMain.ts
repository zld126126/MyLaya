import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { Network_POST } from "./Network_POST";
import { Network_GET } from "./Network_GET";
import { Network_XML } from "./Network_XML";
import { NetWork_Socket } from "./NetWork_Socket";
import { Network_ProtocolBuffer } from "./Network_ProtocolBuffer";
import { GlobalConfig } from "../GlobalConfig";

export class NetworkMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "返回主页", "POST", "GET", "XML", "Socket", "ProtoBuffer"];

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
                Network_POST.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Network_GET.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Network_XML.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                NetWork_Socket.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                Network_ProtocolBuffer.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}