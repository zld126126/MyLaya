import SingletonScene from "../SingletonScene";
import Text = Laya.Text;

export class Text_WordWrap extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createText();
    }

    private createText(): void {
        var txt: Text = new Text();

        txt.text = "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";

        txt.width = 300;

        txt.fontSize = 40;
        txt.color = "#ffffff";

        //设置文本为多行文本
        txt.wordWrap = true;

        txt.x = Laya.stage.width - txt.textWidth >> 1;
        txt.y = Laya.stage.height - txt.textHeight >> 1;

        this.addChild(txt);
    }
}