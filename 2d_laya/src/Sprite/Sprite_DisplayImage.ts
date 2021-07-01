import SingletonScene from "../Singleton";

export class Sprite_DisplayImage extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
    }

    public Show(): void {
        this.visible = true;

        // 方法1：使用loadImage
        var ape1 = new Laya.Sprite();
        this.addChild(ape1);
        ape1.loadImage("res/apes/monkey3.png");

        // 方法2：使用drawTexture
        Laya.loader.load("res/apes/monkey2.png", new Laya.Handler(this, function (): void {
            var t: Laya.Texture = Laya.loader.getRes("res/apes/monkey2.png");
            var ape2 = new Laya.Sprite();
            ape2.graphics.drawTexture(t, 0, 0);
            this.addChild(ape2);
            ape2.pos(200, 0);
        }));
    }

    public Hide(): void {
        this.visible = false;
    }
}