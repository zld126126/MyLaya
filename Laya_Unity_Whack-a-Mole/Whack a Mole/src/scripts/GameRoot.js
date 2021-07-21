import MoleCtrl from "./MoleCtrl";
import HummerCtrl from "./HummerCtrl";

export default class GameRoot extends Laya.Script {

    constructor() { 
        super(); 
        /** @prop {name:intType, tips:"整数类型示例", type:Int, default:1000}*/
        let intType = 1000;
        /** @prop {name:numType, tips:"数字类型示例", type:Number, default:1000}*/
        let numType = 1000;
        /** @prop {name:strType, tips:"字符串类型示例", type:String, default:"hello laya"}*/
        let strType = "hello laya";
        /** @prop {name:boolType, tips:"布尔类型示例", type:Bool, default:true}*/
        let boolType = true;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    onAwake(){
        Laya.Scene3D.load("res/scene/LayaScene_Main/Conventional/Main.ls",Laya.Handler.create(this,this.onLoadSceneFinish));
    }
    //场景加载完成之后的回调方法，参数：加载完成后的场景
    onLoadSceneFinish(loadScene){
        Laya.SoundManager.playMusic("https://donggame.oss-cn-beijing.aliyuncs.com/donggame/whackamole/bgm.mp3",0);

        loadScene.zOrder=-1;
        Laya.stage.addChild(loadScene);
        var moles= loadScene.getChildByName("Moles");
        for(var i=0;i<moles.numChildren;i++){
            moles.getChildAt(i).getChildAt(0).addComponent(MoleCtrl);
        }

        var effect=loadScene.getChildByName("Explosion");
        //制作特效预制体
        var effectPrefab= Laya.Sprite3D.instantiate(effect);
        effect.active=false;

        //获取场景中的摄像机
        var camera=loadScene.getChildByName("Main Camera");
        loadScene.getChildByName("Hummer").addComponent(HummerCtrl).Init(camera,loadScene,effectPrefab);
    }
}