import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class Blinnphong_Transmission extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private rabbitModel: Laya.MeshSprite3D;
    private monkeyModel: Laya.MeshSprite3D;
    private rabbitMaterial: Laya.BlinnPhongMaterial;
    private monkeyMaterial: Laya.BlinnPhongMaterial;
    private resource = [
        GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png",
        GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg"
    ]

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        // Laya.Shader3D.debugMode = true;

        //加载场景
        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/TransmissionScene.ls", Laya.Handler.create(this, function (scene: Laya.Scene3D): void {
            this.s_scene = scene;

            this.AutoSetScene3d(this.s_scene);

            //获取场景中的相机
            var camera: Laya.Camera = (<Laya.Camera>scene.getChildByName("Main Camera"));
            //加入摄像机移动控制脚本
            camera.addComponent(CameraMoveScript);
            this.rabbitModel = scene.getChildByName("rabbit");
            this.monkeyModel = scene.getChildByName("monkey");
            this.rabbitMaterial = (this.rabbitModel as Laya.MeshSprite3D).meshRenderer.sharedMaterial;
            this.monkeyMaterial = (this.monkeyModel as Laya.MeshSprite3D).meshRenderer.sharedMaterial;
            this.loadThinkNessTexture();
        }));

    }
    loadThinkNessTexture() {
        Laya.loader.create(this.resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }

    onPreLoadFinish() {
        this.monkeyMaterial.normalTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png");
        this.rabbitMaterial.normalTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg");
        // this.rabbitMaterial.enableTransmission = true;
        // this.rabbitMaterial.transmissionRata = 0.0;
        // this.rabbitMaterial.backDiffuse = 4.88;
        // this.rabbitMaterial.transmissionColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        // this.rabbitMaterial.backScale = 1.0;

        // this.monkeyMaterial.enableTransmission = true;
        // this.monkeyMaterial.transmissionRata = 0.0;
        // this.monkeyMaterial.backDiffuse = 1.0;
        // this.monkeyMaterial.transmissionColor = new Laya.Vector4(0.2, 1.0, 0.0, 1.0);
        // this.monkeyMaterial.backScale = 1.0;
    }
}