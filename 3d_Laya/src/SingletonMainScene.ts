import { EventManager, EventType } from "./EventManager";

/**
 * 功能场景(按钮控制)(单例)
 */
export default abstract class SingletonMainScene extends Laya.Scene {
    /**
     * 构造函数
     */
    constructor() {
        super();
        // 注册事件
        EventManager.RegistEvent(EventType.BACKTOMAIN, Laya.Handler.create(this, this.Back2Main));
    }
    
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
     * 显示
     */
    Show(): void {
        this.visible = true;
    }

    /**
     * 隐藏
     */
    Hide(): void {
        this.visible = false;
    }

    /**
     * 销毁
     */
    Destroy(): void {
        if (this != null) {
            this.destroy();
        }
    }

    /**
     * 返回主页 隐藏当前页面
     */
    public Back2Main() {
        this.Hide();
    }
}
