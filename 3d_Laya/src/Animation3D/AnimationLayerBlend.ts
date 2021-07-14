import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class AnimationLayerBlend extends SingletonScene {
    private motionCross: Boolean = false;
    private blendType: number = 0;
    private motionIndex: number = 0;
    private motions: Array<string> = ["run", "run_2", "attack", "attack_1", "attack_2", "dead", "idle_2", "idle_3", "idle_4", "idle4", "reload", "replace", "replace_2", "stop"];
    private btns: Laya.Button[] = [];
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_Sniper/Sniper.ls", Laya.Handler.create(this, this.sceneLoaded));
    }
    private sceneLoaded(scene: Laya.Scene3D): void {
        this.AutoSetScene3d(scene);
        var animator: Laya.Animator = scene.getChildAt(2).getComponent(Laya.Animator);

        this.addbtn(100, 100, 160, 30, "动画过渡:否", 20, function (e: Laya.Event): void {
            this.motionCross = !this.motionCross;
            if (this.motionCross)
                (e.target as Laya.Button).label = "动画过渡:是";
            else
                (e.target as Laya.Button).label = "动画过渡:否";
        });

        this.addbtn(100, 160, 160, 30, "混合模式:全身", 20, function (e: Laya.Event): void {
            this.blendType++;
            (this.blendType === 3) && (this.blendType = 0);
            switch (this.blendType) {
                case 0:
                    (e.target as Laya.Button).label = "混合模式:全身";
                    break;
                case 1:
                    (e.target as Laya.Button).label = "混合模式:上身";
                    break;
                case 2:
                    (e.target as Laya.Button).label = "混合模式:下身";
                    break;
            }
        });

        this.addbtn(100, 220, 260, 40, "切换动作:attack_2", 28, function (e: Laya.Event): void {
            switch (this.blendType) {
                case 0:
                    if (this.motionCross) {
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                    } else {
                        animator.play(this.motions[this.motionIndex], 0);
                        animator.play(this.motions[this.motionIndex], 1);
                    }
                    break;
                case 1:
                    if (this.motionCross)
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                    else
                        animator.play(this.motions[this.motionIndex], 0);
                    break;
                case 2:
                    if (this.motionCross)
                        animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                    else
                        animator.play(this.motions[this.motionIndex], 1);
                    break;
            }
            (e.target as Laya.Button).label = "切换动作:" + this.motions[this.motionIndex];
            this.motionIndex++;
            (this.motionIndex === this.motions.length) && (this.motionIndex = 0);
        });
    }

    private addbtn(x: number, y: number, width: number, height: number, text: string, size: number, clickFun: Function): void {
        var thiss = this;
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function (): void {
            var changeActionButton: Laya.Button = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text)) as Laya.Button;
            changeActionButton.size(width, height);
            changeActionButton.labelBold = true;
            changeActionButton.labelSize = size;
            changeActionButton.sizeGrid = "4,4,4,4";
            changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
            changeActionButton.pos(x, y);
            changeActionButton.on(Laya.Event.CLICK, thiss, clickFun);
            this.btns.push(changeActionButton);
        }));
    }

    public Show() {
        super.Show();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = true;
        }
    }

    public Hide() {
        super.Hide();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = false;
        }
    }
}