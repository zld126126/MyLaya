import SingletonScene from "../SingletonScene";
import Texture = Laya.Texture;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class Loader_Sequence extends SingletonScene {
    private numLoaded: number = 0;
    private resAmount: number = 3;

    constructor() {
        super();
        Laya.stage.addChild(this);
        // 按序列加载 monkey2.png - monkey1.png - monkey0.png
        // 不开启缓存
        // 关闭并发加载
        Laya.loader.maxLoader = 1;
        Laya.loader.load(GlobalConfig.ResPath + "res/apes/monkey2.png", Handler.create(this, this.onAssetLoaded), null, null, 0, false);
        Laya.loader.load(GlobalConfig.ResPath + "res/apes/monkey1.png", Handler.create(this, this.onAssetLoaded), null, null, 1, false);
        Laya.loader.load(GlobalConfig.ResPath + "res/apes/monkey0.png", Handler.create(this, this.onAssetLoaded), null, null, 2, false);
    }

    private onAssetLoaded(texture: Texture): void {
        if (!this.isShow) {
            return;
        }
        // 恢复默认并发加载个数。
        if (++this.numLoaded == this.resAmount) {
            Laya.loader.maxLoader = 5;
            console.log("All done.");
        }
    }
}