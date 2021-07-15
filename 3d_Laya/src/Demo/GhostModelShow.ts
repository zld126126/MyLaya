import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Handler = Laya.Handler;

/**
 * ghost Model show,this model use PBR material.
 */
export class GhostModelShow extends SingletonScene {
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        super();

        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/PBRScene/Demo.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);

            var camera: Camera = <Camera>scene.getChildByName("Camera");
            camera.addComponent(CameraMoveScript);
        }));
    }
}