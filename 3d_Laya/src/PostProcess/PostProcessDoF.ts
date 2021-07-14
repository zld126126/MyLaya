import { CameraMoveScript } from "../common/CameraMoveScript";
import { GaussianDoF } from "../common/GaussianDoF";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Shader3D = Laya.Shader3D;
import Loader = Laya.Loader;
import DepthTextureMode = Laya.DepthTextureMode;
import PostProcess = Laya.PostProcess;
import Handler = Laya.Handler;

export class PostProcessDoF extends SingletonScene {

    scene: Scene3D;
    camera: Camera;

    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        // Stat.show();
        super();
        Shader3D.debugMode = true;

        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Handler.create(this, this.onComplate));

    }

    onComplate(): void {

        let scene: Scene3D = this.scene = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls");
        this.AutoSetScene3d(scene);
        let camera: Camera = this.camera = <Camera>scene.getChildByName("MainCamera");
        camera.addComponent(CameraMoveScript);
        let mainCamera = scene.getChildByName("BlurCamera");
        mainCamera.removeSelf();
        camera.depthTextureMode |= DepthTextureMode.Depth;

        let postProcess: PostProcess = new PostProcess();
        camera.postProcess = postProcess;

        let gaussianDoF: GaussianDoF = new GaussianDoF();
        console.log(gaussianDoF);

        postProcess.addEffect(gaussianDoF);
        gaussianDoF.farStart = 1;
        gaussianDoF.farEnd = 5;
        gaussianDoF.maxRadius = 1.0;
    }
}
