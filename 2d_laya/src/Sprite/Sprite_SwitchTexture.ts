import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import Texture = Laya.Texture;
import Handler = Laya.Handler;
import Browser = Laya.Browser;
import WebGL = Laya.WebGL;
import SingletonScene from "../SingletonScene";

export class Sprite_SwitchTexture extends SingletonScene {
    private texture1: string = "res/apes/monkey2.png";
    private texture2: string = "res/apes/monkey3.png";
    private flag: boolean = false;

    private ape: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load([this.texture1, this.texture2], Handler.create(this, this.onAssetsLoaded));
    }

    private onAssetsLoaded(): void {
        this.ape = new Sprite();
        this.addChild(this.ape);
        this.ape.pivot(55, 72);
        this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);

        // 显示默认纹理
        this.switchTexture();

        this.ape.on("click", this, this.switchTexture);
    }

    private switchTexture(): void {
        if (!this.isShow) {
            return;
        }
        var textureUrl: string = (this.flag = !this.flag) ? this.texture1 : this.texture2;

        // 更换纹理
        this.ape.graphics.clear();
        var texture: Texture = Laya.loader.getRes(textureUrl);
        this.ape.graphics.drawTexture(texture, 0, 0);

        // 设置交互区域
        this.ape.size(texture.width, texture.height);
    }
}