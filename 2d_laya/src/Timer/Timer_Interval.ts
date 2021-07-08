import SingletonScene from "../SingletonScene";
import Text = Laya.Text;

export class Timer_Interval extends SingletonScene {
    private rotateTimeBasedText: Text;
    private rotateFrameRateBasedText: Text;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        var vGap: number = 200;

        this.rotateTimeBasedText = this.createText("基于时间旋转", Laya.stage.width / 2, (Laya.stage.height - vGap) / 2);
        this.rotateFrameRateBasedText = this.createText("基于帧频旋转", this.rotateTimeBasedText.x, this.rotateTimeBasedText.y + vGap);

        Laya.timer.loop(200, this, this.animateTimeBased);
        Laya.timer.frameLoop(2, this, this.animateFrameRateBased);
    }

    private createText(text: string, x: number, y: number): Text {
        var t: Text = new Text();
        t.text = text;
        t.fontSize = 30;
        t.color = "white";
        t.bold = true;
        t.pivot(t.width / 2, t.height / 2);
        t.pos(x, y);
        this.addChild(t);

        return t;
    }

    private animateTimeBased(): void {
        if (!this.isShow) {
            return;
        }
        this.rotateTimeBasedText.rotation += 1;
    }

    private animateFrameRateBased(): void {
        if (!this.isShow) {
            return;
        }
        this.rotateFrameRateBasedText.rotation += 1;
    }
}