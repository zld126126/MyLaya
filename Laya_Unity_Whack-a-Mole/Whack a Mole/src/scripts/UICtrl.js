export default class UICtrl extends Laya.Script {

    constructor() { 
        super();
        /** @prop {name:txt_Time, tips:"倒计时显示文本", type:Node, default:null}*/
        this.txt_Time=null;
        /** @prop {name:txt_Score, tips:"成绩显示文本", type:Node, default:null}*/
        this.txt_Score=null;
        /** @prop {name:gameoverPanel, tips:"游戏结束", type:Node, default:null}*/
        this.gameoverPanel=null;
        /** @prop {name:btn_Again, tips:"再来一局按钮", type:Node, default:null}*/
        this.btn_Again=null;
    }
    onAwake(){
        //监听再来一局按钮按下
        this.btn_Again.on(Laya.Event.CLICK,this,this.againGame);
        this.score=0;
        //计时器
        this.timer=0;
        this.time=60;
        //侦听器，侦听AddScore事件类型广播
        Laya.stage.on("AddScore",this,this.addScore);
    }
    //增加成绩
    addScore(){
        this.score++;
        this.txt_Score.text="Score:"+this.score;
    }
    onUpdate(){
        //倒计时结束，游戏结束
        if(this.time<=0){
            this.gameover();
        }
        this.timer+=(Laya.timer.delta/1000);
        if(this.timer>=1){
            this.timer=0;
            this.time--;
            this.txt_Time.text="Time:"+this.time+"s";
        }
    }
    //游戏结束
    gameover(){
        this.txt_Score.visible=false;
        this.txt_Time.visible=false;
        this.gameoverPanel.visible=true;
        Laya.stage.event("GameOver");
    }
    //再来一局按钮按下
    againGame(){
        this.txt_Score.visible=true;
        this.txt_Time.visible=true;
        this.gameoverPanel.visible=false;
        this.timer=0;
        this.time=60;
        this.txt_Time.text="Time:"+this.time+"s";
        this.score=0;
        this.txt_Score.text="Score:"+this.score;
        //派发AgainGame事件码
        Laya.stage.event("AgainGame");
    }
}