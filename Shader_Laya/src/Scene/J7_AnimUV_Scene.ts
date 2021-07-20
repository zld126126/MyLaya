import SingletonScene from "../SingletonScene";
import { J7_AnimUV } from "../Lib/J7_AnimUV";

export class J7_AnimUV_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J7_AnimUV.initShader();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var material = new J7_AnimUV();

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = material; 
            scene.getChildAt(1).getChildAt(1).meshRenderer.material = material; 
            scene.getChildAt(2).meshRenderer.material = material; 

            //关闭显示
            scene.getChildAt(1).getChildAt(0).meshRenderer.enable = false;
            scene.getChildAt(1).getChildAt(1).meshRenderer.enable = false;

            Laya.Texture2D.load("res/textures/water_normal.jpg", Laya.Handler.create(this, function(tex) {
                material.DiffuseTexture = tex;
                console.log(tex);
            }));		

            material.TilingOffset = new Laya.Vector4(2.0, 1.0, 0.0, 0.0);

            Laya.timer.frameLoop(1, this, function() {scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});

        }));
    }
}