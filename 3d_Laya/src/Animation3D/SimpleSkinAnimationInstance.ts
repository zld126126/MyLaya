import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Shader3D = Laya.Shader3D;
import Sprite3D = Laya.Sprite3D;
import Scene3D = Laya.Scene3D;
import Vector3 = Laya.Vector3;
import Animator = Laya.Animator;
import Handler = Laya.Handler;

export class SimpleSkinAnimationInstance extends SingletonScene {
    private animatorName: string[] = ["run", "chongci", "dead", "xuli", "stand"];
    private oriSprite3D: Sprite3D;
    private s_scene: Scene3D;
    private widthNums: number = 30;
    private step: number = 10;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        Shader3D.debugMode = true;
        this.s_scene = new Scene3D();
        this.s_scene.ambientColor = new Vector3(0.5, 0.5, 0.5);

        var path = GlobalConfig.ResPath + "res/threeDimen/texAnimation/Conventional/LayaMonkey.lh";
        Sprite3D.load(path, Handler.create(this, function (sprite): void {
            this.AutoSetScene3d(this.s_scene);
            this.s_scene.addChild(sprite);
            this.oriSprite3D = this.s_scene.getChildAt(0).getChildAt(2) as Sprite3D;
            this.sceneBuild();
            var animate: Animator = this.oriSprite3D.getComponent(Animator);
            animate.play("chongci");
        }));

    }
    cloneSprite(pos: Vector3, quaterial: Vector3) {
        var clonesprite: Sprite3D = this.oriSprite3D.clone() as Sprite3D;
        this.s_scene.addChild(clonesprite);
        var animate: Animator = clonesprite.getComponent(Animator);
        var nums: number = Math.round(Math.random() * 4);
        animate.play(this.animatorName[nums], 0, Math.random());
        clonesprite.transform.position = pos;
        clonesprite.transform.rotationEuler = quaterial;
    }

    sceneBuild() {
        var left: number = -0.5 * this.step * (this.widthNums);
        var right: number = -1 * left;
        for (var i: number = left; i < right; i += this.step)
            for (var j: number = left; j < right; j += this.step) {
                var xchange: number = (Math.random() - 0.5) * 10;
                var zchange: number = (Math.random() - 0.5) * 10;
                var quaterial: Vector3 = new Vector3(0, Math.random() * 180, 0);
                this.cloneSprite(new Vector3(i + xchange, 0, j + zchange), quaterial);
            }
    }
}