import { CameraMoveScript } from "../common/CameraMoveScript"
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
export class SceneLoad1 extends SingletonScene {

    constructor() {
        super();
        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_dudeScene/Conventional/dudeScene.ls", Laya.Handler.create(this, function (scene: Laya.Scene3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, scene);
            var camera: Laya.Camera = scene.getChildByName("Camera") as Laya.Camera;
            camera.addComponent(CameraMoveScript);
        }));
    }
}