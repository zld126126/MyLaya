import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class Scene2DPlayer3D extends SingletonScene {
    private dialog: Laya.Image;
    private s_scene: Laya.Scene3D;
    /**
     * (pos.x pos.y) 屏幕位置
     *  pos.z 深度取值范围(-1,1);
     * */
    private pos = new Laya.Vector3(310, 500, 0);
    private _translate = new Laya.Vector3(0, 0, 0);
    private _layaMonkey: Laya.Sprite3D;
    private _translateW: Laya.Vector3 = new Laya.Vector3(0, 0, -0.2);
    private _translateS: Laya.Vector3 = new Laya.Vector3(0, 0, 0.2);
    private _translateA: Laya.Vector3 = new Laya.Vector3(-0.2, 0, 0);
    private _translateD: Laya.Vector3 = new Laya.Vector3(0.2, 0, 0);

    constructor() {
        super();
        // Laya3D.init(1024, 768);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_HEIGHT;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.dialog = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/secne.jpg");
        Laya.stage.addChild(this.dialog);

        this.s_scene = new Laya.Scene3D();


        var camera = new Laya.Camera(0, 0.1, 1000);
        this.s_scene.addChild(camera);
        camera.transform.rotate(new Laya.Vector3(-45, 0, 0), false, false);
        camera.transform.translate(new Laya.Vector3(5, -10, 1));
        camera.orthographic = true;
        //正交投影垂直矩阵尺寸
        camera.orthographicVerticalSize = 10;
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;

        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey: Laya.Sprite3D): void {
            this.AutoSetScene3d(this.s_scene);
            this.s_scene.addChild(layaMonkey);

            this._layaMonkey = layaMonkey;
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            //转换2D屏幕坐标系统到3D正交投影下的坐标系统
            camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
            layaMonkey.transform.position = this._translate;
            layaMonkey.transform.rotationEuler = new Laya.Vector3(-30, 0, 0);
            Laya.timer.frameLoop(1, this, this.onKeyDown);

        }));

    }
    private onKeyDown(): void {
        Laya.KeyBoardManager.hasKeyDown(87) && this._layaMonkey.transform.translate(this._translateW);//W
        Laya.KeyBoardManager.hasKeyDown(83) && this._layaMonkey.transform.translate(this._translateS);//S
        Laya.KeyBoardManager.hasKeyDown(65) && this._layaMonkey.transform.translate(this._translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && this._layaMonkey.transform.translate(this._translateD);//D
    }

    public Show() {
        super.Show();
        if (this.dialog) {
            this.dialog.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.dialog) {
            this.dialog.visible = false;
        }
    }
}