import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class BlinnPhong_NormalMap extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private rotation: Laya.Vector3 = new Laya.Vector3(0, 0.01, 0);
    private normalMapUrl: Array<string> = [
        GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizardeye_norm.png",
        GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png",
        GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/rock_norm.png"
    ];
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera: Laya.Camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.6, 1.1));
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.transform.worldMatrix = mat;
        directionLight.color = new Laya.Vector3(1, 1, 1);

        Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, this.onComplete), null, Laya3D.HIERARCHY);
    }
    public onComplete(s: any): void {
        this.AutoSetScene3d(this.s_scene);
        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, function (sprite: Laya.Sprite3D): void {
            var monster1: Laya.Sprite3D = this.s_scene.addChild(sprite) as Laya.Sprite3D;
            monster1.transform.position = new Laya.Vector3(-0.6, 0, 0);
            monster1.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
            var monster2: Laya.Sprite3D = Laya.Sprite3D.instantiate(monster1, this.s_scene, false, new Laya.Vector3(0.6, 0, 0));
            monster2.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
            for (var i: number = 0; i < monster2.getChildByName("lizard").numChildren; i++) {
                var meshSprite3D: Laya.MeshSprite3D = monster2.getChildByName("lizard").getChildAt(i) as Laya.MeshSprite3D;
                var material: Laya.BlinnPhongMaterial = meshSprite3D.meshRenderer.material as Laya.BlinnPhongMaterial;
                //法线贴图
                Laya.Texture2D.load(this.normalMapUrl[i], Laya.Handler.create(this, function (mat: Laya.BlinnPhongMaterial, texture: Laya.Texture2D): void {
                    mat.normalTexture = texture;
                }, [material]));
            }

            Laya.timer.frameLoop(1, this, function (): void {
                monster1.transform.rotate(this.rotation);
                monster2.transform.rotate(this.rotation);
            });
        }));

    }
}