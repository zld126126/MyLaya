import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Shader3D = Laya.Shader3D;
import Vector3 = Laya.Vector3;
import DirectionLight = Laya.DirectionLight;
import Matrix4x4 = Laya.Matrix4x4;
import Loader = Laya.Loader;
import glTFLoader = Laya.glTFLoader;
import Sprite3D = Laya.Sprite3D;
import TextureCube = Laya.TextureCube;
import Handler = Laya.Handler;

export class LoadGltfRosource extends SingletonScene {

    s_scene: Scene3D;
    camera: Camera;

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        // Stat.show();

        Shader3D.debugMode = true;

        this.s_scene = new Scene3D();
        this.camera = <Camera>this.s_scene.addChild(new Camera);
        this.camera.addComponent(CameraMoveScript);

        this.camera.transform.position = new Vector3(0, 1, 7);

        //light
        var directionLight: DirectionLight = (<DirectionLight>this.s_scene.addChild(new DirectionLight()));
        directionLight.color = new Vector3(0.6, 0.6, 0.6);
        //设置平行光的方向
        var mat: Matrix4x4 = directionLight.transform.worldMatrix;
        mat.setForward(new Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        // 配置环境反射贴图
        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls", Handler.create(this, function () {
            this.AutoSetScene3d(this.s_scene);
            this.s_scene.ambientColor = new Vector3(0.858, 0.858, 0.858);
            this.s_scene.reflection = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls") as TextureCube;
            this.s_scene.reflectionDecodingFormat = 1;
            this.s_scene.reflectionIntensity = 1;
        }));

        // 初始化 glTFLoader
        glTFLoader.init();

        var gltfResource = [
            GlobalConfig.ResPath + "res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf",
            GlobalConfig.ResPath + "res/threeDimen/gltf/Duck/Duck.gltf",
            GlobalConfig.ResPath + "res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf"
        ];

        Laya.loader.create(gltfResource, Handler.create(this, this.onGLTFComplate));
    }

    onGLTFComplate(success: boolean): void {
        if (!success) {
            // 加载失败
            console.log("gltf load failed");
            return;
        }
        var RiggedFigure: Sprite3D = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf");
        this.s_scene.addChild(RiggedFigure);
        RiggedFigure.transform.position = new Vector3(-2, 0, 0);
        console.log("RiggedFigure: This model is licensed under a Creative Commons Attribution 4.0 International License.");

        var duck: Sprite3D = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/Duck/Duck.gltf");
        this.s_scene.addChild(duck);

        var cube: Sprite3D = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf");
        this.s_scene.addChild(cube);
        cube.transform.position = new Vector3(2.5, 0.6, 0);
        cube.transform.setWorldLossyScale(new Vector3(0.6, 0.6, 0.6));
    }

}