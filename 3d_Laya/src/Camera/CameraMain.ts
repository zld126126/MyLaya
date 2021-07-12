import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { CameraDemo } from "./CameraDemo";
import { CameraLookAt } from "./CameraLookAt";
import { MultiCamera } from "./MultiCamera";
import { CameraRay } from "./CameraRay";
import { CameraLayer } from "./CameraLayer";
import { OrthographicCamera } from "./OrthographicCamera";
import { D3SpaceToD2Space } from "./D3SpaceToD2Space";
import { RenderTarget3DTo2DSprite } from "./RenderTarget3DTo2DSprite";
import { RenderTargetCamera } from "./RenderTargetCamera";
import { RenderTargetTo2DSprite } from "./RenderTargetTo2DSprite";
import { PickPixel } from "./PickPixel";

export class CameraMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页", "摄像机示例", "摄像机捕捉目标", "多照相机", "创建射线",
        "可视遮罩层", "正交摄像机", "3D空间转2D空间", "渲染3D到2DSprite", "渲染到纹理",
        "渲染到2DSprite", "拾取像素"];

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
                CameraDemo.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                CameraLookAt.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                MultiCamera.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                CameraRay.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                CameraLayer.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                OrthographicCamera.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                D3SpaceToD2Space.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                RenderTarget3DTo2DSprite.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                RenderTargetCamera.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                RenderTargetTo2DSprite.getInstance().Click();
                break;
            case this.btnNameArr[11]:
                PickPixel.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}