(function () {
    'use strict';

    class AutoMove extends Laya.Script {
        constructor() {
            super();
            this.moveSpeed = 20;
            this.height = 0;
        }
        onAwake() {
            this.height = this.owner.height;
            Laya.timer.frameLoop(1, this, this.frameLoop);
        }
        frameLoop() {
            var owner = this.owner;
            owner.y += this.moveSpeed;
            if (owner.y >= this.height) {
                owner.y -= this.height * 2;
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

    class StartPanel extends Laya.Script {
        constructor() {
            super();
            this.btn_Play = null;
            this.btn_AudioOn = null;
            this.btn_AudioOff = null;
        }
        onAwake() {
            this.btn_Play.on(Laya.Event.CLICK, this, this.btnPlayClick);
            this.btn_AudioOn.on(Laya.Event.CLICK, this, this.btnAudioOnClick);
            this.btn_AudioOff.on(Laya.Event.CLICK, this, this.btnAudioOffClick);
            Laya.stage.on(GameEvent.Mute, this, this.IsMute);
        }
        btnPlayClick() {
            this.owner.visible = false;
            Laya.stage.event(GameEvent.GameStart);
            Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
        }
        btnAudioOnClick() {
            Laya.SoundManager.muted = true;
            Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
            this.btn_AudioOff.visible = true;
            this.btn_AudioOn.visible = false;
            Laya.stage.event(GameEvent.Mute, true);
        }
        btnAudioOffClick() {
            Laya.SoundManager.muted = false;
            this.btn_AudioOn.visible = true;
            this.btn_AudioOff.visible = false;
            Laya.stage.event(GameEvent.Mute, false);
        }
        btnHomeClick() {
            this.owner.visible = true;
        }
        IsMute(value) {
            if (value) {
                this.btn_AudioOn.visible = false;
                this.btn_AudioOff.visible = true;
            }
            else {
                this.btn_AudioOn.visible = true;
                this.btn_AudioOff.visible = false;
            }
        }
    }

    class Car extends Laya.Script {
        constructor() {
            super();
            this.speed = 15;
            this.sign = "";
        }
        onAwake() {
            Laya.timer.frameLoop(1, this, this.frameLoop);
        }
        Init(sign) {
            this.sign = sign;
        }
        frameLoop() {
            this.owner.y += this.speed;
        }
        onTriggerExit(other) {
            if (other.label == "BottomCollider") {
                this.owner.removeSelf();
                this.recover();
                Laya.stage.event(GameEvent.AddScore);
            }
        }
        recover() {
            Laya.Pool.recover(this.sign, this.owner);
        }
    }

    class Player extends Laya.Script {
        constructor() {
            super();
            this.playerMinX = 200;
            this.playerMaxX = 750;
            this.isStartGame = false;
            this.initXArr = [200, 390, 575, 750];
            this.rig = null;
        }
        onAwake() {
            Laya.SoundManager.playMusic(MusicRes.Background, 0);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.MouseDownClick);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.MouseUpClick);
            Laya.stage.on(GameEvent.GameStart, this, function () {
                this.isStartGame = true;
            });
            Laya.stage.on(GameEvent.GamePause, this, function () {
                this.isStartGame = false;
            });
            this.Reset();
            this.rig = this.owner.getComponent(Laya.RigidBody);
        }
        Reset() {
            var index = this.getRandom(0, this.initXArr.length - 1);
            var owner = this.owner;
            owner.pos(this.initXArr[index], 1360);
        }
        MouseDownClick() {
            if (!this.isStartGame) {
                return;
            }
            var mouseX = Laya.stage.mouseX;
            var width = Laya.stage.width;
            var force = 0;
            if (mouseX < width / 2) {
                force = -1;
            }
            else {
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
            var owner = this.owner;
            if (owner.x > this.playerMaxX) {
                owner.x = this.playerMaxX;
            }
            if (owner.x < this.playerMinX) {
                owner.x = this.playerMinX;
            }
        }
        getRandom(min, max) {
            var value = Math.random() * (max - min);
            value = Math.round(value);
            return min + value;
        }
        onTriggerEnter(other) {
            if (other.label == "Car") {
                Laya.SoundManager.playSound(MusicRes.CarCrash, 1);
                Laya.stage.event(GameEvent.GameOver);
                this.isStartGame = false;
            }
            if (other.label == "Coin") {
                Laya.SoundManager.playSound(MusicRes.Bonus, 1);
                other.owner.removeSelf();
                other.owner.getComponent(Car).recover();
                Laya.stage.event(GameEvent.AddScore, 10);
            }
        }
    }

    class GamePanel extends Laya.Script {
        constructor() {
            super();
            this.score = 0;
            this.best = 0;
            this.last = 0;
            this.isPause = false;
            this.txt_Best = null;
            this.txt_Last = null;
            this.txt_Score = null;
            this.btn_Pause = null;
        }
        onAwake() {
            var owner = this.owner;
            owner.visible = false;
            this.txt_Best = this.owner.getChildByName("txt_Best");
            this.txt_Last = this.owner.getChildByName("txt_Last");
            this.txt_Score = this.owner.getChildByName("txt_Score");
            this.btn_Pause = this.owner.getChildByName("btn_Pause");
            this.Init();
            this.btn_Pause.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
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
            Laya.LocalStorage.setItem(StorageKey.LASTSCORE, this.last.toString());
            Laya.LocalStorage.setItem(StorageKey.BESTSCORE, this.best.toString());
            this.txt_Best.text = "Best:" + this.best;
            this.txt_Last.text = "Last:" + this.last;
        }
    }

    class GameManager extends Laya.Script {
        constructor() {
            super();
            this.isStartGame = false;
            this.carPrefabArr = [];
            this.spawnCarArr = [];
            this.y = 0;
            this.x = 0;
        }
        onAwake() {
            this.loadCarPrefab();
            Laya.stage.on(GameEvent.GameStart, this, function () {
                this.isStartGame = true;
            });
            Laya.stage.on(GameEvent.GameOver, this, function () {
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
            if (!this.isStartGame) {
                return;
            }
            var arrX = [200, 390, 575, 750];
            this.y = -300;
            this.x = arrX[this.getRandom(0, arrX.length - 1)];
            var carIndex = this.getRandom(0, this.carPrefabArr.length - 1);
            var car = Laya.Pool.getItemByCreateFun(carIndex.toString(), function () { return this.carPrefabArr[carIndex].create(); }, this);
            Laya.stage.getChildAt(0).getChildAt(0).addChild(car);
            car.getComponent(Car).Init(carIndex.toString());
            car.pos(this.x, this.y);
            this.spawnCarArr.push(car);
        }
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
        btnRestartClick() {
            this.spawnCarArr.forEach(element => {
                element.removeSelf();
            });
        }
    }

    class PausePanel extends Laya.Script {
        constructor() {
            super();
            this.btn_Close = null;
            this.btn_Home = null;
            this.btn_Restart = null;
            this.btn_AudioOn = null;
            this.btn_AudioOff = null;
        }
        onAwake() {
            var owner = this.owner;
            owner.visible = false;
            this.btn_Close = owner.getChildByName("btn_Close");
            this.btn_Home = owner.getChildByName("btn_Home");
            this.btn_Restart = owner.getChildByName("btn_Restart");
            this.btn_AudioOn = owner.getChildByName("btn_AudioOn");
            this.btn_AudioOff = owner.getChildByName("btn_AudioOff");
            this.btn_Close.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                Laya.timer.resume();
                owner.visible = false;
                owner.parent.getChildByName("GamePanel").visible = true;
                owner.parent.getChildByName("Player").getComponent(Player).isStartGame = true;
            });
            this.btn_Home.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                Laya.timer.resume();
                owner.visible = false;
                owner.parent.getChildByName("StartPanel").getComponent(StartPanel).btnHomeClick();
                owner.parent.getComponent(GameManager).btnHomeClick();
                owner.parent.getChildByName("Player").getComponent(Player).Reset();
            });
            this.btn_Restart.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                Laya.timer.resume();
                owner.visible = false;
                owner.parent.getComponent(GameManager).btnRestartClick();
                Laya.stage.event(GameEvent.GameStart);
                owner.parent.getChildByName("Player").getComponent(Player).Reset();
            });
            this.btn_AudioOff.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.muted = false;
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                this.btn_AudioOff.visible = false;
                this.btn_AudioOn.visible = true;
                Laya.stage.event(GameEvent.Mute, false);
            });
            this.btn_AudioOn.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.muted = true;
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                this.btn_AudioOff.visible = true;
                this.btn_AudioOn.visible = false;
                Laya.stage.event(GameEvent.Mute, true);
            });
            Laya.stage.on(GameEvent.GamePause, this, function () {
                owner.visible = true;
            });
            Laya.stage.on(GameEvent.Mute, this, this.IsMute);
        }
        IsMute(value) {
            if (value) {
                this.btn_AudioOn.visible = false;
                this.btn_AudioOff.visible = true;
            }
            else {
                this.btn_AudioOn.visible = true;
                this.btn_AudioOff.visible = false;
            }
        }
    }

    class GameOverPanel extends Laya.Script {
        constructor() {
            super();
            this.btn_Home = null;
            this.btn_Restart = null;
            this.txt_Over = null;
            this.txt_Score = null;
            this.txt_HighScore = null;
        }
        onAwake() {
            var owner = this.owner;
            owner.visible = false;
            this.btn_Home = owner.getChildByName("btn_Home");
            this.btn_Restart = owner.getChildByName("btn_Restart");
            this.txt_Over = owner.getChildByName("txt_Over");
            this.txt_Score = owner.getChildByName("txt_Score");
            this.txt_HighScore = owner.getChildByName("txt_HighScore");
            Laya.loader.load("font.ttf", Laya.Handler.create(this, function (font) {
                this.txt_Over.font = font.fontName;
                this.txt_Score.font = font.fontName;
                this.txt_HighScore.font = font.fontName;
            }), null, Laya.Loader.TTF);
            this.btn_Home.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                Laya.timer.resume();
                this.owner.visible = false;
                this.owner.parent.getChildByName("StartPanel").getComponent(StartPanel).btnHomeClick();
                this.owner.parent.getComponent(GameManager).btnHomeClick();
                this.owner.parent.getChildByName("Player").getComponent(Player).Reset();
            });
            this.btn_Restart.on(Laya.Event.CLICK, this, function () {
                Laya.SoundManager.playSound(MusicRes.ButtonClick, 1);
                Laya.timer.resume();
                this.owner.visible = false;
                this.owner.parent.getComponent(GameManager).btnRestartClick();
                Laya.stage.event(GameEvent.GameStart);
                this.owner.parent.getChildByName("Player").getComponent(Player).Reset();
            });
            Laya.stage.on(GameEvent.GameOver, this, this.gameOver);
        }
        gameOver() {
            var owner = this.owner;
            owner.visible = true;
            var currentScore = this.owner.parent.getChildByName("GamePanel").getComponent(GamePanel).score;
            this.txt_Score.text = "Score:" + currentScore;
            var hightScore = Number(Laya.LocalStorage.getItem(StorageKey.BESTSCORE));
            if (currentScore > hightScore) {
                Laya.LocalStorage.setItem(StorageKey.BESTSCORE, currentScore);
                this.txt_HighScore.text = "HighScore:" + currentScore;
            }
            else {
                this.txt_HighScore.text = "HighScore:" + hightScore;
            }
            Laya.LocalStorage.setItem(StorageKey.LASTSCORE, currentScore);
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("scripts/AutoMove.ts", AutoMove);
            reg("scripts/StartPanel.ts", StartPanel);
            reg("scripts/Player.ts", Player);
            reg("scripts/GamePanel.ts", GamePanel);
            reg("scripts/PausePanel.ts", PausePanel);
            reg("scripts/GameOverPanel.ts", GameOverPanel);
            reg("scripts/GameManager.ts", GameManager);
            reg("scripts/Car.ts", Car);
        }
    }
    GameConfig.width = 1080;
    GameConfig.height = 1920;
    GameConfig.scaleMode = "showall";
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
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
