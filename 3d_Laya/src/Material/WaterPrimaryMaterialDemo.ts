import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class WaterPrimaryMaterialDemo extends SingletonScene {
    private s_scene: Laya.Scene3D;
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.Stat.show();
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        super();

        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_water/Conventional/Default.ls", Laya.Handler.create(this, function (scene) {
            this.s_scene = scene;

            this.AutoSetScene3d(this.s_scene);
            //Laya.stage.addChild(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
        }));
    }
}