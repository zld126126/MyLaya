import Singleton from "../Singleton";
import { TiledMap_AnimationTile } from "./TiledMap_AnimationTile";
import { TiledMap_IsometricWorld } from "./TiledMap_IsometricWorld";
import { TiledMap_PerspectiveWall } from "./TiledMap_PerspectiveWall";
import { TiledMap_SimpleDemo } from "./TiledMap_SimpleDemo";

export class TiledMapMain extends Singleton {
    private btnNameArr: Array<string> = [
        "带动画的地图", "等角地图", "区块地图", "滚动地图"];

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
        // todo 等待后期优化 一个界面一个
        Laya.stage.addChild(btn);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.size(50, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        return btn;
    }

    // 绑定点击事件
    private _onclick(name: string) {
        switch (name) {
            case this.btnNameArr[0]:
                TiledMap_AnimationTile.getInstance().Click();
                break;
            case this.btnNameArr[1]:
                TiledMap_IsometricWorld.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                TiledMap_PerspectiveWall.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                TiledMap_SimpleDemo.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}