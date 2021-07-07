import { EventManager, EventType } from "../EventManager";
import SingletonMainScene from "../SingletonMainScene";
import { Text_AutoSize } from "./Text_AutoSize";
import { Text_BitmapFont } from "./Text_BitmapFont";
import { Text_ComplexStyle } from "./Text_ComplexStyle";
import { Text_Editable } from "./Text_Editable";
import { Text_HTML } from "./Text_HTML";
import { Text_InputMultiline } from "./Text_InputMultiline";
import { Text_InputSingleline } from "./Text_InputSingleline";
import { Text_MaxChars } from "./Text_MaxChars";
import { Text_Overflow } from "./Text_Overflow";
import { Text_Restrict } from "./Text_Restrict";
import { Text_Scroll } from "./Text_Scroll";
import { Text_Underline } from "./Text_Underline";
import { Text_WordWrap } from "./Text_WordWrap";

export class TextMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "返回主页","自动调整文本尺寸", "位图字体", "复杂的文本样式", "禁止编辑", "Overflow", "下划线", "HTML文本",
        "单行输入", "多行输入", "字数限制", "字符限制", "滚动文本", "自动换行",
    ];

    // 加载例子
    LoadExamples() {
        for (let index = 0; index < this.btnNameArr.length; index++) {
            this.createButton(this.btnNameArr[index], this._onclick, index);
        }
    }

    /**
     * 
     * @param name 按钮名称
     * @param cb 绑定方法
     * @param index index游标
     * @param skin 按钮皮肤
     */
    private createButton(name: string, cb: Function, index: number, skin: string = "res/threeDimen/ui/button.png"): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
        btn.size(50, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        this.addChild(btn);
        return btn;
    }

    // 绑定点击事件
    private _onclick(name: string) {
        switch (name) {
            case this.btnNameArr[0]:
                this.Hide();
                EventManager.DispatchEvent(EventType.BACKTOMAIN);
                break;
            case this.btnNameArr[1]:
                Text_AutoSize.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                Text_BitmapFont.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                Text_ComplexStyle.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                Text_Editable.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                Text_Overflow.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                Text_Underline.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                Text_HTML.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                Text_InputSingleline.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                Text_InputMultiline.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                Text_MaxChars.getInstance().Click();
                break;
            case this.btnNameArr[11]:
                Text_Restrict.getInstance().Click();
                break;
            case this.btnNameArr[12]:
                Text_Scroll.getInstance().Click();
                break;
            case this.btnNameArr[13]:
                Text_WordWrap.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}