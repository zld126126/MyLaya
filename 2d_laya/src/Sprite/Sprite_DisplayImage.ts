import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Texture = Laya.Texture;
import Handler = Laya.Handler;

export class Sprite_DisplayImage extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApes();
    }

    private createApes(): void {
        // 方法1：使用loadImage
        var ape1 = new Sprite();
        this.addChild(ape1);
        ape1.loadImage("res/apes/monkey3.png");

        // 方法2：使用drawTexture
        Laya.loader.load("res/apes/monkey2.png", new Handler(this, function (): void {
            var t: Texture = Laya.loader.getRes("res/apes/monkey2.png");
            var ape2 = new Sprite();
            ape2.graphics.drawTexture(t, 0, 0);
            this.addChild(ape2);
            ape2.pos(200, 0);
        }));
    }
}