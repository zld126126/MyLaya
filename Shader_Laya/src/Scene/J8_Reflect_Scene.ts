import SingletonScene from "../SingletonScene";
import { J8_Reflect } from "../Lib/J8_Reflect";

export class J8_Reflect_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J8_Reflect.initShader();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var material = new J8_Reflect();

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = material; 
            scene.getChildAt(1).getChildAt(1).meshRenderer.material = material; 
            scene.getChildAt(2).meshRenderer.material = material; 

            //直接这么调用是不行的
            material.ReflectTexture = scene.reflectionTexture;

            //这么调用也不行
            //Laya.TextureCube.load("res/textures/Cubemap/Cubemap_0.ltc", Laya.Handler.create(this, function(tex) {

            //    console.log(Laya3D.TextureCube(tex));
            //    material.ReflectTexture = Laya.Laya3D._loadTextureCube(tex);

            //}));

            Laya.Texture2D.load("res/textures/MatCap/matcap017.jpg", Laya.Handler.create(this, function(tex) {
                material.DiffuseTexture = tex;
                console.log(tex);
            }));

            material.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);

            Laya.timer.frameLoop(1, this, function() {scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});
            Laya.timer.frameLoop(1, this, function() {scene.getChildAt(2).transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});

        }));
    }
}