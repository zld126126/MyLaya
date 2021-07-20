import { J4_DiffuseTexture } from "../Lib/J4_DiffuseTexture";
import SingletonScene from "../SingletonScene";
import { CameraMoveScript } from "../Common/CameraMoveScript";

export class J4_DiffuseTexture_Scene extends SingletonScene {
    private s_scene: Laya.Scene3D;
    constructor() {
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J4_DiffuseTexture.initShader();

        //添加3D场景
        this.s_scene = new Laya.Scene3D();
        this.s_scene.ambientColor = new Laya.Vector3(0.1, 0.1, 0.1);

        //添加照相机
        var camera = new Laya.Camera(0, 0.1, 100);
        camera.transform.translate(new Laya.Vector3(0, 2, 4));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        this.s_scene.addChild(camera);

        var directionLight = new Laya.DirectionLight();
        directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
        //设置灯光方向
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -2));
        this.s_scene.addChild(directionLight);

        //添加自定义模型
        var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
        Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
        this.s_scene.addChild(Capsule);

        var material = new J4_DiffuseTexture();

        Capsule.meshRenderer.material = material;
        Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function (tex) {
            material.DiffuseTexture = tex;
            console.log(tex);
            this.AutoSetScene3d(this.s_scene);
        }));

        material.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
    }
}