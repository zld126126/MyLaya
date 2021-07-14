import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class EnvironmentalReflection extends SingletonScene {

    private rotation: Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private sprite3D: Laya.Sprite3D;
    private scene: Laya.Scene3D = null;
    private teapot: Laya.MeshSprite3D = null;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        //创建场景
        var scene = new Laya.Scene3D();
        //Laya.stage.addChild(scene);

        //设置场景的反射模式(全局有效)
        scene.reflectionMode = Laya.Scene3D.REFLECTIONMODE_CUSTOM;

        //初始化照相机
        var camera = new Laya.Camera(0, 0.1, 100);
        scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 2, 3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        //为相机添加视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);
        //设置相机的清除标识为天空盒
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        //天空盒
        Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, function (mat: Laya.SkyBoxMaterial): void {
            this.AutoSetScene3d(scene);

            //获取相机的天空盒渲染体
            var skyRenderer = camera.skyRenderer as Laya.SkyRenderer;
            //设置天空盒mesh
            skyRenderer.mesh = Laya.SkyBox.instance;
            //设置天空盒材质
            skyRenderer.material = mat;
            //设置场景的反射贴图
            scene.customReflection = mat.textureCube;
            //设置曝光强度
            var exposureNumber: Number = 0;
            mat.exposure = 0.6 + 1;
        }));
        //创建平行光
        var directionLight = new Laya.DirectionLight();
        scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);

        //添加一个精灵
        this.sprite3D = new Laya.Sprite3D();
        scene.addChild(this.sprite3D);
        //加载Mesh
        Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/teapot/teapot-Teapot001.lm", Laya.Handler.create(this, function (mesh: Laya.Mesh): void {
            this.teapot = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            this.teapot.transform.position = new Laya.Vector3(0, 1.75, 2);
            this.teapot.transform.rotate(new Laya.Vector3(-90, 0, 0), false, false);
            this.sprite3D.addChild(this.teapot);
            //实例PBR材质
            var pbrMat = new Laya.PBRStandardMaterial();
            //开启该材质的反射
            // pbrMat.enableReflection = true;
            //设置材质的金属度，尽量高点，反射效果更明显
            pbrMat.metallic = 1;
            this.teapot.meshRenderer.material = pbrMat;
        }));

    }
}
