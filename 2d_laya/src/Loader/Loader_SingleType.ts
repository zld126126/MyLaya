import SingletonScene from "../SingletonScene";
import Loader = Laya.Loader;
import Image = Laya.Image;
import Handler = Laya.Handler;
import { GlobalConfig } from "../GlobalConfig";

export class Loader_SingleType extends SingletonScene {

    constructor() {
        super();
        Laya.stage.addChild(this);

        // 加载一张png类型资源
        Laya.loader.load(GlobalConfig.ResPath + "res/apes/monkey0.png", Handler.create(this, this.onAssetLoaded1));
        // 加载多张png类型资源
        Laya.loader.load(
            [GlobalConfig.ResPath + "res/apes/monkey0.png", GlobalConfig.ResPath + "res/apes/monkey1.png", GlobalConfig.ResPath + "res/apes/monkey2.png"],
            Handler.create(this, this.onAssetLoaded2));
    }

    private onAssetLoaded1(): void {
        var pic1: Image = new Image(GlobalConfig.ResPath + "res/apes/monkey0.png");
        pic1.x = 200;
        pic1.y = 300;
        this.addChild(pic1);
    }

    private onAssetLoaded2(): void {
        var pic1: Image = new Image(GlobalConfig.ResPath + "res/apes/monkey0.png");
        pic1.x = 50;
        var pic2: Image = new Image(GlobalConfig.ResPath + "res/apes/monkey1.png");
        pic2.x = 100;
        var pic3: Image = new Image(GlobalConfig.ResPath + "res/apes/monkey2.png");
        pic3.x = 150;
        // 使用资源
        this.addChild(pic1);
        this.addChild(pic2);
        this.addChild(pic3);
    }
}