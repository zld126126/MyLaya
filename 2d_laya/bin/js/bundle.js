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

    var Templet = Laya.Templet;
    var Event = Laya.Event;
    class MultiTexture extends SingletonScene {
        constructor() {
            super();
            this.mStartX = 400;
            this.mStartY = 500;
            this.mActionIndex = 0;
            this.mCurrIndex = 0;
            this.mCurrSkinIndex = 0;
            Laya.stage.addChild(this);
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes1/dragon.sk";
            this.mFactory = new Templet();
            this.mFactory.on(Event.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event.ERROR, this, this.onError);
            this.mFactory.loadAni(this.mAniPath);
        }
        onError() {
            console.log("error");
        }
        parseComplete() {
            this.mArmature = this.mFactory.buildArmature(1);
            this.mArmature.x = this.mStartX;
            this.mArmature.y = this.mStartY;
            this.mArmature.scale(0.5, 0.5);
            this.addChild(this.mArmature);
            this.mArmature.on(Event.STOPPED, this, this.completeHandler);
            this.play();
        }
        completeHandler() {
            this.play();
        }
        play() {
            this.mCurrIndex++;
            if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
                this.mCurrIndex = 0;
            }
            this.mArmature.play(this.mCurrIndex, false);
        }
    }

    var Templet$1 = Laya.Templet;
    var Sprite = Laya.Sprite;
    var Event$1 = Laya.Event;
    var Handler = Laya.Handler;
    var Tween = Laya.Tween;
    class Skeleton_SpineEvent extends SingletonScene {
        constructor() {
            super();
            this.mStartX = 400;
            this.mStartY = 500;
            this.mActionIndex = 0;
            this.mCurrIndex = 0;
            this.mCurrSkinIndex = 0;
            Laya.stage.addChild(this);
            this.mLabelSprite = new Sprite();
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes6/alien.sk";
            this.mFactory = new Templet$1();
            this.mFactory.on(Event$1.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event$1.ERROR, this, this.onError);
            this.mFactory.loadAni(this.mAniPath);
        }
        onError() {
            console.log("error");
        }
        parseComplete() {
            this.mArmature = this.mFactory.buildArmature(1);
            this.mArmature.x = this.mStartX;
            this.mArmature.y = this.mStartY;
            this.mArmature.scale(0.5, 0.5);
            this.addChild(this.mArmature);
            this.mArmature.on(Event$1.LABEL, this, this.onEvent);
            this.mArmature.on(Event$1.STOPPED, this, this.completeHandler);
            this.play();
        }
        completeHandler() {
            this.play();
        }
        play() {
            this.mCurrIndex++;
            if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
                this.mCurrIndex = 0;
            }
            this.mArmature.play(this.mCurrIndex, false);
        }
        onEvent(e) {
            var tEventData = e;
            this.addChild(this.mLabelSprite);
            this.mLabelSprite.x = this.mStartX;
            this.mLabelSprite.y = this.mStartY;
            this.mLabelSprite.graphics.clear();
            this.mLabelSprite.graphics.fillText(tEventData.name, 0, 0, "20px Arial", "#ff0000", "center");
            Tween.to(this.mLabelSprite, { y: this.mStartY - 200 }, 1000, null, Handler.create(this, this.playEnd));
        }
        playEnd() {
            this.mLabelSprite.removeSelf();
        }
    }

    var Templet$2 = Laya.Templet;
    var Event$2 = Laya.Event;
    class Skeleton_SpineStretchyman extends SingletonScene {
        constructor() {
            super();
            this.mStartX = 200;
            this.mStartY = 500;
            this.mActionIndex = 0;
            this.mCurrIndex = 0;
            this.mCurrSkinIndex = 0;
            Laya.stage.addChild(this);
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes4/stretchyman.sk";
            this.mFactory = new Templet$2();
            this.mFactory.on(Event$2.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event$2.ERROR, this, this.onError);
            this.mFactory.loadAni(this.mAniPath);
        }
        onError() {
            console.log("error");
        }
        parseComplete() {
            this.mArmature = this.mFactory.buildArmature(1);
            this.mArmature.x = this.mStartX;
            this.mArmature.y = this.mStartY;
            this.addChild(this.mArmature);
            this.mArmature.on(Event$2.STOPPED, this, this.completeHandler);
            this.play();
        }
        completeHandler() {
            this.play();
        }
        play() {
            this.mCurrIndex++;
            if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
                this.mCurrIndex = 0;
            }
            this.mArmature.play(this.mCurrIndex, false);
        }
    }

    var Templet$3 = Laya.Templet;
    var Event$3 = Laya.Event;
    class Skeleton_SpineVine extends SingletonScene {
        constructor() {
            super();
            this.mStartX = 200;
            this.mStartY = 500;
            this.mActionIndex = 0;
            this.mCurrIndex = 0;
            this.mCurrSkinIndex = 0;
            Laya.stage.addChild(this);
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes5/vine.sk";
            this.mFactory = new Templet$3();
            this.mFactory.on(Event$3.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event$3.ERROR, this, this.onError);
            this.mFactory.loadAni(this.mAniPath);
        }
        onError() {
            console.log("error");
        }
        parseComplete() {
            this.mArmature = this.mFactory.buildArmature(1);
            this.mArmature.x = this.mStartX;
            this.mArmature.y = this.mStartY;
            this.mArmature.scale(0.5, 0.5);
            this.addChild(this.mArmature);
            this.mArmature.on(Event$3.STOPPED, this, this.completeHandler);
            this.play();
        }
        completeHandler() {
            this.play();
        }
        play() {
            this.mCurrIndex++;
            if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
                this.mCurrIndex = 0;
            }
            this.mArmature.play(this.mCurrIndex, false);
        }
    }

    var Templet$4 = Laya.Templet;
    var Event$4 = Laya.Event;
    class ChangeSkin extends SingletonScene {
        constructor() {
            super();
            this.mStartX = 400;
            this.mStartY = 500;
            this.mActionIndex = 0;
            this.mCurrIndex = 0;
            this.mCurrSkinIndex = 0;
            this.mSkinList = ["goblin", "goblingirl"];
            Laya.stage.addChild(this);
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes2/goblins.sk";
            this.mFactory = new Templet$4();
            this.mFactory.on(Event$4.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event$4.ERROR, this, this.onError);
            this.mFactory.loadAni(this.mAniPath);
        }
        onError() {
            console.log("error");
        }
        parseComplete() {
            this.mArmature = this.mFactory.buildArmature(1);
            this.mArmature.x = this.mStartX;
            this.mArmature.y = this.mStartY;
            this.addChild(this.mArmature);
            this.mArmature.on(Event$4.STOPPED, this, this.completeHandler);
            this.play();
            this.changeSkin();
            Laya.timer.loop(1000, this, this.changeSkin);
        }
        changeSkin() {
            this.mCurrSkinIndex++;
            if (this.mCurrSkinIndex >= this.mSkinList.length) {
                this.mCurrSkinIndex = 0;
            }
            this.mArmature.showSkinByName(this.mSkinList[this.mCurrSkinIndex]);
        }
        completeHandler() {
            this.play();
        }
        play() {
            this.mCurrIndex++;
            if (this.mCurrIndex >= this.mArmature.getAnimNum()) {
                this.mCurrIndex = 0;
            }
            this.mArmature.play(this.mCurrIndex, false);
        }
    }

    class SkeletalAnimationMain extends Singleton {
        constructor() {
            super(...arguments);
            this.btnNameArr = [
                "多纹理", "Spine事件", "橡胶人", "藤蔓", "换装"
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
                    MultiTexture.getInstance().Click();
                    break;
                case this.btnNameArr[1]:
                    Skeleton_SpineEvent.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Skeleton_SpineStretchyman.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Skeleton_SpineVine.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    ChangeSkin.getInstance().Click();
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
            SkeletalAnimationMain.getInstance().LoadExamples();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
