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
    GameConfig.alignV = "middle";
    GameConfig.alignH = "middle";
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
            super(...arguments);
            this.isShow = false;
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        }
        Show() {
        }
        Hide() {
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
    var Handler = Laya.Handler;
    class Sprite_DisplayImage extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApes();
        }
        createApes() {
            var ape1 = new Sprite();
            this.addChild(ape1);
            ape1.loadImage("res/apes/monkey3.png");
            Laya.loader.load("res/apes/monkey2.png", new Handler(this, function () {
                var t = Laya.loader.getRes("res/apes/monkey2.png");
                var ape2 = new Sprite();
                ape2.graphics.drawTexture(t, 0, 0);
                this.addChild(ape2);
                ape2.pos(200, 0);
            }));
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    var Sprite$1 = Laya.Sprite;
    var Handler$1 = Laya.Handler;
    var Button = Laya.Button;
    var Event = Laya.Event;
    class Sprite_ScreenShot extends SingletonScene {
        constructor() {
            super();
            this.btnArr = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
            this.nameArr = ["截图", "清理"];
            Config.preserveDrawingBuffer = true;
            Laya.stage.addChild(this);
            this.createApes();
        }
        createApes() {
            var ape1 = new Sprite$1();
            this.addChild(ape1);
            ape1.loadImage("res/apes/monkey3.png", Handler$1.create(this, this.onLoaded));
        }
        createButton(skin, name, cb, index) {
            var btn = new Button(skin, name);
            this.addChild(btn);
            btn.on(Event.CLICK, this, cb);
            btn.size(40, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            return btn;
        }
        onLoaded() {
            for (let index = 0; index < this.btnArr.length; index++) {
                this.createButton(this.btnArr[index], this.nameArr[index], this._onclick, index);
            }
            this.drawSp = new Sprite$1();
            this.addChild(this.drawSp);
            this.drawSp.size(600 / 2, 800 / 2);
            this.drawSp.y = 800 / 2;
            this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
        }
        _onclick(e) {
            switch (e.target.name) {
                case this.nameArr[0]:
                    var text = Laya.stage.drawToTexture(600, 800, 0, 0);
                    this.drawSp.graphics.drawTexture(text, 0, 0, this.drawSp.width, this.drawSp.height);
                    break;
                case this.nameArr[1]:
                    this.drawSp.graphics.clear();
                    this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
                    break;
            }
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    var Sprite$2 = Laya.Sprite;
    class Sprite_Container extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApes();
        }
        createApes() {
            var layoutRadius = 150;
            var radianUnit = Math.PI / 2;
            this.apesCtn = new Sprite$2();
            this.addChild(this.apesCtn);
            for (var i = 0; i < 4; i++) {
                var ape = new Sprite$2();
                ape.loadImage("res/apes/monkey" + i + ".png");
                ape.pivot(55, 72);
                ape.pos(Math.cos(radianUnit * i) * layoutRadius, Math.sin(radianUnit * i) * layoutRadius);
                this.apesCtn.addChild(ape);
            }
            this.apesCtn.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate(e) {
            this.apesCtn.rotation += 1;
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    class SpriteMain extends Singleton {
        constructor() {
            super(...arguments);
            this.btnImgArr = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
            this.btnNameArr = ["显示图片", "屏幕截图", "容器"];
        }
        LoadExamples() {
            for (let index = 0; index < this.btnImgArr.length; index++) {
                this.createButton(this.btnImgArr[index], this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(skin, name, cb, index) {
            var btn = new Laya.Button(skin, name);
            Laya.stage.addChild(btn);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.size(60, 30);
            btn.name = name;
            btn.right = 10;
            btn.top = index * (btn.height + 10);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    Sprite_DisplayImage.getInstance().Click();
                    break;
                case this.btnNameArr[1]:
                    Sprite_ScreenShot.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Sprite_Container.getInstance().Click();
                    break;
            }
            console.log(name + "-被点击");
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
            SpriteMain.getInstance().LoadExamples();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
