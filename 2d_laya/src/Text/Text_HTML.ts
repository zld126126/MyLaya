
import SingletonScene from "../SingletonScene";
import HTMLDivElement = Laya.HTMLDivElement;
import HTMLIframeElement = Laya.HTMLIframeElement;

export class Text_HTML extends SingletonScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.createParagraph();	// 代码创建
        this.showExternalHTML(); // 使用外部定义的html
    }

    private createParagraph(): void {
        var p: HTMLDivElement = new HTMLDivElement();
        this.addChild(p);

        p.style.font = "Impact";
        p.style.fontSize = 30;

        var html: string = "<span color='#e3d26a'>使用</span>";
        html += "<span style='color:#FFFFFF;font-weight:bold'>HTMLDivElement</span>";
        html += "<span color='#6ad2e3'>创建的</span><br/>";
        html += "<span color='#d26ae3'>HTML文本</span>";

        p.innerHTML = html;
    }

    private showExternalHTML(): void {
        var p: HTMLIframeElement = new HTMLIframeElement();
        this.addChild(p);
        p.href = "res/html/test.html";
        p.y = 200;
    }
}