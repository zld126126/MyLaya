import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class RenderTarget3DTo2DSprite extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private scene3DImage: Laya.Image;
    private dialog: Laya.Image;
    private _pos: Laya.Vector3 = new Laya.Vector3(310, 500, 0);
    private _translate: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private _translate2: Laya.Vector3 = new Laya.Vector3(5, -10, 1);
    private _translate3: Laya.Vector3 = new Laya.Vector3(0, 0, -0.2);
    private _translate4: Laya.Vector3 = new Laya.Vector3(0, 0, 0.2);
    private _translate5: Laya.Vector3 = new Laya.Vector3(-0.2, 0, 0);
    private _translate6: Laya.Vector3 = new Laya.Vector3(0.2, 0, 0);
    private _layaMonkey: Laya.Sprite3D;
    private _rotation: Laya.Vector3 = new Laya.Vector3(-45, 0, 0);
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        this.dialog = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/secne.jpg");
        Laya.stage.addChild(this.dialog);
        this.s_scene = new Laya.Scene3D();

        var camera: Laya.Camera = (<Laya.Camera>this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.rotate(this._rotation, false, false);
        camera.addComponent(CameraMoveScript);
        camera.transform.translate(this._translate2);
        camera.orthographic = true;
        camera.clearFlag = Laya.CameraClearFlags.SolidColor;
        //除了猴子自身，渲染图片其他地方都完全渲染到屏幕上deddd
        camera.clearColor = new Laya.Vector4(0.5, 0.0, 0.0, 0.5);
        //创建一个渲染图片
        var renderTexture = new Laya.RenderTexture(512, 512, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        camera.renderTarget = renderTexture;
        //正交投影垂直矩阵尺寸
        camera.orthographicVerticalSize = 10;

        this.s_scene.addChild(new Laya.DirectionLight());

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey: Laya.Sprite3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
            this.s_scene.addChild(layaMonkey);
            this._layaMonkey = layaMonkey;
            var transform: Laya.Transform3D = layaMonkey.transform;
            var localScale: Laya.Vector3 = transform.localScale;
            var rotationEuler: Laya.Vector3 = transform.rotationEuler;
            //转换2D屏幕坐标系统到3D正交投影下的坐标系统
            camera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);
            transform.position = this._translate;
            localScale.setValue(0.5, 0.5, 0.5);
            transform.localScale = localScale;
            rotationEuler.setValue(-30, 0, 0);
            transform.rotationEuler = rotationEuler;

            //显示2D图片
            this.scene3DImage = new Laya.Image();
            //@ts-ignore
            this.scene3DImage.source = new Laya.Texture(renderTexture as Laya.Texture2D);
            //添加到stage
            Laya.stage.addChild(this.scene3DImage);
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }));

    }
    private onKeyDown(): void {
        var transform: Laya.Transform3D = this._layaMonkey.transform;
        Laya.KeyBoardManager.hasKeyDown(87) && transform.translate(this._translate3);//W
        Laya.KeyBoardManager.hasKeyDown(83) && transform.translate(this._translate4);//S
        Laya.KeyBoardManager.hasKeyDown(65) && transform.translate(this._translate5);//A
        Laya.KeyBoardManager.hasKeyDown(68) && transform.translate(this._translate6);//D
    }

    public Show() {
        super.Show();
        if (this.dialog) {
            this.dialog.visible = true;
        }
        if (this.scene3DImage) {
            this.scene3DImage.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.dialog) {
            this.dialog.visible = false;
        }
        if (this.scene3DImage) {
            this.scene3DImage.visible = false;
        }
    }
}
