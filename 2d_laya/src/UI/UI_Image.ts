import SingletonScene from "../SingletonScene";
import Image = Laya.Image;
import { GlobalConfig } from "../GlobalConfig";

export class UI_Image extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        var dialog: Image = new Image(GlobalConfig.ResPath + "res/ui/dialog (3).png");
        dialog.pos(165, 62.5);
        this.addChild(dialog);
    }
}