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
    }

    var Sprite$3 = Laya.Sprite;
    class Sprite_RoateAndScale extends SingletonScene {
        constructor() {
            super();
            this.scaleDelta = 0;
            Laya.stage.addChild(this);
            this.createApe();
        }
        createApe() {
            this.ape = new Sprite$3();
            this.ape.loadImage("res/apes/monkey2.png");
            this.addChild(this.ape);
            this.ape.pivot(55, 72);
            this.ape.x = Laya.stage.width / 2;
            this.ape.y = Laya.stage.height / 2;
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate(e) {
            if (!this.isShow) {
                return;
            }
            this.ape.rotation += 2;
            this.scaleDelta += 0.02;
            var scaleValue = Math.sin(this.scaleDelta);
            this.ape.scale(scaleValue, scaleValue);
        }
    }

    var Sprite$4 = Laya.Sprite;
    class Sprite_DrawPath extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.drawPentagram();
        }
        drawPentagram() {
            var canvas = new Sprite$4();
            this.addChild(canvas);
            var path = [];
            path.push(0, -130);
            path.push(33, -33);
            path.push(137, -30);
            path.push(55, 32);
            path.push(85, 130);
            path.push(0, 73);
            path.push(-85, 130);
            path.push(-55, 32);
            path.push(-137, -30);
            path.push(-33, -33);
            canvas.graphics.drawPoly(Laya.stage.width / 2, Laya.stage.height / 2, path, "#FF7F50");
        }
    }

    var Sprite$5 = Laya.Sprite;
    class Sprite_MagnifyingGlass extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApe();
        }
        createApe() {
            var bg = new Sprite$5();
            bg.loadImage("res/bg2.png");
            this.addChild(bg);
            this.bg2 = new Sprite$5();
            this.bg2.loadImage("res/bg2.png");
            this.addChild(this.bg2);
            this.bg2.scale(3, 3);
            this.maskSp = new Sprite$5();
            this.maskSp.loadImage("res/mask.png");
            this.maskSp.pivot(50, 50);
            this.bg2.mask = this.maskSp;
            Laya.stage.on("mousemove", this, this.onMouseMove);
        }
        onMouseMove() {
            if (!this.isShow) {
                return;
            }
            this.bg2.x = -Laya.stage.mouseX * 2;
            this.bg2.y = -Laya.stage.mouseY * 2;
            this.maskSp.x = Laya.stage.mouseX;
            this.maskSp.y = Laya.stage.mouseY;
        }
    }

    var Sprite$6 = Laya.Sprite;
    class Sprite_DrawShapes extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.drawSomething();
        }
        drawSomething() {
            this.sp = new Sprite$6();
            this.addChild(this.sp);
            this.sp.graphics.drawLine(10, 58, 146, 58, "#ff0000", 3);
            this.sp.graphics.drawLines(176, 58, [0, 0, 39, -50, 78, 0, 117, 50, 156, 0], "#ff0000", 5);
            this.sp.graphics.drawCurves(352, 58, [0, 0, 19, -100, 39, 0, 58, 100, 78, 0, 97, -100, 117, 0, 136, 100, 156, 0], "#ff0000", 5);
            this.sp.graphics.drawRect(10, 166, 166, 90, "#ffff00");
            this.sp.graphics.drawPoly(264, 166, [0, 0, 60, 0, 78.48, 57, 30, 93.48, -18.48, 57], "#ffff00");
            this.sp.graphics.drawPoly(400, 166, [0, 100, 50, 0, 100, 100], "#ffff00");
            this.sp.graphics.drawCircle(98, 332, 50, "#00ffff");
            this.sp.graphics.drawPie(240, 290, 100, 10, 60, "#00ffff");
            this.sp.graphics.drawPath(400, 310, [["moveTo", 5, 0], ["lineTo", 105, 0], ["arcTo", 110, 0, 110, 5, 5], ["lineTo", 110, 55], ["arcTo", 110, 60, 105, 60, 5], ["lineTo", 5, 60], ["arcTo", 0, 60, 0, 55, 5], ["lineTo", 0, 5], ["arcTo", 0, 0, 5, 0, 5], ["closePath"]], { fillStyle: "#00ffff" });
        }
    }

    var Sprite$7 = Laya.Sprite;
    var Text = Laya.Text;
    class Sprite_Cache extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApe();
        }
        createApe() {
            var textBox = new Sprite$7();
            var text;
            for (var i = 0; i < 1000; i++) {
                text = new Text();
                text.fontSize = 20;
                text.text = (Math.random() * 100).toFixed(0);
                text.rotation = Math.random() * 360;
                text.color = "#CCCCCC";
                text.x = Math.random() * 600;
                text.y = Math.random() * 800;
                textBox.addChild(text);
            }
            textBox.cacheAs = "bitmap";
            this.addChild(textBox);
        }
    }

    var Sprite$8 = Laya.Sprite;
    class Sprite_NodeControl extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApes();
        }
        createApes() {
            this.ape1 = new Sprite$8();
            this.ape2 = new Sprite$8();
            this.ape1.loadImage("res/apes/monkey2.png");
            this.ape2.loadImage("res/apes/monkey2.png");
            this.ape1.pivot(55, 72);
            this.ape2.pivot(55, 72);
            this.ape1.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.ape2.pos(200, 0);
            this.addChild(this.ape1);
            this.ape1.addChild(this.ape2);
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate(e) {
            this.ape1.rotation += 2;
            this.ape2.rotation -= 4;
        }
    }

    var Sprite$9 = Laya.Sprite;
    class Sprite_Pivot extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createApes();
        }
        createApes() {
            var gap = 300;
            this.sp1 = new Sprite$9();
            this.sp1.loadImage("res/apes/monkey2.png");
            this.sp1.pos((Laya.stage.width - gap) / 2, Laya.stage.height / 2);
            this.sp1.pivot(55, 72);
            this.addChild(this.sp1);
            this.sp2 = new Sprite$9();
            this.sp2.loadImage("res/apes/monkey2.png");
            this.sp2.pos((Laya.stage.width + gap) / 2, Laya.stage.height / 2);
            this.addChild(this.sp2);
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate(e) {
            if (!this.isShow) {
                return;
            }
            this.sp1.rotation += 2;
            this.sp2.rotation += 2;
        }
    }

    var Sprite$a = Laya.Sprite;
    var Handler$2 = Laya.Handler;
    class Sprite_SwitchTexture extends SingletonScene {
        constructor() {
            super();
            this.texture1 = "res/apes/monkey2.png";
            this.texture2 = "res/apes/monkey3.png";
            this.flag = false;
            Laya.stage.addChild(this);
            Laya.loader.load([this.texture1, this.texture2], Handler$2.create(this, this.onAssetsLoaded));
        }
        onAssetsLoaded() {
            this.ape = new Sprite$a();
            this.addChild(this.ape);
            this.ape.pivot(55, 72);
            this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.switchTexture();
            this.ape.on("click", this, this.switchTexture);
        }
        switchTexture() {
            if (!this.isShow) {
                return;
            }
            var textureUrl = (this.flag = !this.flag) ? this.texture1 : this.texture2;
            this.ape.graphics.clear();
            var texture = Laya.loader.getRes(textureUrl);
            this.ape.graphics.drawTexture(texture, 0, 0);
            this.ape.size(texture.width, texture.height);
        }
    }

    var Sprite$b = Laya.Sprite;
    var HitArea = Laya.HitArea;
    class Sprite_Guide extends SingletonScene {
        constructor() {
            super();
            this.guideSteps = [
                { x: 40, y: 160, radius: 50, tip: "res/guide/help6.png", tipx: 50, tipy: 50 },
                { x: 220, y: 150, radius: 20, tip: "res/guide/help4.png", tipx: 150, tipy: 100 },
                { x: 280, y: 150, radius: 30, tip: "res/guide/help3.png", tipx: 200, tipy: 80 }
            ];
            this.guideStep = 0;
            Laya.stage.addChild(this);
        }
        firstStep() {
            this.gameContainer = new Sprite$b();
            this.gameContainer.loadImage("res/guide/crazy_snowball.png");
            this.addChild(this.gameContainer);
            this.guideContainer = new Sprite$b();
            this.guideContainer.cacheAs = "bitmap";
            this.addChild(this.guideContainer);
            this.gameContainer.on("click", this, this.nextStep);
            var maskArea = new Sprite$b();
            maskArea.alpha = 0.5;
            maskArea.graphics.drawRect(0, 0, 321, 181, "#000000");
            this.guideContainer.addChild(maskArea);
            this.interactionArea = new Sprite$b();
            this.interactionArea.blendMode = "destination-out";
            this.guideContainer.addChild(this.interactionArea);
            this.hitArea = new HitArea();
            this.hitArea.hit.drawRect(0, 0, 321, 181, "#000000");
            this.guideContainer.hitArea = this.hitArea;
            this.guideContainer.mouseEnabled = true;
            this.tipContainer = new Sprite$b();
            this.addChild(this.tipContainer);
        }
        nextStep() {
            if (!this.isShow) {
                return;
            }
            if (this.guideStep == this.guideSteps.length) {
                this.removeChild(this.guideContainer);
                this.removeChild(this.tipContainer);
            }
            else {
                var step = this.guideSteps[this.guideStep++];
                this.hitArea.unHit.clear();
                this.hitArea.unHit.drawCircle(step.x, step.y, step.radius, "#000000");
                this.interactionArea.graphics.clear();
                this.interactionArea.graphics.drawCircle(step.x, step.y, step.radius, "#000000");
                this.tipContainer.graphics.clear();
                this.tipContainer.loadImage(step.tip);
                this.tipContainer.pos(step.tipx, step.tipy);
            }
        }
        Start() {
            this.firstStep();
            this.nextStep();
        }
        End() {
            this.removeChild(this.gameContainer);
            this.removeChild(this.guideContainer);
            this.removeChild(this.tipContainer);
            this.guideStep = 0;
        }
        Show() {
            this.visible = true;
            this.Start();
        }
        Hide() {
            this.visible = false;
            this.End();
        }
    }

    class SpriteMain extends Singleton {
        constructor() {
            super(...arguments);
            this.btnNameArr = [
                "显示图片", "屏幕截图", "容器", "旋转缩放", "绘制路径", "遮罩_放大镜",
                "绘制形状", "缓存静态图像", "节点控制", "轴心点", "切换纹理", "新手引导"
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
                    Sprite_DisplayImage.getInstance().Click();
                    break;
                case this.btnNameArr[1]:
                    Sprite_ScreenShot.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Sprite_Container.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Sprite_RoateAndScale.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Sprite_DrawPath.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Sprite_MagnifyingGlass.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    Sprite_DrawShapes.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    Sprite_Cache.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    Sprite_NodeControl.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    Sprite_Pivot.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    Sprite_SwitchTexture.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    Sprite_Guide.getInstance().Click();
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
            SpriteMain.getInstance().LoadExamples();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
