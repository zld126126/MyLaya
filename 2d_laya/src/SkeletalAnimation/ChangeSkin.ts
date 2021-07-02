import Skeleton = Laya.Skeleton;
import Templet = Laya.Templet;
import Event = Laya.Event;
import SingletonScene from "../SingletonScene";

export class ChangeSkin extends SingletonScene{
    private mAniPath: string;
    private mStartX: number = 400;
    private mStartY: number = 500;
    private mFactory: Templet;
    private mActionIndex: number = 0;
    private mCurrIndex: number = 0;
    private mArmature: Skeleton;
    private mCurrSkinIndex: number = 0;
    private mSkinList: any = ["goblin", "goblingirl"];

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.startFun();
    }
    public startFun(): void {
        this.mAniPath = "res/spine/spineRes2/goblins.sk";
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
        this.addChild(this.mArmature);
        this.mArmature.on(Event.STOPPED, this, this.completeHandler);
        this.play();
        this.changeSkin();
        Laya.timer.loop(1000, this, this.changeSkin);
    }

    private changeSkin(): void {
        this.mCurrSkinIndex++;
        if (this.mCurrSkinIndex >= this.mSkinList.length) {
            this.mCurrSkinIndex = 0;
        }
        this.mArmature.showSkinByName(this.mSkinList[this.mCurrSkinIndex]);
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
}