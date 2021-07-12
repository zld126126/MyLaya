import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Camera = Laya.Camera;
import Scene3D = Laya.Scene3D;
import Handler = Laya.Handler;
import PostProcess = Laya.PostProcess;
import BloomEffect = Laya.BloomEffect;
import Color = Laya.Color;
import Texture2D = Laya.Texture2D;
import Button = Laya.Button;
import Browser = Laya.Browser;
import Event = Laya.Event;

export class PostProcessBloom extends SingletonScene {
    camera: Camera = null;
    button: Button;

    /**
     *@private
     */
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Handler.create(this, function (scene: Scene3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, scene);
            //Laya.stage.addChild(scene);
            //获取场景中的相机
            this.camera = <Camera>(scene.getChildByName("Main Camera") as any);
            //加入摄像机移动控制脚本
            this.camera.addComponent(CameraMoveScript);
            //增加后期处理
            var postProcess: PostProcess = new PostProcess();
            //增加后期处理泛光效果
            var bloom: BloomEffect = new BloomEffect();
            postProcess.addEffect(bloom);
            this.camera.postProcess = postProcess;
            this.camera.enableHDR = true;
            //设置泛光参数
            bloom.intensity = 5;
            bloom.threshold = 0.9;
            bloom.softKnee = 0.5;
            bloom.clamp = 65472;
            bloom.diffusion = 5;
            bloom.anamorphicRatio = 0.0;
            bloom.color = new Color(1, 1, 1, 1);
            bloom.fastMode = true;
            //增加污渍纹理参数
            Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Handler.create(null, function (tex: Texture2D): void {
                bloom.dirtTexture = tex;
                bloom.dirtIntensity = 2.0;
            }));
            //加载UI
            this.loadUI();
        }));
    }

    /**
     *@private
     */
    loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.button = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭HDR")));
            this.button.size(200, 40);
            this.button.labelBold = true;
            this.button.labelSize = 30;
            this.button.sizeGrid = "4,4,4,4";
            this.button.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.button.pos(Laya.stage.width / 2 - this.button.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
            this.button.on(Event.CLICK, this, function (): void {
                var enableHDR: boolean = this.camera.enableHDR;
                if (enableHDR)
                    this.button.label = "开启HDR";
                else
                    this.button.label = "关闭HDR";
                this.camera.enableHDR = !enableHDR;
            });

        }));
    }

    public Show() {
        super.Show();
        if (this.button) {
            this.button.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.button) {
            this.button.visible = false;
        }
    }
}

