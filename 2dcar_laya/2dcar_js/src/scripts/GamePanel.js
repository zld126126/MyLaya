import { GameEvent, StorageKey,MusicRes } from "./MyConst";

/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-12 16:06
*/
export default class GamePanel extends Laya.Script {

    constructor() {
        super();
        this.score = 0;
        this.best = 0;
        this.last = 0;
        this.isPause = false;
    }

    onAwake() {
        this.owner.visible = false;
        this.txt_Best = this.owner.getChildByName("txt_Best");
        this.txt_Last = this.owner.getChildByName("txt_Last");
        this.txt_Score = this.owner.getChildByName("txt_Score");
        this.btn_Pause = this.owner.getChildByName("btn_Pause");
        this.owner.visible = false;
        this.Init();

        this.btn_Pause.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            Laya.timer.pause();
            this.owner.visible = false;
            Laya.stage.event(GameEvent.GamePause);
        });

        Laya.loader.load("font.ttf", Laya.Handler.create(this, function (font) {
            this.txt_Best.font = font.fontName;
            this.txt_Last.font = font.fontName;
            this.txt_Score.font = font.fontName;
        }), null, Laya.Loader.TTF);

        Laya.stage.on(GameEvent.GameStart, this, function () {
            this.owner.visible = true;
            this.Init();
        });
        Laya.stage.on(GameEvent.AddScore, this, this.AddScore);
        Laya.stage.on(GameEvent.GameOver, this, function () {
            this.owner.visible = false;
        });
    }

    AddScore(score = 1) {
        this.score += score;
        this.txt_Score.text = this.score;
        this.last = this.score;
        if (this.score > this.best) {
            this.best = this.score;
        }
        this.SaveAndShow();
    }

    Init() {
        this.score = 0;
        this.txt_Score.text = this.score;
        this.LoadAndShow();
    }

    LoadAndShow() {
        this.last = Number(Laya.LocalStorage.getItem(StorageKey.LASTSCORE));
        this.best = Number(Laya.LocalStorage.getItem(StorageKey.BESTSCORE));
        this.txt_Best.text = "Best:" + this.best;
        this.txt_Last.text = "Last:" + this.last;
    }

    SaveAndShow() {
        Laya.LocalStorage.setItem(StorageKey.LASTSCORE, this.last);
        Laya.LocalStorage.setItem(StorageKey.BESTSCORE, this.best);
        this.txt_Best.text = "Best:" + this.best;
        this.txt_Last.text = "Last:" + this.last;
    }
}