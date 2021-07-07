import { EventManager, EventType } from "../EventManager";
import SingletonMainScene from "../SingletonMainScene";
import { UI_Button } from "./UI_Button";
import { UI_CheckBox } from "./UI_CheckBox";
import { UI_Clip } from "./UI_Clip";
import { UI_ColorPicker } from "./UI_ColorPicker";
import { UI_ComboBox } from "./UI_ComboBox";
import { UI_Dialog } from "./UI_Dialog";
import { UI_Font_Clip } from "./UI_Font_Clip";
import { UI_Image } from "./UI_Image";
import { UI_Input } from "./UI_Input";
import { UI_Label } from "./UI_Label";
import { UI_List } from "./UI_List";
import { UI_ProgressBar } from "./UI_ProgressBar";
import { UI_RadioGroup } from "./UI_RadioGroup";
import { UI_ScrollBar } from "./UI_ScrollBar";
import { UI_Slider } from "./UI_Slider";
import { UI_Tab } from "./UI_Tab";
import { UI_TextArea } from "./UI_TextArea";
import { UI_Tree } from "./UI_Tree";

// TODO:等待下载res资源
export class UIMain extends SingletonMainScene {
    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    private btnNameArr: Array<string> = [
        "返回主页", "Label", "Button", "RadioGroup", "CheckBox", "Clip",
        "FontClip", "ColorPicker", "ComboBox", "Dialog", "ScrollBar",
        "Slider", "Image", "List", "ProgressBar", "Tab",
        "Input", "TextArea", "Tree"
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
                UI_Label.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                UI_Button.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                UI_RadioGroup.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                UI_CheckBox.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                UI_Clip.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                UI_Font_Clip.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                UI_ColorPicker.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                UI_ComboBox.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                UI_Dialog.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                UI_ScrollBar.getInstance().Click();
                break;
            case this.btnNameArr[11]:
                UI_Slider.getInstance().Click();
                break;
            case this.btnNameArr[12]:
                UI_Image.getInstance().Click();
                break;
            case this.btnNameArr[13]:
                UI_List.getInstance().Click();
                break;
            case this.btnNameArr[14]:
                UI_ProgressBar.getInstance().Click();
                break;
            case this.btnNameArr[15]:
                UI_Tab.getInstance().Click();
                break;
            case this.btnNameArr[16]:
                UI_Input.getInstance().Click();
                break;
            case this.btnNameArr[17]:
                UI_TextArea.getInstance().Click();
                break;
            case this.btnNameArr[18]:
                UI_Tree.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}