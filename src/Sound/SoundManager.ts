import Singleton from "../Base/Singleton";

export class SoundManager extends Singleton{
    public Play(url:string,loop:number){
        Laya.SoundManager.playSound(url,loop);
    }

    public Stop(url:string){
        Laya.SoundManager.stopSound(url);
    }
}