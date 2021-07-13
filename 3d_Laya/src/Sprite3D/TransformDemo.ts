import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class TransformDemo extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private position: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private position1: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private rotate: Laya.Vector3 = new Laya.Vector3(0, 1, 0);
    private scale: Laya.Vector3 = new Laya.Vector3();
    private rotate1: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private scaleDelta: number = 0;
    private scaleValue: number = 0;

    private layaMonkey_clone1: Laya.Sprite3D;
    private layaMonkey_clone2: Laya.Sprite3D;
    private layaMonkey_clone3: Laya.Sprite3D;

    private clone1Transform: Laya.Transform3D;
    private clone2Transform: Laya.Transform3D;
    private clone3Transform: Laya.Transform3D;

    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //创建场景
        this.s_scene = new Laya.Scene3D();
        //Laya.stage.addChild(this.scene);

        //添加相机
        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 0.8, 5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //添加光照
        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        //批量预加载资源
        Laya.loader.create([
            GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
            GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
        ], Laya.Handler.create(this, this.onComplete));
    }

    onComplete() {
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
        //加载地面
        var grid = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh")) as Laya.Sprite3D;
        //加载静态小猴子
        var staticLayaMonkey = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"))) as Laya.MeshSprite3D;
        //设置材质
        staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
        //设置位置
        var staticMonkeyTransform = staticLayaMonkey.transform;
        var staticPos = staticMonkeyTransform.position;
        staticPos.setValue(0, 0, 0.5);
        staticMonkeyTransform.position = staticPos;
        //设置缩放
        var staticScale = staticMonkeyTransform.localScale;
        staticScale.setValue(0.3, 0.3, 0.3);
        staticMonkeyTransform.localScale = staticScale;
        //设置旋转
        staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);

        staticLayaMonkey.removeSelf();

        //克隆sprite3d
        this.layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
        this.layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
        this.layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
        //得到三个Transform3D
        this.clone1Transform = this.layaMonkey_clone1.transform;
        this.clone2Transform = this.layaMonkey_clone2.transform;
        this.clone3Transform = this.layaMonkey_clone3.transform;

        //平移
        this.position1.setValue(-1.5, 0, 0.0);
        this.clone2Transform.translate(this.position1);
        this.position1.setValue(1.0, 0, 0.0);
        this.clone3Transform.translate(this.position1);
        //旋转
        this.rotate1.setValue(0, 60, 0);
        this.clone2Transform.rotate(this.rotate1, false, false);
        //缩放
        var scale = this.clone3Transform.localScale;
        scale.setValue(0.1, 0.1, 0.1);
        this.clone3Transform.localScale = scale;

        //设置定时器执行,定时重复执行(基于帧率)
        Laya.timer.frameLoop(1, this, this.animate);
    }

    animate() {
        if (!this.isShow) {
            return;
        }
        this.scaleValue = Math.sin(this.scaleDelta += 0.1);

        this.position.y = Math.max(0, this.scaleValue / 2);;
        this.layaMonkey_clone1.transform.position = this.position;

        this.layaMonkey_clone2.transform.rotate(this.rotate, false, false);

        this.scale.x = this.scale.y = this.scale.z = Math.abs(this.scaleValue) / 5;
        this.layaMonkey_clone3.transform.localScale = this.scale;
    }
}