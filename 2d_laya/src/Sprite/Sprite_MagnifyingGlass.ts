import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import Browser = Laya.Browser;
import Handler = Laya.Handler;
import WebGL = Laya.WebGL;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class Sprite_MagnifyingGlass extends SingletonScene {
    private maskSp: Sprite;
    private bg2: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApe();
    }

    private createApe(): void {
        var bg: Sprite = new Sprite();
        bg.loadImage(GlobalConfig.ResPath + "res/bg2.png");
        this.addChild(bg);

        this.bg2 = new Sprite();
        this.bg2.loadImage(GlobalConfig.ResPath + "res/bg2.png");
        this.addChild(this.bg2);
        this.bg2.scale(3, 3);

        //创建mask
        this.maskSp = new Sprite();
        this.maskSp.loadImage(GlobalConfig.ResPath + "res/mask.png");
        this.maskSp.pivot(50, 50);

        //设置mask
        this.bg2.mask = this.maskSp;

        Laya.stage.on("mousemove", this, this.onMouseMove);
    }

    private onMouseMove(): void {
        if (!this.isShow) {
            return;
        }
        this.bg2.x = -Laya.stage.mouseX * 2;
        this.bg2.y = -Laya.stage.mouseY * 2;

        this.maskSp.x = Laya.stage.mouseX;
        this.maskSp.y = Laya.stage.mouseY;
    }
}