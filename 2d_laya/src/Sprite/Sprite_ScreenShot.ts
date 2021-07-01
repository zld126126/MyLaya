import SingletonScene from "../Singleton";

// todo 等待处理 目前还有问题
export class Sprite_ScreenShot extends SingletonScene {
    private btnArr: Array<string> = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
    private nameArr: Array<string> = ["canvas截图", "sprite截图", "清理"];
    private _canvas: HTMLCanvasElement;
    private aimSp: Laya.Sprite;
    private drawImage: Laya.Image;
    private drawSp: Laya.Sprite;
    private monkeyTexture: Laya.Texture;

    constructor() {
        super();
        Laya.stage.addChild(this);

        var ape1 = new Laya.Sprite();
        this.addChild(ape1);
    
        this.onLoaded();

        Config.preserveDrawingBuffer = true;
    }

    private onLoaded() {
        for (let index = 0; index < this.btnArr.length; index++) {
            this.createButton(this.btnArr[index], this.nameArr[index], this._onclick, index);
        }

        this._canvas = window.document.getElementById("layaCanvas") as HTMLCanvasElement;

        this.aimSp = new Laya.Sprite();
        this.aimSp.size(600 / 2, 800 / 2);
        this.addChild(this.aimSp);
        this.aimSp.graphics.drawRect(0, 0, this.aimSp.width, this.aimSp.height, "#333333");
        this.monkeyTexture = Laya.loader.getRes("res/apes/monkey3.png");
        this.aimSp.graphics.drawTexture(this.monkeyTexture, 0, 0, this.monkeyTexture.width, this.monkeyTexture.height);
        this.drawImage = new Laya.Image();
        this.drawImage.size(600 / 2, 800 / 2);
        this.addChild(this.drawImage);
        this.drawImage.bottom = this.drawImage.right = 0;

        this.drawSp = new Laya.Sprite();
        this.addChild(this.drawSp);
        this.drawSp.size(600 / 2, 800 / 2);
        this.drawSp.y = 800 / 2;
        this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
    }

    private createButton(skin: string, name: string, cb: Function, index: number): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        this.addChild(btn);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.size(50, 25);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        return btn;
    }

    private _onclick(name: string) {
        switch (name) {
            case this.nameArr[0]:
                // this._canvas.height = 800;
                // this._canvas.width = 600;
                var base64Url: string = this._canvas.toDataURL("image/png", 1);
                this.drawImage.skin = base64Url;
                break;
            case this.nameArr[1]:
                var text: Laya.Texture = Laya.stage.drawToTexture(600, 800, 0, 0) as Laya.Texture;
                this.drawSp.graphics.drawTexture(text, 0, 0, this.drawSp.width, this.drawSp.height);
                break;
            case this.nameArr[2]:
                this.drawImage.skin = null;
                this.drawSp.graphics.clear();
                this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
                break;
        }
    }

    public Show() {
        this.visible = true;
    }

    public Hide() {
        this.visible = false;
    }
}
