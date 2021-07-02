import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;

export class Sprite_RoateAndScale extends SingletonScene {
    private ape: Sprite;
    private scaleDelta: number = 0;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApe();
    }

    private createApe(): void {
        this.ape = new Sprite();

        this.ape.loadImage("res/apes/monkey2.png");
        this.addChild(this.ape);
        this.ape.pivot(55, 72);
        this.ape.x = Laya.stage.width / 2;
        this.ape.y = Laya.stage.height / 2;

        Laya.timer.frameLoop(1, this, this.animate);
    }

    private animate(e: Event): void {
        if (!this.isShow) {
            return;
        }
        this.ape.rotation += 2;

        //心跳缩放
        this.scaleDelta += 0.02;
        var scaleValue: number = Math.sin(this.scaleDelta);
        this.ape.scale(scaleValue, scaleValue);
    }
}