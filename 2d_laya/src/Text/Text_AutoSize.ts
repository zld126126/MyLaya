import SingletonScene from "../SingletonScene";
import Text = Laya.Text;

export class Text_AutoSize extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        // 该文本自动适应尺寸
        var autoSizeText: Text = this.createSampleText();
        autoSizeText.overflow = Text.VISIBLE;
        autoSizeText.y = 50;

        // 该文本被限制了宽度
        var widthLimitText: Text = this.createSampleText();
        widthLimitText.width = 100;
        widthLimitText.y = 180;

        //该文本被限制了高度 
        var heightLimitText: Text = this.createSampleText();
        heightLimitText.height = 20;
        heightLimitText.y = 320;
    }

    private createSampleText(): Text {
        var text: Text = new Text();
        text.overflow = Text.HIDDEN;

        text.color = "#FFFFFF";
        text.font = "Impact";
        text.fontSize = 20;
        text.borderColor = "#FFFF00";
        text.x = 80;

        this.addChild(text);
        text.text = "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL";

        return text;
    }
}