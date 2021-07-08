import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;

export class Interaction_Rotate extends SingletonScene {
    private sp: Sprite;
    private preRadian: number = 0;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.createSprite();

        Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
    }

    private createSprite(): void {
        this.sp = new Sprite();
        var w: number = 200, h: number = 300;
        this.sp.graphics.drawRect(0, 0, w, h, "#FF7F50");
        this.sp.size(w, h);
        this.sp.pivot(w / 2, h / 2);
        this.sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.addChild(this.sp);

        this.sp.on(Event.MOUSE_DOWN, this, this.onMouseDown);
    }

    private onMouseDown(e: Event): void {
        if (!this.isShow) {
            return;
        }
        var touches: Array<any> = e.touches;

        if (touches && touches.length == 2) {
            this.preRadian = Math.atan2(
                touches[0].stageY - touches[1].stageY,
                touches[0].stageX - touches[1].stageX);

            Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
        }
    }

    private onMouseMove(e: Event): void {
        if (!this.isShow) {
            return;
        }
        var touches: Array<any> = e.touches;
        if (touches && touches.length == 2) {
            var nowRadian: number = Math.atan2(
                touches[0].stageY - touches[1].stageY,
                touches[0].stageX - touches[1].stageX);

            this.sp.rotation += 180 / Math.PI * (nowRadian - this.preRadian);

            this.preRadian = nowRadian;
        }
    }

    private onMouseUp(e: Event): void {
        if (!this.isShow) {
            return;
        }
        Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
    }
}