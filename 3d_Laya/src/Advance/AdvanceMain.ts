import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { Laya3DCombineHtml } from "./Laya3DCombineHtml";
import { AStarFindPath } from "./AStarFindPath";
import { Scene2DPlayer3D } from "./Scene2DPlayer3D";
import { Secne3DPlayer2D } from "./Secne3DPlayer2D";
import { DrawTextTexture } from "./DrawTextTexture";
import { VideoPlayIn3DWorld } from "./VideoPlayIn3DWorld";
import { CommandBuffer_BlurryGlass } from "./CommandBuffer_BlurryGlass";
import { CommandBuffer_Outline } from "./CommandBuffer_Outline";
import { CommandBuffer_DrawCustomInstance } from "./CommandBuffer_DrawCustomInstance";
import { GrassDemo } from "./GrassDemo";
import { ReflectionProbeDemo } from "./ReflectionProbeDemo";
import { CameraDepthModeTextureDemo } from "./CameraDepthModeTextureDemo";
import { SeparableSSS_RenderDemo } from "./SeparableSSS_RenderDemo";

export class AdvanceMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页",
        "Laya3D与网页混合", "寻路导航", "2D场景+3D人物", "2D人物+3D场景", "3D文字纹理",
        "视频纹理", "毛玻璃", "轮廓", "Instance渲染", "草地",
        "反射探针", "相机深度模式纹理展示", "次表面散射"
    ];

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
                Laya3DCombineHtml.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                AStarFindPath.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Scene2DPlayer3D.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Secne3DPlayer2D.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                DrawTextTexture.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                VideoPlayIn3DWorld.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                CommandBuffer_BlurryGlass.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                CommandBuffer_Outline.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                CommandBuffer_DrawCustomInstance.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                GrassDemo.getInstance().Click();
                break;
            case this.btnNameArr[11]:
                ReflectionProbeDemo.getInstance().Click();
                break;
            case this.btnNameArr[12]:
                CameraDepthModeTextureDemo.getInstance().Click();
                break;
            case this.btnNameArr[13]:
                SeparableSSS_RenderDemo.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}