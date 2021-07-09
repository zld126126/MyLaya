import Animation = Laya.Animation;
import Rectangle = Laya.Rectangle;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class Animation_Altas extends SingletonScene {
    private AniConfPath: string = GlobalConfig.ResPath + "res/fighter/fighter.atlas";

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createAnimation();
    }

    private createAnimation(): void {
        var ani: Animation = new Animation();
        ani.loadAtlas(this.AniConfPath); // 加载图集动画
        ani.interval = 30; // 设置播放间隔（单位：毫秒）
        ani.index = 1; // 当前播放索引
        ani.play(); // 播放图集动画

        // 获取动画的边界信息
        var bounds: Rectangle = ani.getGraphicBounds(true);
        ani.pivot(bounds.width / 2, bounds.height / 2);

        ani.pos(Laya.stage.width / 2, Laya.stage.height / 2);

        this.addChild(ani);
    }
}