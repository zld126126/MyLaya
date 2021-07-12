import { CameraMoveScript } from "../common/CameraMoveScript";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class DirectionLightDemo extends SingletonScene {
    private _quaternion: Laya.Quaternion = new Laya.Quaternion();
    private _direction: Laya.Vector3 = new Laya.Vector3();
    private s_scene: Laya.Scene3D;
    constructor() {
        super();
        // Laya3D.init(0, 0,);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        var camera: Laya.Camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000))) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //方向光
        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        //设置灯光方向
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite: Laya.Sprite3D): void {
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            EventManager.DispatchEvent(EventType.SETSCENE3D, this.s_scene);
            var grid: Laya.Sprite3D = this.s_scene.addChild(sprite) as Laya.Sprite3D;

            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey: Laya.Sprite3D): void {
                var layaMonkey: Laya.Sprite3D = this.s_scene.addChild(layaMonkey) as Laya.Sprite3D;
                var aniSprite3d: Laya.Sprite3D = layaMonkey.getChildAt(0) as Laya.Sprite3D;
                var animator: Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;

                var state: Laya.AnimatorState = new Laya.AnimatorState();
                state.name = "run";
                state.clipStart = 40 / 150;
                state.clipEnd = 70 / 150;
                state.clip = animator.getDefaultState().clip;
                animator.addState(state);

                animator.play("run");

                Laya.timer.frameLoop(1, this, function (): void {
                    Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
                    directionLight.transform.worldMatrix.getForward(this._direction);
                    Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                    directionLight.transform.worldMatrix.setForward(this._direction);
                    var mat = directionLight.transform.worldMatrix;
                    mat.setForward(this._direction);
                    directionLight.transform.worldMatrix = mat;
                });
            }));

        }));

    }
}