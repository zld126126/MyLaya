export default abstract class SingletonScene extends Laya.Scene3D {
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
        //显示性能面板
        Laya.Stat.show();
    }

    /**
     * 隐藏
     */
    Hide(): void {
        this.visible = false;
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
        if (this != null) {
            this.destroy();
        }
    }
}
