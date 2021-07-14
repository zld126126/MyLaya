import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Handler = Laya.Handler;
import BitmapFont = Laya.BitmapFont;
import Text = Laya.Text;
import Browser = Laya.Browser;
import Event = Laya.Event;

export class SkeletonMask extends SingletonScene {
    private fontName: string = "fontClip";
    private texts: Laya.Text[] = [];
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        this.loadFont();

        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_MaskModelTest/Conventional/MaskModelTest.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);
            //获取场景中的相机
            var camera: Camera = (<Camera>scene.getChildByName("Camera"));
        }));
    }


    private loadFont(): void {
        var bitmapFont: BitmapFont = new BitmapFont();

        bitmapFont.loadFont(GlobalConfig.ResPath + "res/threeDimen/LayaScene_MaskModelTest/font/fontClip.fnt", new Handler(this, this.onFontLoaded, [bitmapFont]));
    }
    private onFontLoaded(bitmapFont: BitmapFont): void {
        bitmapFont.setSpaceWidth(10);
        Text.registerBitmapFont(this.fontName, bitmapFont);
        this.createText(this.fontName);
        this.createText1(this.fontName);
        this.createText2(this.fontName);
    }

    private createText(font: string): void {
        var txt: Text = new Text();
        txt.width = 250;
        txt.wordWrap = true;
        txt.text = "带有骨骼遮罩的动画";
        txt.color = "#FFFFFFFF";
        txt.leading = 5;
        txt.fontSize = 10;
        txt.zOrder = 999999999;
        txt.scale(Browser.pixelRatio, Browser.pixelRatio);
        txt.pos(Laya.stage.width / 2 - 50, Laya.stage.height / 2);
        Laya.stage.on(Event.RESIZE, txt, () => {
            txt.pos(Laya.stage.width / 2 - 50, Laya.stage.height / 2);
        });
        this.texts.push(txt);
        Laya.stage.addChild(txt);
    }

    createText1(font) {
        var txt = new Text();
        txt.width = 250;
        txt.wordWrap = true;
        txt.text = "正常动画一";
        txt.color = "#FFFFFFFF";
        txt.size(200, 300);
        txt.leading = 5;
        txt.fontSize = 15;
        txt.zOrder = 999999999;
        txt.pos(Laya.stage.width / 2 - 240, Laya.stage.height / 2);
        Laya.stage.on(Event.RESIZE, txt, () => {
            txt.pos(Laya.stage.width / 2 - 240, Laya.stage.height / 2);
        });
        this.texts.push(txt);
        Laya.stage.addChild(txt);
    }

    createText2(font) {
        var txt = new Text();
        txt.width = 250;
        txt.wordWrap = true;
        txt.text = "正常动画二";
        txt.color = "#FFFFFFFF";
        txt.leading = 5;
        txt.zOrder = 999999999;
        txt.fontSize = 15;
        txt.pos(Laya.stage.width / 2 + 140, Laya.stage.height / 2);
        Laya.stage.on(Event.RESIZE, txt, () => {
            txt.pos(Laya.stage.width / 2 + 140, Laya.stage.height / 2);
        });
        this.texts.push(txt);
        Laya.stage.addChild(txt);
    }

    public Show() {
        super.Show();
        for (var i = 0; i < this.texts.length; i++) {
            this.texts[i].visible = true;
        }
    }

    public Hide() {
        super.Hide();
        for (var i = 0; i < this.texts.length; i++) {
            this.texts[i].visible = false;
        }
    }
}