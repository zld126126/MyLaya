import { GameEvent, StorageKey,MusicRes } from "./MyConst";
import GameManager from "./GameManager";
import GamePanel from "./GamePanel";
import StartPanel from "./StartPanel";
import Player from "./Player";

/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-13 20:25
*/
export default class GameOverPanel extends Laya.Script {

    constructor() {
        super();
    }

    onAwake() {
        this.owner.visible = false;
        this.btn_Home = this.owner.getChildByName("btn_Home");
        this.btn_Restart = this.owner.getChildByName("btn_Restart");
        this.txt_Over = this.owner.getChildByName("txt_Over");
        this.txt_Score = this.owner.getChildByName("txt_Score");
        this.txt_HighScore = this.owner.getChildByName("txt_HighScore");

        Laya.loader.load("font.ttf", Laya.Handler.create(this, function (font) {
            this.txt_Over.font = font.fontName;
            this.txt_Score.font = font.fontName;
            this.txt_HighScore.font = font.fontName;
        }), null, Laya.Loader.TTF);

        this.btn_Home.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getChildByName("StartPanel").getComponent(StartPanel).btnHomeClick();
            this.owner.parent.getComponent(GameManager).btnHomeClick();
            this.owner.parent.getChildByName("Player").getComponent(Player).Reset();
        });

        this.btn_Restart.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getComponent(GameManager).btnRestartClick();
            Laya.stage.event(GameEvent.GameStart);
            this.owner.parent.getChildByName("Player").getComponent(Player).Reset();
        });

        Laya.stage.on(GameEvent.GameOver, this, this.gameOver);
    }

    gameOver() {
        this.owner.visible = true;
        var currentScore = this.owner.parent.getChildByName("GamePanel").getComponent(GamePanel).score;
        this.txt_Score.text = "Score:" + currentScore;
        var hightScore = Number(Laya.LocalStorage.getItem(StorageKey.BESTSCORE));
        if (currentScore > hightScore) {
            Laya.LocalStorage.setItem(StorageKey.BESTSCORE, currentScore);
            this.txt_HighScore.text = "HighScore:" + currentScore;
        } else {
            this.txt_HighScore.text = "HighScore:" + hightScore;
        }
        Laya.LocalStorage.setItem(StorageKey.LASTSCORE, currentScore);
    }
}