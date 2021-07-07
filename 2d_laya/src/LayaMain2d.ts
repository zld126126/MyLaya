import { SpriteMain } from "./Sprite/SpriteMain";
import { AnimationMain } from "./Animation/AnimationMain";
import { SkeletalAnimationMain } from "./SkeletalAnimation/SkeletalAnimationMain";
import { BlendModeMain } from "./BlendMode/BlendModeMain";
import { TiledMapMain } from "./TiledMap/TiledMapMain";
import { FiltersMain } from "./Filters/FiltersMain";
import { ParticleMain } from "./Particle/ParticleMain";
import { SoundMain } from "./Sound/SoundMain";
import { TextMain } from "./Text/TextMain";
import { UIMain } from "./UI/UIMain";
import SingletonMainScene from "./SingletonMainScene";
import { EventManager, EventType } from "./EventManager";

export class LayaMain2d extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
        EventManager.RegistEvent(EventType.BACKTOMAIN, Laya.Handler.create(this, this.Back2Main));
    }

    private btnNameArr: Array<string> = [
        "Sprite", "动画", "骨骼动画", "混合模式", "区块地图",
        "滤镜", "粒子", "音频", "文本", "UI",
        "计时器", "缓动", "2D物理", "鼠标交互", "加载",
        "屏幕适配", "输入设备", "网络和格式", "Dom元素", "调试",
        "性能测试", "其他引擎",
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
        this.Hide();
        switch (name) {
            case this.btnNameArr[0]:
                SpriteMain.getInstance().Show();
                break;
            case this.btnNameArr[1]:
                AnimationMain.getInstance().Show();
                break;
            case this.btnNameArr[2]:
                SkeletalAnimationMain.getInstance().Show();
                break;
            case this.btnNameArr[3]:
                BlendModeMain.getInstance().Show();
                break;
            case this.btnNameArr[4]:
                TiledMapMain.getInstance().Show();
                break;
            case this.btnNameArr[5]:
                FiltersMain.getInstance().Show();
                break;
            case this.btnNameArr[6]:
                ParticleMain.getInstance().Show();
                break;
            case this.btnNameArr[7]:
                SoundMain.getInstance().Show();
                break;
            case this.btnNameArr[8]:
                TextMain.getInstance().Show();
                break;
            case this.btnNameArr[9]:
                UIMain.getInstance().Show();
                break;
            case this.btnNameArr[10]:

                break;
            case this.btnNameArr[11]:

                break;
            case this.btnNameArr[12]:

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
            case this.btnNameArr[21]:

                break;
        }
        console.log(name + "按钮_被点击");
    }

    public Back2Main() {
        this.Show();
    }
}