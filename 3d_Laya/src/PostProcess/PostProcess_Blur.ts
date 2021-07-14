import { BlurEffect } from "../common/BlurEffect";
import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import CameraClearFlags = Laya.CameraClearFlags;
import Matrix4x4 = Laya.Matrix4x4;
import PostProcess = Laya.PostProcess;
import Button = Laya.Button;
import Shader3D = Laya.Shader3D;
import Browser = Laya.Browser;
import Event = Laya.Event;
import Handler = Laya.Handler;


export class PostProcess_Blur extends SingletonScene {
    private btn: Laya.Button;
    private s_scene: Laya.Scene;
    /**
     *@private
     */
    constructor() {
        super();
        //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        Shader3D.debugMode = true;
        BlurEffect.init();
        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Handler.create(this, function (scene: Scene3D): void {
            this.s_scene = scene;
            this.AutoSetScene3d(this.s_scene);
            //Laya.stage.addChild(scene);

            //获取场景中的相机
            this.camera = (scene.getChildByName("MainCamera") as Camera);
            //加入摄像机移动控制脚本
            this.camera.addComponent(CameraMoveScript);
            (this.camera as Camera).clearFlag = CameraClearFlags.Sky;
            (this.camera as Camera).cullingMask ^= 2;
            //this.camera.active = false;
            (this.camera as Camera).enableHDR = false;
            var mainCamera: Camera = (scene.getChildByName("BlurCamera") as Camera);// MainCamera//(this.camera as Camera).getChildAt(0) as Camera;
            mainCamera.clearFlag = CameraClearFlags.Nothing;//微信平台有bug这里得换成DepthOnly
            mainCamera.cullingMask = 2;
            mainCamera.renderingOrder = 1;
            mainCamera.enableHDR = false;
            (this.camera as Camera).addChild(mainCamera);
            mainCamera.transform.localMatrix = new Matrix4x4();

            //增加后期处理
            this.postProcess = new PostProcess();

            var blurEffect: BlurEffect = new BlurEffect();
            this.postProcess.addEffect(blurEffect);
            this.camera.postProcess = this.postProcess;

            //设置模糊参数
            blurEffect.downSampleNum = 6;
            blurEffect.blurSpreadSize = 1;
            blurEffect.blurIterations = 1;

            //加载UI
            this.loadUI();
        }));
    }

    /**
     *@private
     */
    loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.btn = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭高斯模糊")));
            this.btn.size(200, 40);
            this.btn.labelBold = true;
            this.btn.labelSize = 30;
            this.btn.sizeGrid = "4,4,4,4";
            this.btn.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.btn.pos(Laya.stage.width / 2 - this.btn.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
            this.btn.on(Event.CLICK, this, function (): void {
                var enableHDR: boolean = !!this.camera.postProcess;
                if (enableHDR) {
                    this.btn.label = "开启高斯模糊";
                    this.camera.postProcess = null;

                }
                else {
                    this.btn.label = "关闭高斯模糊";
                    this.camera.postProcess = this.postProcess;
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.btn) {
            this.btn.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.btn) {
            this.btn.visible = false;
        }
    }
}

