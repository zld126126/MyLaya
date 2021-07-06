import TiledMap = Laya.TiledMap;
import Rectangle = Laya.Rectangle;
import Browser = Laya.Browser;
import SingletonScene from "../SingletonScene";

export class TiledMap_AnimationTile extends SingletonScene {
    private tiledMap: TiledMap;

    constructor() {
        super();
        Laya.stage.addChild(this);
    }

    private createMap(): void {
        this.tiledMap = new TiledMap();
        this.tiledMap.createMap("res/tiledMap/orthogonal-test-movelayer.json", new Rectangle(0, 0, 300, 400), null);
    }

    public Show() {
        this.createMap();
    }

    public Hide() {
        this.tiledMap.destroy();
    }
}