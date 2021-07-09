import SingletonScene from "../SingletonScene";
import FontClip = Laya.FontClip;
import { GlobalConfig } from "../GlobalConfig";

export class UI_Font_Clip extends SingletonScene {
    private TestClipNum: string = GlobalConfig.ResPath + "res/comp/fontClip_num.png";
    private _ClipNum: string = GlobalConfig.ResPath + "res/comp/fontClip_num.png";
    private _ClipNum1: string = GlobalConfig.ResPath + "res/comp/fontClip_num.png";
    private TestFontClip: string = GlobalConfig.ResPath + "res/comp/fontClip.png";
    private _FontClip: string = GlobalConfig.ResPath + "res/comp/fontClip.png";

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load([this.TestClipNum, this.TestFontClip, 
            this._ClipNum, this._FontClip, this._ClipNum1], Laya.Handler.create(this, this.ShowContent));
    }

    private ShowContent(): void {
        var clipnum: FontClip = new FontClip(this._ClipNum);
        var fontClip: FontClip = new FontClip(this._FontClip);
        var TestFontClip: FontClip = new FontClip(this.TestFontClip);
        var TestClipNum: FontClip = new FontClip(this.TestClipNum);
        var clipnum1: FontClip = new FontClip(this._ClipNum1);

        clipnum.pos(240, 500);
        clipnum.size(250, 50);
        clipnum.sheet = "0123456789";
        clipnum.value = "114499";
        clipnum.spaceY = 10;

        TestClipNum.pos(200, 400);
        TestClipNum.sheet = "0123456789";
        TestClipNum.value = "0123456789";

        clipnum1.pos(150, 200);
        clipnum1.direction = "vertical";
        clipnum1.sheet = "0123456789";
        clipnum1.value = "223388";

        fontClip.pos(240, 300);
        fontClip.sheet = "鼠牛虎兔龙蛇马羊 猴鸡狗猪年快乐";
        fontClip.value = "猪年快乐";
        fontClip.spaceY = 10;

        TestFontClip.pos(200, 200);
        TestFontClip.sheet = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
        TestFontClip.value = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
        TestFontClip.spaceY = 10;

        this.addChild(clipnum);
        this.addChild(fontClip);
        this.addChild(TestFontClip);
        this.addChild(TestClipNum);
        this.addChild(clipnum1);
    }
}