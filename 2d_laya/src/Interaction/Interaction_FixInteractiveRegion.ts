import SingletonScene from "../SingletonScene";
import Sprite = Laya.Sprite;
import Text = Laya.Text;
import Event = Laya.Event;

export class Interaction_FixInteractiveRegion extends SingletonScene {
    private logger: Text;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.setup();
    }

    private setup(): void {
        this.buildWorld();
        this.createLogger();
    }

    private buildWorld(): void {
        this.createCoralRect();
        this.createDeepSkyblueRect();
        this.createDarkOrchidRect();

        // 设置舞台
        this.name = "暗灰色舞台"
        Laya.stage.on(Event.MOUSE_DOWN, this, this.onDown);
    }

    private createCoralRect(): void {
        var coralRect: Sprite = new Sprite();
        coralRect.graphics.drawRect(0, 0, Laya.stage.width - 100, Laya.stage.height / 2, "#FF7F50");

        //设置名称
        coralRect.name = "珊瑚色容器";
        coralRect.size(Laya.stage.width - 100, Laya.stage.height / 2);
        this.addChild(coralRect);

        coralRect.on(Event.MOUSE_DOWN, this, this.onDown);
    }

    private createDeepSkyblueRect(): void {
        var deepSkyblueRect: Sprite = new Sprite();
        deepSkyblueRect.graphics.drawRect(0, 0, 100, 100, "#00BFFF");
        //设置名称
        deepSkyblueRect.name = "天蓝色矩形";
        //设置宽高（要接收鼠标事件必须设置宽高，否则不会被命中）  
        deepSkyblueRect.size(100, 100);
        deepSkyblueRect.pos(10, 10);
        this.addChild(deepSkyblueRect);

        deepSkyblueRect.on(Event.MOUSE_DOWN, this, this.onDown);
    }

    private createDarkOrchidRect(): void {
        var darkOrchidRect: Sprite = new Sprite();
        darkOrchidRect.name = "暗紫色矩形容器";
        darkOrchidRect.graphics.drawRect(-100, -100, 200, 200, "#9932CC");

        darkOrchidRect.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.addChild(darkOrchidRect);

        // 为true时，碰撞区域会被修正为实际显示边界
        // mouseThrough命名真是具有强烈的误导性
        darkOrchidRect.mouseThrough = true;
        darkOrchidRect.on(Event.MOUSE_DOWN, this, this.onDown);
    }

    private createLogger(): void {
        this.logger = new Text();
        this.logger.size(Laya.stage.width - 100, Laya.stage.height - 100);
        this.logger.align = 'right';
        this.logger.fontSize = 20;
        this.logger.color = "#FFFFFF";
        this.addChild(this.logger);
    }

    /**侦听处理方法*/
    private onDown(e: Event): void {
        if (!this.isShow) {
            return;
        }
        this.logger.text += "点击 - " + e.target.name + "\n";
    }
}