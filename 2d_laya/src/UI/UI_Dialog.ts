import SingletonScene from "../SingletonScene";
import Button = Laya.Button;
import Dialog = Laya.Dialog;
import Image = Laya.Image;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class UI_Dialog extends SingletonScene {
    private dialog: Dialog;
    private DIALOG_WIDTH: number = 220;
    private DIALOG_HEIGHT: number = 275;
    private CLOSE_BTN_WIDTH: number = 43;
    private CLOSE_BTN_PADDING: number = 5;

    private assets: Array<string>;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.assets = [GlobalConfig.ResPath + "res/ui/dialog (1).png", GlobalConfig.ResPath + "res/ui/close.png"];
        Laya.loader.load(this.assets, Handler.create(this, this.onSkinLoadComplete));
    }

    private onSkinLoadComplete(): void {
        this.dialog = new Dialog();
        this.addChild(this.dialog);

        var bg: Image = new Image(this.assets[0]);
        this.dialog.addChild(bg);

        var button: Button = new Button(this.assets[1]);
        //button.name = Dialog.CLOSE;
        button.pos(this.DIALOG_WIDTH - this.CLOSE_BTN_WIDTH - this.CLOSE_BTN_PADDING, this.CLOSE_BTN_PADDING);
        button.on(Laya.Event.CLICK, this, this.DialogHide);
        this.dialog.addChild(button);

        this.dialog.dragArea = "0,0," + this.DIALOG_WIDTH + "," + this.DIALOG_HEIGHT;
        this.dialog.show();
    }

    public DialogHide() {
        if (!this.isShow) {
            return;
        }
        this.dialog.visible = false;;
    }

    public Show() {
        this.visible = true;
        if (this.dialog) {
            this.dialog.visible = true;
        }
    }

    public Hide() {
        this.visible = false;
        if (this.dialog) {
            this.dialog.visible = false;
        }
    }
}