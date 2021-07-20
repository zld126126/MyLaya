import SingletonScene from "../SingletonScene";
import { J8_MatCap } from "../Lib/J8_MatCap";

export class J9_PostProcess_Scene extends SingletonScene {
    constructor() {
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J8_MatCap.initShader();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            //获取场景中的相机
            var camera = scene.getChildByName("Camera");
            //加入摄像机移动控制脚本
            // this.camera.addComponent(CameraMoveScript);
            //增加后期处理
            var postProcess = new Laya.PostProcess();
            console.log(postProcess);

            //增加后期处理泛光效果
            var bloom = new Laya.BloomEffect();
            postProcess.addEffect(bloom);
            camera.postProcess = postProcess;
            camera.enableHDR = true;
            //设置泛光参数
            bloom.intensity = 5.0;
            bloom.threshold = 0.90;
            bloom.softKnee = 0.5;
            bloom.clamp = 65472.0;
            bloom.diffusion = 5.0;
            bloom.anamorphicRatio = 0.0;
            bloom.color = new Laya.Color(1.0, 1.0, 1.0, 1.0);
            bloom.fastMode = true;
            //增加污渍纹理参数
            Laya.Texture2D.load("res/textures/LensDirt01.png", Laya.Handler.create(this, function (tex) {
                bloom.dirtTexture = tex;
                bloom.dirtIntensity = 4.0;
            }));

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var material = new J8_MatCap();

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
            scene.getChildAt(1).getChildAt(1).meshRenderer.material = material;
            scene.getChildAt(2).meshRenderer.material = material;


            Laya.Texture2D.load("res/textures/MatCap/matcap017.jpg", Laya.Handler.create(this, function (tex) {
                material.MatCapTexture = tex;
                console.log(tex);
            }));

            material.TilingOffset = new Laya.Vector4(2.0, 2.0, 0.0, 0.0);

            Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });

        }));
    }
}