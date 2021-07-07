import { EventManager, EventType } from "../EventManager";
import SingletonMainScene from "../SingletonMainScene";
import { TiledMap_AnimationTile } from "./TiledMap_AnimationTile";
import { TiledMap_IsometricWorld } from "./TiledMap_IsometricWorld";
import { TiledMap_PerspectiveWall } from "./TiledMap_PerspectiveWall";
import { TiledMap_SimpleDemo } from "./TiledMap_SimpleDemo";

export class TiledMapMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }


    private btnNameArr: Array<string> = [
        "返回主页","带动画的地图", "等角地图", "区块地图", "滚动地图"];

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
                TiledMap_AnimationTile.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                TiledMap_IsometricWorld.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                TiledMap_PerspectiveWall.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                TiledMap_SimpleDemo.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}