import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class EffectMaterialDemo extends SingletonScene {
    private rotation: Laya.Vector3;
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();
        this.rotation = new Laya.Vector3(0, 0.01, 0);

        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);

        var earth = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere())) as Laya.MeshSprite3D;
        earth.transform.position = new Laya.Vector3(0, 0, 0);
        //创建EffectMaterial材质
        var material = new Laya.EffectMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
            this.AutoSetScene3d(this.s_scene);

            //设置纹理
            material.texture = texture;
            //设置材质颜色
            material.color = new Laya.Vector4(0, 0, 0.6, 1);
        }));
        earth.meshRenderer.material = material;

        Laya.timer.frameLoop(1, this, function () {
            earth.transform.rotate(this.rotation, false);
        });
    }
}