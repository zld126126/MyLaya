import SingletonScene from "../SingletonScene";
import Text = Laya.Text;

export class Timer_CallLater extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.demonstrate();
    }

    private demonstrate(): void {
        for (var i: number = 0; i < 10; i++) {
            Laya.timer.callLater(this, this.onCallLater);
        }
    }

    private onCallLater(): void {
        console.log("onCallLater triggered");

        var text: Text = new Text();
        text.font = "SimHei";
        text.fontSize = 30;
        text.color = "#FFFFFF";
        text.text = "打开控制台可见该函数仅触发了一次";
        text.size(Laya.stage.width, Laya.stage.height);
        text.wordWrap = true;
        text.valign = "middle";
        text.align = "center";
        this.addChild(text);
    }
}