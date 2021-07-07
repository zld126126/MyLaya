import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import BlurFilter = Laya.BlurFilter;
import Handler = Laya.Handler;

export class Filters_Blur extends SingletonScene {
    private apePath: string = "res/apes/monkey2.png";

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.apePath, Handler.create(this, this.createApe));
    }

    private createApe(): void {
        var ape: Sprite = new Sprite();
        ape.loadImage(this.apePath);

        ape.x = (Laya.stage.width - ape.width) / 2;
        ape.y = (Laya.stage.height - ape.height) / 2;

        this.addChild(ape);
        this.applayFilter(ape);
    }

    private applayFilter(ape: Sprite): void {
        var blurFilter: BlurFilter = new BlurFilter();
        blurFilter.strength = 5;
        ape.filters = [blurFilter];
    }
}