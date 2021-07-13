import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class BlinnPhongMaterialLoad extends SingletonScene {
    private rotation: Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private s_scene: Laya.Scene3D;
    constructor() {
        super();

        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.9, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);

        Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh: Laya.Mesh): void {
            this.AutoSetScene3d(this.s_scene);

            var layaMonkey: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
            //加载材质
            Laya.Material.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat", Laya.Handler.create(null, function (mat: Laya.Material): void {
                layaMonkey.meshRenderer.material = mat;
            }));
            layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);

            Laya.timer.frameLoop(1, this, function (): void {
                layaMonkey.transform.rotate(this.rotation, false);
            });
        }))
    }
}