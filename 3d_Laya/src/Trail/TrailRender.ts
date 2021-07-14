import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class TrailRender extends SingletonScene{
    s_scene: Laya.Scene3D;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // //显示性能面板
        // Laya.Stat.show();

        //加载场景
        this.s_scene = new Laya.Scene3D();
    
        //加载相机
        var camera = new Laya.Camera(0, 0.1, 1000);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 8, 10));
        camera.transform.rotate(new Laya.Vector3(-45, 0, 0), true, false);
        //设置相机清除标识为固定颜色
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;

        //创建平行光
        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        //设置平行光颜色
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (plane: Laya.Sprite3D): void {
            this.AutoSetScene3d(this.s_scene);
            this.s_scene.addChild(plane);
        }));

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, function (sprite: Laya.Sprite3D): void {
            this.s_scene.addChild(sprite);
        }));
    }
}