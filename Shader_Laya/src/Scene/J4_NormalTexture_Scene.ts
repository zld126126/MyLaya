import SingletonScene from "../SingletonScene";
import { J4_NormalTexture } from "../Lib/J4_NormalTexture";
export class J4_NormalTexture_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J4_NormalTexture.initShader();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var material = new J4_NormalTexture();

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = material; 
            scene.getChildAt(1).getChildAt(1).meshRenderer.material = material; 
            scene.getChildAt(2).meshRenderer.material = material; 

            Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function(tex) {
                material.DiffuseTexture = tex;
                console.log(tex);
            }));
            Laya.Texture2D.load("res/textures/Wall02_Normal.png", Laya.Handler.create(this, function(tex) {
                material.normalTexture = tex;
                console.log(tex);
            }));
            
            material.TilingOffset = new Laya.Vector4(2.0, 1.0, 0.0, 0.0);

            Laya.timer.frameLoop(1, this, function() {scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});

        }));
    }
}