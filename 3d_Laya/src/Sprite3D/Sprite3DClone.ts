import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class Sprite3DClone extends SingletonScene {
    private s_scene: Laya.Scene3D;
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();

        this.s_scene = new Laya.Scene3D();
        this.s_scene.ambientColor = new Laya.Vector3(1, 1, 1);

        var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.onComplete));
    }

    public onComplete(): void {
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);

        var layaMonkey: Laya.Sprite3D = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")) as Laya.Sprite3D;
        //克隆sprite3d
        var layaMonkey_clone1: Laya.Sprite3D = Laya.Sprite3D.instantiate(layaMonkey, this.s_scene, false, new Laya.Vector3(0.6, 0, 0));
        //克隆sprite3d
        var layaMonkey_clone2: Laya.Sprite3D = this.s_scene.addChild(Laya.Sprite3D.instantiate(layaMonkey, null, false, new Laya.Vector3(-0.6, 0, 0))) as Laya.Sprite3D;
    }
}