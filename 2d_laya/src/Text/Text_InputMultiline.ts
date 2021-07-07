import SingletonScene from "../SingletonScene";
import Input = Laya.Input;

export class Text_InputMultiline extends SingletonScene {

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createInput();
    }

    private createInput(): void {
        var inputText: Input = new Input();

        // 移动端输入提示符
        inputText.prompt = "Type some word...";

        //多行输入
        inputText.multiline = true;
        inputText.wordWrap = true;

        inputText.size(350, 100);
        inputText.x = Laya.stage.width - inputText.width >> 1;
        inputText.y = Laya.stage.height - inputText.height >> 1;
        inputText.padding = [2, 2, 2, 2];

        inputText.bgColor = "#666666";
        inputText.color = "#ffffff";
        inputText.fontSize = 20;

        this.addChild(inputText);
    }
}