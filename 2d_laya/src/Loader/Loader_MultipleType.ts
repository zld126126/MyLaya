import SingletonScene from "../SingletonScene";
import Loader = Laya.Loader;
import Handler = Laya.Handler;
import Image = Laya.Image;

export class Loader_MultipleType extends SingletonScene {
    private ROBOT_DATA_PATH: string = "res/skeleton/robot/robot.bin";
    private ROBOT_TEXTURE_PATH: string = "res/skeleton/robot/texture.png";

    constructor() {
        super();
        Laya.stage.addChild(this);

        var assets: Array<any> = [];
        assets.push({ url: this.ROBOT_DATA_PATH, type: Loader.BUFFER });
        assets.push({ url: this.ROBOT_TEXTURE_PATH, type: Loader.IMAGE });

        Laya.loader.load(assets, Handler.create(this, this.onAssetsLoaded));
    }

    private onAssetsLoaded(): void {
        var robotData: any = Loader.getRes(this.ROBOT_DATA_PATH);
        var robotTexture: any = Loader.getRes(this.ROBOT_TEXTURE_PATH);
        var img: Image = new Image(this.ROBOT_TEXTURE_PATH);
        this.addChild(img);
        // 使用资源
    }
}