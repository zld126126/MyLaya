import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { AnimatorDemo } from "./AnimatorDemo";
import { AnimationLayerBlend } from "./AnimationLayerBlend";
import { AnimatorStateScriptDemo } from "./AnimatorStateScriptDemo";
import { BoneLinkSprite3D } from "./BoneLinkSprite3D";
import { MaterialAnimation } from "./MaterialAnimation";
import { SkeletonMask } from "./SkeletonMask";
import { SimpleSkinAnimationInstance } from "./SimpleSkinAnimationInstance";
import { CameraAnimation } from "./CameraAnimation";
import { RigidbodyAnimationDemo } from "./RigidbodyAnimationDemo";

export class Animation3DMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页",
        "动画示例", "动画过渡和混合", "动画状态脚本", "蒙皮动画挂点", "材质动画",
        "刚体动画", "摄像机动画", "预烘焙动画", "骨骼动画遮罩",];

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
                AnimatorDemo.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                AnimationLayerBlend.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                AnimatorStateScriptDemo.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                BoneLinkSprite3D.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                MaterialAnimation.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                RigidbodyAnimationDemo.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                CameraAnimation.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                SimpleSkinAnimationInstance.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                SkeletonMask.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}