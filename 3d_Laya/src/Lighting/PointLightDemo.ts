import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class PointLightDemo extends SingletonScene {
    private _temp_position: Laya.Vector3 = new Laya.Vector3();
    private _temp_quaternion: Laya.Quaternion = new Laya.Quaternion();
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();
        this.s_scene.ambientColor = new Laya.Vector3(0.1, 0.1, 0.1);

        var camera: Laya.Camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //点光
        var pointLight: Laya.PointLight = this.s_scene.addChild(new Laya.PointLight()) as Laya.PointLight;
        pointLight.color = new Laya.Vector3(1.0, 0.5, 0.0);
        pointLight.transform.position = new Laya.Vector3(0.4, 0.4, 0.0);
        pointLight.range = 3.0;

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite: Laya.Sprite3D): void {
            var grid: Laya.Sprite3D = this.s_scene.addChild(sprite) as Laya.Sprite3D;
            this.AutoSetScene3d(this.s_scene);

            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey: Laya.Sprite3D): void {
                this.s_scene.addChild(layaMonkey);
                var aniSprite3d: Laya.Sprite3D = layaMonkey.getChildAt(0) as Laya.Sprite3D;
                var animator: Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;

                var state: Laya.AnimatorState = new Laya.AnimatorState();
                state.name = "attack";
                state.clipStart = 75 / 150;
                state.clipEnd = 110 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);

                animator.play("attack");

                Laya.timer.frameLoop(1, this, function (): void {

                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._temp_quaternion);
                    Laya.Vector3.transformQuat(pointLight.transform.position, this._temp_quaternion, this._temp_position);
                    pointLight.transform.position = this._temp_position;
                });
            }));

        }));
    }
}