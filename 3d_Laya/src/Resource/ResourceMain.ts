import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { LoadResourceDemo } from "./LoadResourceDemo";
import { GlobalConfig } from "../GlobalConfig";
import { GarbageCollection } from "./GarbageCollection";


export class ResourceMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页", "资源加载", "释放显存", "加载Gltf资源"];

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
                new LoadResourceDemo();
                break;
            case this.btnNameArr[2]:
                new GarbageCollection();
                break;
            case this.btnNameArr[3]:
                console.log("TODO:未来实现");
                break;
        }
        console.log(name + "按钮_被点击");
    }
}