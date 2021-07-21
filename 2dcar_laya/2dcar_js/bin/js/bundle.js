(function () {
    'use strict';

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-11 11:12
    */
    class AutoMove extends Laya.Script {

        constructor() {
            super();
            this.moveSpeed = 20;
        }

        onAwake() {
            this.height = this.owner.height;
        }

        onUpdate() {
            this.owner.y += this.moveSpeed;
            if (this.owner.y >= this.height) {
                this.owner.y -= this.height * 2;
            }
        }
    }

    const GameEvent = {
        GameStart: "GameStart",
        GamePause: "GamePause",
        AddScore: "AddScore",
        GameOver: "GameOver",
        Mute: "Mute",
    };

    const StorageKey = {
        BESTSCORE: "2DCAR_BESTSCORE",
        LASTSCORE: "2DCAR_LASTSCORE",
    };

    const MusicRes = {
        Bonus: "res/Sounds/Bonus.ogg",
        ButtonClick: "res/Sounds/ButtonClick.ogg",
        CarCrash: "res/Sounds/CarCrash.ogg",
        Background: "res/Sounds/FutureWorld_Dark_Loop_03.ogg",
    };

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-10 20:55
    */
    class StartPanel extends Laya.Script {

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

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-11 14:17
    */
    class Car extends Laya.Script {

        constructor() {
            super();
            /** @prop {name:speed, tips:"指定速度", type:number}*/
            this.speed = 15;
        }

        onAwake(){
            Laya.timer.frameLoop(1,this,this.frameLoop);
        }

        Init(sign){
            this.sign = sign;
        }

        frameLoop() {
            this.owner.y += this.speed;
        }

        onTriggerExit(other){
            if (other.label == "BottomCollider"){
                this.owner.removeSelf();
                this.recover();
                Laya.stage.event(GameEvent.AddScore);
            }
        }

        // 回收
        recover(){
            Laya.Pool.recover(this.sign,this.owner);
        }
    }

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-11 11:28
    */
    class Player extends Laya.Script {

        constructor() {
            super();
            this.playerMinX = 200;
            this.playerMaxX = 750;
            this.isStartGame = false;
            this.initXArr = [200, 390, 575, 750];
        }

        onAwake() {
            Laya.SoundManager.playMusic(MusicRes.Background,0);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MouseDownClick);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.MouseUpClick);
            Laya.stage.on(GameEvent.GameStart, this, function () {
                this.isStartGame = true;
            });
            Laya.stage.on(GameEvent.GamePause, this, function () {
                this.isStartGame = false;
            });

            this.Reset();
            // 获取自身rigbody组件
            this.rig = this.owner.getComponent(Laya.RigidBody);
        }

        Reset() {
            // 随机小汽车初始位置
            var index = this.getRandom(0, this.initXArr.length - 1);
            this.owner.pos(this.initXArr[index], 1360);
        }

        MouseDownClick() {
            if (!this.isStartGame) {
                return;
            }
            var mouseX = Laya.stage.mouseX;
            var width = Laya.stage.width;
            var force = 0;
            if (mouseX < width / 2) {
                // left
                force = -1;
            } else {
                force = 1;
            }
            this.rig.linearVelocity = { x: force * 8, y: 0 };
            Laya.Tween.to(this.owner, { rotation: force * 25 }, 300);
        }

        MouseUpClick() {
            this.rig.linearVelocity = { x: 0, y: 0 };
            Laya.Tween.to(this.owner, { rotation: 0 }, 300);
        }

        onUpdate() {
            if (this.owner.x > this.playerMaxX) {
                this.owner.x = this.playerMaxX;
            }
            if (this.owner.x < this.playerMinX) {
                this.owner.x = this.playerMinX;
            }
        }

        /**
         * 获取指定区间随机数
         * @param {最小数} min 
         * @param {最大数} max 
         * @returns 
         */
        getRandom(min, max) {
            var value = Math.random() * (max - min);
            value = Math.round(value);
            return min + value;
        }

        onTriggerEnter(other) {
            if (other.label == "Car") {
                Laya.SoundManager.playSound(MusicRes.CarCrash,1);
                // 游戏结束
                Laya.stage.event(GameEvent.GameOver);
                this.isStartGame = false;
            }
            if (other.label == "Coin") {
                Laya.SoundManager.playSound(MusicRes.Bonus,1);
                other.owner.removeSelf();
                other.owner.getComponent(Car).recover();
                // 增加分数
                Laya.stage.event(GameEvent.AddScore, 10);
            }
        }
    }

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-11 15:13
    */
    class GameManager extends Laya.Script {

        constructor() {
            super();
            this.isStartGame = false;
            this.carPrefabArr = [];
            this.spawnCarArr = [];
        }

        onAwake() {
            this.loadCarPrefab();
            Laya.stage.on(GameEvent.GameStart, this, function () {
                this.isStartGame = true;
            });


            Laya.stage.on(GameEvent.GameOver, this, function(){
                this.gameOver();
            });
        }

        loadCarPrefab() {
            var pathArr = [
                "prefab/Car_1.json",
                "prefab/Car_2.json",
                "prefab/Car_3.json",
                "prefab/Car_4.json",
                "prefab/Car_5.json",
                "prefab/Car_6.json",
                "prefab/Coin.json",
            ];
            var infoArr = [];
            for (var i = 0; i < pathArr.length; i++) {
                infoArr.push({ url: pathArr[i], type: Laya.Loader.PREFAB });
            }
            Laya.loader.load(infoArr, Laya.Handler.create(this, function (result) {
                for (var i = 0; i < pathArr.length; i++) {
                    this.carPrefabArr.push(Laya.loader.getRes(pathArr[i]));
                }

                this.ranTime = this.getRandom(500, 1000);
                Laya.timer.loop(this.ranTime, this, function () {
                    this.spawn();
                    this.ranTime = this.getRandom(500, 1000);
                });
            }));
        }

        spawn() {
            console.log("spawn"+this.isStartGame);
            if (!this.isStartGame) {
                return;
            }
            var arrX = [200, 390, 575, 750];
            this.y = -300;
            this.x = arrX[this.getRandom(0, arrX.length - 1)];

            var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
            var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function () { return this.carPrefabArr[carIndex].create() }, this);
            Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
            car.getComponent(Car).Init(carIndex.toString());
            car.pos(this.x, this.y);
            this.spawnCarArr.push(car);
        }

        /**
         * 获取指定区间随机数
         * @param {最小数} min 
         * @param {最大数} max 
         * @returns 
         */
        getRandom(min, max) {
            var value = Math.random() * (max - min);
            value = Math.round(value);
            return min + value;
        }

        gameOver() {
            this.isStartGame = false;
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }

        btnHomeClick() {
            this.gameOver();
        }

        btnRestartClick(){
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }
    }

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-12 16:06
    */
    class GamePanel extends Laya.Script {

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

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-13 14:01
    */
    class PausePanel extends Laya.Script {

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
                Laya.stage.event(GameEvent.Mute,false);
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

    /**
    *
    * @ author:DongTech
    * @ email:9212085@qq.com
    * @ data: 2021-05-13 20:25
    */
    class GameOverPanel extends Laya.Script {

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

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/StartPanel.js",StartPanel);
    		reg("scripts/Player.js",Player);
    		reg("scripts/GameManager.js",GameManager);
    		reg("scripts/GamePanel.js",GamePanel);
    		reg("scripts/PausePanel.js",PausePanel);
    		reg("scripts/GameOverPanel.js",GameOverPanel);
    		reg("scripts/Car.js",Car);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
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
