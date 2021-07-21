import { GameEvent, MusicRes } from "./MyConst";
import GameManager from "./GameManager";
import Player from "./Player";
import StartPanel from "./StartPanel";
/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-13 14:01
*/
export default class PausePanel extends Laya.Script {

    constructor() {
        super();
    }

    onAwake() {
        this.owner.visible = false;
        this.btn_Close = this.owner.getChildByName("btn_Close");
        this.btn_Home = this.owner.getChildByName("btn_Home");
        this.btn_Restart = this.owner.getChildByName("btn_Restart");
        this.btn_AudioOn = this.owner.getChildByName("btn_AudioOn");
        this.btn_AudioOff = this.owner.getChildByName("btn_AudioOff");
        

        this.btn_Close.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            Laya.timer.resume();
            this.owner.visible = false;
            this.owner.parent.getChildByName("GamePanel").visible = true;
            this.owner.parent.getChildByName("Player").getComponent(Player).isStartGame=true;
        });

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

        this.btn_AudioOff.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.muted = false;
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            this.btn_AudioOff.visible = false;
            this.btn_AudioOn.visible = true;
            Laya.stage.event(GameEvent.Mute,false)
        });

        this.btn_AudioOn.on(Laya.Event.CLICK, this, function () {
            Laya.SoundManager.muted = true;
            Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
            this.btn_AudioOff.visible = true;
            this.btn_AudioOn.visible = false;
            Laya.stage.event(GameEvent.Mute,true);
        });

        Laya.stage.on(GameEvent.GamePause,this,function(){
            this.owner.visible = true;
        });

        Laya.stage.on(GameEvent.Mute,this,this.IsMute);
    }

    IsMute(value){
        if(value){
            this.btn_AudioOn.visible=false;
            this.btn_AudioOff.visible=true;
        }else{
            this.btn_AudioOn.visible=true;
            this.btn_AudioOff.visible=false;
        }
    }
}