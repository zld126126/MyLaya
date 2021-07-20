import { J3_DiffusePixe } from "../Lib/J3_DiffusePixe";
import { J3_DiffuseVertex } from "../Lib/J3_DiffuseVertex";
import SingletonScene from "../SingletonScene";

export class J3_DiffusePixe_Scene extends SingletonScene {
    constructor() {
        super();

        this.init();
    }

    init() {

        //初始化Shader
        J3_DiffusePixe.initShader();
        J3_DiffuseVertex.initShader();

        //添加3D场景
        var scene = new Laya.Scene3D();
        scene.ambientColor = new Laya.Vector3(0.2, 0.1, 0.2);

        //添加照相机
        var camera = new Laya.Camera(0, 0.1, 100);
        camera.transform.translate(new Laya.Vector3(0, 2, 4));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        var directionLight = new Laya.DirectionLight();
        directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
        //设置灯光方向
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -2));

        //添加自定义模型
        var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
        Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
        //Capsule.transform.scale = new Laya.Vector3(0.4, 0.4, 0.4);

        /*var J3_DiffusePixeMat = new J3_DiffusePixe();
        Capsule.meshRenderer.material = J3_DiffusePixeMat;
        */

        scene.addChild(camera);
        scene.addChild(directionLight);
        scene.addChild(Capsule);
        this.AutoSetScene3d(scene);

        var J3_DiffuseVertexMat = new J3_DiffuseVertex();
        Capsule.meshRenderer.material = J3_DiffuseVertexMat;

    }
}