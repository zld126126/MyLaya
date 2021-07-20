import { EventManager, EventType } from "./EventManager";
import { GlobalConfig } from "./GlobalConfig";

/**
 * 场景(单例)
 */
export default abstract class SingletonScene {
    /**
     * 每个页面单独的返回主页按钮
     */
    backbtn: Laya.Button;

    constructor() {
        /**
         * 注册设置场景按钮
         */
        EventManager.RegistEvent(EventType.SETSCENE3D, Laya.Handler.create(this, this.SetScene3d));
    }

    // 是否展示
    public isShow: boolean = false;
    // 当前场景
    public CurrentScene: Laya.Scene3D;
    /**
     *
     * @param this 单例
     * @returns
     */
    static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this).instance) {
            (<any>this).instance = new this();
        }
        return (<any>this).instance;
    }

    /**
     * 增加按钮
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param text 
     * @param clickFun 
     */
    private addButton(x: number, y: number, width: number, height: number, text: string, clickFun: Function): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.backbtn = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text);
            Laya.stage.addChild(this.backbtn);
            this.backbtn.size(width, height);
            this.backbtn.pos(x, y);
            this.backbtn.on(Laya.Event.CLICK, this, clickFun);
        }));
    }

    /**
     * 设置当前场景
     * @param scene 场景
     */
    public SetScene3d(scene: Laya.Scene3D) {
        if (!this.CurrentScene) {
            this.CurrentScene = scene;
            Laya.stage.addChild(this.CurrentScene);
            this.Show();
        }
    }

    /**
     * 获取当前场景
     * @returns 场景
     */
    public GetScene3d(): Laya.Scene3D {
        return this.CurrentScene;
    }

    /**
     * 自动设置current场景
     * @param scene 场景
     */
    public AutoSetScene3d(scene: Laya.Scene3D) {
        EventManager.DispatchEvent(EventType.BACKTOMAIN);
        EventManager.DispatchEvent(EventType.SETSCENE3D, scene);
    }

    /**
     * 增加返回主页按钮
     */
    AddReturn() {
        this.addButton(50, 50, 100, 40, "返回主页", function (e) {
            this.Hide();
            if (this.backbtn) {
                this.backbtn.visible = false;
                this.backbtn.destroy();
                this.backbtn = null;
            }
            EventManager.DispatchEvent(EventType.BACKTOMAIN);
            this.isShow = false;
        });
    }

    /**
     * 显示
     */
    Show(): void {
        if (this.CurrentScene) {
            this.CurrentScene.visible = true;
            this.AddReturn();
        }
        //显示性能面板
        Laya.Stat.show();
    }

    /**
     * 隐藏
     */
    Hide(): void {
        if (this.CurrentScene) {
            this.CurrentScene.visible = false;
        }
        //隐藏性能面板
        Laya.Stat.hide();
    }

    /**
     * 点击
     */
    Click(): void {
        this.isShow = !this.isShow;
        if (this.isShow) {
            this.Show();
        }
        else {
            this.Hide();
        }
    }

    /**
     * 销毁
     */
    Destroy(): void {
        if (this.CurrentScene) {
            this.CurrentScene.destroy();
        }
    }
}
