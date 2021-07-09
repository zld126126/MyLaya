import SingletonScene from "../SingletonScene";
import HSlider = Laya.HSlider;
import VSlider = Laya.VSlider;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class UI_Slider extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        var skins: Array<string> = [];
        skins.push(GlobalConfig.ResPath + "res/ui/hslider.png", GlobalConfig.ResPath + "res/ui/hslider$bar.png");
        skins.push(GlobalConfig.ResPath + "res/ui/vslider.png", GlobalConfig.ResPath + "res/ui/vslider$bar.png");
        Laya.loader.load(skins, Handler.create(this, this.onLoadComplete));
    }

    private onLoadComplete(): void {
        this.placeHSlider();
        this.placeVSlider();
    }

    private placeHSlider(): void {
        var hs: HSlider = new HSlider();
        hs.skin = GlobalConfig.ResPath + "res/ui/hslider.png";

        hs.width = 300;
        hs.pos(50, 170);
        hs.min = 0;
        hs.max = 100;
        hs.value = 50;
        hs.tick = 1;

        hs.changeHandler = new Handler(this, this.onChange);
        this.addChild(hs);
    }

    private placeVSlider(): void {
        var vs: VSlider = new VSlider();

        vs.skin = GlobalConfig.ResPath + "res/ui/vslider.png";

        vs.height = 300;
        vs.pos(400, 50);
        vs.min = 0;
        vs.max = 100;
        vs.value = 50;
        vs.tick = 1;

        vs.changeHandler = new Handler(this, this.onChange);
        this.addChild(vs);
    }

    private onChange(value: Number): void {
        console.log("滑块的位置：" + value);
    }
}