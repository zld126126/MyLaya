export default abstract class SingletonScene extends Laya.Scene {
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

    }

    /**
     * 隐藏
     */
    Hide(): void {

    }

    /**
     * 点击
     */
    Click(): void {
        this.isShow = !this.isShow;
        if (this.isShow) {
            this.Show();
        } else {
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