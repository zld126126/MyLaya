import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Ease = Laya.Ease;
import Tween = Laya.Tween;

export class Interaction_CustomEvent extends SingletonScene {
    public static ROTATE: string = "rotate";

    private sp: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createSprite();
    }

    private createSprite(): void {
        this.sp = new Sprite();
        this.sp.graphics.drawRect(0, 0, 200, 200, "#D2691E");
        this.sp.pivot(100, 100);

        this.sp.x = Laya.stage.width / 2;
        this.sp.y = Laya.stage.height / 2;

        this.sp.size(200, 200);
        this.addChild(this.sp);

        this.sp.on(Interaction_CustomEvent.ROTATE, this, this.onRotate);    // 侦听自定义的事件
        this.sp.on(Event.CLICK, this, this.onSpriteClick);
    }

    private onSpriteClick(e: Event): void {
        if (!this.isShow) {
            return;
        }
        var randomAngle: number = Math.random() * 180;
        //发送自定义事件
        this.sp.event(Interaction_CustomEvent.ROTATE, [randomAngle]);
    }

    // 触发自定义的rotate事件
    private onRotate(newAngle: number): void {
        if (!this.isShow) {
            return;
        }
        Tween.to(this.sp, { "rotation": newAngle }, 1000, Ease.elasticOut);
    }
}