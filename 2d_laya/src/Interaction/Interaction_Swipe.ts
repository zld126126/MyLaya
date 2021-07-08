import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Tween = Laya.Tween;

export class Interaction_Swipe extends SingletonScene {
    //swipe滚动范围
    private TrackLength: number = 200;
    //触发swipe的拖动距离
    private TOGGLE_DIST: number = this.TrackLength / 2;

    private buttonPosition: number;
    private beginPosition: number;
    private endPosition: number;

    private button: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.createSprtie();
        this.drawTrack();
    }

    private createSprtie(): void {
        const w: number = 50;
        const h: number = 30;

        this.button = new Sprite();
        this.button.graphics.drawRect(0, 0, w, h, "#FF7F50");
        this.button.pivot(w / 2, h / 2);
        //设置宽高（要接收鼠标事件必须设置宽高，否则不会被命中）  
        this.button.size(w, h);
        this.button.x = (Laya.stage.width - this.TrackLength) / 2;
        this.button.y = Laya.stage.height / 2;

        this.button.on(Event.MOUSE_DOWN, this, this.onMouseDown);

        this.addChild(this.button);
        //左侧临界点设为圆形初始位置
        this.beginPosition = this.button.x;
        //右侧临界点设置
        this.endPosition = this.beginPosition + this.TrackLength;
    }

    private drawTrack(): void {
        var graph: Sprite = new Sprite();
        this.graphics.drawLine(
            this.beginPosition, Laya.stage.height / 2,
            this.endPosition, Laya.stage.height / 2,
            "#FFFFFF", 20);
        this.addChild(graph);
    }

    /**按下事件处理*/
    private onMouseDown(e: Event): void {
        //添加鼠标移到侦听
        Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
        this.buttonPosition = this.button.x;

        Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
    }
    /**移到事件处理*/
    private onMouseMove(e: Event): void {
        if (!this.isShow) {
            return;
        }
        this.button.x = Math.max(Math.min(Laya.stage.mouseX, this.endPosition), this.beginPosition);
    }

    /**抬起事件处理*/
    private onMouseUp(e: Event): void {
        if (!this.isShow) {
            return;
        }
        Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove);
        Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp);
        Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseUp);

        // 滑动到目的地
        var dist: number = Laya.stage.mouseX - this.buttonPosition;

        var targetX = this.beginPosition;
        if (dist > this.TOGGLE_DIST)
            targetX = this.endPosition;
        Tween.to(this.button, { x: targetX }, 100);
    }
}