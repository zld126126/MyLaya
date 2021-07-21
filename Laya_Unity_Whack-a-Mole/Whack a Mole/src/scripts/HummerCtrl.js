import MoleCtrl from "./MoleCtrl";
import EffectAutoDestroy from "./EffectAutoDestroy";

export default class HummerCtrl extends Laya.Script {

    constructor() { 
        super();
    }
    //初始化方法
    Init(camera,scene,effect){
        this.camera=camera;
        this.scene=scene;
        this.physicsSimulation=scene.physicsSimulation;
        this.effect=effect;
    }
    onAwake(){
        //创建射线
        this.ray=new Laya.Ray(new Laya.Vector3(),new Laya.Vector3());
        //射线检测结果
        this.hitResult=new Laya.HitResult(); 

        //监听鼠标左键按下
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.onDown);
        Laya.stage.on("GameOver",this,function(){this.isGameOver=true;});
        Laya.stage.on("AgainGame",this,function(){this.isGameOver=false;});
    }
    onDown(){
        if(this.isGameOver)return;
        
        //将屏幕坐标转化为射线
        this.camera.viewportPointToRay(new Laya.Vector2(Laya.stage.mouseX,Laya.stage.mouseY),this.ray);
        if(this.physicsSimulation.rayCast(this.ray,this.hitResult)){
            if(this.hitResult.collider.owner.transform.localPosition.y>=2){
                this.targetPos=this.hitResult.collider.owner.transform.position;
                this.targetPos.y=0.35;
                this.owner.transform.position=new Laya.Vector3(this.targetPos.x,7,this.targetPos.z);

                //锤子下落动画
                Laya.Tween.to(this.owner.transform,{localPositionX:this.targetPos.x,localPositionY:this.targetPos.y,
                localPositionZ:this.targetPos.z},100,Laya.Ease.linearIn,Laya.Handler.create(this,function(){
                    this.hitResult.collider.owner.getComponent(MoleCtrl).Knock();
                    //生成特效
                    var temp=Laya.Sprite3D.instantiate(this.effect,this.scene);
                    temp.transform.position=this.targetPos;
                    temp.addComponent(EffectAutoDestroy);
                    Laya.stage.event("AddScore");
                    Laya.SoundManager.playSound("https://donggame.oss-cn-beijing.aliyuncs.com/donggame/whackamole/hit.mp3");

                    Laya.Tween.to(this.owner.transform,{localPositionX:this.targetPos.x,localPositionY:7,
                        localPositionZ:this.targetPos.z},100,Laya.Ease.linearIn,Laya.Handler.create(this,function(){}),0,true);
                }),0,true);
            }
        }
    }
}