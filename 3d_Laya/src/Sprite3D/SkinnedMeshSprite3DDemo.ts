import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class SkinnedMeshSprite3DDemo extends SingletonScene {
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //创建场景
        this.s_scene = new Laya.Scene3D();
        // Laya.stage.addChild(this.s_scene);

        //创建相机
        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //添加光照
        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        //预加载资源
        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.onComplete));

    }
    public onComplete() {
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);

        //添加父级猴子
        var dude = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh")) as Laya.Sprite3D;
        //缩放
        var scale = new Laya.Vector3(0.1, 0.1, 0.1);
        dude.transform.localScale = scale;
        dude.transform.rotate(new Laya.Vector3(0, 3.14, 0));
    }

}

