export default abstract class SingletonMainScene extends Laya.Scene {
    /**
     * 构造函数
     */
    constructor() {
        super();
    }

    // 是否展示
    public isShow: boolean = false;
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
}
