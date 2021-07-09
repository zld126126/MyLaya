import SingletonScene from "../SingletonScene";
import ComboBox = Laya.ComboBox;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class UI_ComboBox extends SingletonScene {
    private skin: string = GlobalConfig.ResPath + "res/ui/combobox.png";

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.skin, Handler.create(this, this.onLoadComplete));
    }

    private onLoadComplete(): void {
        var cb: ComboBox = this.createComboBox(this.skin);
        cb.autoSize = true;
        cb.pos((Laya.stage.width - cb.width) / 2, 100);
        cb.autoSize = false;
    }

    private createComboBox(skin: String): ComboBox {
        var comboBox: ComboBox = new ComboBox(this.skin, "item0,item1,item2,item3,item4,item5");
        comboBox.labelSize = 30;
        comboBox.itemSize = 25;
        comboBox.selectHandler = new Handler(this, this.onSelect, [comboBox]);
        this.addChild(comboBox);

        return comboBox;
    }

    private onSelect(cb: ComboBox): void {
        console.log("选中了： " + cb.selectedLabel);
    }
}