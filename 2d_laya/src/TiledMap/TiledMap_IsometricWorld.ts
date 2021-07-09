import Sprite = Laya.Sprite;
import MapLayer = Laya.MapLayer;
import TiledMap = Laya.TiledMap;
import Point = Laya.Point;
import Rectangle = Laya.Rectangle;
import Handler = Laya.Handler;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class TiledMap_IsometricWorld extends SingletonScene {
    private tiledMap: TiledMap;
    private layer: MapLayer;
    private sprite: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.on("click", this, this.onStageClick);
    }

    private createMap(): void {
        this.tiledMap = new TiledMap();
        this.tiledMap.createMap(GlobalConfig.ResPath + "res/tiledMap/isometric_grass_and_water.json", new Rectangle(0, 0, 300, 400), Handler.create(this, this.mapLoaded), null, new Point(800, 400));
    }

    private onStageClick(): void {
        if (!this.isShow) {
            return;
        }
        var p: Point = new Point(0, 0);
        this.layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, p);
        this.layer.getScreenPositionByTilePos(Math.floor(p.x), Math.floor(p.y), p);
        this.sprite.pos(p.x, p.y);
    }

    private mapLoaded(): void {
        this.layer = this.tiledMap.getLayerByIndex(0);

        var radiusX: number = 32;
        var radiusY: number = Math.tan(180 / Math.PI * 30) * radiusX;
        var color: string = "#FF7F50";

        this.sprite = new Sprite();
        this.sprite.graphics.drawLine(0, 0, -radiusX, radiusY, color);
        this.sprite.graphics.drawLine(0, 0, radiusX, radiusY, color);
        this.sprite.graphics.drawLine(-radiusX, radiusY, 0, radiusY * 2, color);
        this.sprite.graphics.drawLine(radiusX, radiusY, 0, radiusY * 2, color);
        this.addChild(this.sprite);
    }

    public Show() {
        this.createMap();
    }

    public Hide() {
        this.tiledMap.destroy();
    }
}
