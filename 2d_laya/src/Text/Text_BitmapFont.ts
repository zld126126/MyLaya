import SingletonScene from "../SingletonScene";
import BitmapFont = Laya.BitmapFont;
import Text = Laya.Text;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class Text_BitmapFont extends SingletonScene {
    private fontName: string = "diyFont";

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.loadFont();
    }

    private loadFont(): void {
        var bitmapFont: BitmapFont = new BitmapFont();
        bitmapFont.loadFont(GlobalConfig.ResPath + "res/bitmapFont/test.fnt", new Handler(this, this.onFontLoaded, [bitmapFont]));
    }

    private onFontLoaded(bitmapFont: BitmapFont): void {
        bitmapFont.setSpaceWidth(10);
        Text.registerBitmapFont(this.fontName, bitmapFont);

        this.createText(this.fontName);
    }

    private createText(font: string): void {
        var txt: Text = new Text();
        txt.width = 250;
        txt.wordWrap = true;
        txt.text = "Do one thing at a time, and do well.";
        txt.font = font;
        txt.leading = 5;
        txt.pos(Laya.stage.width - txt.width >> 1, Laya.stage.height - txt.height >> 1);
        this.addChild(txt);
    }
}