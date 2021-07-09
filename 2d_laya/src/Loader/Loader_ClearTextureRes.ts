import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Animation = Laya.Animation;
import Text = Laya.Text;
import Event = Laya.Event;
import { GlobalConfig } from "../GlobalConfig";

/**
 * Tips:
 * 1. 引擎初始化后，会占用16M内存，用来存放文字图集资源，所以即便舞台没有任何对象，也会占用这部分内存；
 * 2. 销毁 Texture 使用的图片资源后，会保留 Texture 壳，当下次渲染时，发现 Texture 使用的图片资源不存在，则自动恢复。
 */
export class Loader_ClearTextureRes extends SingletonScene {
    private spBg: Sprite;
    private aniFly: Animation;
    private btn: Sprite;
    private txt: Text;
    private isDestroyed: Boolean = false;
    private readonly PathBg: string = GlobalConfig.ResPath + "res/bg2.png";
    private readonly PathFly: string = GlobalConfig.ResPath + "res/fighter/fighter.atlas";

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.init();
    }

    /**
     * 初始化场景
     */
    private init(): void {
        //创建背景
        this.spBg = Sprite.fromImage(this.PathBg);
        this.addChild(this.spBg);

        //创建动画
        this.aniFly = new Animation();
        this.aniFly.loadAtlas(this.PathFly);
        this.aniFly.play();
        this.aniFly.pos(250, 100);
        this.addChild(this.aniFly);

        //创建按钮
        this.btn = new Sprite().size(205, 55);
        this.btn.graphics.drawRect(0, 0, this.btn.width, this.btn.height, "#057AFB");
        this.txt = new Text();
        this.txt.text = "销毁";
        this.txt.pos(75, 15);
        this.txt.fontSize = 25;
        this.txt.color = "#FF0000";
        this.btn.addChild(this.txt);
        this.btn.pos(20, 160);
        this.addChild(this.btn);

        //添加侦听
        this.btn.on(Event.MOUSE_UP, this, this.onMouseUp);
    }

    /**
     * 鼠标事件响应函数
     * @param evt 
     */
    private onMouseUp(evt: Event): void {
        if (this.isDestroyed) {
            //通过设置 visible=true ，来触发渲染，然后引擎会自动恢复资源
            this.spBg.visible = true;
            this.aniFly.visible = true;

            this.isDestroyed = false;
            this.txt.text = "销毁";
        } else {
            //通过设置 visible=false ，来停止渲染对象
            this.spBg.visible = false;
            this.aniFly.visible = false;

            //销毁 Texture 使用的图片资源
            Laya.loader.clearTextureRes(this.PathBg);
            Laya.loader.clearTextureRes(this.PathFly);

            this.isDestroyed = true;
            this.txt.text = "恢复";
        }
    }
}