import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Stage = Laya.Stage;
import Stat = Laya.Stat;
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Button = Laya.Button;
import Browser = Laya.Browser;
import RenderTexture = Laya.RenderTexture;
import Event = Laya.Event;
import BaseCamera = Laya.BaseCamera;
import Texture = Laya.Texture;
import Texture2D = Laya.Texture2D;
import Sprite = Laya.Sprite;

export class RenderTargetTo2DSprite extends SingletonScene {
    changeActionButton: Button;
    sp: Laya.Sprite;
    constructor() {
        super();

        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // //显示性能面板
        // Stat.show();

        //预加载资源
        Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler.create(this, this.onComplete));
    }

    private onComplete(): void {
        //加载场景
        var scene: Scene3D = (<Scene3D>Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"));
        this.AutoSetScene3d(scene);
        //添加相机
        var camera: Camera = <Camera>scene.getChildByName("Main Camera");
        //相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);

        //增加个小猴
        Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function (layaMonkey: Sprite3D): void {
            scene.addChild(layaMonkey);
            layaMonkey.transform.localScale = new Vector3(0.5, 0.5, 0.5);
            layaMonkey.transform.rotate(new Vector3(0, 180, 0), true, false);
            layaMonkey.transform.position = new Vector3(-28.8, 5, -53);
        }));

        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.changeActionButton = <Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "渲染到2DSprite"));
            this.changeActionButton.size(240, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
            this.changeActionButton.on(Event.CLICK, this, function (): void {
                //渲染到纹理的相机
                var renderTargetCamera: Camera = <Camera>scene.addChild(new Camera(0, 0.3, 1000));
                renderTargetCamera.transform.position = new Vector3(-28.8, 8, -60);
                renderTargetCamera.transform.rotate(new Vector3(0, 180, 0), true, false);
                //选择渲染目标为纹理
                renderTargetCamera.renderTarget = new RenderTexture(512, 512);
                //渲染顺序
                renderTargetCamera.renderingOrder = -1;
                //清除标记
                renderTargetCamera.clearFlag = BaseCamera.CLEARFLAG_SKY;
                var rtex = new Texture(((<Texture2D>(renderTargetCamera.renderTarget as any))), Texture.DEF_UV);
                this.sp = new Sprite();
                Laya.stage.addChild(this.sp);
                this.sp.graphics.drawTexture(rtex);
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.changeActionButton) {
            this.changeActionButton.visible = true;
        }
        if (this.sp) {
            this.sp.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.changeActionButton) {
            this.changeActionButton.visible = false;
        }
        if (this.sp) {
            this.sp.visible = false;
        }
    }
}

