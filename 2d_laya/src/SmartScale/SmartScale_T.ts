import GameConfig from "../GameConfig";
import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Stage = Laya.Stage;
import Text = Laya.Text;
import Event = Laya.Event;
import Image = Laya.Image;
import WebGL = Laya.WebGL;

export class SmartScale_T extends SingletonScene {


    //所有适配模式
    private modes: Array<string> = ["noscale", "exactfit", "showall", "noborder", "full", "fixedwidth", "fixedheight"];
    //当前适配模式索引
    private index: number = 0;
    //全局文本信息
    private txt: Text;

    private bg: Image;
    private boy1: Image;
    private boy2: Image;

    constructor() {
        super();

        //实例一个背景
        this.bg = new Image();
        this.bg.skin = "res/bg.jpg";
        Laya.stage.addChild(this.bg);

        //实例一个文本
        this.txt = new Text();
        this.txt.text = "点击我切换适配模式(noscale)";
        this.txt.bold = true;
        this.txt.pos(0, 200);
        this.txt.fontSize = 30;
        this.txt.on("click", this, this.onTxtClick);
        Laya.stage.addChild(this.txt);

        //实例一个小人，放到右上角，并相对布局
        this.boy1 = new Image();
        this.boy1.skin = "res/cartoonCharacters/1.png";
        this.boy1.top = 0;
        this.boy1.right = 0;
        this.boy1.on("click", this, this.onBoyClick);
        Laya.stage.addChild(this.boy1);

        //实例一个小人，放到右下角，并相对布局
        this.boy2 = new Image();
        this.boy2.skin = "res/cartoonCharacters/2.png";
        this.boy2.bottom = 0;
        this.boy2.right = 0;
        this.boy2.on("click", this, this.onBoyClick);
        Laya.stage.addChild(this.boy2);

        //侦听点击事件，输出坐标信息
        Laya.stage.on("click", this, this.onClick);
        Laya.stage.on("resize", this, this.onResize);
    }

    private ChangeLayaConfig() {
        // 不支持WebGL时自动切换至Canvas
        Laya.init(1136, 640, WebGL);

        //设置适配模式
        Laya.stage.scaleMode = "noscale";
        //设置横竖屏
        Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
        //设置水平对齐
        Laya.stage.alignH = "center";
        //设置垂直对齐
        Laya.stage.alignV = "middle";
    }

    private SetLayaConfigDefault() {
        //根据IDE设置初始化引擎		
        if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
        else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
        Laya["Physics"] && Laya["Physics"].enable();
        Laya["DebugPanel"] && Laya["DebugPanel"].enable();
        Laya.stage.scaleMode = GameConfig.scaleMode;
        Laya.stage.screenMode = GameConfig.screenMode;
        Laya.stage.alignV = GameConfig.alignV;
        Laya.stage.alignH = GameConfig.alignH;
        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

        //打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
        if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
        if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
        if (GameConfig.stat) Laya.Stat.show();
        Laya.alertGlobalError = true;
    }

    private onBoyClick(e: Event): void {
        if (!this.isShow) {
            return;
        }
        //点击后小人会放大缩小
        var boy: Sprite = e.target;
        if (boy.scaleX === 1) {
            boy.scale(1.2, 1.2);
        } else {
            boy.scale(1, 1);
        }
    }

    private onTxtClick(e: Event): void {
        if (!this.isShow) {
            return;
        }
        //点击后切换适配模式
        e.stopPropagation();
        this.index++;
        if (this.index >= this.modes.length) this.index = 0;
        Laya.stage.scaleMode = this.modes[this.index];
        this.txt.text = "点击我切换适配模式" + "(" + this.modes[this.index] + ")";
    }

    private onClick(e: Event): void {
        if (!this.isShow) {
            return;
        }
        //输出坐标信息
        console.log("mouse:", Laya.stage.mouseX, Laya.stage.mouseY);
    }

    private onResize(): void {
        if (!this.isShow) {
            return;
        }
        //输出当前适配模式下的stage大小
        console.log("size:", Laya.stage.width, Laya.stage.height);
    }

    public Show() {
        this.ChangeLayaConfig();
        this.visible = true;
    }

    public Hide() {
        this.SetLayaConfigDefault();
        this.visible = true;
    }
}