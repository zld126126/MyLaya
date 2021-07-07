import SingletonScene from "../SingletonScene";
import ColorPicker = Laya.ColorPicker;
import Handler = Laya.Handler;

export class UI_ColorPicker extends SingletonScene {
    private skin: string = "res/ui/colorPicker.png";

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.skin, Handler.create(this, this.onColorPickerSkinLoaded));
    }

    private onColorPickerSkinLoaded(): void {
        var colorPicker: ColorPicker = new ColorPicker();
        colorPicker.selectedColor = "#ff0033";
        colorPicker.skin = this.skin;

        colorPicker.pos(100, 100);
        colorPicker.changeHandler = new Handler(this, this.onChangeColor, [colorPicker]);
        this.addChild(colorPicker);

        this.onChangeColor(colorPicker);
    }

    private onChangeColor(colorPicker: ColorPicker): void {
        if (!this.isShow) {
            return;
        }
        console.log(colorPicker.selectedColor);
    }
}