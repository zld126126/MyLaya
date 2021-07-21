(function () {
    'use strict';

    class MoleCtrl extends Laya.Script {

        constructor() { 
            super();
            this.isUp=false;
            this.isDown=false;
        }
        onAwake(){
            this.randomUp();
        }
        onUpdate(){
            if(this.isUp){
                //沿着y轴正方向移动
                this.owner.transform.translate(new Laya.Vector3(0,0.1,0));
                if(this.owner.transform.localPosition.y>=2.5){
                    this.isUp=false;
                    this.owner.transform.localPosition=new Laya.Vector3(0,2.5,0);
                    //延时调用
                    Laya.stage.timerOnce(1000,this,function(){this.isDown=true;});
                }
            }
            if(this.isDown){
                this.owner.transform.translate(new Laya.Vector3(0,-0.1,0));
                if(this.owner.transform.localPosition.y<=0){
                    this.isDown=false;
                    this.owner.transform.localPosition=new Laya.Vector3();
                    this.randomUp();
                }
            }
        }
        randomUp(){
            var value=Math.random();
            Laya.stage.timerOnce(value*6000,this,function(){this.isUp=true;});
        }
        //当地鼠被敲击之后调用
        Knock(){
            this.owner.transform.localPosition=new Laya.Vector3();
            this.isUp=false;
            this.isDown=false;
        }
    }

    class EffectAutoDestroy extends Laya.Script {

        constructor() { 
            super();
        }
        onAwake(){
            Laya.stage.timerOnce(2000,this,function(){
                this.owner.destroy();
            });
        }
    }

    class HummerCtrl extends Laya.Script {

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

    class GameRoot extends Laya.Script {

        constructor() { 
            super(); 
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

    class UICtrl extends Laya.Script {

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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/GameRoot.js",GameRoot);
    		reg("scripts/UICtrl.js",UICtrl);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="fixedauto";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "GameRoot.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError = true;

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
