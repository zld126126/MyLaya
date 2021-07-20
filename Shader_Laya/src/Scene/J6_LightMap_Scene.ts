import SingletonScene from "../SingletonScene";
import { J6_LightMap } from "../Lib/J6_LightMap";
/*
lightMap这块有bug
1.只有在unity场景已经烘焙了lightmap的情况下，才可以导出mesh的UV2信息，但受LightmapScaleOffset属性的影响，直接在shader里边调用uv2，会发生错位现像。
2.在模型由uv2的情况下，正常导出mesh，不会携带uv2信息。
*/

export class J6_LightMap_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J6_LightMap.initShader();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var LightMapMat01 = new J6_LightMap();
            var LightMapMat02 = new J6_LightMap();

            console.log(scene.getChildAt(2));

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = LightMapMat01; 
            scene.getChildAt(2).meshRenderer.material = LightMapMat02; 
            
            //关闭显示
            //scene.getChildAt(1).getChildAt(0).meshRenderer.enable = false;
            //scene.getChildAt(1).getChildAt(1).meshRenderer.enable = false;

            Laya.Texture2D.load("res/models/lightMap/Assets/A-mesh/lightMap/Lightmap-1_comp_light.png", Laya.Handler.create(this, function(tex) {
                LightMapMat01.DiffuseTexture = tex;
                console.log(tex);
            }));

            Laya.Texture2D.load("res/models/lightMap/Assets/A-mesh/lightMap/Lightmap-0_comp_light.png", Laya.Handler.create(this, function(tex) {
                LightMapMat02.DiffuseTexture = tex;
                console.log(tex);
            }));		

            //Laya.timer.frameLoop(1, this, function() {scene.transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});

        }));
    }
}