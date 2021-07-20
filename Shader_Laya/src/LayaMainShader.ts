import SingletonMainScene from "./SingletonMainScene";
import { GlobalConfig } from "./GlobalConfig";
import { J3_BlinnPhone_Scene } from "./Scene/J3_BlinnPhone_Scene";
import { J4_DiffuseTexture_Scene } from "./Scene/J4_DiffuseTexture_Scene";
import { J3_DiffusePixe_Scene } from "./Scene/J3_DiffusePixe_Scene";
import { J4_NormalTexture_Scene } from "./Scene/J4_NormalTexture_Scene";
import { J5_AlphaBlending_Scene } from "./Scene/J5_AlphaBlending_Scene";
import { J6_LightMap_Scene } from "./Scene/J6_LightMap_Scene";
import { J6_shadow_Scene } from "./Scene/J6_Shadow_Scene";
import { J7_AnimUV_Scene } from "./Scene/J7_AnimUV_Scene";
import { J8_MatCap_Scene } from "./Scene/J8_MatCap_Scene";
import { J8_Reflect_Scene } from "./Scene/J8_Reflect_Scene";
import { J9_PostProcess_Scene } from "./Scene/J9_PostProcess_Scene";

export class LayaMainShader extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "BlinnPhone", "DiffusePixe", "DiffuseTexture", "NormalTexture", "AlphaBlending",
        "LightMap", "Shadow", "AnimUV", "MatCap", "Reflect",
        "PostProcess"
    ];

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
        this.Hide();
        switch (name) {
            case this.btnNameArr[0]:
                J3_BlinnPhone_Scene.getInstance().Click();
                break;
            case this.btnNameArr[1]:
                J3_DiffusePixe_Scene.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                J4_DiffuseTexture_Scene.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                J4_NormalTexture_Scene.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                J5_AlphaBlending_Scene.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                J6_LightMap_Scene.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                //TODO 有问题后期解决
                J6_shadow_Scene.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                J7_AnimUV_Scene.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                J8_MatCap_Scene.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                J8_Reflect_Scene.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                J9_PostProcess_Scene.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }

    public Back2Main() {
        this.Show();
    }
}