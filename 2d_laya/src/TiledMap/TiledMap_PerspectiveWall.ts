import TiledMap = Laya.TiledMap;
import Rectangle = Laya.Rectangle;
import Browser = Laya.Browser;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class TiledMap_PerspectiveWall extends SingletonScene {
    private tiledMap: TiledMap;
    constructor() {
        super();
    }

    private createMap(): void {
        this.tiledMap = new TiledMap();
        this.tiledMap.createMap(GlobalConfig.ResPath + "res/tiledMap/perspective_walls.json", new Rectangle(0, 0, 300, 400), null);
    }

    public Show() {
        this.createMap();
    }

    public Hide() {
        this.tiledMap.destroy();
    }
}