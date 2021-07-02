export default abstract class Singleton {
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
}