import SingletonScene from "../SingletonScene";
//import { J6_shadow } from "../Lib/J6_shadow";
/*
lightMap这块有bug
1.只有在unity场景已经烘焙了lightmap的情况下，才可以导出mesh的UV2信息，但受LightmapScaleOffset属性的影响，直接在shader里边调用uv2，会发生错位现像。
2.在模型由uv2的情况下，正常导出mesh，不会携带uv2信息。
*/

export class J6_shadow_Scene extends SingletonScene{
    constructor(){
        super();

        this.init();
    }
    init() {

        //初始化Shader
        window['J6_shadow_initShader']();

        //添加场景
        Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            //灯光开启阴影
            directionLight.shadow = true;
            //可见阴影距离
            directionLight.shadowDistance = 10;
            //生成阴影贴图尺寸
            directionLight.shadowResolution = 4096;
            //生成阴影贴图数量
            directionLight.shadowPSSMCount = 1;
            //模糊等级,越大越高,更耗性能
            directionLight.shadowPCFType = 3;

            var shadowMat01 = new window['NewJ6_shadow']();
            var shadowMat02 = new window['NewJ6_shadow']();

            console.log(scene.getChildAt(2));

            scene.getChildAt(1).getChildAt(0).meshRenderer.material = shadowMat01; 
            scene.getChildAt(1).getChildAt(0).meshRenderer.castShadow = true
            scene.getChildAt(1).getChildAt(0).meshRenderer.receiveShadow = true

            scene.getChildAt(2).meshRenderer.material = shadowMat02; 
            scene.getChildAt(2).meshRenderer.receiveShadow = true;

            Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function(tex) {
                shadowMat01.DiffuseTexture = tex;
                shadowMat02.DiffuseTexture = tex;
                console.log(tex);
            }));

            //Laya.timer.frameLoop(1, this, function() {scene.transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});

        }));
    }
}