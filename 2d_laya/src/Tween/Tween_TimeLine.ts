import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Keyboard = Laya.Keyboard;
import TimeLine = Laya.TimeLine;
import { GlobalConfig } from "../GlobalConfig";

export class Tween_TimeLine extends SingletonScene {
    private target: Sprite;
    private timeLine: TimeLine = new TimeLine();

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }
    private setup(): void {
        this.createApe();
        this.createTimerLine();
        this.on(Event.KEY_DOWN, this, this.keyDown);
    }
    private createApe(): void {
        this.target = new Sprite();
        this.target.loadImage(GlobalConfig.ResPath + "res/apes/monkey2.png");
        this.addChild(this.target);
        this.target.pivot(55, 72);
        this.target.pos(100, 100);
    }

    private createTimerLine(): void {
        this.timeLine.addLabel("turnRight", 0).to(this.target, { x: 450, y: 100, scaleX: 0.5, scaleY: 0.5 }, 2000, null, 0)
            .addLabel("turnDown", 0).to(this.target, { x: 450, y: 300, scaleX: 0.2, scaleY: 1, alpha: 1 }, 2000, null, 0)
            .addLabel("turnLeft", 0).to(this.target, { x: 100, y: 300, scaleX: 1, scaleY: 0.2, alpha: 0.1 }, 2000, null, 0)
            .addLabel("turnUp", 0).to(this.target, { x: 100, y: 100, scaleX: 1, scaleY: 1, alpha: 1 }, 2000, null, 0);
        this.timeLine.play(0, true);
        this.timeLine.on(Event.COMPLETE, this, this.onComplete);
        this.timeLine.on(Event.LABEL, this, this.onLabel);
    }
    private onComplete(): void {
        if (!this.isShow) {
            return;
        }
        console.log("timeLine complete!!!!");
    }
    private onLabel(label: String): void {
        if (!this.isShow) {
            return;
        }
        console.log("LabelName:" + label);
    }
    private keyDown(e: Event): void {
        if (!this.isShow) {
            return;
        }
        switch (e.keyCode) {
            case Keyboard.LEFT:
                this.timeLine.play("turnLeft");
                break;
            case Keyboard.RIGHT:
                this.timeLine.play("turnRight");
                break;
            case Keyboard.UP:
                this.timeLine.play("turnUp");
                break;
            case Keyboard.DOWN:
                this.timeLine.play("turnDown");
                break;
            case Keyboard.P:
                this.timeLine.pause();
                break;
            case Keyboard.R:
                this.timeLine.resume();
                break;
        }
    }
}