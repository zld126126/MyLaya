import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class TextureGPUCompression extends SingletonScene {
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.Stat.show();
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;


        if (Laya.Browser.onAndroid) {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/Android/scene.ls", Laya.Handler.create(this, function (scene) {
                Laya.stage.addChild(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
        else if (Laya.Browser.onIOS) {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/IOS/scene.ls", Laya.Handler.create(this, function (scene) {
                Laya.stage.addChild(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
        else {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/Conventional/scene.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }
}