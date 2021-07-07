
import SingletonScene from "../SingletonScene";
import Text = Laya.Text;

export class Text_Overflow extends SingletonScene{
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createTexts();
    }

    private createTexts(): void {
        var t1: Text = this.createText();
        t1.overflow = Text.VISIBLE;
        t1.pos(10, 10);

        var t2: Text = this.createText();
        t2.overflow = Text.SCROLL;
        t2.pos(10, 110);

        var t3: Text = this.createText();
        t3.overflow = Text.HIDDEN;
        t3.pos(10, 210);
    }

    private createText(): Text {
        var txt: Text = new Text();

        txt.text =
            "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
            "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
            "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";

        txt.borderColor = "#FFFF00";

        txt.size(300, 50);
        txt.fontSize = 20;
        txt.color = "#ffffff";

        this.addChild(txt);

        return txt;
    }

}