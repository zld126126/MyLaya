import SingletonScene from "../SingletonScene";
import Text = Laya.Text;
import Event = Laya.Event;

export class Interaction_Keyboard extends SingletonScene {
    private logger: Text;
    private keyDownList: Array<boolean>;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.listenKeyboard();
        this.createLogger();

        Laya.timer.frameLoop(1, this, this.keyboardInspector);
    }

    private listenKeyboard(): void {
        this.keyDownList = [];

        //添加键盘按下事件,一直按着某按键则会不断触发
        Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDown);
        //添加键盘抬起事件
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);
    }

    /**键盘按下处理*/
    private onKeyDown(e: Event): void {
        if (!this.isShow) {
            return;
        }
        var keyCode: number = e["keyCode"];
        this.keyDownList[keyCode] = true;
    }

    /**键盘抬起处理*/
    private onKeyUp(e: Event): void {
        if (!this.isShow) {
            return;
        }
        delete this.keyDownList[e["keyCode"]];
    }

    private keyboardInspector(): void {
        if (!this.isShow) {
            return;
        }
        var numKeyDown: number = this.keyDownList.length;

        var newText: string = '[ ';
        for (var i: number = 0; i < numKeyDown; i++) {
            if (this.keyDownList[i]) {
                newText += i + " ";
            }
        }
        newText += ']';

        this.logger.changeText(newText);
    }

    /**添加提示文本*/
    private createLogger(): void {
        this.logger = new Text();

        this.logger.size(Laya.stage.width, Laya.stage.height);
        this.logger.fontSize = 30;
        this.logger.font = "SimHei";
        this.logger.wordWrap = true;
        this.logger.color = "#FFFFFF";
        this.logger.align = 'center';
        this.logger.valign = 'middle';

        this.addChild(this.logger);
    }
}