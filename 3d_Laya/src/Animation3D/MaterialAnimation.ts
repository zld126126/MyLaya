import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class MaterialAnimation extends SingletonScene {
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.Stat.show();
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        super();

        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/materialScene/Conventional/layaScene.ls", Laya.Handler.create(this, function (scene: Laya.Scene3D): void {
            this.AutoSetScene3d(scene);
            var camera = scene.getChildByName("Main Camera") as Laya.Camera;
            camera.addComponent(CameraMoveScript);
        }));

    }

}