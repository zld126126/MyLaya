import SingletonScene from "../SingletonScene";
import Stage = Laya.Stage;
import TextArea = Laya.TextArea;
import Browser = Laya.Browser;
import Handler = Laya.Handler;
import WebGL = Laya.WebGL;
import { GlobalConfig } from "../GlobalConfig";

export class UI_TextArea extends SingletonScene {
    private skin: string = GlobalConfig.ResPath + "res/ui/textarea.png";

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.skin, Handler.create(this, this.onLoadComplete));
    }

    private onLoadComplete(): void {
        var ta: TextArea = new TextArea("");
        ta.skin = this.skin;

        ta.font = "Arial";
        ta.fontSize = 18;
        ta.bold = true;

        ta.color = "#3d3d3d";

        ta.pos(100, 15);
        ta.size(375, 355);

        ta.padding = "70,8,8,8";

        var scaleFactor: Number = Browser.pixelRatio;

        this.addChild(ta);
    }
}