import { CameraMoveScript } from "./CameraMoveScript";

export class DirectionLightDemo {
    directionLight: any;
    quaternion: any;
    direction: any;
    scene: any;
    constructor() {
        this.quaternion = new Laya.Quaternion();
        this.direction = new Laya.Vector3();
        Laya3D.init(0, 0);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        Laya.Stat.show();
        this.scene = Laya.stage.addChild(new Laya.Scene3D());
        let camera = (this.scene.addChild(new Laya.Camera(0, 0.1, 1000)));
        camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);
        this.directionLight = this.scene.addChild(new Laya.DirectionLight());
        this.directionLight.color = new Laya.Vector3(1, 1, 1);
        let mat = this.directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        this.directionLight.transform.worldMatrix = mat;
        Laya.Sprite3D.load("res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
            let grid = this.scene.addChild(sprite);
            Laya.Sprite3D.load("res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.loadSprite3D));
        }));
    }
    loadSprite3D(sp) {
        let layaMonkey = this.scene.addChild(sp);
        let aniSprite3d = layaMonkey.getChildAt(0);
        let animator = aniSprite3d.getComponent(Laya.Animator);
        let state = new Laya.AnimatorState();
        state.name = "run";
        state.clipStart = 40 / 150;
        state.clipEnd = 70 / 150;
        state.clip = animator.getDefaultState().clip;
        animator.getControllerLayer(0).addState(state);
        animator.play("run");
        Laya.timer.frameLoop(1, this, this.onFrameLoop);
    }

    onFrameLoop() {
        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this.quaternion);
        this.directionLight.transform.worldMatrix.getForward(this.direction);
        Laya.Vector3.transformQuat(this.direction, this.quaternion, this.direction);
        this.directionLight.transform.worldMatrix.setForward(this.direction);
        let mat = this.directionLight.transform.worldMatrix;
        mat.setForward(this.direction);
        this.directionLight.transform.worldMatrix = mat;
    }
}
