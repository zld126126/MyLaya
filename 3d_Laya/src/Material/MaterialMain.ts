import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { MaterialDemo } from "./MaterialDemo";
import { BlinnPhongMaterialLoad } from "./BlinnPhongMaterialLoad";
import { BlinnPhong_DiffuseMap } from "./BlinnPhong_DiffuseMap";
import { BlinnPhong_NormalMap } from "./BlinnPhong_NormalMap";
import { BlinnPhong_SpecularMap } from "./BlinnPhong_SpecularMap";
import { Blinnphong_Transmission } from "./Blinnphong_Transmission";
import { PBRMaterialDemo } from "./PBRMaterialDemo";
import { EffectMaterialDemo } from "./EffectMaterialDemo";
import { UnlitMaterialDemo } from "./UnlitMaterialDemo";
import { WaterPrimaryMaterialDemo } from "./WaterPrimaryMaterialDemo";

export class MaterialMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页",
        "材质示例", "BP材质加载", "BP漫反射贴图", "BP法线贴图", "BP高光贴图",
        "BP透射", "PBR材质", "Effect材质", "Unlit材质", "WaterPrimary材质"];

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
                MaterialDemo.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                BlinnPhongMaterialLoad.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                BlinnPhong_DiffuseMap.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                BlinnPhong_NormalMap.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                BlinnPhong_SpecularMap.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                Blinnphong_Transmission.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                PBRMaterialDemo.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                EffectMaterialDemo.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                UnlitMaterialDemo.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                WaterPrimaryMaterialDemo.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}