import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class BlinnPhong_DiffuseMap extends SingletonScene {
    private rotation: Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera: Laya.Camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        //创建公用的mesh
        var sphereMesh: Laya.Mesh = Laya.PrimitiveMesh.createSphere();
        var earth1: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh)) as Laya.MeshSprite3D;
        earth1.transform.position = new Laya.Vector3(-0.6, 0, 0);

        var earth2: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh)) as Laya.MeshSprite3D;
        earth2.transform.position = new Laya.Vector3(0.6, 0, 0);
        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        //漫反射贴图
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture: Laya.Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            material.albedoTexture = texture;
        }));
        earth2.meshRenderer.material = material;

        Laya.timer.frameLoop(1, this, function (): void {
            earth1.transform.rotate(this.rotation, false);
            earth2.transform.rotate(this.rotation, false);
        });
    }
}