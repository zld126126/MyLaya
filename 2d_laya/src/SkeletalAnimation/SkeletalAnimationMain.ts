import SingletonScene from "../SingletonScene";
import { MultiTexture } from "./MultiTexture";
import { Skeleton_SpineEvent } from "./Skeleton_SpineEvent";
import { Skeleton_SpineStretchyman } from "./Skeleton_SpineStretchyman";
import { Skeleton_SpineVine } from "./Skeleton_SpineVine";
import { ChangeSkin } from "./ChangeSkin";
import { EventManager, EventType } from "../EventManager";
import SingletonMainScene from "../SingletonMainScene";

export class SkeletalAnimationMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }


    private btnNameArr: Array<string> = [
        "返回主页","多纹理", "Spine事件", "橡胶人", "藤蔓", "换装"];

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
                MultiTexture.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Skeleton_SpineEvent.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Skeleton_SpineStretchyman.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Skeleton_SpineVine.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                ChangeSkin.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}