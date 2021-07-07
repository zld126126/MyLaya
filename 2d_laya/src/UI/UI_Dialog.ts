import SingletonScene from "../SingletonScene";
import Button = Laya.Button;
import Dialog = Laya.Dialog;
import Image = Laya.Image;
import Handler = Laya.Handler;

export class UI_Dialog extends SingletonScene {
    private DIALOG_WIDTH: number = 220;
    private DIALOG_HEIGHT: number = 275;
    private CLOSE_BTN_WIDTH: number = 43;
    private CLOSE_BTN_PADDING: number = 5;

    private assets: Array<string>;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.assets = ["res/ui/dialog (1).png", "res/ui/close.png"];
        Laya.loader.load(this.assets, Handler.create(this, this.onSkinLoadComplete));
    }

    private onSkinLoadComplete(): void {
        var dialog: Dialog = new Dialog();

        var bg: Image = new Image(this.assets[0]);
        dialog.addChild(bg);

        var button: Button = new Button(this.assets[1]);
        button.name = Dialog.CLOSE;
        button.pos(this.DIALOG_WIDTH - this.CLOSE_BTN_WIDTH - this.CLOSE_BTN_PADDING, this.CLOSE_BTN_PADDING);
        dialog.addChild(button);

        dialog.dragArea = "0,0," + this.DIALOG_WIDTH + "," + this.DIALOG_HEIGHT;
        dialog.show();
    }
}