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
    var BlurFilter = Laya.BlurFilter;
    var Handler = Laya.Handler;
    class Filters_Blur extends SingletonScene {
        constructor() {
            super();
            this.apePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.apePath, Handler.create(this, this.createApe));
        }
        createApe() {
            var ape = new Sprite();
            ape.loadImage(this.apePath);
            ape.x = (Laya.stage.width - ape.width) / 2;
            ape.y = (Laya.stage.height - ape.height) / 2;
            this.addChild(ape);
            this.applayFilter(ape);
        }
        applayFilter(ape) {
            var blurFilter = new BlurFilter();
            blurFilter.strength = 5;
            ape.filters = [blurFilter];
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    var Sprite$1 = Laya.Sprite;
    var ColorFilter = Laya.ColorFilter;
    var Handler$1 = Laya.Handler;
    class Filters_Color extends SingletonScene {
        constructor() {
            super();
            this.ApePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.ApePath, Handler$1.create(this, this.setup));
        }
        setup() {
            this.normalizeApe();
            this.makeRedApe();
            this.grayingApe();
        }
        normalizeApe() {
            var originalApe = this.createApe();
            this.apeTexture = Laya.loader.getRes(this.ApePath);
            originalApe.x = (Laya.stage.width - this.apeTexture.width * 3) / 2;
            originalApe.y = (Laya.stage.height - this.apeTexture.height) / 2;
        }
        makeRedApe() {
            var redMat = [
                1, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 0, 0,
                0, 0, 0, 1, 0,
            ];
            var redFilter = new ColorFilter(redMat);
            var redApe = this.createApe();
            redApe.filters = [redFilter];
            var firstChild = this.getChildAt(0);
            redApe.x = firstChild.x + this.apeTexture.width;
            redApe.y = firstChild.y;
        }
        grayingApe() {
            var grayscaleMat = [0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0.3086, 0.6094, 0.0820, 0, 0, 0, 0, 0, 1, 0];
            var grayscaleFilter = new ColorFilter(grayscaleMat);
            var grayApe = this.createApe();
            grayApe.filters = [grayscaleFilter];
            var secondChild = this.getChildAt(1);
            grayApe.x = secondChild.x + this.apeTexture.width;
            grayApe.y = secondChild.y;
        }
        createApe() {
            var ape = new Sprite$1();
            ape.loadImage("res/apes/monkey2.png");
            this.addChild(ape);
            return ape;
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    var Sprite$2 = Laya.Sprite;
    var GlowFilter = Laya.GlowFilter;
    var Handler$2 = Laya.Handler;
    class Filters_Glow extends SingletonScene {
        constructor() {
            super();
            this.apePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.apePath, Handler$2.create(this, this.setup));
        }
        setup() {
            this.createApe();
            this.applayFilter();
        }
        createApe() {
            this.ape = new Sprite$2();
            this.ape.loadImage(this.apePath);
            var texture = Laya.loader.getRes(this.apePath);
            this.ape.x = (600 - texture.width) / 2;
            this.ape.y = (800 - texture.height) / 2;
            this.addChild(this.ape);
        }
        applayFilter() {
            var glowFilter = new GlowFilter("#ffff00", 10, 0, 0);
            this.ape.filters = [glowFilter];
        }
        Show() {
            this.visible = true;
        }
        Hide() {
            this.visible = false;
        }
    }

    class FiltersMain extends Singleton {
        constructor() {
            super(...arguments);
            this.btnNameArr = [
                "发光滤镜", "模糊滤镜", "颜色滤镜"
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
                    Filters_Glow.getInstance().Click();
                    break;
                case this.btnNameArr[1]:
                    Filters_Blur.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Filters_Color.getInstance().Click();
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
            FiltersMain.getInstance().LoadExamples();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
