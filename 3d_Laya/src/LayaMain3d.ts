import SingletonMainScene from "./SingletonMainScene";
import { EventManager, EventType } from "./EventManager";
import { ResourceMain } from "./Resource/ResourceMain";
import { GlobalConfig } from "./GlobalConfig";
import { Scene3DMain } from "./Scene3D/Scene3DMain";
import { CameraMain } from "./Camera/CameraMain";
import { PostProcessMain } from "./PostProcess/PostProcessMain";
import { LightingMain } from "./Lighting/LightingMain";
import { Sprite3DMain } from "./Sprite3D/Sprite3DMain";
import { MeshMain } from "./Mesh/MeshMain";
import { MaterialMain } from "./Material/MaterialMain";
import { TextureMain } from "./Texture/TextureMain";
import { Animation3DMain } from "./Animation3D/Animation3DMain";
import { Physics3DMain } from "./Physics3D/Physics3DMain";
import { CannonPhysics3DMain } from "./CannonPhysics3D/CannonPhysics3DMain";
import { MouseInteractionMain } from "./MouseInteraction/MouseInteractionMain";

export class LayaMain3d extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "Resource", "Scene3D", "摄像机", "后处理", "光照",
        "3D精灵", "Mesh网格", "材质", "纹理", "动画",
        "物理系统", "canoon物理", "鼠标交互", "脚本", "天空",
        "粒子系统", "拖尾系统", "自定义Shader", "性能测试", "高级应用",
        "展示案例",
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
                ResourceMain.getInstance().Show();
                break;
            case this.btnNameArr[1]:
                Scene3DMain.getInstance().Show();
                break;
            case this.btnNameArr[2]:
                CameraMain.getInstance().Show();
                break;
            case this.btnNameArr[3]:
                PostProcessMain.getInstance().Show();
                break;
            case this.btnNameArr[4]:
                LightingMain.getInstance().Show();
                break;
            case this.btnNameArr[5]:
                Sprite3DMain.getInstance().Show();
                break;
            case this.btnNameArr[6]:
                MeshMain.getInstance().Show();
                break;
            case this.btnNameArr[7]:
                MaterialMain.getInstance().Show();
                break;
            case this.btnNameArr[8]:
                TextureMain.getInstance().Show();
                break;
            case this.btnNameArr[9]:
                Animation3DMain.getInstance().Show();
                break;
            case this.btnNameArr[10]:
                Physics3DMain.getInstance().Show();
                break;
            case this.btnNameArr[11]:
                CannonPhysics3DMain.getInstance().Show();
                break;
            case this.btnNameArr[12]:
                MouseInteractionMain.getInstance().Show();
                break;
            case this.btnNameArr[13]:
                break;
            case this.btnNameArr[14]:
                break;
            case this.btnNameArr[15]:
                break;
            case this.btnNameArr[16]:
                break;
            case this.btnNameArr[17]:
                break;
            case this.btnNameArr[18]:
                break;
            case this.btnNameArr[19]:
                break;
            case this.btnNameArr[20]:
                break;
        }
        console.log(name + "按钮_被点击");
    }

    public Back2Main() {
        this.Show();
    }
}