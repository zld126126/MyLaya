import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import ColorFilter = Laya.ColorFilter;
import Texture = Laya.Texture;
import Handler = Laya.Handler;

export class Filters_Color extends SingletonScene {
    private ApePath: string = "res/apes/monkey2.png";

    private apeTexture: Texture;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.ApePath, Handler.create(this, this.setup));
    }

    private setup(): void {
        this.normalizeApe();
        this.makeRedApe();
        this.grayingApe();
    }

    private normalizeApe(): void {
        var originalApe: Sprite = this.createApe();

        this.apeTexture = Laya.loader.getRes(this.ApePath);
        originalApe.x = (Laya.stage.width - this.apeTexture.width * 3) / 2;
        originalApe.y = (Laya.stage.height - this.apeTexture.height) / 2;
    }

    private makeRedApe(): void {
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，红色
        var redMat: Array<number> =
            [
                1, 0, 0, 0, 0, //R
                0, 0, 0, 0, 0, //G
                0, 0, 0, 0, 0, //B
                0, 0, 0, 1, 0, //A
            ];

        //创建一个颜色滤镜对象,红色
        var redFilter: ColorFilter = new ColorFilter(redMat);

        // 赤化猩猩
        var redApe: Sprite = this.createApe();
        redApe.filters = [redFilter];

        var firstChild: any = this.getChildAt(0);
        redApe.x = firstChild.x + this.apeTexture.width;
        redApe.y = firstChild.y;
    }

    private grayingApe(): void {
        //由 20 个项目（排列成 4 x 5 矩阵）组成的数组，灰图
        var grayscaleMat: Array<number> = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];

        //创建一个颜色滤镜对象，灰图
        var grayscaleFilter: ColorFilter = new ColorFilter(grayscaleMat);

        // 灰度猩猩
        var grayApe: Sprite = this.createApe();
        grayApe.filters = [grayscaleFilter];

        var secondChild: any = this.getChildAt(1);
        grayApe.x = secondChild.x + this.apeTexture.width;
        grayApe.y = secondChild.y;
    }

    private createApe(): Sprite {
        var ape: Sprite = new Sprite();
        ape.loadImage("res/apes/monkey2.png");
        this.addChild(ape);

        return ape;
    }
}