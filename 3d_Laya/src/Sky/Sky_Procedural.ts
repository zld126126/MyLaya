import { CameraMoveScript } from "../common/CameraMoveScript";
import SingletonScene from "../SingletonScene";

export class Sky_Procedural extends SingletonScene {
    private directionLight: Laya.DirectionLight;
    private rotation: Laya.Vector3;
    private s_scene: Laya.Scene3D;
    constructor() {
        // //初始化3D配置
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();

        //初始化3D场景
        this.s_scene = new Laya.Scene3D();

        //初始化相机并设置清除标记为天空
        var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.addComponent(CameraMoveScript);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        //初始化平行光
        this.directionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        var mat = this.directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        this.directionLight.transform.worldMatrix = mat;
        this.rotation = new Laya.Vector3(-0.01, 0, 0);

        //初始化天空渲染器
        var skyRenderer: Laya.SkyRenderer = this.s_scene.skyRenderer;
        skyRenderer.mesh = Laya.SkyDome.instance;
        skyRenderer.material = new Laya.SkyProceduralMaterial();
        //旋转平行光,模拟太阳轨迹
        Laya.timer.frameLoop(1, this, this.onFrameLoop);

        this.AutoSetScene3d(this.s_scene);
    }

    onFrameLoop() {
        this.directionLight.transform.rotate(this.rotation);
    }
}