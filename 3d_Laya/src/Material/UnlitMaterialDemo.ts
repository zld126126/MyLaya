import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class UnlitMaterialDemo extends SingletonScene {
    private rotation: Laya.Vector3;
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera = new Laya.Camera(0, 0.1, 100);
        this.s_scene.addChild(camera);
        camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;

        var directionLight = new Laya.DirectionLight();
        this.s_scene.addChild(directionLight);
        directionLight.color = new Laya.Vector3(1, 1, 1);

        this.rotation = new Laya.Vector3(0, 0.01, 0);

        //创建公用的Mesh
        var sphereMesh: Laya.Mesh = Laya.PrimitiveMesh.createSphere();
        var earth1 =  this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh)) as Laya.MeshSprite3D;
        earth1.transform.position = new Laya.Vector3(-0.6, 0, 0);
        var earth2 =  this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh)) as Laya.MeshSprite3D;
        earth2.transform.position = new Laya.Vector3(0.6, 0, 0);

        //创建Unlit材质
        var material = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
            this.AutoSetScene3d(this.s_scene);

            //设置反照率贴图
            material.albedoTexture = texture;
            //设置反照率强度
            material.albedoIntensity = 1;
        }));
        earth1.meshRenderer.material = material;

        //创建Unlit材质
        var material2 = new Laya.UnlitMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
            //设置反照率贴图
            material2.albedoTexture = texture;
            //设置反照率强度
            material2.albedoIntensity = 1;
            //设置材质颜色
            material2.albedoColor = new Laya.Vector4(0, 0, 0.6, 1);
        }));
        earth2.meshRenderer.material = material2;

        Laya.timer.frameLoop(1, this, function () {
            earth1.transform.rotate(this.rotation, false);
            earth2.transform.rotate(this.rotation, false);
        });
    }
}