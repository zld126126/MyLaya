import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class Sky_SkyBox extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private camera: Laya.Camera;
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();
        this.s_scene = new Laya.Scene3D();

        this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.rotate(new Laya.Vector3(10, 0, 0), true, false);
        this.camera.addComponent(CameraMoveScript);
        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        //天空盒
        Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, function (mat: Laya.SkyBoxMaterial): void {
            this.AutoSetScene3d(this.s_scene);
            var skyRenderer: Laya.SkyRenderer = this.s_scene.skyRenderer;
            skyRenderer.mesh = Laya.SkyBox.instance;
            skyRenderer.material = mat;
            Laya.timer.frameLoop(1, this, this.onFrameLoop);
            Laya.timer.frameLoop(1, this, function (): void {
                this.s_scene.skyRenderer.material.exposure = Math.sin(this.exposureNumber += 0.01) + 1;
                this.s_scene.skyRenderer.material.rotation += 0.01;
            });
        }))
    }
}