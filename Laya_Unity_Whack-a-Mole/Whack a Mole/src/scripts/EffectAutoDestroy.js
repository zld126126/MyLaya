export default class EffectAutoDestroy extends Laya.Script {

    constructor() { 
        super();
    }
    onAwake(){
        Laya.stage.timerOnce(2000,this,function(){
            this.owner.destroy();
        })
    }
}