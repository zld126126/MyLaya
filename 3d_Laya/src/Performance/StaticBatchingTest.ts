import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Loader = Laya.Loader;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Handler = Laya.Handler;

/**
 * ...
 * @author ...
 */
export class StaticBatchingTest extends SingletonScene {
    constructor() {
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // //显示性能面板
        // Stat.show();
        super();

        //预加载资源,该资源在Unity中已勾选Static后导出
        Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler.create(this, this.onComplete));
    }

    private onComplete(): void {

        //加载场景
        var scene: Scene3D = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls");
        this.AutoSetScene3d(scene);
        //添加相机
        var camera: Camera = <Camera>scene.getChildByName("Main Camera");
        //相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);
    }

}


