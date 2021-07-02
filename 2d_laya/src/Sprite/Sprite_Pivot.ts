import Sprite = Laya.Sprite;
import Event = Laya.Event;
import SingletonScene from "../SingletonScene";

export class Sprite_Pivot extends SingletonScene {
    private sp1: Sprite;
    private sp2: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApes();
    }

    private createApes(): void {
        var gap: number = 300;

        this.sp1 = new Sprite();
        this.sp1.loadImage("res/apes/monkey2.png");

        this.sp1.pos((Laya.stage.width - gap) / 2, Laya.stage.height / 2);
        //设置轴心点为中心
        this.sp1.pivot(55, 72);
        this.addChild(this.sp1);

        //不设置轴心点默认为左上角
        this.sp2 = new Sprite();
        this.sp2.loadImage("res/apes/monkey2.png");
        this.sp2.pos((Laya.stage.width + gap) / 2, Laya.stage.height / 2);
        this.addChild(this.sp2);

        Laya.timer.frameLoop(1, this, this.animate);
    }

    private animate(e: Event): void {
        if (!this.isShow) {
            return;
        }
        this.sp1.rotation += 2;
        this.sp2.rotation += 2;
    }
}