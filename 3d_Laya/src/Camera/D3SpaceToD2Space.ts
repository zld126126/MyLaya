import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class D3SpaceToD2Space extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private camera: Laya.Camera;
    private layaMonkey3D: Laya.Sprite3D;
    private layaMonkey2D: Laya.Image;
    private _position: Laya.Vector3 = new Laya.Vector3();
    private _outPos: Laya.Vector4 = new Laya.Vector4();
    private scaleDelta: number = 0;
    private scale: Laya.Vector3 = new Laya.Vector3(0.1, 0.1, 0.1);
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();
        this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
        this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;

        var completeHandler: Laya.Handler = Laya.Handler.create(this, this.onComplete);

        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", completeHandler);
    }
    public onComplete(): void {
        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey3D: Laya.Sprite3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
            this.layaMonkey3D = layaMonkey3D;
            this.s_scene.addChild(layaMonkey3D);

            this.layaMonkey2D = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/monkey.png");
            Laya.stage.addChild(this.layaMonkey2D);
            Laya.timer.frameLoop(1, this, this.animate);
        }))
    }

    private animate(): void {
        if (!this.isShow) {
            return;
        }
        this._position.x = Math.sin(this.scaleDelta += 0.01);
        this.layaMonkey3D.transform.position = this._position;
        this.layaMonkey3D.transform.scale = this.scale;
        //转换坐标
        this.camera.viewport.project(this.layaMonkey3D.transform.position, this.camera.projectionViewMatrix, this._outPos);
        //赋值给2D
        this.layaMonkey2D.pos(this._outPos.x / Laya.stage.clientScaleX, this._outPos.y / Laya.stage.clientScaleY);
    }

    public Show() {
        super.Show();
        if (this.layaMonkey2D) {
            this.layaMonkey2D.visible = true;
        }

    }

    public Hide() {
        super.Hide();
        if (this.layaMonkey2D) {
            this.layaMonkey2D.visible = false;
        }
    }
}