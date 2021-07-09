import { EventManager, EventType } from "./EventManager";
import { GlobalConfig } from "./GlobalConfig";

export default abstract class SingletonScene {
    backbtn: Laya.Button;
    constructor() {
        EventManager.RegistEvent(EventType.SETSCENE3D, Laya.Handler.create(this, this.SetScene3d));
    }
    // 是否展示
    public isShow: boolean = false;
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

    private addButton(x: number, y: number, width: number, height: number, text: string, clickFun: Function): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
            this.backbtn = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text);
            var changeActionButton: Laya.Button = Laya.stage.addChild(this.backbtn) as Laya.Button;
            changeActionButton.size(width, height);
            changeActionButton.pos(x, y);
            changeActionButton.on(Laya.Event.CLICK, this, clickFun);
        }));
    }

    SetScene3d(scene: Laya.Scene3D) {
        if (!this.CurrentScene){
            this.CurrentScene = scene;
            Laya.stage.addChild(this.CurrentScene);
            this.Show();
        }
    }

    AddReturn(){
        this.addButton(50, 50, 100, 40, "返回主页", function (e) {
            this.Hide();
            this.backbtn.visible = false;
            this.backbtn.destroy();
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
