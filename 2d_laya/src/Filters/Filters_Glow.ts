import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import GlowFilter = Laya.GlowFilter;
import Texture = Laya.Texture;
import Handler = Laya.Handler;

export class Filters_Glow extends SingletonScene {
    private apePath: string = "res/apes/monkey2.png";

    private ape: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.apePath, Handler.create(this, this.setup));
    }

    private setup(): void {
        this.createApe();
        this.applayFilter();
    }

    private createApe(): void {
        this.ape = new Sprite();
        this.ape.loadImage(this.apePath);

        var texture: Texture = Laya.loader.getRes(this.apePath);
        this.ape.x = (600 - texture.width) / 2;
        this.ape.y = (800 - texture.height) / 2;

        this.addChild(this.ape);
    }

    private applayFilter(): void {
        //创建一个发光滤镜
        var glowFilter: GlowFilter = new GlowFilter("#ffff00", 10, 0, 0);
        //设置滤镜集合为发光滤镜
        this.ape.filters = [glowFilter];
    }
}