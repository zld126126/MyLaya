import { CameraMoveScript } from "../Common/CameraMoveScript";
import { J3_BlinnPhone } from "../Lib/J3_BlinnPhone";
import { J3_DiffBlinnPhone } from "../Lib/J3_DiffBlinnPhone";
import SingletonScene from "../SingletonScene";

export class J3_BlinnPhone_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }

    init(){
         //初始化Shader
         J3_BlinnPhone.initShader();
         J3_DiffBlinnPhone.initShader();
         //添加3D场景
         var scene = new Laya.Scene3D();
         scene.ambientColor = new Laya.Vector3(0.2, 0.1, 0.2);
 
         //添加照相机
         var camera = new Laya.Camera(0, 0.1, 100);
         scene.addChild(camera);
         camera.transform.translate(new Laya.Vector3(0, 2, 4));
         camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
         camera.addComponent(CameraMoveScript);
 
         var directionLight = new Laya.DirectionLight();
         scene.addChild(directionLight);
         directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
         //设置灯光方向
         directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, 0));
 
         //添加自定义模型
         var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
         scene.addChild(Capsule);
         Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
         //Capsule.transform.scale = new Laya.Vector3(0.4, 0.4, 0.4);
 
         //var J3_BlinnPhoneMat = new J3_BlinnPhone();
         var J3_DiffBlinnPhoneMat = new J3_DiffBlinnPhone();
 
         //Capsule.meshRenderer.material = J3_BlinnPhoneMat;
         Capsule.meshRenderer.material = J3_DiffBlinnPhoneMat;
 
         this.AutoSetScene3d(scene);
 
         Laya.timer.frameLoop(1, this, function () { Capsule.transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
    }
}