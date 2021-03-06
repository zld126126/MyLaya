import EventData = Laya.EventData;
import Skeleton = Laya.Skeleton;
import Templet = Laya.Templet;
import Sprite = Laya.Sprite;
import Event = Laya.Event;
import Handler = Laya.Handler;
import Tween = Laya.Tween;
import SingletonScene from "../SingletonScene";
import { GlobalConfig } from "../GlobalConfig";

export class Skeleton_SpineEvent extends SingletonScene {
    private mAniPath: string;
    private mStartX: number = 400;
    private mStartY: number = 500;
    private mFactory: Templet;
    private mActionIndex: number = 0;
    private mCurrIndex: number = 0;
    private mArmature: Skeleton;
    private mCurrSkinIndex: number = 0;
    private mFactory2: Templet;
    private mLabelSprite: Sprite;

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.mLabelSprite = new Sprite();
        this.startFun();
    }
    public startFun(): void {
        this.mAniPath = GlobalConfig.ResPath + "res/spine/spineRes6/alien.sk";
        this.mFactory = new Templet();
        this.mFactory.on(Event.COMPLETE, this, this.parseComplete);
        this.mFactory.on(Event.ERROR, this, this.onError);
        this.mFactory.loadAni(this.mAniPath);
    }

    private onError(): void {
        console.log("error");
    }

    private parseComplete(): void {
        //创建模式为1，可以启用换装
        this.mArmature = this.mFactory.buildArmature(1);
        this.mArmature.x = this.mStartX;
        this.mArmature.y = this.mStartY;
        this.mArmature.scale(0.5, 0.5);
        this.addChild(this.mArmature);
        this.mArmature.on(Event.LABEL, this, this.onEvent);
        this.mArmature.on(Event.STOPPED, this, this.completeHandler);
        this.play();
    }

    private completeHandler(): void {
        this.play();
    }

    private play(): void {
        this.mCurrIndex++;
        if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
            this.mCurrIndex = 0;
        }
        this.mArmature.play(this.mCurrIndex, false);

    }

    private onEvent(e): void {
        var tEventData: EventData = e as EventData;

        this.addChild(this.mLabelSprite);
        this.mLabelSprite.x = this.mStartX;
        this.mLabelSprite.y = this.mStartY;
        this.mLabelSprite.graphics.clear();
        this.mLabelSprite.graphics.fillText(tEventData.name, 0, 0, "20px Arial", "#ff0000", "center");
        Tween.to(this.mLabelSprite, { y: this.mStartY - 200 }, 1000, null, Handler.create(this, this.playEnd))
    }

    private playEnd(): void {
        this.mLabelSprite.removeSelf();
    }
}