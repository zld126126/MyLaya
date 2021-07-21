import { GameEvent, MusicRes } from "./MyConst";
/**
*
* @ author:DongTech
* @ email:9212085@qq.com
* @ data: 2021-05-10 20:55
*/
export default class StartPanel extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:btn_Play, tips:"提示文本", type:Node, default:null}*/
        this.btn_Play = null;

        /** @prop {name:btn_AudioOn, tips:"提示文本", type:Node, default:null}*/
        this.btn_AudioOn = null;

        /** @prop {name:btn_AudioOff, tips:"提示文本", type:Node, default:null}*/
        this.btn_AudioOff = null;
    }

    onAwake() {
        this.btn_Play.on(Laya.Event.CLICK, this, this.btnPlayClick);
        this.btn_AudioOn.on(Laya.Event.CLICK, this, this.btnAudioOnClick);
        this.btn_AudioOff.on(Laya.Event.CLICK, this, this.btnAudioOffClick);

        Laya.stage.on(GameEvent.Mute,this,this.IsMute);
    }

    btnPlayClick() {
        this.owner.visible = false;
        Laya.stage.event(GameEvent.GameStart);
        Laya.SoundManager.playSound(MusicRes.ButtonClick,1); 
    }

    btnAudioOnClick() {
        Laya.SoundManager.muted = true;
        Laya.SoundManager.playSound(MusicRes.ButtonClick,1);
        this.btn_AudioOff.visible = true;
        this.btn_AudioOn.visible = false;
        Laya.stage.event(GameEvent.Mute,true);
    }

    btnAudioOffClick() {
        Laya.SoundManager.muted = false;
        this.btn_AudioOn.visible = true;
        this.btn_AudioOff.visible = false;
        Laya.stage.event(GameEvent.Mute,false);
    }

    btnHomeClick(){
        this.owner.visible = true;
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