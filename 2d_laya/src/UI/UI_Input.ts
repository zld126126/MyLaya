import SingletonScene from "../SingletonScene";
import TextInput = Laya.TextInput;
import Handler = Laya.Handler;

export class UI_Input extends SingletonScene {
    private SPACING: number = 100;
    private INPUT_WIDTH: number = 300;
    private INPUT_HEIGHT: number = 50;
    private Y_OFFSET: number = 50;
    private skins: Array<string>;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.skins = ["res/ui/input (1).png", "res/ui/input (2).png", "res/ui/input (3).png", "res/ui/input (4).png"];
        Laya.loader.load(this.skins, Handler.create(this, this.onLoadComplete));//加载资源。
    }

    private onLoadComplete(): void {
        for (var i: number = 0; i < this.skins.length; ++i) {
            var input: TextInput = this.createInput(this.skins[i]);
            input.prompt = 'Type:';
            input.x = (Laya.stage.width - input.width) / 2;
            input.y = i * this.SPACING + this.Y_OFFSET;
        }
    }

    private createInput(skin: string): TextInput {
        var ti: TextInput = new TextInput();

        ti.skin = skin;
        ti.size(300, 50);
        ti.sizeGrid = "0,40,0,40";
        ti.font = "Arial";
        ti.fontSize = 30;
        ti.bold = true;
        ti.color = "#606368";

        this.addChild(ti);

        return ti;
    }
}