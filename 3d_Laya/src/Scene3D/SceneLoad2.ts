import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class SceneLoad2 extends SingletonScene {
    constructor() {
        super();
        //初始化引擎
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();

        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene: Laya.Scene3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, scene);
            //Laya.stage.addChild(scene);
            //开启雾化效果
            scene.enableFog = true;
            //设置雾化的颜色
            scene.fogColor = new Laya.Vector3(0, 0, 0.6);
            //设置雾化的起始位置，相对于相机的距离
            scene.fogStart = 10;
            //设置雾化最浓处的距离。
            scene.fogRange = 40;
            //设置场景环境光
            scene.ambientColor = new Laya.Vector3(0.6, 0, 0);

            //添加相机
            var camera = new Laya.Camera();
            scene.addChild(camera);
            //调整相机的位置
            camera.transform.translate(new Laya.Vector3(10, 15, -25));
            camera.transform.rotate(new Laya.Vector3(-20, 170, 0), false, false);
            //设置相机横纵比
            camera.aspectRatio = 0;
            //设置相机近距裁剪
            camera.nearPlane = 0.1;
            //设置相机远距裁剪
            camera.farPlane = 1000;
            //相机设置清楚标记
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            //设置摄像机视野范围（角度）
            camera.fieldOfView = 60;
            //设置背景颜色
            //camera.clearColor = new Vector4(0,0,0.6,1);    
            //加入摄像机移动控制脚本
            camera.addComponent(CameraMoveScript);

            //加载相机天空盒材质
            Laya.Material.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox3/SkyBox.lmat", Laya.Handler.create(this, function (mat: Laya.Material): void {
                var skyRenderer = camera.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = mat;
            }));

            //创建方向光
            var light = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
            //移动灯光位置
            light.transform.translate(new Laya.Vector3(0, 2, 5));
            //调整灯光方向
            var mat: Laya.Matrix4x4 = light.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(0, -5, 1));
            light.transform.worldMatrix = mat;
            //设置灯光漫反射颜色
            light.diffuseColor = new Laya.Vector3(0.3, 0.3, 0.3);

            //激活场景中的两个子节点
            (scene.getChildByName('Scenes').getChildByName('HeightMap') as Laya.MeshSprite3D).active = false;
            (scene.getChildByName('Scenes').getChildByName('Area') as Laya.MeshSprite3D).active = false;
        }));

    }
}
