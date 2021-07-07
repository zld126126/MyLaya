(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Singleton {
        static getInstance() {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        }
    }

    class SingletonScene extends Laya.Scene {
        constructor() {
            super();
            this.isShow = false;
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
        Click() {
            this.isShow = !this.isShow;
            if (this.isShow) {
                this.Show();
            }
            else {
                this.Hide();
            }
        }
        Destroy() {
            if (this != null) {
                this.destroy();
            }
        }
    }

    var Sprite = Laya.Sprite;
    var Event = Laya.Event;
    var SoundManager = Laya.SoundManager;
    var Handler = Laya.Handler;
    class Sound_SimpleDemo extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var gap = 10;
            var soundButton = this.createButton("播放音效");
            soundButton.x = (Laya.stage.width - soundButton.width * 2 + gap) / 2;
            soundButton.y = (Laya.stage.height - soundButton.height) / 2;
            this.addChild(soundButton);
            var musicButton = this.createButton("播放音乐");
            musicButton.x = soundButton.x + gap + soundButton.width;
            musicButton.y = soundButton.y;
            this.addChild(musicButton);
            soundButton.on(Event.CLICK, this, this.onPlaySound);
            musicButton.on(Event.CLICK, this, this.onPlayMusic);
        }
        createButton(label) {
            var w = 110;
            var h = 40;
            var button = new Sprite();
            button.size(w, h);
            button.graphics.drawRect(0, 0, w, h, "#FF7F50");
            button.graphics.fillText(label, w / 2, 8, "25px SimHei", "#FFFFFF", "center");
            this.addChild(button);
            return button;
        }
        onPlayMusic(e) {
            console.log("播放音乐");
            SoundManager.playMusic("res/sounds/bgm.mp3", 1, new Handler(this, this.onComplete));
        }
        onPlaySound(e) {
            console.log("播放音效");
            SoundManager.playSound("res/sounds/btn.mp3", 1, new Handler(this, this.onComplete));
        }
        onComplete() {
            console.log("播放完成");
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            SoundManager.stopSound("res/sounds/btn.mp3");
            SoundManager.stopSound("res/sounds/bgm.mp3");
            this.visible = false;
        }
    }

    class SoundMain extends Singleton {
        constructor() {
            super(...arguments);
            this.btnNameArr = [
                "音效演示",
            ];
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            Laya.stage.addChild(btn);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    Sound_SimpleDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

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
        LoadExample() {
            SoundMain.getInstance().LoadExamples();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
