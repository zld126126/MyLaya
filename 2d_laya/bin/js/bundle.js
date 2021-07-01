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

    class Sprite_DisplayImage extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
        }
        Show() {
            this.visible = true;
            var ape1 = new Laya.Sprite();
            this.addChild(ape1);
            ape1.loadImage("res/apes/monkey3.png");
            Laya.loader.load("res/apes/monkey2.png", new Laya.Handler(this, function () {
                var t = Laya.loader.getRes("res/apes/monkey2.png");
                var ape2 = new Laya.Sprite();
                ape2.graphics.drawTexture(t, 0, 0);
                this.addChild(ape2);
                ape2.pos(200, 0);
            }));
        }
        Hide() {
            this.visible = false;
        }
    }

    class Sprite_ScreenShot extends SingletonScene {
        constructor() {
            super();
            this.btnArr = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
            this.nameArr = ["canvas截图", "sprite截图", "清理"];
            Laya.stage.addChild(this);
            var ape1 = new Laya.Sprite();
            this.addChild(ape1);
            this.onLoaded();
            Config.preserveDrawingBuffer = true;
        }
        onLoaded() {
            for (let index = 0; index < this.btnArr.length; index++) {
                this.createButton(this.btnArr[index], this.nameArr[index], this._onclick, index);
            }
            this._canvas = window.document.getElementById("layaCanvas");
            this.aimSp = new Laya.Sprite();
            this.aimSp.size(600 / 2, 800 / 2);
            this.addChild(this.aimSp);
            this.aimSp.graphics.drawRect(0, 0, this.aimSp.width, this.aimSp.height, "#333333");
            this.monkeyTexture = Laya.loader.getRes("res/apes/monkey3.png");
            this.aimSp.graphics.drawTexture(this.monkeyTexture, 0, 0, this.monkeyTexture.width, this.monkeyTexture.height);
            this.drawImage = new Laya.Image();
            this.drawImage.size(600 / 2, 800 / 2);
            this.addChild(this.drawImage);
            this.drawImage.bottom = this.drawImage.right = 0;
            this.drawSp = new Laya.Sprite();
            this.addChild(this.drawSp);
            this.drawSp.size(600 / 2, 800 / 2);
            this.drawSp.y = 800 / 2;
            this.drawSp.graphics.drawRect(0, 0, this.drawSp.width, this.drawSp.height, "#ff0000");
        }
        createButton(skin, name, cb, index) {
            var btn = new Laya.Button(skin, name);
            this.addChild(btn);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.size(50, 25);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.nameArr[0]:
                    var base64Url = this._canvas.toDataURL("image/png", 1);
                    this.drawImage.skin = base64Url;
                    break;
                case this.nameArr[1]:
                    var text = Laya.stage.drawToTexture(600, 800, 0, 0);
                    this.drawSp.graphics.drawTexture(text, 0, 0, this.drawSp.width, this.drawSp.height);
                    break;
                case this.nameArr[2]:
                    this.drawImage.skin = null;
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

    class Main {
        constructor() {
            this.btnImgArr = ["res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png", "res/threeDimen/ui/button.png"];
            this.btnNameArr = ["显示图片", "屏幕截图", "容器"];
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
                    break;
            }
            console.log(name + "-被点击");
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
