import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
export class PickPixel extends SingletonScene {
    private isPick: Boolean = false;
    private changeActionButton: Laya.Button;
    private ray: Laya.Ray;
    private text: Laya.Text = new Laya.Text();
    private renderTargetCamera: Laya.Camera;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();
        //射线初始化（必须初始化）
        this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));

        //预加载资源
        Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls", GlobalConfig.ResPath + "res/threeDimen/texture/earth.png"], Laya.Handler.create(this, this.onComplete));
    }

    private onMouseDown() {
        var posX = Laya.MouseManager.instance.mouseX;
        var posY = Laya.MouseManager.instance.mouseY;
        var out = new Uint8Array(4);
        this.renderTargetCamera.renderTarget.getData(posX, posY, 1, 1, out);
        this.text.text = out[0] + " " + out[1] + " " + out[2] + " " + out[3];
    }

    private onResize(): void {
        var stageHeight = Laya.stage.height;
        var stageWidth = Laya.stage.width;
        this.renderTargetCamera.renderTarget.destroy();
        this.renderTargetCamera.renderTarget = new Laya.RenderTexture(stageWidth, stageHeight);
        this.text.x = Laya.stage.width / 2;
        this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
    }
    private onComplete(): void {
        //加载场景
        var scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls") as Laya.Scene3D;
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, scene);
        //添加相机
        var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        //设置相机清除标识
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        //相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);

        //渲染到纹理的相机
        this.renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000)) as Laya.Camera;
        this.renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
        this.renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
        //选择渲染目标为纹理
        var stageHeight = Laya.stage.height;
        var stageWidth = Laya.stage.width;
        this.renderTargetCamera.renderTarget = new Laya.RenderTexture(stageWidth, stageHeight);
        //渲染顺序
        this.renderTargetCamera.renderingOrder = -1;
        //相机添加视角控制组件(脚本)
        this.renderTargetCamera.addComponent(CameraMoveScript);


        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {
            this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "拾取像素"));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
            this.changeActionButton.on(Laya.Event.CLICK, this, function (): void {
                if (this.isPick) {
                    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, null);
                    this.changeActionButton.label = "拾取像素";
                    this.isPick = false;
                }
                else {
                    //鼠标事件监听
                    Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
                    this.changeActionButton.label = "结束拾取";
                    this.isPick = true;
                }
            });
        }));
        this.text.x = Laya.stage.width / 2 - 50;
        this.text.y = 50;
        this.text.overflow = Laya.Text.HIDDEN;
        this.text.color = "#FFFFFF";
        this.text.font = "Impact";
        this.text.fontSize = 20;
        this.text.borderColor = "#FFFF00";
        this.text.x = Laya.stage.width / 2;
        this.text.text = "选中的颜色：";
        Laya.stage.addChild(this.text);
        //添加舞台RESIZE事件
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    public Show() {
        super.Show();
        if (this.changeActionButton) {
            this.changeActionButton.visible = true;
        }
        if (this.text) {
            this.text.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.changeActionButton) {
            this.changeActionButton.visible = false;
        }
        if (this.text) {
            this.text.visible = false;
        }
    }
}