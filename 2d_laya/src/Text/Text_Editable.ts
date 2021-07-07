import SingletonScene from "../SingletonScene";
import Input = Laya.Input;

export class Text_Editable extends SingletonScene {

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createInput();
    }

    private createInput(): void {
        var inputText: Input = new Input();

        inputText.size(350, 100);
        inputText.x = Laya.stage.width - inputText.width >> 1;
        inputText.y = Laya.stage.height - inputText.height >> 1;

        inputText.text = "这段文本不可编辑，但可复制";
        inputText.editable = false;

        // 设置字体样式
        inputText.bold = true;
        inputText.bgColor = "#666666";
        inputText.color = "#ffffff";
        inputText.fontSize = 20;

        this.addChild(inputText);
    }
}