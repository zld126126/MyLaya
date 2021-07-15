import { DepthMaterial } from "../common/DepthMaterial";
import { DepthNormalsMaterial } from "../common/DepthNormalsMaterial";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import MeshSprite3D = Laya.MeshSprite3D;
import Shader3D = Laya.Shader3D;
import Vector3 = Laya.Vector3;
import Loader = Laya.Loader;
import DepthTextureMode = Laya.DepthTextureMode;
import TextureCube = Laya.TextureCube;
import Camera = Laya.Camera;
import Handler = Laya.Handler;

/**
 * 示例用来展示获得的深度、深度法线贴图
 * @author miner 
 */
export class CameraDepthModeTextureDemo extends SingletonScene {
    private s_scene: Scene3D;
    private depthPlane: MeshSprite3D;
    private depthNormalPlane: MeshSprite3D;
    constructor() {
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // //显示性能面板
        // Stat.show();
        super();
        Shader3D.debugMode = true;
        DepthMaterial.init();
        DepthNormalsMaterial.init();
        this.PreloadingRes();
    }

    //批量预加载方式
    PreloadingRes() {
        //预加载所有资源
        var resource: any[] = [
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh",
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh",
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh",
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh",
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls"
        ];
        Laya.loader.create(resource, Handler.create(this, this.onPreLoadFinish));
    }

    onPreLoadFinish() {
        this.s_scene = new Scene3D();
        this.AutoSetScene3d(this.s_scene);

        this.s_scene.ambientColor = new Vector3(0.858, 0.858, 0.858);
        this.s_scene.reflection = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls") as TextureCube;
        this.s_scene.reflectionDecodingFormat = 1;
        this.s_scene.reflectionIntensity = 1;
        this.depthNormalPlane = this.s_scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthNormalPlane.lh")) as MeshSprite3D;
        this.depthPlane = this.s_scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthPlane.lh")) as MeshSprite3D;
        this.s_scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/depthscene.lh"));
        var camera = this.s_scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Main Camera.lh")) as Camera;
        camera.depthTextureMode |= DepthTextureMode.Depth;
        this.depthPlane.meshRenderer.sharedMaterial = new DepthMaterial();

        camera.depthTextureMode |= DepthTextureMode.DepthNormals;
        this.depthNormalPlane.meshRenderer.sharedMaterial = new DepthNormalsMaterial();
    }
}