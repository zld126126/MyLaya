import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Rectangle = Laya.Rectangle;
import Texture = Laya.Texture;
import Handler = Laya.Handler;

export class Interaction_Drag extends SingletonScene {
    private ApePath: string = "res/apes/monkey2.png";

    private ape: Sprite;
    private dragRegion: Rectangle;

    constructor() {
        super();
        Laya.stage.addChild(this);
        Laya.loader.load(this.ApePath, Handler.create(this, this.setup));
    }

    private setup(): void {
        this.createApe();
        this.showDragRegion();
    }

    private createApe(): void {
        this.ape = new Sprite();

        this.ape.loadImage(this.ApePath);
        this.addChild(this.ape);

        var texture: Texture = Laya.loader.getRes(this.ApePath);
        this.ape.pivot(texture.width / 2, texture.height / 2);
        this.ape.x = Laya.stage.width / 2;
        this.ape.y = Laya.stage.height / 2;

        this.ape.on(Event.MOUSE_DOWN, this, this.onStartDrag);
    }

    private showDragRegion(): void {
        //拖动限制区域
        var dragWidthLimit: number = 350;
        var dragHeightLimit: number = 200;
        this.dragRegion = new Rectangle(Laya.stage.width - dragWidthLimit >> 1, Laya.stage.height - dragHeightLimit >> 1, dragWidthLimit, dragHeightLimit);

        //画出拖动限制区域
        this.graphics.drawRect(
            this.dragRegion.x, this.dragRegion.y, this.dragRegion.width, this.dragRegion.height,
            null, "#FFFFFF", 2);
    }

    private onStartDrag(e: Event): void {
        //鼠标按下开始拖拽(设置了拖动区域和超界弹回的滑动效果)
        this.ape.startDrag(this.dragRegion, true, 100);
    }
}