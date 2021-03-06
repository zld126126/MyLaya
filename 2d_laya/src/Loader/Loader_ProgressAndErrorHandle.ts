import SingletonScene from "../SingletonScene";
import Event = Laya.Event;
import Loader = Laya.Loader;
import Texture = Laya.Texture;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class Loader_ProgressAndErrorHandle extends SingletonScene {

    constructor() {
        super();
        // 无加载失败重试
        Laya.loader.retryNum = 0;
        var urls: Array<string> = ["do not exist", GlobalConfig.ResPath + "res/fighter/fighter.png", GlobalConfig.ResPath + "res/legend/map.jpg"];
        Laya.loader.load(urls, Handler.create(this, this.onAssetLoaded), Handler.create(this, this.onLoading, null, false), Loader.TEXT);
        // 侦听加载失败
        Laya.loader.on(Event.ERROR, this, this.onError);
    }

    private onAssetLoaded(texture: Texture): void {
        if (!this.isShow) {
            return;
        }
        // 使用texture
        console.log("加载结束");
    }

    // 加载进度侦听器
    private onLoading(progress: number): void {
        if (!this.isShow) {
            return;
        }
        console.log("加载进度: " + progress);
    }

    private onError(err: String): void {
        if (!this.isShow) {
            return;
        }
        console.log("加载失败: " + err);
    }
}