import Sprite = Laya.Sprite;
import HitArea = Laya.HitArea;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class Sprite_Guide extends SingletonScene {
    private guideContainer: Sprite;
    private tipContainer: Sprite;
    private gameContainer: Sprite;

    private guideSteps: Array<any> =
        [
            { x: 40, y: 160, radius: 50, tip: GlobalConfig.ResPath + "res/guide/help6.png", tipx: 50, tipy: 50 },
            { x: 220, y: 150, radius: 20, tip: GlobalConfig.ResPath + "res/guide/help4.png", tipx: 150, tipy: 100 },
            { x: 280, y: 150, radius: 30, tip: GlobalConfig.ResPath + "res/guide/help3.png", tipx: 200, tipy: 80 }
        ];
    private guideStep: number = 0;
    public hitArea: HitArea;
    private interactionArea: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
    }

    private firstStep(): void {
        //绘制一个蓝色方块，不被抠图
        this.gameContainer = new Sprite();
        this.gameContainer.loadImage(GlobalConfig.ResPath + "res/guide/crazy_snowball.png");
        this.addChild(this.gameContainer);

        // 引导所在容器
        this.guideContainer = new Sprite();
        // 设置容器为画布缓存
        this.guideContainer.cacheAs = "bitmap";
        this.addChild(this.guideContainer);
        this.gameContainer.on("click", this, this.nextStep);

        //绘制遮罩区，含透明度，可见游戏背景
        var maskArea: Sprite = new Sprite();
        maskArea.alpha = 0.5;
        maskArea.graphics.drawRect(0, 0, 321, 181, "#000000");
        this.guideContainer.addChild(maskArea);

        //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
        this.interactionArea = new Sprite();
        //设置叠加模式
        this.interactionArea.blendMode = "destination-out";
        this.guideContainer.addChild(this.interactionArea);

        this.hitArea = new HitArea();
        this.hitArea.hit.drawRect(0, 0, 321, 181, "#000000");

        this.guideContainer.hitArea = this.hitArea;
        this.guideContainer.mouseEnabled = true;

        this.tipContainer = new Sprite();
        this.addChild(this.tipContainer);
    }

    private nextStep(): void {
        if (!this.isShow) {
            return;
        }

        if (this.guideStep == this.guideSteps.length) {
            this.removeChild(this.guideContainer);
            this.removeChild(this.tipContainer);
        }
        else {
            var step: any = this.guideSteps[this.guideStep++];

            this.hitArea.unHit.clear();
            this.hitArea.unHit.drawCircle(step.x, step.y, step.radius, "#000000");

            this.interactionArea.graphics.clear();
            this.interactionArea.graphics.drawCircle(step.x, step.y, step.radius, "#000000");

            this.tipContainer.graphics.clear();
            this.tipContainer.loadImage(step.tip);
            this.tipContainer.pos(step.tipx, step.tipy);
        }
    }

    private Start() {
        this.firstStep();
        this.nextStep();
    }

    private End() {
        this.removeChild(this.gameContainer);
        this.removeChild(this.guideContainer);
        this.removeChild(this.tipContainer);
        this.guideStep = 0;
    }

    public Show() {
        this.visible = true;
        this.Start();
    }

    public Hide() {
        this.visible = false;
        this.End();
    }
}