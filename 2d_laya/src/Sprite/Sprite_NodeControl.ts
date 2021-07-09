import Sprite = Laya.Sprite;
import Event = Laya.Event;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class Sprite_NodeControl extends SingletonScene {
    private ape1: Sprite;
    private ape2: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.createApes();
    }

    private createApes(): void {
        //显示两只猩猩
        this.ape1 = new Sprite();
        this.ape2 = new Sprite();
        this.ape1.loadImage(GlobalConfig.ResPath + "res/apes/monkey2.png");
        this.ape2.loadImage(GlobalConfig.ResPath + "res/apes/monkey2.png");

        this.ape1.pivot(55, 72);
        this.ape2.pivot(55, 72);

        this.ape1.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.ape2.pos(200, 0);

        //一只猩猩在舞台上，另一只被添加成第一只猩猩的子级
        this.addChild(this.ape1);
        this.ape1.addChild(this.ape2);

        Laya.timer.frameLoop(1, this, this.animate);
    }

    private animate(e: Event): void {
        this.ape1.rotation += 2;
        this.ape2.rotation -= 4;
    }
}