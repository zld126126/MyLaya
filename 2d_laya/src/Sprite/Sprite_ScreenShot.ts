import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Texture = Laya.Texture;
import Handler = Laya.Handler;
import Button = Laya.Button;
import Event = Laya.Event;
import { GlobalConfig } from "../GlobalConfig";

export class Sprite_ScreenShot extends SingletonScene {
    private btnArr: Array<string> = [GlobalConfig.ResPath + "res/threeDimen/ui/button.png", GlobalConfig.ResPath + "res/threeDimen/ui/button.png"];
    // TODO 暂时只展示sprite截图  canvas截图后期处理
    private nameArr: Array<string> = ["截图", "清理"];
    private drawSp: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApes();
    }

    private createApes(): void {
        var ape1 = new Sprite();
        this.addChild(ape1);
        ape1.loadImage(GlobalConfig.ResPath + "res/apes/monkey3.png", Handler.create(this, this.onLoaded));
    }

    private createButton(skin: string, name: string, cb: Function, index: number): Button {
        var btn: Button = new Button(skin, name);
        this.addChild(btn);
        btn.on(Event.CLICK, this, cb);
        btn.size(40, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        return btn;
    }

    private onLoaded() {
        for (let index = 0; index < this.btnArr.length; index++) {
            this.createButton(this.btnArr[index], this.nameArr[index], this._onclick, index);
        }

        this.drawSp = new Sprite();
        this.addChild(this.drawSp);
        this.drawSp.size(600 / 2, 800 / 2);
        this.drawSp.y = 800 / 2;
        this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
    }

    private _onclick(e: Event) {
        switch (e.target.name) {
            case this.nameArr[0]:
                var text: Texture = Laya.stage.drawToTexture(600, 800, 0, 0) as Texture;
                this.drawSp.graphics.drawTexture(text, 0, 0, this.drawSp.width, this.drawSp.height);
                break;
            case this.nameArr[1]:
                this.drawSp.graphics.clear();
                this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
                break;
        }
    }
}