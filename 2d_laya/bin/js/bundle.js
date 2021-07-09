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
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "middle";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class SingletonMainScene extends Laya.Scene {
        constructor() {
            super();
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
        Destroy() {
            if (this != null) {
                this.destroy();
            }
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

    class EventExtra {
        constructor() {
            this._handerList = new Array();
        }
        Add(handler) {
            this._handerList.push(handler);
        }
        Remove(handler) {
            for (let i = 0; i < this._handerList.length; i++) {
                if (handler.caller == this._handerList[i].caller && handler.method == this._handerList[i].method) {
                    this._handerList[i].recover();
                    this._handerList.splice(i, 1);
                    handler.recover();
                    return;
                }
            }
        }
        Exec(args) {
            for (let i = this._handerList.length; i >= 0; i--) {
                let handler = this._handerList[i];
                if (handler != null) {
                    try {
                        handler.setTo(handler.caller, handler.method, args, false);
                        handler.run();
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
    }
    class EventManager {
        static DispatchEvent(type, args) {
            if (!(args instanceof Array))
                args = [args];
            let e = EventManager.eventMap.get(type);
            if (e != null || e != undefined) {
                try {
                    e.Exec(args);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        static RegistEvent(type, handler) {
            let e = EventManager.eventMap.get(type);
            if (e == null || e == undefined) {
                e = new EventExtra();
                EventManager.eventMap.set(type, e);
            }
            e.Add(handler);
        }
        static RemoveEvent(type, handler) {
            let e = EventManager.eventMap.get(type);
            if (e != undefined && handler != null) {
                e.Remove(handler);
            }
        }
    }
    EventManager.eventMap = new Map();

    class SpriteMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "显示图片", "屏幕截图", "容器", "旋转缩放", "绘制路径", "遮罩_放大镜",
                "绘制形状", "缓存静态图像", "节点控制", "轴心点", "切换纹理", "新手引导"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Sprite_DisplayImage.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Sprite_ScreenShot.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Sprite_Container.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Sprite_RoateAndScale.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Sprite_DrawPath.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    Sprite_MagnifyingGlass.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    Sprite_DrawShapes.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    Sprite_Cache.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    Sprite_NodeControl.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    Sprite_Pivot.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    Sprite_SwitchTexture.getInstance().Click();
                    break;
                case this.btnNameArr[12]:
                    Sprite_Guide.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var MovieClip = Laya.MovieClip;
    class Animation_SWF extends SingletonScene {
        constructor() {
            super();
            this.SWFPath = "res/swf/dragon.swf";
            this.MCWidth = 318;
            this.MCHeight = 406;
            Laya.stage.addChild(this);
            this.createMovieClip();
        }
        createMovieClip() {
            var mc = new MovieClip();
            mc.load(this.SWFPath);
            mc.x = (Laya.stage.width - this.MCWidth) / 2;
            mc.y = (Laya.stage.height - this.MCHeight) / 2;
            this.addChild(mc);
        }
    }

    var Animation = Laya.Animation;
    class Animation_Altas extends SingletonScene {
        constructor() {
            super();
            this.AniConfPath = "res/fighter/fighter.atlas";
            Laya.stage.addChild(this);
            this.createAnimation();
        }
        createAnimation() {
            var ani = new Animation();
            ani.loadAtlas(this.AniConfPath);
            ani.interval = 30;
            ani.index = 1;
            ani.play();
            var bounds = ani.getGraphicBounds(true);
            ani.pivot(bounds.width / 2, bounds.height / 2);
            ani.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.addChild(ani);
        }
    }

    class AnimationMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "SWF动画", "图集动画"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Animation_SWF.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Animation_Altas.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Templet = Laya.Templet;
    var Event$1 = Laya.Event;
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
    }

    var Templet$1 = Laya.Templet;
    var Sprite$c = Laya.Sprite;
    var Event$2 = Laya.Event;
    var Handler$3 = Laya.Handler;
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
            this.mLabelSprite = new Sprite$c();
            this.startFun();
        }
        startFun() {
            this.mAniPath = "res/spine/spineRes6/alien.sk";
            this.mFactory = new Templet$1();
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
            this.mArmature.scale(0.5, 0.5);
            this.addChild(this.mArmature);
            this.mArmature.on(Event$2.LABEL, this, this.onEvent);
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
        onEvent(e) {
            var tEventData = e;
            this.addChild(this.mLabelSprite);
            this.mLabelSprite.x = this.mStartX;
            this.mLabelSprite.y = this.mStartY;
            this.mLabelSprite.graphics.clear();
            this.mLabelSprite.graphics.fillText(tEventData.name, 0, 0, "20px Arial", "#ff0000", "center");
            Tween.to(this.mLabelSprite, { y: this.mStartY - 200 }, 1000, null, Handler$3.create(this, this.playEnd));
        }
        playEnd() {
            this.mLabelSprite.removeSelf();
        }
    }

    var Templet$2 = Laya.Templet;
    var Event$3 = Laya.Event;
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

    var Templet$3 = Laya.Templet;
    var Event$4 = Laya.Event;
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
            this.mArmature.scale(0.5, 0.5);
            this.addChild(this.mArmature);
            this.mArmature.on(Event$4.STOPPED, this, this.completeHandler);
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
    var Event$5 = Laya.Event;
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
            this.mFactory.on(Event$5.COMPLETE, this, this.parseComplete);
            this.mFactory.on(Event$5.ERROR, this, this.onError);
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
            this.mArmature.on(Event$5.STOPPED, this, this.completeHandler);
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

    class SkeletalAnimationMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "多纹理", "Spine事件", "橡胶人", "藤蔓", "换装"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    MultiTexture.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Skeleton_SpineEvent.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Skeleton_SpineStretchyman.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Skeleton_SpineVine.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    ChangeSkin.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Animation$1 = Laya.Animation;
    var Handler$4 = Laya.Handler;
    var Tween$1 = Laya.Tween;
    class BlendMode_Lighter extends SingletonScene {
        constructor() {
            super();
            this.phoenixWidth = 550;
            this.phoenixHeight = 400;
            this.bgColorTweener = new Tween$1();
            this.gradientInterval = 2000;
            this.bgColorChannels = { r: 99, g: 0, b: 0xFF };
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createPhoenixes();
            this.evalBgColor();
            Laya.timer.frameLoop(1, this, this.renderBg);
        }
        createPhoenixes() {
            var scaleFactor = Math.min(Laya.stage.width / (this.phoenixWidth * 2), Laya.stage.height / this.phoenixHeight);
            var blendedPhoenix = this.createAnimation();
            blendedPhoenix.blendMode = "lighter";
            blendedPhoenix.scale(scaleFactor, scaleFactor);
            blendedPhoenix.y = (Laya.stage.height - this.phoenixHeight * scaleFactor) / 2;
            var normalPhoenix = this.createAnimation();
            normalPhoenix.scale(scaleFactor, scaleFactor);
            normalPhoenix.x = this.phoenixWidth * scaleFactor;
            normalPhoenix.y = (Laya.stage.height - this.phoenixHeight * scaleFactor) / 2;
        }
        createAnimation() {
            var frames = [];
            for (var i = 1; i <= 25; ++i) {
                frames.push("res/phoenix/phoenix" + this.preFixNumber(i, 4) + ".jpg");
            }
            var animation = new Animation$1();
            animation.loadImages(frames);
            this.addChild(animation);
            var clips = animation.frames.concat();
            clips = clips.reverse();
            animation.frames = animation.frames.concat(clips);
            animation.play();
            return animation;
        }
        preFixNumber(num, strLen) {
            return ("0000000000" + num).slice(-strLen);
        }
        evalBgColor() {
            var color = Math.random() * 0xFFFFFF;
            var channels = this.getColorChannals(color);
            this.bgColorTweener.to(this.bgColorChannels, { r: channels[0], g: channels[1], b: channels[2] }, this.gradientInterval, null, Handler$4.create(this, this.onTweenComplete));
        }
        getColorChannals(color) {
            var result = [];
            result.push(color >> 16);
            result.push(color >> 8 & 0xFF);
            result.push(color & 0xFF);
            return result;
        }
        onTweenComplete() {
            this.evalBgColor();
        }
        renderBg() {
            if (!this.isShow) {
                return;
            }
            this.graphics.clear();
            this.graphics.drawRect(0, 0, this.phoenixWidth, this.phoenixHeight, this.getHexColorString());
        }
        getHexColorString() {
            this.bgColorChannels.r = Math.floor(this.bgColorChannels.r);
            this.bgColorChannels.g = 0;
            this.bgColorChannels.b = Math.floor(this.bgColorChannels.b);
            var r = this.bgColorChannels.r.toString(16);
            r = r.length == 2 ? r : "0" + r;
            var g = this.bgColorChannels.g.toString(16);
            g = g.length == 2 ? g : "0" + g;
            var b = this.bgColorChannels.b.toString(16);
            b = b.length == 2 ? b : "0" + b;
            return "#" + r + g + b;
        }
    }

    class BlendModeMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "Lighter"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    BlendMode_Lighter.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var TiledMap = Laya.TiledMap;
    var Rectangle = Laya.Rectangle;
    class TiledMap_AnimationTile extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
        }
        createMap() {
            this.tiledMap = new TiledMap();
            this.tiledMap.createMap("res/tiledMap/orthogonal-test-movelayer.json", new Rectangle(0, 0, 300, 400), null);
        }
        Show() {
            this.createMap();
        }
        Hide() {
            this.tiledMap.destroy();
        }
    }

    var Sprite$d = Laya.Sprite;
    var TiledMap$1 = Laya.TiledMap;
    var Point = Laya.Point;
    var Rectangle$1 = Laya.Rectangle;
    var Handler$5 = Laya.Handler;
    class TiledMap_IsometricWorld extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.on("click", this, this.onStageClick);
        }
        createMap() {
            this.tiledMap = new TiledMap$1();
            this.tiledMap.createMap("res/tiledMap/isometric_grass_and_water.json", new Rectangle$1(0, 0, 300, 400), Handler$5.create(this, this.mapLoaded), null, new Point(800, 400));
        }
        onStageClick() {
            if (!this.isShow) {
                return;
            }
            var p = new Point(0, 0);
            this.layer.getTilePositionByScreenPos(Laya.stage.mouseX, Laya.stage.mouseY, p);
            this.layer.getScreenPositionByTilePos(Math.floor(p.x), Math.floor(p.y), p);
            this.sprite.pos(p.x, p.y);
        }
        mapLoaded() {
            this.layer = this.tiledMap.getLayerByIndex(0);
            var radiusX = 32;
            var radiusY = Math.tan(180 / Math.PI * 30) * radiusX;
            var color = "#FF7F50";
            this.sprite = new Sprite$d();
            this.sprite.graphics.drawLine(0, 0, -radiusX, radiusY, color);
            this.sprite.graphics.drawLine(0, 0, radiusX, radiusY, color);
            this.sprite.graphics.drawLine(-radiusX, radiusY, 0, radiusY * 2, color);
            this.sprite.graphics.drawLine(radiusX, radiusY, 0, radiusY * 2, color);
            this.addChild(this.sprite);
        }
        Show() {
            this.createMap();
        }
        Hide() {
            this.tiledMap.destroy();
        }
    }

    var TiledMap$2 = Laya.TiledMap;
    var Rectangle$2 = Laya.Rectangle;
    class TiledMap_PerspectiveWall extends SingletonScene {
        constructor() {
            super();
        }
        createMap() {
            this.tiledMap = new TiledMap$2();
            this.tiledMap.createMap("res/tiledMap/perspective_walls.json", new Rectangle$2(0, 0, 300, 400), null);
        }
        Show() {
            this.createMap();
        }
        Hide() {
            this.tiledMap.destroy();
        }
    }

    var TiledMap$3 = Laya.TiledMap;
    var Rectangle$3 = Laya.Rectangle;
    var Browser = Laya.Browser;
    var Handler$6 = Laya.Handler;
    class TiledMap_SimpleDemo extends SingletonScene {
        constructor() {
            super();
            this.mLastMouseX = 0;
            this.mLastMouseY = 0;
            this.mX = 0;
            this.mY = 0;
            this.createMap();
            this.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
            this.on(Laya.Event.MOUSE_UP, this, this.mouseUp);
        }
        createMap() {
            this.tiledMap = new TiledMap$3();
            this.mX = this.mY = 0;
            this.tiledMap.createMap("res/tiledMap/desert.json", new Rectangle$3(0, 0, Browser.width, Browser.height), new Handler$6(this, this.completeHandler));
        }
        completeHandler() {
            console.log("地图创建完成");
            console.log("ClientW:" + Browser.clientWidth + " ClientH:" + Browser.clientHeight);
            Laya.stage.on(Laya.Event.RESIZE, this, this.resize);
            this.resize();
        }
        mouseDown() {
            if (!this.isShow) {
                return;
            }
            this.mLastMouseX = Laya.stage.mouseX;
            this.mLastMouseY = Laya.stage.mouseY;
            this.on(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        mouseMove() {
            if (!this.isShow) {
                return;
            }
            this.tiledMap.moveViewPort(this.mX - (Laya.stage.mouseX - this.mLastMouseX), this.mY - (Laya.stage.mouseY - this.mLastMouseY));
        }
        mouseUp() {
            if (!this.isShow) {
                return;
            }
            this.mX = this.mX - (Laya.stage.mouseX - this.mLastMouseX);
            this.mY = this.mY - (Laya.stage.mouseY - this.mLastMouseY);
            this.off(Laya.Event.MOUSE_MOVE, this, this.mouseMove);
        }
        resize() {
            this.tiledMap.changeViewPort(this.mX, this.mY, Browser.width, Browser.height);
        }
        Show() {
            this.createMap();
        }
        Hide() {
            this.tiledMap.destroy();
        }
    }

    class TiledMapMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "带动画的地图", "等角地图", "区块地图", "滚动地图"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    TiledMap_AnimationTile.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    TiledMap_IsometricWorld.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    TiledMap_PerspectiveWall.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    TiledMap_SimpleDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$e = Laya.Sprite;
    var BlurFilter = Laya.BlurFilter;
    var Handler$7 = Laya.Handler;
    class Filters_Blur extends SingletonScene {
        constructor() {
            super();
            this.apePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.apePath, Handler$7.create(this, this.createApe));
        }
        createApe() {
            var ape = new Sprite$e();
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
    }

    var Sprite$f = Laya.Sprite;
    var ColorFilter = Laya.ColorFilter;
    var Handler$8 = Laya.Handler;
    class Filters_Color extends SingletonScene {
        constructor() {
            super();
            this.ApePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.ApePath, Handler$8.create(this, this.setup));
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
            var ape = new Sprite$f();
            ape.loadImage("res/apes/monkey2.png");
            this.addChild(ape);
            return ape;
        }
    }

    var Sprite$g = Laya.Sprite;
    var GlowFilter = Laya.GlowFilter;
    var Handler$9 = Laya.Handler;
    class Filters_Glow extends SingletonScene {
        constructor() {
            super();
            this.apePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.apePath, Handler$9.create(this, this.setup));
        }
        setup() {
            this.createApe();
            this.applayFilter();
        }
        createApe() {
            this.ape = new Sprite$g();
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
    }

    class FiltersMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "发光滤镜", "模糊滤镜", "颜色滤镜"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Filters_Glow.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Filters_Blur.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Filters_Color.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Loader = Laya.Loader;
    var Particle2D = Laya.Particle2D;
    var Handler$a = Laya.Handler;
    class Particle_T1 extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            Laya.loader.load("res/particles/GravityMode.part", Handler$a.create(this, this.onAssetsLoaded), null, Loader.JSON);
        }
        onAssetsLoaded(settings) {
            this.sp = new Particle2D(settings);
            this.sp.emitter.start();
            this.sp.play();
            this.addChild(this.sp);
            this.sp.x = Laya.stage.width / 2;
            this.sp.y = Laya.stage.height / 2;
        }
    }

    var Loader$1 = Laya.Loader;
    var Particle2D$1 = Laya.Particle2D;
    var Handler$b = Laya.Handler;
    class Particle_T2 extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            Laya.loader.load("res/particles/RadiusMode.part", Handler$b.create(this, this.onAssetsLoaded), null, Loader$1.JSON);
        }
        onAssetsLoaded(settings) {
            this.sp = new Particle2D$1(settings);
            this.sp.emitter.start();
            this.sp.play();
            this.addChild(this.sp);
            this.sp.x = Laya.stage.width / 2;
            this.sp.y = Laya.stage.height / 2;
        }
    }

    var Loader$2 = Laya.Loader;
    var Particle2D$2 = Laya.Particle2D;
    var Handler$c = Laya.Handler;
    class Particle_T3 extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            Laya.loader.load("res/particles/particleNew.part", Handler$c.create(this, this.onAssetsLoaded), null, Loader$2.JSON);
        }
        onAssetsLoaded(settings) {
            this.sp = new Particle2D$2(settings);
            this.sp.emitter.start();
            this.sp.play();
            this.addChild(this.sp);
            this.sp.x = Laya.stage.width / 2;
            this.sp.y = Laya.stage.height / 2;
        }
    }

    class ParticleMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "粒子演示1", "粒子演示2", "粒子演示3"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Particle_T1.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Particle_T2.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Particle_T3.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$h = Laya.Sprite;
    var Event$6 = Laya.Event;
    var SoundManager = Laya.SoundManager;
    var Handler$d = Laya.Handler;
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
            soundButton.on(Event$6.CLICK, this, this.onPlaySound);
            musicButton.on(Event$6.CLICK, this, this.onPlayMusic);
        }
        createButton(label) {
            var w = 110;
            var h = 40;
            var button = new Sprite$h();
            button.size(w, h);
            button.graphics.drawRect(0, 0, w, h, "#FF7F50");
            button.graphics.fillText(label, w / 2, 8, "25px SimHei", "#FFFFFF", "center");
            this.addChild(button);
            return button;
        }
        onPlayMusic(e) {
            console.log("播放音乐");
            SoundManager.playMusic("res/sounds/bgm.mp3", 1, new Handler$d(this, this.onComplete));
        }
        onPlaySound(e) {
            console.log("播放音效");
            SoundManager.playSound("res/sounds/btn.mp3", 1, new Handler$d(this, this.onComplete));
        }
        onComplete() {
            console.log("播放完成");
        }
        Hide() {
            SoundManager.stopSound("res/sounds/btn.mp3");
            SoundManager.stopSound("res/sounds/bgm.mp3");
            this.visible = false;
        }
    }

    class SoundMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "音效演示",
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Sound_SimpleDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Text$1 = Laya.Text;
    class Text_AutoSize extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var autoSizeText = this.createSampleText();
            autoSizeText.overflow = Text$1.VISIBLE;
            autoSizeText.y = 50;
            var widthLimitText = this.createSampleText();
            widthLimitText.width = 100;
            widthLimitText.y = 180;
            var heightLimitText = this.createSampleText();
            heightLimitText.height = 20;
            heightLimitText.y = 320;
        }
        createSampleText() {
            var text = new Text$1();
            text.overflow = Text$1.HIDDEN;
            text.color = "#FFFFFF";
            text.font = "Impact";
            text.fontSize = 20;
            text.borderColor = "#FFFF00";
            text.x = 80;
            this.addChild(text);
            text.text = "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL\n" + "A POWERFUL HTML5 ENGINE ON FLASH TECHNICAL";
            return text;
        }
    }

    var BitmapFont = Laya.BitmapFont;
    var Text$2 = Laya.Text;
    var Handler$e = Laya.Handler;
    class Text_BitmapFont extends SingletonScene {
        constructor() {
            super();
            this.fontName = "diyFont";
            Laya.stage.addChild(this);
            this.loadFont();
        }
        loadFont() {
            var bitmapFont = new BitmapFont();
            bitmapFont.loadFont("res/bitmapFont/test.fnt", new Handler$e(this, this.onFontLoaded, [bitmapFont]));
        }
        onFontLoaded(bitmapFont) {
            bitmapFont.setSpaceWidth(10);
            Text$2.registerBitmapFont(this.fontName, bitmapFont);
            this.createText(this.fontName);
        }
        createText(font) {
            var txt = new Text$2();
            txt.width = 250;
            txt.wordWrap = true;
            txt.text = "Do one thing at a time, and do well.";
            txt.font = font;
            txt.leading = 5;
            txt.pos(Laya.stage.width - txt.width >> 1, Laya.stage.height - txt.height >> 1);
            this.addChild(txt);
        }
    }

    var Text$3 = Laya.Text;
    class Text_ComplexStyle extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createText();
        }
        createText() {
            var txt = new Text$3();
            txt.text = "Layabox是性能最强的HTML5引擎技术提供商与优秀的游戏发行商，面向Flash开发者提供HTML5开发技术方案！";
            txt.width = 400;
            txt.wordWrap = true;
            txt.align = "center";
            txt.fontSize = 40;
            txt.font = "Microsoft YaHei";
            txt.color = "#ff0000";
            txt.bold = true;
            txt.leading = 5;
            txt.stroke = 2;
            txt.strokeColor = "#ffffff";
            txt.borderColor = "#00ff00";
            txt.x = (Laya.stage.width - txt.textWidth) / 2;
            txt.y = (Laya.stage.height - txt.textHeight) / 2;
            this.addChild(txt);
        }
    }

    var Input = Laya.Input;
    class Text_Editable extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createInput();
        }
        createInput() {
            var inputText = new Input();
            inputText.size(350, 100);
            inputText.x = Laya.stage.width - inputText.width >> 1;
            inputText.y = Laya.stage.height - inputText.height >> 1;
            inputText.text = "这段文本不可编辑，但可复制";
            inputText.editable = false;
            inputText.bold = true;
            inputText.bgColor = "#666666";
            inputText.color = "#ffffff";
            inputText.fontSize = 20;
            this.addChild(inputText);
        }
    }

    var HTMLDivElement = Laya.HTMLDivElement;
    var HTMLIframeElement = Laya.HTMLIframeElement;
    class Text_HTML extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createParagraph();
            this.showExternalHTML();
        }
        createParagraph() {
            var p = new HTMLDivElement();
            this.addChild(p);
            p.style.font = "Impact";
            p.style.fontSize = 30;
            var html = "<span color='#e3d26a'>使用</span>";
            html += "<span style='color:#FFFFFF;font-weight:bold'>HTMLDivElement</span>";
            html += "<span color='#6ad2e3'>创建的</span><br/>";
            html += "<span color='#d26ae3'>HTML文本</span>";
            p.innerHTML = html;
        }
        showExternalHTML() {
            var p = new HTMLIframeElement();
            this.addChild(p);
            p.href = "res/html/test.html";
            p.y = 200;
        }
    }

    var Input$1 = Laya.Input;
    class Text_InputMultiline extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createInput();
        }
        createInput() {
            var inputText = new Input$1();
            inputText.prompt = "Type some word...";
            inputText.multiline = true;
            inputText.wordWrap = true;
            inputText.size(350, 100);
            inputText.x = Laya.stage.width - inputText.width >> 1;
            inputText.y = Laya.stage.height - inputText.height >> 1;
            inputText.padding = [2, 2, 2, 2];
            inputText.bgColor = "#666666";
            inputText.color = "#ffffff";
            inputText.fontSize = 20;
            this.addChild(inputText);
        }
    }

    var Input$2 = Laya.Input;
    class Text_InputSingleline extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createInput();
        }
        createInput() {
            var inputText = new Input$2();
            inputText.size(350, 100);
            inputText.x = Laya.stage.width - inputText.width >> 1;
            inputText.y = Laya.stage.height - inputText.height >> 1;
            inputText.prompt = "Type some word...";
            inputText.bold = true;
            inputText.bgColor = "#666666";
            inputText.color = "#ffffff";
            inputText.fontSize = 20;
            this.addChild(inputText);
        }
    }

    var Input$3 = Laya.Input;
    class Text_MaxChars extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createInput();
        }
        createInput() {
            var inputText = new Input$3();
            inputText.size(350, 100);
            inputText.x = Laya.stage.width - inputText.width >> 1;
            inputText.y = Laya.stage.height - inputText.height >> 1;
            inputText.bold = true;
            inputText.bgColor = "#666666";
            inputText.color = "#ffffff";
            inputText.fontSize = 20;
            inputText.maxChars = 5;
            this.addChild(inputText);
        }
    }

    var Text$4 = Laya.Text;
    class Text_Overflow extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createTexts();
        }
        createTexts() {
            var t1 = this.createText();
            t1.overflow = Text$4.VISIBLE;
            t1.pos(10, 10);
            var t2 = this.createText();
            t2.overflow = Text$4.SCROLL;
            t2.pos(10, 110);
            var t3 = this.createText();
            t3.overflow = Text$4.HIDDEN;
            t3.pos(10, 210);
        }
        createText() {
            var txt = new Text$4();
            txt.text =
                "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";
            txt.borderColor = "#FFFF00";
            txt.size(300, 50);
            txt.fontSize = 20;
            txt.color = "#ffffff";
            this.addChild(txt);
            return txt;
        }
    }

    var Input$4 = Laya.Input;
    var Text$5 = Laya.Text;
    class Text_Restrict extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createTexts();
        }
        createTexts() {
            this.createLabel("只允许输入数字：").pos(50, 20);
            var input = this.createInput();
            input.pos(50, 50);
            input.restrict = "0-9";
            this.createLabel("只允许输入字母：").pos(50, 100);
            input = this.createInput();
            input.pos(50, 130);
            input.restrict = "a-zA-Z";
            this.createLabel("只允许输入中文字符：").pos(50, 180);
            input = this.createInput();
            input.pos(50, 210);
            input.restrict = "\u4e00-\u9fa5";
        }
        createLabel(text) {
            var label = new Text$5();
            label.text = text;
            label.color = "white";
            label.fontSize = 20;
            this.addChild(label);
            return label;
        }
        createInput() {
            var input = new Input$4();
            input.size(200, 30);
            input.borderColor = "#FFFF00";
            input.bold = true;
            input.fontSize = 20;
            input.color = "#FFFFFF";
            input.padding = [0, 4, 0, 4];
            this.addChild(input);
            return input;
        }
    }

    var Text$6 = Laya.Text;
    var Event$7 = Laya.Event;
    class Text_Scroll extends SingletonScene {
        constructor() {
            super();
            this.prevX = 0;
            this.prevY = 0;
            Laya.stage.addChild(this);
            this.createText();
        }
        createText() {
            this.txt = new Text$6();
            this.txt.overflow = Text$6.SCROLL;
            this.txt.text =
                "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！\n" +
                    "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";
            this.txt.size(200, 100);
            this.txt.x = Laya.stage.width - this.txt.width >> 1;
            this.txt.y = Laya.stage.height - this.txt.height >> 1;
            this.txt.borderColor = "#FFFF00";
            this.txt.fontSize = 20;
            this.txt.color = "#ffffff";
            this.addChild(this.txt);
            this.txt.on(Event$7.MOUSE_DOWN, this, this.startScrollText);
        }
        startScrollText(e) {
            if (!this.isShow) {
                return;
            }
            this.prevX = this.txt.mouseX;
            this.prevY = this.txt.mouseY;
            Laya.stage.on(Event$7.MOUSE_MOVE, this, this.scrollText);
            Laya.stage.on(Event$7.MOUSE_UP, this, this.finishScrollText);
        }
        finishScrollText(e) {
            if (!this.isShow) {
                return;
            }
            Laya.stage.off(Event$7.MOUSE_MOVE, this, this.scrollText);
            Laya.stage.off(Event$7.MOUSE_UP, this, this.finishScrollText);
        }
        scrollText(e) {
            if (!this.isShow) {
                return;
            }
            var nowX = this.txt.mouseX;
            var nowY = this.txt.mouseY;
            this.txt.scrollX += this.prevX - nowX;
            this.txt.scrollY += this.prevY - nowY;
            this.prevX = nowX;
            this.prevY = nowY;
        }
    }

    var Text$7 = Laya.Text;
    class Text_Underline extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createTexts();
        }
        createTexts() {
            this.createText('left', 1, null, 100, 10);
            this.createText('center', 2, "#00BFFF", 155, 150);
            this.createText('right', 3, "#FF7F50", 210, 290);
        }
        createText(align, underlineWidth, underlineColor, x, y) {
            var txt = new Text$7();
            txt.text = "Layabox\n是HTML5引擎技术提供商\n与优秀的游戏发行商\n	面向AS/JS/TS开发者提供HTML5开发技术方案";
            txt.size(300, 50);
            txt.fontSize = 20;
            txt.color = "#ffffff";
            txt.align = align;
            txt.underline = true;
            txt.underlineColor = underlineColor;
            txt.pos(x, y);
            this.addChild(txt);
            return txt;
        }
    }

    var Text$8 = Laya.Text;
    class Text_WordWrap extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createText();
        }
        createText() {
            var txt = new Text$8();
            txt.text = "Layabox是HTML5引擎技术提供商与优秀的游戏发行商，面向AS/JS/TS开发者提供HTML5开发技术方案！";
            txt.width = 300;
            txt.fontSize = 40;
            txt.color = "#ffffff";
            txt.wordWrap = true;
            txt.x = Laya.stage.width - txt.textWidth >> 1;
            txt.y = Laya.stage.height - txt.textHeight >> 1;
            this.addChild(txt);
        }
    }

    class TextMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "自动调整文本尺寸", "位图字体", "复杂的文本样式", "禁止编辑", "Overflow", "下划线", "HTML文本",
                "单行输入", "多行输入", "字数限制", "字符限制", "滚动文本", "自动换行",
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Text_AutoSize.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Text_BitmapFont.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Text_ComplexStyle.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Text_Editable.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Text_Overflow.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    Text_Underline.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    Text_HTML.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    Text_InputSingleline.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    Text_InputMultiline.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    Text_MaxChars.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    Text_Restrict.getInstance().Click();
                    break;
                case this.btnNameArr[12]:
                    Text_Scroll.getInstance().Click();
                    break;
                case this.btnNameArr[13]:
                    Text_WordWrap.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Button$1 = Laya.Button;
    var Handler$f = Laya.Handler;
    class UI_Button extends SingletonScene {
        constructor() {
            super();
            this.COLUMNS = 2;
            this.BUTTON_WIDTH = 147;
            this.BUTTON_HEIGHT = 165 / 3;
            this.HORIZONTAL_SPACING = 200;
            this.VERTICAL_SPACING = 100;
            Laya.stage.addChild(this);
            this.skins = [
                "res/ui/button-1.png", "res/ui/button-2.png", "res/ui/button-3.png",
                "res/ui/button-4.png", "res/ui/button-5.png", "res/ui/button-6.png"
            ];
            this.xOffset = (Laya.stage.width - this.HORIZONTAL_SPACING * (this.COLUMNS - 1) - this.BUTTON_WIDTH) / 2;
            this.yOffset = (Laya.stage.height - this.VERTICAL_SPACING * (this.skins.length / this.COLUMNS - 1) - this.BUTTON_HEIGHT) / 2;
            Laya.loader.load(this.skins, Handler$f.create(this, this.onUIAssetsLoaded));
        }
        onUIAssetsLoaded() {
            for (var i = 0, len = this.skins.length; i < len; ++i) {
                var btn = this.createButton(this.skins[i]);
                var x = i % this.COLUMNS * this.HORIZONTAL_SPACING + this.xOffset;
                var y = (i / this.COLUMNS | 0) * this.VERTICAL_SPACING + this.yOffset;
                btn.pos(x, y);
            }
        }
        createButton(skin) {
            var btn = new Button$1(skin);
            this.addChild(btn);
            return btn;
        }
    }

    var CheckBox = Laya.CheckBox;
    var Handler$g = Laya.Handler;
    class UI_CheckBox extends SingletonScene {
        constructor() {
            super();
            this.COL_AMOUNT = 2;
            this.ROW_AMOUNT = 3;
            this.HORIZONTAL_SPACING = 200;
            this.VERTICAL_SPACING = 100;
            this.X_OFFSET = 100;
            this.Y_OFFSET = 50;
            Laya.stage.addChild(this);
            this.skins = ["res/ui/checkbox (1).png", "res/ui/checkbox (2).png", "res/ui/checkbox (3).png", "res/ui/checkbox (4).png", "res/ui/checkbox (5).png", "res/ui/checkbox (6).png"];
            Laya.loader.load(this.skins, Handler$g.create(this, this.onCheckBoxSkinLoaded));
        }
        onCheckBoxSkinLoaded() {
            var cb;
            for (var i = 0; i < this.COL_AMOUNT; ++i) {
                for (var j = 0; j < this.ROW_AMOUNT; ++j) {
                    cb = this.createCheckBox(this.skins[i * this.ROW_AMOUNT + j]);
                    cb.selected = true;
                    cb.x = this.HORIZONTAL_SPACING * i + this.X_OFFSET;
                    cb.y += this.VERTICAL_SPACING * j + this.Y_OFFSET;
                    if (i == 0) {
                        cb.y += 20;
                        cb.on("change", this, this.updateLabel, [cb]);
                        this.updateLabel(cb);
                    }
                }
            }
        }
        createCheckBox(skin) {
            var cb = new CheckBox(skin);
            this.addChild(cb);
            cb.labelColors = "white";
            cb.labelSize = 20;
            cb.labelFont = "Microsoft YaHei";
            cb.labelPadding = "3,0,0,5";
            return cb;
        }
        updateLabel(checkBox) {
            checkBox.label = checkBox.selected ? "已选中" : "未选中";
        }
    }

    var Button$2 = Laya.Button;
    var Clip = Laya.Clip;
    var Image = Laya.Image;
    class UI_Clip extends SingletonScene {
        constructor() {
            super();
            this.buttonSkin = "res/ui/button-7.png";
            this.clipSkin = "res/ui/num0-9.png";
            this.bgSkin = "res/ui/coutDown.png";
            Laya.stage.addChild(this);
            Laya.loader.load([this.buttonSkin, this.clipSkin, this.bgSkin], Laya.Handler.create(this, this.onSkinLoaded));
        }
        onSkinLoaded() {
            this.showBg();
            this.createTimerAnimation();
            this.showTotalSeconds();
            this.createController();
        }
        showBg() {
            var bg = new Image(this.bgSkin);
            bg.size(224, 302);
            bg.pos(Laya.stage.width - bg.width >> 1, this.height - bg.height >> 1);
            this.addChild(bg);
        }
        createTimerAnimation() {
            this.counter = new Clip(this.clipSkin, 10, 1);
            this.counter.autoPlay = true;
            this.counter.interval = 1000;
            this.counter.x = (Laya.stage.width - this.counter.width) / 2 - 35;
            this.counter.y = (Laya.stage.height - this.counter.height) / 2 - 40;
            this.addChild(this.counter);
        }
        showTotalSeconds() {
            var clip = new Clip(this.clipSkin, 10, 1);
            clip.index = clip.clipX - 1;
            clip.pos(this.counter.x + 60, this.counter.y);
            this.addChild(clip);
        }
        createController() {
            this.controller = new Button$2(this.buttonSkin, "暂停");
            this.controller.labelBold = true;
            this.controller.labelColors = "#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF";
            this.controller.size(84, 30);
            this.controller.on('click', this, this.onClipSwitchState);
            this.controller.x = (Laya.stage.width - this.controller.width) / 2;
            this.controller.y = (Laya.stage.height - this.controller.height) / 2 + 110;
            this.addChild(this.controller);
        }
        onClipSwitchState() {
            if (!this.isShow) {
                return;
            }
            if (this.counter.isPlaying) {
                this.counter.stop();
                this.currFrame = this.counter.index;
                this.controller.label = "播放";
            }
            else {
                this.counter.play();
                this.counter.index = this.currFrame;
                this.controller.label = "暂停";
            }
        }
    }

    var ColorPicker = Laya.ColorPicker;
    var Handler$h = Laya.Handler;
    class UI_ColorPicker extends SingletonScene {
        constructor() {
            super();
            this.skin = "res/ui/colorPicker.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.skin, Handler$h.create(this, this.onColorPickerSkinLoaded));
        }
        onColorPickerSkinLoaded() {
            var colorPicker = new ColorPicker();
            colorPicker.selectedColor = "#ff0033";
            colorPicker.skin = this.skin;
            colorPicker.pos(100, 100);
            colorPicker.changeHandler = new Handler$h(this, this.onChangeColor, [colorPicker]);
            this.addChild(colorPicker);
            this.onChangeColor(colorPicker);
        }
        onChangeColor(colorPicker) {
            if (!this.isShow) {
                return;
            }
            console.log(colorPicker.selectedColor);
        }
    }

    var ComboBox = Laya.ComboBox;
    var Handler$i = Laya.Handler;
    class UI_ComboBox extends SingletonScene {
        constructor() {
            super();
            this.skin = "res/ui/combobox.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.skin, Handler$i.create(this, this.onLoadComplete));
        }
        onLoadComplete() {
            var cb = this.createComboBox(this.skin);
            cb.autoSize = true;
            cb.pos((Laya.stage.width - cb.width) / 2, 100);
            cb.autoSize = false;
        }
        createComboBox(skin) {
            var comboBox = new ComboBox(this.skin, "item0,item1,item2,item3,item4,item5");
            comboBox.labelSize = 30;
            comboBox.itemSize = 25;
            comboBox.selectHandler = new Handler$i(this, this.onSelect, [comboBox]);
            this.addChild(comboBox);
            return comboBox;
        }
        onSelect(cb) {
            console.log("选中了： " + cb.selectedLabel);
        }
    }

    var Button$3 = Laya.Button;
    var Dialog = Laya.Dialog;
    var Image$1 = Laya.Image;
    var Handler$j = Laya.Handler;
    class UI_Dialog extends SingletonScene {
        constructor() {
            super();
            this.DIALOG_WIDTH = 220;
            this.DIALOG_HEIGHT = 275;
            this.CLOSE_BTN_WIDTH = 43;
            this.CLOSE_BTN_PADDING = 5;
            Laya.stage.addChild(this);
            this.assets = ["res/ui/dialog (1).png", "res/ui/close.png"];
            Laya.loader.load(this.assets, Handler$j.create(this, this.onSkinLoadComplete));
        }
        onSkinLoadComplete() {
            this.dialog = new Dialog();
            this.addChild(this.dialog);
            var bg = new Image$1(this.assets[0]);
            this.dialog.addChild(bg);
            var button = new Button$3(this.assets[1]);
            button.pos(this.DIALOG_WIDTH - this.CLOSE_BTN_WIDTH - this.CLOSE_BTN_PADDING, this.CLOSE_BTN_PADDING);
            button.on(Laya.Event.CLICK, this, this.DialogHide);
            this.dialog.addChild(button);
            this.dialog.dragArea = "0,0," + this.DIALOG_WIDTH + "," + this.DIALOG_HEIGHT;
            this.dialog.show();
        }
        DialogHide() {
            if (!this.isShow) {
                return;
            }
            this.dialog.visible = false;
            ;
        }
        Show() {
            this.visible = true;
            if (this.dialog) {
                this.dialog.visible = true;
            }
        }
        Hide() {
            this.visible = false;
            if (this.dialog) {
                this.dialog.visible = false;
            }
        }
    }

    var FontClip = Laya.FontClip;
    class UI_Font_Clip extends SingletonScene {
        constructor() {
            super();
            this.TestClipNum = "res/comp/fontClip_num.png";
            this._ClipNum = "res/comp/fontClip_num.png";
            this._ClipNum1 = "res/comp/fontClip_num.png";
            this.TestFontClip = "res/comp/fontClip.png";
            this._FontClip = "res/comp/fontClip.png";
            Laya.stage.addChild(this);
            Laya.loader.load([this.TestClipNum, this.TestFontClip,
                this._ClipNum, this._FontClip, this._ClipNum1], Laya.Handler.create(this, this.ShowContent));
        }
        ShowContent() {
            var clipnum = new FontClip(this._ClipNum);
            var fontClip = new FontClip(this._FontClip);
            var TestFontClip = new FontClip(this.TestFontClip);
            var TestClipNum = new FontClip(this.TestClipNum);
            var clipnum1 = new FontClip(this._ClipNum1);
            clipnum.pos(240, 500);
            clipnum.size(250, 50);
            clipnum.sheet = "0123456789";
            clipnum.value = "114499";
            clipnum.spaceY = 10;
            TestClipNum.pos(200, 400);
            TestClipNum.sheet = "0123456789";
            TestClipNum.value = "0123456789";
            clipnum1.pos(150, 200);
            clipnum1.direction = "vertical";
            clipnum1.sheet = "0123456789";
            clipnum1.value = "223388";
            fontClip.pos(240, 300);
            fontClip.sheet = "鼠牛虎兔龙蛇马羊 猴鸡狗猪年快乐";
            fontClip.value = "猪年快乐";
            fontClip.spaceY = 10;
            TestFontClip.pos(200, 200);
            TestFontClip.sheet = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
            TestFontClip.value = "鼠牛虎兔龙蛇马羊猴鸡狗猪年快乐";
            TestFontClip.spaceY = 10;
            this.addChild(clipnum);
            this.addChild(fontClip);
            this.addChild(TestFontClip);
            this.addChild(TestClipNum);
            this.addChild(clipnum1);
        }
    }

    var Image$2 = Laya.Image;
    class UI_Image extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var dialog = new Image$2("res/ui/dialog (3).png");
            dialog.pos(165, 62.5);
            this.addChild(dialog);
        }
    }

    var TextInput = Laya.TextInput;
    var Handler$k = Laya.Handler;
    class UI_Input extends SingletonScene {
        constructor() {
            super();
            this.SPACING = 100;
            this.INPUT_WIDTH = 300;
            this.INPUT_HEIGHT = 50;
            this.Y_OFFSET = 50;
            Laya.stage.addChild(this);
            this.skins = ["res/ui/input (1).png", "res/ui/input (2).png", "res/ui/input (3).png", "res/ui/input (4).png"];
            Laya.loader.load(this.skins, Handler$k.create(this, this.onLoadComplete));
        }
        onLoadComplete() {
            for (var i = 0; i < this.skins.length; ++i) {
                var input = this.createInput(this.skins[i]);
                input.prompt = 'Type:';
                input.x = (Laya.stage.width - input.width) / 2;
                input.y = i * this.SPACING + this.Y_OFFSET;
            }
        }
        createInput(skin) {
            var ti = new TextInput();
            ti.skin = skin;
            ti.size(300, 50);
            ti.sizeGrid = "0,40,0,40";
            ti.font = "Arial";
            ti.fontSize = 30;
            ti.bold = true;
            ti.color = "#606368";
            this.addChild(ti);
            return ti;
        }
    }

    var Label = Laya.Label;
    class UI_Label extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createLabel("#FFFFFF", null).pos(30, 50);
            this.createLabel("#00FFFF", null).pos(290, 50);
            this.createLabel("#FFFF00", "#FFFFFF").pos(30, 100);
            this.createLabel("#000000", "#FFFFFF").pos(290, 100);
            this.createLabel("#FFFFFF", "#00FFFF").pos(30, 150);
            this.createLabel("#0080FF", "#00FFFF").pos(290, 150);
        }
        createLabel(color, strokeColor) {
            const STROKE_WIDTH = 4;
            var label = new Label();
            label.font = "Microsoft YaHei";
            label.text = "SAMPLE DEMO";
            label.fontSize = 30;
            label.color = color;
            if (strokeColor) {
                label.stroke = STROKE_WIDTH;
                label.strokeColor = strokeColor;
            }
            this.addChild(label);
            return label;
        }
    }

    var List = Laya.List;
    var Handler$l = Laya.Handler;
    class UI_List extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var list = new List();
            list.itemRender = Item;
            list.repeatX = 1;
            list.repeatY = 4;
            list.x = (Laya.stage.width - Item.WID) / 2;
            list.y = (Laya.stage.height - Item.HEI * list.repeatY) / 2;
            list.vScrollBarSkin = "";
            list.selectEnable = true;
            list.selectHandler = new Handler$l(this, this.onSelect);
            list.renderHandler = new Handler$l(this, this.updateItem);
            this.addChild(list);
            var data = [];
            for (var i = 0; i < 10; ++i) {
                data.push("res/ui/listskins/1.jpg");
                data.push("res/ui/listskins/2.jpg");
                data.push("res/ui/listskins/3.jpg");
                data.push("res/ui/listskins/4.jpg");
                data.push("res/ui/listskins/5.jpg");
            }
            list.array = data;
        }
        updateItem(cell, index) {
            cell.setImg(cell.dataSource);
        }
        onSelect(index) {
            console.log("当前选择的索引：" + index);
        }
    }
    var Box = Laya.Box;
    var Image$3 = Laya.Image;
    class Item extends Box {
        constructor() {
            super();
            this.size(Item.WID, Item.HEI);
            this.img = new Image$3();
            this.addChild(this.img);
        }
        setImg(src) {
            this.img.skin = src;
        }
    }
    Item.WID = 373;
    Item.HEI = 85;

    var ProgressBar = Laya.ProgressBar;
    var Handler$m = Laya.Handler;
    class UI_ProgressBar extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            Laya.loader.load(["res/ui/progressBar.png", "res/ui/progressBar$bar.png"], Handler$m.create(this, this.onLoadComplete));
        }
        onLoadComplete() {
            this.progressBar = new ProgressBar("res/ui/progressBar.png");
            this.progressBar.width = 400;
            this.progressBar.x = (Laya.stage.width - this.progressBar.width) / 2;
            this.progressBar.y = Laya.stage.height / 2;
            this.progressBar.sizeGrid = "5,5,5,5";
            this.progressBar.changeHandler = new Handler$m(this, this.onChange);
            this.addChild(this.progressBar);
            Laya.timer.loop(100, this, this.changeValue);
        }
        changeValue() {
            if (!this.isShow) {
                return;
            }
            if (this.progressBar.value >= 1)
                this.progressBar.value = 0;
            this.progressBar.value += 0.05;
        }
        onChange(value) {
            if (!this.isShow) {
                return;
            }
            console.log("进度：" + Math.floor(value * 100) + "%");
        }
    }

    var RadioGroup = Laya.RadioGroup;
    var Handler$n = Laya.Handler;
    class UI_RadioGroup extends SingletonScene {
        constructor() {
            super();
            this.SPACING = 150;
            this.X_OFFSET = 200;
            this.Y_OFFSET = 200;
            Laya.stage.addChild(this);
            this.skins = ["res/ui/radioButton (1).png", "res/ui/radioButton (2).png", "res/ui/radioButton (3).png"];
            Laya.loader.load(this.skins, Handler$n.create(this, this.initRadioGroups));
        }
        initRadioGroups() {
            for (var i = 0; i < this.skins.length; ++i) {
                var rg = this.createRadioGroup(this.skins[i]);
                rg.selectedIndex = i;
                rg.x = i * this.SPACING + this.X_OFFSET;
                rg.y = this.Y_OFFSET;
            }
        }
        createRadioGroup(skin) {
            var rg = new RadioGroup();
            rg.skin = skin;
            rg.space = 70;
            rg.direction = "v";
            rg.labels = "Item1, Item2, Item3";
            rg.labelColors = "#787878,#d3d3d3,#FFFFFF";
            rg.labelSize = 20;
            rg.labelBold = true;
            rg.labelPadding = "5,0,0,5";
            rg.selectHandler = new Handler$n(this, this.onSelectChange);
            this.addChild(rg);
            return rg;
        }
        onSelectChange(index) {
            if (!this.isShow) {
                return;
            }
            console.log("你选择了第 " + (index + 1) + " 项");
        }
    }

    var HScrollBar = Laya.HScrollBar;
    var VScrollBar = Laya.VScrollBar;
    var Handler$o = Laya.Handler;
    class UI_ScrollBar extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            var skins = [];
            skins.push("res/ui/hscroll.png", "res/ui/hscroll$bar.png", "res/ui/hscroll$down.png", "res/ui/hscroll$up.png");
            skins.push("res/ui/vscroll.png", "res/ui/vscroll$bar.png", "res/ui/vscroll$down.png", "res/ui/vscroll$up.png");
            Laya.loader.load(skins, Handler$o.create(this, this.onSkinLoadComplete));
        }
        onSkinLoadComplete() {
            this.placeHScroller();
            this.placeVScroller();
        }
        placeHScroller() {
            var hs = new HScrollBar();
            hs.skin = "res/ui/hscroll.png";
            hs.width = 300;
            hs.pos(50, 170);
            hs.min = 0;
            hs.max = 100;
            hs.changeHandler = new Handler$o(this, this.onChange);
            this.addChild(hs);
        }
        placeVScroller() {
            var vs = new VScrollBar();
            vs.skin = "res/ui/vscroll.png";
            vs.height = 300;
            vs.pos(400, 50);
            vs.min = 0;
            vs.max = 100;
            vs.changeHandler = new Handler$o(this, this.onChange);
            this.addChild(vs);
        }
        onChange(value) {
            console.log("滚动条的位置： value=" + value);
        }
    }

    var HSlider = Laya.HSlider;
    var VSlider = Laya.VSlider;
    var Handler$p = Laya.Handler;
    class UI_Slider extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            var skins = [];
            skins.push("res/ui/hslider.png", "res/ui/hslider$bar.png");
            skins.push("res/ui/vslider.png", "res/ui/vslider$bar.png");
            Laya.loader.load(skins, Handler$p.create(this, this.onLoadComplete));
        }
        onLoadComplete() {
            this.placeHSlider();
            this.placeVSlider();
        }
        placeHSlider() {
            var hs = new HSlider();
            hs.skin = "res/ui/hslider.png";
            hs.width = 300;
            hs.pos(50, 170);
            hs.min = 0;
            hs.max = 100;
            hs.value = 50;
            hs.tick = 1;
            hs.changeHandler = new Handler$p(this, this.onChange);
            this.addChild(hs);
        }
        placeVSlider() {
            var vs = new VSlider();
            vs.skin = "res/ui/vslider.png";
            vs.height = 300;
            vs.pos(400, 50);
            vs.min = 0;
            vs.max = 100;
            vs.value = 50;
            vs.tick = 1;
            vs.changeHandler = new Handler$p(this, this.onChange);
            this.addChild(vs);
        }
        onChange(value) {
            console.log("滑块的位置：" + value);
        }
    }

    var Tab = Laya.Tab;
    var Handler$q = Laya.Handler;
    class UI_Tab extends SingletonScene {
        constructor() {
            super();
            this.skins = ["res/ui/tab1.png", "res/ui/tab2.png"];
            Laya.stage.addChild(this);
            Laya.loader.load(this.skins, Handler$q.create(this, this.onSkinLoaded));
        }
        onSkinLoaded() {
            var tabA = this.createTab(this.skins[0]);
            tabA.pos(40, 120);
            tabA.labelColors = "#000000,#d3d3d3,#333333";
            var tabB = this.createTab(this.skins[1]);
            tabB.pos(40, 220);
            tabB.labelColors = "#FFFFFF,#8FB299,#FFFFFF";
        }
        createTab(skin) {
            var tab = new Tab();
            tab.skin = skin;
            tab.labelBold = true;
            tab.labelSize = 20;
            tab.labelStrokeColor = "#000000";
            tab.labels = "Tab Control 1,Tab Control 2,Tab Control 3";
            tab.labelPadding = "0,0,0,0";
            tab.selectedIndex = 1;
            this.onSelect(tab.selectedIndex);
            tab.selectHandler = new Handler$q(this, this.onSelect);
            this.addChild(tab);
            return tab;
        }
        onSelect(index) {
            console.log("当前选择的标签页索引为 " + index);
        }
    }

    var TextArea = Laya.TextArea;
    var Browser$1 = Laya.Browser;
    var Handler$r = Laya.Handler;
    class UI_TextArea extends SingletonScene {
        constructor() {
            super();
            this.skin = "res/ui/textarea.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.skin, Handler$r.create(this, this.onLoadComplete));
        }
        onLoadComplete() {
            var ta = new TextArea("");
            ta.skin = this.skin;
            ta.font = "Arial";
            ta.fontSize = 18;
            ta.bold = true;
            ta.color = "#3d3d3d";
            ta.pos(100, 15);
            ta.size(375, 355);
            ta.padding = "70,8,8,8";
            var scaleFactor = Browser$1.pixelRatio;
            this.addChild(ta);
        }
    }

    var Tree = Laya.Tree;
    var Handler$s = Laya.Handler;
    var Utils = Laya.Utils;
    class UI_Tree extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            var res = [
                "res/ui/vscroll.png",
                "res/ui/vscroll$bar.png",
                "res/ui/vscroll$down.png",
                "res/ui/vscroll$up.png",
                "res/ui/tree/clip_selectBox.png",
                "res/ui/tree/clip_tree_folder.png",
                "res/ui/tree/clip_tree_arrow.png"
            ];
            Laya.loader.load(res, new Handler$s(this, this.onLoadComplete));
        }
        onLoadComplete() {
            var treeData = "<data>";
            for (var i = 0; i < 5; ++i) {
                treeData += "<item label='Directory " + (i + 1) + "' isOpen='true'>";
                for (var j = 0; j < 5; ++j) {
                    treeData += "<leaf label='File " + (j + 1) + "'/>";
                }
                treeData += "</item>";
            }
            treeData += "</data>";
            var xml = Utils.parseXMLFromString(treeData);
            var tree = new Tree();
            tree.scrollBarSkin = "res/ui/vscroll.png";
            tree.itemRender = Item$1;
            tree.xml = xml;
            tree.size(300, 300);
            tree.x = (Laya.stage.width - tree.width) / 2;
            tree.y = (Laya.stage.height - tree.height) / 2;
            this.addChild(tree);
        }
    }
    var Box$1 = Laya.Box;
    var Clip$1 = Laya.Clip;
    var Label$1 = Laya.Label;
    class Item$1 extends Box$1 {
        constructor() {
            super();
            this.right = 0;
            this.left = 0;
            var selectBox = new Clip$1("res/ui/tree/clip_selectBox.png", 1, 2);
            selectBox.name = "selectBox";
            selectBox.height = 32;
            selectBox.x = 13;
            selectBox.left = 12;
            this.addChild(selectBox);
            var folder = new Clip$1("res/ui/tree/clip_tree_folder.png", 1, 3);
            folder.name = "folder";
            folder.x = 14;
            folder.y = 4;
            this.addChild(folder);
            var label = new Label$1("treeItem");
            label.name = "label";
            label.fontSize = 20;
            label.color = "#FFFFFF";
            label.padding = "6,0,0,13";
            label.width = 150;
            label.height = 30;
            label.x = 33;
            label.y = 1;
            label.left = 33;
            label.right = 0;
            this.addChild(label);
            var arrow = new Clip$1("res/ui/tree/clip_tree_arrow.png", 1, 2);
            arrow.name = "arrow";
            arrow.x = 0;
            arrow.y = 5;
            this.addChild(arrow);
        }
    }

    class UIMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "Label", "Button", "RadioGroup", "CheckBox", "Clip",
                "FontClip", "ColorPicker", "ComboBox", "Dialog", "ScrollBar",
                "Slider", "Image", "List", "ProgressBar", "Tab",
                "Input", "TextArea", "Tree"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    UI_Label.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    UI_Button.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    UI_RadioGroup.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    UI_CheckBox.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    UI_Clip.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    UI_Font_Clip.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    UI_ColorPicker.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    UI_ComboBox.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    UI_Dialog.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    UI_ScrollBar.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    UI_Slider.getInstance().Click();
                    break;
                case this.btnNameArr[12]:
                    UI_Image.getInstance().Click();
                    break;
                case this.btnNameArr[13]:
                    UI_List.getInstance().Click();
                    break;
                case this.btnNameArr[14]:
                    UI_ProgressBar.getInstance().Click();
                    break;
                case this.btnNameArr[15]:
                    UI_Tab.getInstance().Click();
                    break;
                case this.btnNameArr[16]:
                    UI_Input.getInstance().Click();
                    break;
                case this.btnNameArr[17]:
                    UI_TextArea.getInstance().Click();
                    break;
                case this.btnNameArr[18]:
                    UI_Tree.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Text$9 = Laya.Text;
    class Timer_CallLater extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.demonstrate();
        }
        demonstrate() {
            for (var i = 0; i < 10; i++) {
                Laya.timer.callLater(this, this.onCallLater);
            }
        }
        onCallLater() {
            console.log("onCallLater triggered");
            var text = new Text$9();
            text.font = "SimHei";
            text.fontSize = 30;
            text.color = "#FFFFFF";
            text.text = "打开控制台可见该函数仅触发了一次";
            text.size(Laya.stage.width, Laya.stage.height);
            text.wordWrap = true;
            text.valign = "middle";
            text.align = "center";
            this.addChild(text);
        }
    }

    var Sprite$i = Laya.Sprite;
    var Event$8 = Laya.Event;
    class Timer_DelayExcute extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var vGap = 100;
            this.button1 = this.createButton("点我3秒之后 alpha - 0.5");
            this.button1.x = (Laya.stage.width - this.button1.width) / 2;
            this.button1.y = (Laya.stage.height - this.button1.height - vGap) / 2;
            this.addChild(this.button1);
            this.button1.on(Event$8.CLICK, this, this.onDecreaseAlpha1);
            this.button2 = this.createButton("点我60帧之后 alpha - 0.5");
            this.button2.pos(this.button1.x, this.button1.y + vGap);
            this.addChild(this.button2);
            this.button2.on(Event$8.CLICK, this, this.onDecreaseAlpha2);
        }
        createButton(label) {
            var w = 300, h = 60;
            var button = new Sprite$i();
            button.graphics.drawRect(0, 0, w, h, "#FF7F50");
            button.size(w, h);
            button.graphics.fillText(label, w / 2, 17, "20px simHei", "#ffffff", "center");
            return button;
        }
        onDecreaseAlpha1(e) {
            if (!this.isShow) {
                return;
            }
            this.button1.off(Event$8.CLICK, this, this.onDecreaseAlpha1);
            Laya.timer.once(3000, this, this.onComplete1);
        }
        onDecreaseAlpha2(e) {
            if (!this.isShow) {
                return;
            }
            this.button2.off(Event$8.CLICK, this, this.onDecreaseAlpha2);
            Laya.timer.frameOnce(60, this, this.onComplete2);
        }
        onComplete1() {
            if (!this.isShow) {
                return;
            }
            this.button1.alpha -= 0.5;
        }
        onComplete2() {
            if (!this.isShow) {
                return;
            }
            this.button2.alpha -= 0.5;
        }
        Show() {
            if (this.button1) {
                this.button1.on(Event$8.CLICK, this, this.onDecreaseAlpha1);
                this.button1.alpha = 1;
            }
            if (this.button2) {
                this.button2.on(Event$8.CLICK, this, this.onDecreaseAlpha2);
                this.button2.alpha = 1;
            }
            this.visible = true;
        }
    }

    var Text$a = Laya.Text;
    class Timer_Interval extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var vGap = 200;
            this.rotateTimeBasedText = this.createText("基于时间旋转", Laya.stage.width / 2, (Laya.stage.height - vGap) / 2);
            this.rotateFrameRateBasedText = this.createText("基于帧频旋转", this.rotateTimeBasedText.x, this.rotateTimeBasedText.y + vGap);
            Laya.timer.loop(200, this, this.animateTimeBased);
            Laya.timer.frameLoop(2, this, this.animateFrameRateBased);
        }
        createText(text, x, y) {
            var t = new Text$a();
            t.text = text;
            t.fontSize = 30;
            t.color = "white";
            t.bold = true;
            t.pivot(t.width / 2, t.height / 2);
            t.pos(x, y);
            this.addChild(t);
            return t;
        }
        animateTimeBased() {
            if (!this.isShow) {
                return;
            }
            this.rotateTimeBasedText.rotation += 1;
        }
        animateFrameRateBased() {
            if (!this.isShow) {
                return;
            }
            this.rotateFrameRateBasedText.rotation += 1;
        }
    }

    class TimerMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "延迟调用", "延迟执行", "间隔循环"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Timer_CallLater.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Timer_DelayExcute.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Timer_Interval.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Input$5 = Laya.Input;
    var Sprite$j = Laya.Sprite;
    var Text$b = Laya.Text;
    var Event$9 = Laya.Event;
    var List$1 = Laya.List;
    var Ease = Laya.Ease;
    var Handler$t = Laya.Handler;
    var Tween$2 = Laya.Tween;
    class Tween_EaseFunctionsDemo extends SingletonScene {
        constructor() {
            super();
            this.duration = 2000;
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createCharacter();
            this.createEaseFunctionList();
            this.createDurationCrontroller();
        }
        createCharacter() {
            this.character = new Sprite$j();
            this.character.loadImage("res/cartoonCharacters/1.png");
            this.character.pos(100, 50);
            this.addChild(this.character);
        }
        createEaseFunctionList() {
            var easeFunctionsList = new List$1();
            easeFunctionsList.itemRender = ListItemRender;
            easeFunctionsList.pos(5, 5);
            easeFunctionsList.repeatX = 1;
            easeFunctionsList.repeatY = 20;
            easeFunctionsList.vScrollBarSkin = '';
            easeFunctionsList.selectEnable = true;
            easeFunctionsList.selectHandler = new Handler$t(this, this.onEaseFunctionChange, [easeFunctionsList]);
            easeFunctionsList.renderHandler = new Handler$t(this, this.renderList);
            this.addChild(easeFunctionsList);
            var data = [];
            data.push('backIn', 'backOut', 'backInOut');
            data.push('bounceIn', 'bounceOut', 'bounceInOut');
            data.push('circIn', 'circOut', 'circInOut');
            data.push('cubicIn', 'cubicOut', 'cubicInOut');
            data.push('elasticIn', 'elasticOut', 'elasticInOut');
            data.push('expoIn', 'expoOut', 'expoInOut');
            data.push('linearIn', 'linearOut', 'linearInOut');
            data.push('linearNone');
            data.push('QuadIn', 'QuadOut', 'QuadInOut');
            data.push('quartIn', 'quartOut', 'quartInOut');
            data.push('quintIn', 'quintOut', 'quintInOut');
            data.push('sineIn', 'sineOut', 'sineInOut');
            data.push('strongIn', 'strongOut', 'strongInOut');
            easeFunctionsList.array = data;
        }
        renderList(item) {
            item.setLabel(item.dataSource);
        }
        onEaseFunctionChange(list) {
            this.character.pos(100, 50);
            this.tween && this.tween.clear();
            this.tween = Tween$2.to(this.character, { x: 350, y: 250 }, this.duration, Ease[list.selectedItem]);
        }
        createDurationCrontroller() {
            var durationInput = this.createInputWidthLabel("Duration:", '2000', 400, 10);
            durationInput.on(Event$9.INPUT, this, function () {
                this.duration = parseInt(durationInput.text);
            });
        }
        createInputWidthLabel(label, prompt, x, y) {
            var text = new Text$b();
            text.text = label;
            text.color = "white";
            this.addChild(text);
            text.pos(x, y);
            var input = new Input$5();
            input.size(50, 20);
            input.text = prompt;
            input.align = 'center';
            this.addChild(input);
            input.color = "#FFFFFF";
            input.borderColor = "#FFFFFF";
            input.pos(text.x + text.width + 10, text.y - 3);
            return input;
        }
    }
    var Box$2 = Laya.Box;
    var Label$2 = Laya.Label;
    class ListItemRender extends Box$2 {
        constructor() {
            super();
            this.size(100, 20);
            this.label = new Label$2();
            this.label.fontSize = 12;
            this.label.color = "#FFFFFF";
            this.addChild(this.label);
        }
        setLabel(value) {
            this.label.text = value;
        }
    }

    var Text$c = Laya.Text;
    var Ease$1 = Laya.Ease;
    var Tween$3 = Laya.Tween;
    class Tween_Letters extends SingletonScene {
        constructor() {
            super();
            this.letters = [];
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var demoString = "LayaBox";
            for (var i = 0, len = demoString.length; i < len; ++i) {
                var letterText = this.createLetter(demoString.charAt(i));
                this.letters.push(letterText);
            }
        }
        MoveLetter() {
            var w = 400;
            var offset = Laya.stage.width - w >> 1;
            var endY = Laya.stage.height / 2 - 50;
            for (var i = 0; i < this.letters.length; i++) {
                this.letters[i].x = w / this.letters.length * i + offset;
                this.letters[i].y = 0;
                Tween$3.to(this.letters[i], { y: endY }, 1000, Ease$1.elasticOut, null, i * 1000);
            }
        }
        createLetter(char) {
            var letter = new Text$c();
            letter.text = char;
            letter.color = "#FFFFFF";
            letter.font = "Impact";
            letter.fontSize = 110;
            this.addChild(letter);
            return letter;
        }
        Show() {
            this.visible = true;
            this.MoveLetter();
        }
    }

    var Sprite$k = Laya.Sprite;
    var Tween$4 = Laya.Tween;
    class Tween_SimpleSample extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.terminalX = 200;
            this.characterA = this.createCharacter("res/cartoonCharacters/1.png");
            this.characterA.pivot(46.5, 50);
            this.characterA.y = 100;
            this.characterB = this.createCharacter("res/cartoonCharacters/2.png");
            this.characterB.pivot(34, 50);
            this.characterB.y = 250;
            this.graphics.drawLine(this.terminalX, 0, this.terminalX, Laya.stage.height, "#FFFFFF");
            this.TweenMove();
        }
        TweenMove() {
            this.terminalX = 200;
            if (this.characterA) {
                this.characterA.pivot(46.5, 50);
                this.characterA.y = 100;
                this.characterA.x = 0;
                Tween$4.to(this.characterA, { x: this.terminalX }, 1000);
            }
            if (this.characterB) {
                this.characterB.pivot(34, 50);
                this.characterB.y = 250;
                this.characterB.x = this.terminalX;
                Tween$4.from(this.characterB, { x: 0 }, 1000);
            }
        }
        createCharacter(skin) {
            var character = new Sprite$k();
            character.loadImage(skin);
            this.addChild(character);
            return character;
        }
        Show() {
            this.visible = true;
            this.TweenMove();
        }
    }

    var Sprite$l = Laya.Sprite;
    var Event$a = Laya.Event;
    var Keyboard = Laya.Keyboard;
    var TimeLine = Laya.TimeLine;
    class Tween_TimeLine extends SingletonScene {
        constructor() {
            super();
            this.timeLine = new TimeLine();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createApe();
            this.createTimerLine();
            this.on(Event$a.KEY_DOWN, this, this.keyDown);
        }
        createApe() {
            this.target = new Sprite$l();
            this.target.loadImage("res/apes/monkey2.png");
            this.addChild(this.target);
            this.target.pivot(55, 72);
            this.target.pos(100, 100);
        }
        createTimerLine() {
            this.timeLine.addLabel("turnRight", 0).to(this.target, { x: 450, y: 100, scaleX: 0.5, scaleY: 0.5 }, 2000, null, 0)
                .addLabel("turnDown", 0).to(this.target, { x: 450, y: 300, scaleX: 0.2, scaleY: 1, alpha: 1 }, 2000, null, 0)
                .addLabel("turnLeft", 0).to(this.target, { x: 100, y: 300, scaleX: 1, scaleY: 0.2, alpha: 0.1 }, 2000, null, 0)
                .addLabel("turnUp", 0).to(this.target, { x: 100, y: 100, scaleX: 1, scaleY: 1, alpha: 1 }, 2000, null, 0);
            this.timeLine.play(0, true);
            this.timeLine.on(Event$a.COMPLETE, this, this.onComplete);
            this.timeLine.on(Event$a.LABEL, this, this.onLabel);
        }
        onComplete() {
            if (!this.isShow) {
                return;
            }
            console.log("timeLine complete!!!!");
        }
        onLabel(label) {
            if (!this.isShow) {
                return;
            }
            console.log("LabelName:" + label);
        }
        keyDown(e) {
            if (!this.isShow) {
                return;
            }
            switch (e.keyCode) {
                case Keyboard.LEFT:
                    this.timeLine.play("turnLeft");
                    break;
                case Keyboard.RIGHT:
                    this.timeLine.play("turnRight");
                    break;
                case Keyboard.UP:
                    this.timeLine.play("turnUp");
                    break;
                case Keyboard.DOWN:
                    this.timeLine.play("turnDown");
                    break;
                case Keyboard.P:
                    this.timeLine.pause();
                    break;
                case Keyboard.R:
                    this.timeLine.resume();
                    break;
            }
        }
    }

    class TweenMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "简单的Tween", "逐字缓动", "缓动函数演示", "时间线"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Tween_SimpleSample.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Tween_Letters.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Tween_EaseFunctionsDemo.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Tween_TimeLine.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class PhysicsMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "复合碰撞器", "碰撞过滤器", "碰撞事件与传感器", "桥", "仿生机器人"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    break;
                case this.btnNameArr[2]:
                    break;
                case this.btnNameArr[3]:
                    break;
                case this.btnNameArr[4]:
                    break;
                case this.btnNameArr[5]:
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$m = Laya.Sprite;
    var Event$b = Laya.Event;
    var Ease$2 = Laya.Ease;
    var Handler$u = Laya.Handler;
    var Tween$5 = Laya.Tween;
    class Interaction_Hold extends SingletonScene {
        constructor() {
            super();
            this.HOLD_TRIGGER_TIME = 1000;
            this.apePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.apePath, Handler$u.create(this, this.createApe));
        }
        createApe() {
            this.ape = new Sprite$m();
            this.ape.loadImage(this.apePath);
            var texture = Laya.loader.getRes(this.apePath);
            this.ape.pivot(texture.width / 2, texture.height / 2);
            this.ape.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.ape.scale(0.8, 0.8);
            this.addChild(this.ape);
            this.ape.on(Event$b.MOUSE_DOWN, this, this.onApePress);
        }
        onApePress(e) {
            Laya.timer.once(this.HOLD_TRIGGER_TIME, this, this.onHold);
            Laya.stage.on(Event$b.MOUSE_UP, this, this.onApeRelease);
        }
        onHold() {
            if (!this.isShow) {
                return;
            }
            Tween$5.to(this.ape, { "scaleX": 1, "scaleY": 1 }, 500, Ease$2.bounceOut);
            this.isApeHold = true;
        }
        onApeRelease() {
            if (!this.isShow) {
                return;
            }
            if (this.isApeHold) {
                this.isApeHold = false;
                Tween$5.to(this.ape, { "scaleX": 0.8, "scaleY": 0.8 }, 300);
            }
            else
                Laya.timer.clear(this, this.onHold);
            Laya.stage.off(Event$b.MOUSE_UP, this, this.onApeRelease);
        }
    }

    var Sprite$n = Laya.Sprite;
    var Event$c = Laya.Event;
    var Rectangle$4 = Laya.Rectangle;
    var Handler$v = Laya.Handler;
    class Interaction_Drag extends SingletonScene {
        constructor() {
            super();
            this.ApePath = "res/apes/monkey2.png";
            Laya.stage.addChild(this);
            Laya.loader.load(this.ApePath, Handler$v.create(this, this.setup));
        }
        setup() {
            this.createApe();
            this.showDragRegion();
        }
        createApe() {
            this.ape = new Sprite$n();
            this.ape.loadImage(this.ApePath);
            this.addChild(this.ape);
            var texture = Laya.loader.getRes(this.ApePath);
            this.ape.pivot(texture.width / 2, texture.height / 2);
            this.ape.x = Laya.stage.width / 2;
            this.ape.y = Laya.stage.height / 2;
            this.ape.on(Event$c.MOUSE_DOWN, this, this.onStartDrag);
        }
        showDragRegion() {
            var dragWidthLimit = 350;
            var dragHeightLimit = 200;
            this.dragRegion = new Rectangle$4(Laya.stage.width - dragWidthLimit >> 1, Laya.stage.height - dragHeightLimit >> 1, dragWidthLimit, dragHeightLimit);
            this.graphics.drawRect(this.dragRegion.x, this.dragRegion.y, this.dragRegion.width, this.dragRegion.height, null, "#FFFFFF", 2);
        }
        onStartDrag(e) {
            this.ape.startDrag(this.dragRegion, true, 100);
        }
    }

    var Sprite$o = Laya.Sprite;
    var Event$d = Laya.Event;
    class Interaction_Rotate extends SingletonScene {
        constructor() {
            super();
            this.preRadian = 0;
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createSprite();
            Laya.stage.on(Event$d.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Event$d.MOUSE_OUT, this, this.onMouseUp);
        }
        createSprite() {
            this.sp = new Sprite$o();
            var w = 200, h = 300;
            this.sp.graphics.drawRect(0, 0, w, h, "#FF7F50");
            this.sp.size(w, h);
            this.sp.pivot(w / 2, h / 2);
            this.sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.addChild(this.sp);
            this.sp.on(Event$d.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown(e) {
            if (!this.isShow) {
                return;
            }
            var touches = e.touches;
            if (touches && touches.length == 2) {
                this.preRadian = Math.atan2(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
                Laya.stage.on(Event$d.MOUSE_MOVE, this, this.onMouseMove);
            }
        }
        onMouseMove(e) {
            if (!this.isShow) {
                return;
            }
            var touches = e.touches;
            if (touches && touches.length == 2) {
                var nowRadian = Math.atan2(touches[0].stageY - touches[1].stageY, touches[0].stageX - touches[1].stageX);
                this.sp.rotation += 180 / Math.PI * (nowRadian - this.preRadian);
                this.preRadian = nowRadian;
            }
        }
        onMouseUp(e) {
            if (!this.isShow) {
                return;
            }
            Laya.stage.off(Event$d.MOUSE_MOVE, this, this.onMouseMove);
        }
    }

    var Sprite$p = Laya.Sprite;
    var Event$e = Laya.Event;
    class Interaction_Scale extends SingletonScene {
        constructor() {
            super();
            this.lastDistance = 0;
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createSprite();
            Laya.stage.on(Event$e.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Event$e.MOUSE_OUT, this, this.onMouseUp);
        }
        createSprite() {
            this.sp = new Sprite$p();
            var w = 300, h = 300;
            this.sp.graphics.drawRect(0, 0, w, h, "#FF7F50");
            this.sp.size(w, h);
            this.sp.pivot(w / 2, h / 2);
            this.sp.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.addChild(this.sp);
            this.sp.on(Event$e.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown(e) {
            var touches = e.touches;
            if (touches && touches.length == 2) {
                this.lastDistance = this.getDistance(touches);
                Laya.stage.on(Event$e.MOUSE_MOVE, this, this.onMouseMove);
            }
        }
        onMouseMove(e) {
            if (!this.isShow) {
                return;
            }
            var distance = this.getDistance(e.touches);
            const factor = 0.01;
            this.sp.scaleX += (distance - this.lastDistance) * factor;
            this.sp.scaleY += (distance - this.lastDistance) * factor;
            this.lastDistance = distance;
        }
        onMouseUp(e) {
            if (!this.isShow) {
                return;
            }
            Laya.stage.off(Event$e.MOUSE_MOVE, this, this.onMouseMove);
        }
        getDistance(points) {
            var distance = 0;
            if (points && points.length == 2) {
                var dx = points[0].stageX - points[1].stageX;
                var dy = points[0].stageY - points[1].stageY;
                distance = Math.sqrt(dx * dx + dy * dy);
            }
            return distance;
        }
    }

    var Sprite$q = Laya.Sprite;
    var Event$f = Laya.Event;
    var Tween$6 = Laya.Tween;
    class Interaction_Swipe extends SingletonScene {
        constructor() {
            super();
            this.TrackLength = 200;
            this.TOGGLE_DIST = this.TrackLength / 2;
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createSprtie();
            this.drawTrack();
        }
        createSprtie() {
            const w = 50;
            const h = 30;
            this.button = new Sprite$q();
            this.button.graphics.drawRect(0, 0, w, h, "#FF7F50");
            this.button.pivot(w / 2, h / 2);
            this.button.size(w, h);
            this.button.x = (Laya.stage.width - this.TrackLength) / 2;
            this.button.y = Laya.stage.height / 2;
            this.button.on(Event$f.MOUSE_DOWN, this, this.onMouseDown);
            this.addChild(this.button);
            this.beginPosition = this.button.x;
            this.endPosition = this.beginPosition + this.TrackLength;
        }
        drawTrack() {
            var graph = new Sprite$q();
            this.graphics.drawLine(this.beginPosition, Laya.stage.height / 2, this.endPosition, Laya.stage.height / 2, "#FFFFFF", 20);
            this.addChild(graph);
        }
        onMouseDown(e) {
            Laya.stage.on(Event$f.MOUSE_MOVE, this, this.onMouseMove);
            this.buttonPosition = this.button.x;
            Laya.stage.on(Event$f.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Event$f.MOUSE_OUT, this, this.onMouseUp);
        }
        onMouseMove(e) {
            if (!this.isShow) {
                return;
            }
            this.button.x = Math.max(Math.min(Laya.stage.mouseX, this.endPosition), this.beginPosition);
        }
        onMouseUp(e) {
            if (!this.isShow) {
                return;
            }
            Laya.stage.off(Event$f.MOUSE_MOVE, this, this.onMouseMove);
            Laya.stage.off(Event$f.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.off(Event$f.MOUSE_OUT, this, this.onMouseUp);
            var dist = Laya.stage.mouseX - this.buttonPosition;
            var targetX = this.beginPosition;
            if (dist > this.TOGGLE_DIST)
                targetX = this.endPosition;
            Tween$6.to(this.button, { x: targetX }, 100);
        }
    }

    var Sprite$r = Laya.Sprite;
    var Event$g = Laya.Event;
    var Ease$3 = Laya.Ease;
    var Tween$7 = Laya.Tween;
    class Interaction_CustomEvent extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.createSprite();
        }
        createSprite() {
            this.sp = new Sprite$r();
            this.sp.graphics.drawRect(0, 0, 200, 200, "#D2691E");
            this.sp.pivot(100, 100);
            this.sp.x = Laya.stage.width / 2;
            this.sp.y = Laya.stage.height / 2;
            this.sp.size(200, 200);
            this.addChild(this.sp);
            this.sp.on(Interaction_CustomEvent.ROTATE, this, this.onRotate);
            this.sp.on(Event$g.CLICK, this, this.onSpriteClick);
        }
        onSpriteClick(e) {
            if (!this.isShow) {
                return;
            }
            var randomAngle = Math.random() * 180;
            this.sp.event(Interaction_CustomEvent.ROTATE, [randomAngle]);
        }
        onRotate(newAngle) {
            if (!this.isShow) {
                return;
            }
            Tween$7.to(this.sp, { "rotation": newAngle }, 1000, Ease$3.elasticOut);
        }
    }
    Interaction_CustomEvent.ROTATE = "rotate";

    var Text$d = Laya.Text;
    var Event$h = Laya.Event;
    class Interaction_Keyboard extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.listenKeyboard();
            this.createLogger();
            Laya.timer.frameLoop(1, this, this.keyboardInspector);
        }
        listenKeyboard() {
            this.keyDownList = [];
            Laya.stage.on(Event$h.KEY_DOWN, this, this.onKeyDown);
            Laya.stage.on(Event$h.KEY_UP, this, this.onKeyUp);
        }
        onKeyDown(e) {
            if (!this.isShow) {
                return;
            }
            var keyCode = e["keyCode"];
            this.keyDownList[keyCode] = true;
        }
        onKeyUp(e) {
            if (!this.isShow) {
                return;
            }
            delete this.keyDownList[e["keyCode"]];
        }
        keyboardInspector() {
            if (!this.isShow) {
                return;
            }
            var numKeyDown = this.keyDownList.length;
            var newText = '[ ';
            for (var i = 0; i < numKeyDown; i++) {
                if (this.keyDownList[i]) {
                    newText += i + " ";
                }
            }
            newText += ']';
            this.logger.changeText(newText);
        }
        createLogger() {
            this.logger = new Text$d();
            this.logger.size(Laya.stage.width, Laya.stage.height);
            this.logger.fontSize = 30;
            this.logger.font = "SimHei";
            this.logger.wordWrap = true;
            this.logger.color = "#FFFFFF";
            this.logger.align = 'center';
            this.logger.valign = 'middle';
            this.addChild(this.logger);
        }
    }

    var Sprite$s = Laya.Sprite;
    var Text$e = Laya.Text;
    var Event$i = Laya.Event;
    class Interaction_Mouse extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.createInteractiveTarget();
            this.createLogger();
        }
        createInteractiveTarget() {
            var rect = new Sprite$s();
            rect.graphics.drawRect(0, 0, 200, 200, "#D2691E");
            rect.size(200, 200);
            rect.x = (Laya.stage.width - 200) / 2;
            rect.y = (Laya.stage.height - 200) / 2;
            this.addChild(rect);
            rect.on(Event$i.MOUSE_DOWN, this, this.mouseHandler);
            rect.on(Event$i.MOUSE_UP, this, this.mouseHandler);
            rect.on(Event$i.CLICK, this, this.mouseHandler);
            rect.on(Event$i.RIGHT_MOUSE_DOWN, this, this.mouseHandler);
            rect.on(Event$i.RIGHT_MOUSE_UP, this, this.mouseHandler);
            rect.on(Event$i.RIGHT_CLICK, this, this.mouseHandler);
            rect.on(Event$i.MOUSE_MOVE, this, this.mouseHandler);
            rect.on(Event$i.MOUSE_OVER, this, this.mouseHandler);
            rect.on(Event$i.MOUSE_OUT, this, this.mouseHandler);
            rect.on(Event$i.DOUBLE_CLICK, this, this.mouseHandler);
            rect.on(Event$i.MOUSE_WHEEL, this, this.mouseHandler);
        }
        mouseHandler(e) {
            if (!this.isShow) {
                return;
            }
            switch (e.type) {
                case Event$i.MOUSE_DOWN:
                    this.appendText("\n————————\n左键按下");
                    break;
                case Event$i.MOUSE_UP:
                    this.appendText("\n左键抬起");
                    break;
                case Event$i.CLICK:
                    this.appendText("\n左键点击\n————————");
                    break;
                case Event$i.RIGHT_MOUSE_DOWN:
                    this.appendText("\n————————\n右键按下");
                    break;
                case Event$i.RIGHT_MOUSE_UP:
                    this.appendText("\n右键抬起");
                    break;
                case Event$i.RIGHT_CLICK:
                    this.appendText("\n右键单击\n————————");
                    break;
                case Event$i.MOUSE_MOVE:
                    if (/鼠标移动\.*$/.test(this.txt.text))
                        this.appendText(".");
                    else
                        this.appendText("\n鼠标移动");
                    break;
                case Event$i.MOUSE_OVER:
                    this.appendText("\n鼠标经过目标");
                    break;
                case Event$i.MOUSE_OUT:
                    this.appendText("\n鼠标移出目标");
                    break;
                case Event$i.DOUBLE_CLICK:
                    this.appendText("\n鼠标左键双击\n————————");
                    break;
                case Event$i.MOUSE_WHEEL:
                    this.appendText("\n鼠标滚轮滚动");
                    break;
            }
        }
        appendText(value) {
            this.txt.text += value;
            this.txt.scrollY = this.txt.maxScrollY;
        }
        createLogger() {
            this.txt = new Text$e();
            this.txt.overflow = Text$e.SCROLL;
            this.txt.text = "请把鼠标移到到矩形方块,左右键操作触发相应事件\n";
            this.txt.size(Laya.stage.width - 100, Laya.stage.height - 100);
            this.txt.pos(10, 50);
            this.txt.fontSize = 20;
            this.txt.wordWrap = true;
            this.txt.color = "#FFFFFF";
            this.addChild(this.txt);
        }
    }

    var Sprite$t = Laya.Sprite;
    var Text$f = Laya.Text;
    var Event$j = Laya.Event;
    class Interaction_FixInteractiveRegion extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            this.buildWorld();
            this.createLogger();
        }
        buildWorld() {
            this.createCoralRect();
            this.createDeepSkyblueRect();
            this.createDarkOrchidRect();
            this.name = "暗灰色舞台";
            Laya.stage.on(Event$j.MOUSE_DOWN, this, this.onDown);
        }
        createCoralRect() {
            var coralRect = new Sprite$t();
            coralRect.graphics.drawRect(0, 0, Laya.stage.width - 100, Laya.stage.height / 2, "#FF7F50");
            coralRect.name = "珊瑚色容器";
            coralRect.size(Laya.stage.width - 100, Laya.stage.height / 2);
            this.addChild(coralRect);
            coralRect.on(Event$j.MOUSE_DOWN, this, this.onDown);
        }
        createDeepSkyblueRect() {
            var deepSkyblueRect = new Sprite$t();
            deepSkyblueRect.graphics.drawRect(0, 0, 100, 100, "#00BFFF");
            deepSkyblueRect.name = "天蓝色矩形";
            deepSkyblueRect.size(100, 100);
            deepSkyblueRect.pos(10, 10);
            this.addChild(deepSkyblueRect);
            deepSkyblueRect.on(Event$j.MOUSE_DOWN, this, this.onDown);
        }
        createDarkOrchidRect() {
            var darkOrchidRect = new Sprite$t();
            darkOrchidRect.name = "暗紫色矩形容器";
            darkOrchidRect.graphics.drawRect(-100, -100, 200, 200, "#9932CC");
            darkOrchidRect.pos(Laya.stage.width / 2, Laya.stage.height / 2);
            this.addChild(darkOrchidRect);
            darkOrchidRect.mouseThrough = true;
            darkOrchidRect.on(Event$j.MOUSE_DOWN, this, this.onDown);
        }
        createLogger() {
            this.logger = new Text$f();
            this.logger.size(Laya.stage.width - 100, Laya.stage.height - 100);
            this.logger.align = 'right';
            this.logger.fontSize = 20;
            this.logger.color = "#FFFFFF";
            this.addChild(this.logger);
        }
        onDown(e) {
            if (!this.isShow) {
                return;
            }
            this.logger.text += "点击 - " + e.target.name + "\n";
        }
    }

    class InteractionMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "Hold", "拖动", "双指旋转", "双指缩放",
                "滑动", "自定义事件", "键盘交互", "鼠标交互", "修正交互区域"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Interaction_Hold.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Interaction_Drag.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Interaction_Rotate.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Interaction_Scale.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Interaction_Swipe.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    Interaction_CustomEvent.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    Interaction_Keyboard.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    Interaction_Mouse.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    Interaction_FixInteractiveRegion.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$u = Laya.Sprite;
    var Animation$2 = Laya.Animation;
    var Text$g = Laya.Text;
    var Event$k = Laya.Event;
    class Loader_ClearTextureRes extends SingletonScene {
        constructor() {
            super();
            this.isDestroyed = false;
            this.PathBg = "res/bg2.png";
            this.PathFly = "res/fighter/fighter.atlas";
            Laya.stage.addChild(this);
            this.init();
        }
        init() {
            this.spBg = Sprite$u.fromImage(this.PathBg);
            this.addChild(this.spBg);
            this.aniFly = new Animation$2();
            this.aniFly.loadAtlas(this.PathFly);
            this.aniFly.play();
            this.aniFly.pos(250, 100);
            this.addChild(this.aniFly);
            this.btn = new Sprite$u().size(205, 55);
            this.btn.graphics.drawRect(0, 0, this.btn.width, this.btn.height, "#057AFB");
            this.txt = new Text$g();
            this.txt.text = "销毁";
            this.txt.pos(75, 15);
            this.txt.fontSize = 25;
            this.txt.color = "#FF0000";
            this.btn.addChild(this.txt);
            this.btn.pos(20, 160);
            this.addChild(this.btn);
            this.btn.on(Event$k.MOUSE_UP, this, this.onMouseUp);
        }
        onMouseUp(evt) {
            if (this.isDestroyed) {
                this.spBg.visible = true;
                this.aniFly.visible = true;
                this.isDestroyed = false;
                this.txt.text = "销毁";
            }
            else {
                this.spBg.visible = false;
                this.aniFly.visible = false;
                Laya.loader.clearTextureRes(this.PathBg);
                Laya.loader.clearTextureRes(this.PathFly);
                this.isDestroyed = true;
                this.txt.text = "恢复";
            }
        }
    }

    var Image$4 = Laya.Image;
    var Handler$w = Laya.Handler;
    class Loader_SingleType extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            Laya.loader.load("res/apes/monkey0.png", Handler$w.create(this, this.onAssetLoaded1));
            Laya.loader.load(["res/apes/monkey0.png", "res/apes/monkey1.png", "res/apes/monkey2.png"], Handler$w.create(this, this.onAssetLoaded2));
        }
        onAssetLoaded1() {
            var pic1 = new Image$4("res/apes/monkey0.png");
            pic1.x = 200;
            pic1.y = 300;
            this.addChild(pic1);
        }
        onAssetLoaded2() {
            var pic1 = new Image$4("res/apes/monkey0.png");
            pic1.x = 50;
            var pic2 = new Image$4("res/apes/monkey1.png");
            pic2.x = 100;
            var pic3 = new Image$4("res/apes/monkey2.png");
            pic3.x = 150;
            this.addChild(pic1);
            this.addChild(pic2);
            this.addChild(pic3);
        }
    }

    var Loader$3 = Laya.Loader;
    var Handler$x = Laya.Handler;
    var Image$5 = Laya.Image;
    class Loader_MultipleType extends SingletonScene {
        constructor() {
            super();
            this.ROBOT_DATA_PATH = "res/skeleton/robot/robot.bin";
            this.ROBOT_TEXTURE_PATH = "res/skeleton/robot/texture.png";
            Laya.stage.addChild(this);
            var assets = [];
            assets.push({ url: this.ROBOT_DATA_PATH, type: Loader$3.BUFFER });
            assets.push({ url: this.ROBOT_TEXTURE_PATH, type: Loader$3.IMAGE });
            Laya.loader.load(assets, Handler$x.create(this, this.onAssetsLoaded));
        }
        onAssetsLoaded() {
            var robotData = Loader$3.getRes(this.ROBOT_DATA_PATH);
            var robotTexture = Loader$3.getRes(this.ROBOT_TEXTURE_PATH);
            var img = new Image$5(this.ROBOT_TEXTURE_PATH);
            this.addChild(img);
        }
    }

    var Handler$y = Laya.Handler;
    class Loader_Sequence extends SingletonScene {
        constructor() {
            super();
            this.numLoaded = 0;
            this.resAmount = 3;
            Laya.stage.addChild(this);
            Laya.loader.maxLoader = 1;
            Laya.loader.load("res/apes/monkey2.png", Handler$y.create(this, this.onAssetLoaded), null, null, 0, false);
            Laya.loader.load("res/apes/monkey1.png", Handler$y.create(this, this.onAssetLoaded), null, null, 1, false);
            Laya.loader.load("res/apes/monkey0.png", Handler$y.create(this, this.onAssetLoaded), null, null, 2, false);
        }
        onAssetLoaded(texture) {
            if (!this.isShow) {
                return;
            }
            if (++this.numLoaded == this.resAmount) {
                Laya.loader.maxLoader = 5;
                console.log("All done.");
            }
        }
    }

    var Event$l = Laya.Event;
    var Loader$4 = Laya.Loader;
    var Handler$z = Laya.Handler;
    class Loader_ProgressAndErrorHandle extends SingletonScene {
        constructor() {
            super();
            Laya.loader.retryNum = 0;
            var urls = ["do not exist", "res/fighter/fighter.png", "res/legend/map.jpg"];
            Laya.loader.load(urls, Handler$z.create(this, this.onAssetLoaded), Handler$z.create(this, this.onLoading, null, false), Loader$4.TEXT);
            Laya.loader.on(Event$l.ERROR, this, this.onError);
        }
        onAssetLoaded(texture) {
            if (!this.isShow) {
                return;
            }
            console.log("加载结束");
        }
        onLoading(progress) {
            if (!this.isShow) {
                return;
            }
            console.log("加载进度: " + progress);
        }
        onError(err) {
            if (!this.isShow) {
                return;
            }
            console.log("加载失败: " + err);
        }
    }

    class LoaderMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "销毁Texture", "单一资源加载", "多种资源加载", "加载序列", "错误处理和进度"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Loader_ClearTextureRes.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Loader_SingleType.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Loader_MultipleType.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Loader_Sequence.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Loader_ProgressAndErrorHandle.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Stage = Laya.Stage;
    var Text$h = Laya.Text;
    var Image$6 = Laya.Image;
    var WebGL = Laya.WebGL;
    class SmartScale_T extends SingletonScene {
        constructor() {
            super();
            this.modes = ["noscale", "exactfit", "showall", "noborder", "full", "fixedwidth", "fixedheight"];
            this.index = 0;
            this.bg = new Image$6();
            this.bg.skin = "res/bg.jpg";
            Laya.stage.addChild(this.bg);
            this.txt = new Text$h();
            this.txt.text = "点击我切换适配模式(noscale)";
            this.txt.bold = true;
            this.txt.pos(0, 200);
            this.txt.fontSize = 30;
            this.txt.on("click", this, this.onTxtClick);
            Laya.stage.addChild(this.txt);
            this.boy1 = new Image$6();
            this.boy1.skin = "res/cartoonCharacters/1.png";
            this.boy1.top = 0;
            this.boy1.right = 0;
            this.boy1.on("click", this, this.onBoyClick);
            Laya.stage.addChild(this.boy1);
            this.boy2 = new Image$6();
            this.boy2.skin = "res/cartoonCharacters/2.png";
            this.boy2.bottom = 0;
            this.boy2.right = 0;
            this.boy2.on("click", this, this.onBoyClick);
            Laya.stage.addChild(this.boy2);
            Laya.stage.on("click", this, this.onClick);
            Laya.stage.on("resize", this, this.onResize);
        }
        ChangeLayaConfig() {
            Laya.init(1136, 640, WebGL);
            Laya.stage.scaleMode = "noscale";
            Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;
            Laya.stage.alignH = "center";
            Laya.stage.alignV = "middle";
        }
        SetLayaConfigDefault() {
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
        }
        onBoyClick(e) {
            if (!this.isShow) {
                return;
            }
            var boy = e.target;
            if (boy.scaleX === 1) {
                boy.scale(1.2, 1.2);
            }
            else {
                boy.scale(1, 1);
            }
        }
        onTxtClick(e) {
            if (!this.isShow) {
                return;
            }
            e.stopPropagation();
            this.index++;
            if (this.index >= this.modes.length)
                this.index = 0;
            Laya.stage.scaleMode = this.modes[this.index];
            this.txt.text = "点击我切换适配模式" + "(" + this.modes[this.index] + ")";
        }
        onClick(e) {
            if (!this.isShow) {
                return;
            }
            console.log("mouse:", Laya.stage.mouseX, Laya.stage.mouseY);
        }
        onResize() {
            if (!this.isShow) {
                return;
            }
            console.log("size:", Laya.stage.width, Laya.stage.height);
        }
        Show() {
            this.ChangeLayaConfig();
            this.visible = true;
        }
        Hide() {
            this.SetLayaConfigDefault();
            this.visible = true;
        }
    }

    class SmartScaleMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "屏幕适配"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    SmartScale_T.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Stage$1 = Laya.Stage;
    var Text$i = Laya.Text;
    var Geolocation = Laya.Geolocation;
    var Browser$2 = Laya.Browser;
    var Handler$A = Laya.Handler;
    class InputDevice_Map {
        constructor() {
            this.BMap = Browser$2.window.BMap;
            this.convertor = new this.BMap.Convertor();
            Laya.init(Browser$2.width, 255);
            Laya.stage.scaleMode = Stage$1.SCALE_NOSCALE;
            this.createDom();
            this.initMap();
            this.createInfoText();
            var successHandler = new Handler$A(this, this.updatePosition);
            var errorHandler = new Handler$A(this, this.onError);
            Geolocation.enableHighAccuracy = true;
            Geolocation.watchPosition(successHandler, errorHandler);
            this.convertToBaiduCoord = this.convertToBaiduCoord.bind(this);
        }
        createDom() {
            this.mapDiv = Browser$2.createElement("div");
            var style = this.mapDiv.style;
            style.position = "absolute";
            style.top = Laya.stage.height / Browser$2.pixelRatio + "px";
            style.left = "0px";
            style.width = Browser$2.width / Browser$2.pixelRatio + "px";
            style.height = (Browser$2.height - Laya.stage.height) / Browser$2.pixelRatio + "px";
            Browser$2.document.body.appendChild(this.mapDiv);
        }
        initMap() {
            this.map = new this.BMap.Map(this.mapDiv);
            this.map.disableKeyboard();
            this.map.disableScrollWheelZoom();
            this.map.disableDoubleClickZoom();
            this.map.disablePinchToZoom();
            this.map.centerAndZoom(new this.BMap.Point(116.32715863448607, 39.990912172420714), 15);
            this.marker = new this.BMap.Marker(new this.BMap.Point(0, 0));
            this.map.addOverlay(this.marker);
            var label = new this.BMap.Label("当前位置", { offset: new this.BMap.Size(-15, 30) });
            this.marker.setLabel(label);
        }
        createInfoText() {
            this.infoText = new Text$i();
            Laya.stage.addChild(this.infoText);
            this.infoText.fontSize = 15;
            this.infoText.color = "#FFFFFF";
            this.infoText.size(Laya.stage.width, Laya.stage.height);
        }
        updatePosition(p) {
            var point = new this.BMap.Point(p.longitude, p.latitude);
            this.convertor.translate([point], 1, 5, this.convertToBaiduCoord);
            this.infoText.text =
                "经度：" + p.longitude +
                    "\t纬度：" + p.latitude +
                    "\t精度：" + p.accuracy +
                    "\n海拔：" + p.altitude +
                    "\t海拔精度：" + p.altitudeAccuracy +
                    "\n头：" + p.heading +
                    "\n速度：" + p.speed +
                    "\n时间戳：" + p.timestamp;
        }
        convertToBaiduCoord(data) {
            if (data.status == 0) {
                var position = data.points[0];
                this.marker.setPosition(position);
                this.map.panTo(position);
                this.map.setZoom(17);
            }
        }
        onError(e) {
            if (e.code == Geolocation.TIMEOUT)
                alert("获取位置超时");
            else if (e.code == Geolocation.POSITION_UNAVAILABLE)
                alert("位置不可用");
            else if (e.code == Geolocation.PERMISSION_DENIED)
                alert("无权限");
        }
    }

    var Sprite$v = Laya.Sprite;
    var Stage$2 = Laya.Stage;
    var Text$j = Laya.Text;
    var Gyroscope = Laya.Gyroscope;
    var Browser$3 = Laya.Browser;
    var Handler$B = Laya.Handler;
    var WebGL$1 = Laya.WebGL;
    var Event$m = Laya.Event;
    class InputDevice_Compasss {
        constructor() {
            this.compassImgPath = "res/inputDevice/kd.png";
            this.firstTime = true;
            Laya.init(700, 1024, WebGL$1);
            Laya.stage.scaleMode = Stage$2.SCALE_SHOWALL;
            Laya.stage.alignH = Stage$2.ALIGN_CENTER;
            Laya.stage.alignV = Stage$2.ALIGN_MIDDLE;
            Laya.loader.load(this.compassImgPath, Handler$B.create(this, this.init));
        }
        init() {
            this.createCompass();
            this.createDirectionIndicator();
            this.drawUI();
            this.createDegreesText();
            Gyroscope.instance.on(Event$m.CHANGE, this, this.onOrientationChange);
        }
        createCompass() {
            this.compassImg = new Sprite$v();
            Laya.stage.addChild(this.compassImg);
            this.compassImg.loadImage(this.compassImgPath);
            this.compassImg.pivot(this.compassImg.width / 2, this.compassImg.height / 2);
            this.compassImg.pos(Laya.stage.width / 2, 400);
        }
        drawUI() {
            var canvas = new Sprite$v();
            Laya.stage.addChild(canvas);
            canvas.graphics.drawLine(this.compassImg.x, 50, this.compassImg.x, 182, "#FFFFFF", 3);
            canvas.graphics.drawLine(-140 + this.compassImg.x, this.compassImg.y, 140 + this.compassImg.x, this.compassImg.y, "#AAAAAA", 1);
            canvas.graphics.drawLine(this.compassImg.x, -140 + this.compassImg.y, this.compassImg.x, 140 + this.compassImg.y, "#AAAAAA", 1);
        }
        createDegreesText() {
            this.degreesText = new Text$j();
            Laya.stage.addChild(this.degreesText);
            this.degreesText.align = "center";
            this.degreesText.size(Laya.stage.width, 100);
            this.degreesText.pos(0, this.compassImg.y + 400);
            this.degreesText.fontSize = 100;
            this.degreesText.color = "#FFFFFF";
        }
        createDirectionIndicator() {
            this.directionIndicator = new Sprite$v();
            Laya.stage.addChild(this.directionIndicator);
            this.directionIndicator.alpha = 0.8;
            this.directionIndicator.graphics.drawCircle(0, 0, 70, "#343434");
            this.directionIndicator.graphics.drawLine(-40, 0, 40, 0, "#FFFFFF", 3);
            this.directionIndicator.graphics.drawLine(0, -40, 0, 40, "#FFFFFF", 3);
            this.directionIndicator.x = this.compassImg.x;
            this.directionIndicator.y = this.compassImg.y;
        }
        onOrientationChange(absolute, info) {
            if (info.alpha === null) {
                alert("当前设备不支持陀螺仪。");
            }
            else if (this.firstTime && !absolute && !Browser$3.onIOS) {
                this.firstTime = false;
                alert("在当前设备中无法获取地球坐标系，使用设备坐标系，你可以继续观赏，但是提供的方位并非正确方位。");
            }
            this.degreesText.text = 360 - Math.floor(info.alpha) + "°";
            this.compassImg.rotation = info.alpha;
            this.directionIndicator.x = -1 * Math.floor(info.gamma) / 90 * 70 + this.compassImg.x;
            this.directionIndicator.y = -1 * Math.floor(info.beta) / 90 * 70 + this.compassImg.y;
        }
    }

    var Sprite$w = Laya.Sprite;
    var Stage$3 = Laya.Stage;
    var Text$k = Laya.Text;
    var Shake = Laya.Shake;
    var Browser$4 = Laya.Browser;
    var Event$n = Laya.Event;
    class InputDevice_Shake {
        constructor() {
            this.picW = 484;
            this.picH = 484;
            this.shakeCount = 0;
            Laya.init(this.picW, Browser$4.height * this.picW / Browser$4.width);
            Laya.stage.scaleMode = Stage$3.SCALE_SHOWALL;
            this.showShakePic();
            this.showConsoleText();
            this.startShake();
        }
        showShakePic() {
            var shakePic = new Sprite$w();
            shakePic.loadImage("res/inputDevice/shake.png");
            Laya.stage.addChild(shakePic);
        }
        showConsoleText() {
            this.console = new Text$k();
            Laya.stage.addChild(this.console);
            this.console.y = this.picH + 10;
            this.console.width = Laya.stage.width;
            this.console.height = Laya.stage.height - this.console.y;
            this.console.color = "#FFFFFF";
            this.console.fontSize = 50;
            this.console.align = "center";
            this.console.valign = 'middle';
            this.console.leading = 10;
        }
        startShake() {
            Shake.instance.start(5, 500);
            Shake.instance.on(Event$n.CHANGE, this, this.callback);
            this.console.text = '开始接收设备摇动\n';
        }
        callback() {
            this.shakeCount++;
            this.console.text += "设备摇晃了" + this.shakeCount + "次\n";
            if (this.shakeCount >= 3) {
                Shake.instance.stop();
                this.console.text += "停止接收设备摇动";
            }
        }
    }

    var Sprite$x = Laya.Sprite;
    var Accelerator = Laya.Accelerator;
    var Point$1 = Laya.Point;
    var Browser$5 = Laya.Browser;
    var WebGL$2 = Laya.WebGL;
    var Event$o = Laya.Event;
    class InputDevice_GluttonousSnake {
        constructor() {
            this.segments = [];
            this.foods = [];
            this.initialSegmentsAmount = 5;
            this.vx = 0;
            this.vy = 0;
            Laya.init(Browser$5.width, Browser$5.height, WebGL$2);
            this.initSnake();
            Accelerator.instance.on(Event$o.CHANGE, this, this.monitorAccelerator);
            Laya.timer.frameLoop(1, this, this.animate);
            Laya.timer.loop(3000, this, this.produceFood);
            this.produceFood();
        }
        initSnake() {
            for (var i = 0; i < this.initialSegmentsAmount; i++) {
                this.addSegment();
                if (i == 0) {
                    var header = this.segments[0];
                    header.rotation = 180;
                    this.targetPosition = new Point$1();
                    this.targetPosition.x = Laya.stage.width / 2;
                    this.targetPosition.y = Laya.stage.height / 2;
                    header.pos(this.targetPosition.x + header.width, this.targetPosition.y);
                    header.graphics.drawCircle(header.width, 5, 3, "#000000");
                    header.graphics.drawCircle(header.width, -5, 3, "#000000");
                }
            }
        }
        monitorAccelerator(acceleration, accelerationIncludingGravity, rotationRate, interval) {
            this.vx = accelerationIncludingGravity.x;
            this.vy = accelerationIncludingGravity.y;
        }
        addSegment() {
            var seg = new Segment(40, 30);
            Laya.stage.addChildAt(seg, 0);
            if (this.segments.length > 0) {
                var prevSeg = this.segments[this.segments.length - 1];
                seg.rotation = prevSeg.rotation;
                var point = seg.getPinPosition();
                seg.x = prevSeg.x - point.x;
                seg.y = prevSeg.y - point.y;
            }
            this.segments.push(seg);
        }
        animate() {
            var seg = this.segments[0];
            this.targetPosition.x += this.vx;
            this.targetPosition.y += this.vy;
            this.limitMoveRange();
            this.checkEatFood();
            var targetX = this.targetPosition.x;
            var targetY = this.targetPosition.y;
            for (var i = 0, len = this.segments.length; i < len; i++) {
                seg = this.segments[i];
                var dx = targetX - seg.x;
                var dy = targetY - seg.y;
                var radian = Math.atan2(dy, dx);
                seg.rotation = radian * 180 / Math.PI;
                var pinPosition = seg.getPinPosition();
                var w = pinPosition.x - seg.x;
                var h = pinPosition.y - seg.y;
                seg.x = targetX - w;
                seg.y = targetY - h;
                targetX = seg.x;
                targetY = seg.y;
            }
        }
        limitMoveRange() {
            if (this.targetPosition.x < 0)
                this.targetPosition.x = 0;
            else if (this.targetPosition.x > Laya.stage.width)
                this.targetPosition.x = Laya.stage.width;
            if (this.targetPosition.y < 0)
                this.targetPosition.y = 0;
            else if (this.targetPosition.y > Laya.stage.height)
                this.targetPosition.y = Laya.stage.height;
        }
        checkEatFood() {
            var food;
            for (var i = this.foods.length - 1; i >= 0; i--) {
                food = this.foods[i];
                if (food.hitTestPoint(this.targetPosition.x, this.targetPosition.y)) {
                    this.addSegment();
                    Laya.stage.removeChild(food);
                    this.foods.splice(i, 1);
                }
            }
        }
        produceFood() {
            if (this.foods.length == 5)
                return;
            var food = new Sprite$x();
            Laya.stage.addChild(food);
            this.foods.push(food);
            const foodSize = 40;
            food.size(foodSize, foodSize);
            food.graphics.drawRect(0, 0, foodSize, foodSize, "#00BFFF");
            food.x = Math.random() * Laya.stage.width;
            food.y = Math.random() * Laya.stage.height;
        }
    }
    class Segment extends Sprite$x {
        constructor(width, height) {
            super();
            this.size(width, height);
            this.init();
        }
        init() {
            this.graphics.drawRect(-this.height / 2, -this.height / 2, this.width + this.height, this.height, "#FF7F50");
        }
        getPinPosition() {
            var radian = this.rotation * Math.PI / 180;
            var tx = this.x + Math.cos(radian) * this.width;
            var ty = this.y + Math.sin(radian) * this.width;
            return new Point$1(tx, ty);
        }
    }

    class InputDeviceMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "地图", "指南针", "摇一摇", "贪吃蛇"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    new InputDevice_Map();
                    break;
                case this.btnNameArr[2]:
                    new InputDevice_Compasss();
                    break;
                case this.btnNameArr[3]:
                    new InputDevice_Shake();
                    break;
                case this.btnNameArr[4]:
                    new InputDevice_GluttonousSnake();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Text$l = Laya.Text;
    var Event$p = Laya.Event;
    var HttpRequest = Laya.HttpRequest;
    class Network_POST extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.connect();
            this.showLogger();
        }
        connect() {
            this.hr = new HttpRequest();
            this.hr.once(Event$p.PROGRESS, this, this.onHttpRequestProgress);
            this.hr.once(Event$p.COMPLETE, this, this.onHttpRequestComplete);
            this.hr.once(Event$p.ERROR, this, this.onHttpRequestError);
            this.hr.send('https://www.baidu.com/', '', 'post', 'Content-Type:application/json');
        }
        showLogger() {
            this.logger = new Text$l();
            this.logger.fontSize = 30;
            this.logger.color = "#FFFFFF";
            this.logger.align = 'center';
            this.logger.valign = 'middle';
            this.logger.size(Laya.stage.width, Laya.stage.height);
            this.logger.text = "等待响应...\n";
            this.addChild(this.logger);
        }
        onHttpRequestError(e) {
            console.log(e);
        }
        onHttpRequestProgress(e) {
            console.log(e);
        }
        onHttpRequestComplete(e) {
            this.logger.text += "收到数据：" + this.hr.data;
        }
    }

    var Text$m = Laya.Text;
    var Event$q = Laya.Event;
    var HttpRequest$1 = Laya.HttpRequest;
    class Network_GET extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.connect();
            this.showLogger();
        }
        connect() {
            this.hr = new HttpRequest$1();
            this.hr.once(Event$q.PROGRESS, this, this.onHttpRequestProgress);
            this.hr.once(Event$q.COMPLETE, this, this.onHttpRequestComplete);
            this.hr.once(Event$q.ERROR, this, this.onHttpRequestError);
            this.hr.send('https://www.baidu.com/', null, 'get', 'Content-Type:application/json');
        }
        showLogger() {
            this.logger = new Text$m();
            this.logger.fontSize = 30;
            this.logger.color = "#FFFFFF";
            this.logger.align = 'center';
            this.logger.valign = 'middle';
            this.logger.size(Laya.stage.width, Laya.stage.height);
            this.logger.text = "等待响应...\n";
            this.addChild(this.logger);
        }
        onHttpRequestError(e) {
            console.log(e);
        }
        onHttpRequestProgress(e) {
            console.log(e);
        }
        onHttpRequestComplete(e) {
            this.logger.text += "收到数据：" + this.hr.data;
        }
    }

    var Utils$1 = Laya.Utils;
    class Network_XML extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.setup();
        }
        setup() {
            var xmlValueContainsError = "<root><item>item a</item><item>item b</item>somethis...</root1>";
            var xmlValue = "<root><item>item a</item><item>item b</item>somethings...</root>";
            this.proessXML(xmlValueContainsError);
            console.log("\n");
            this.proessXML(xmlValue);
        }
        proessXML(source) {
            try {
                var xml = Utils$1.parseXMLFromString(source);
            }
            catch (e) {
                console.log(e.massage);
                return;
            }
            this.printDirectChildren(xml);
        }
        printDirectChildren(xml) {
            var rootNode = xml.firstChild;
            var nodes = rootNode.childNodes;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.nodeType == 1) {
                    console.log("节点名称: " + node.nodeName);
                    console.log("元素节点，第一个子节点值为：" + node.firstChild.nodeValue);
                }
                else if (node.nodeType == 3) {
                    console.log("文本节点：" + node.nodeValue);
                }
                console.log("\n");
            }
        }
    }

    var Event$r = Laya.Event;
    var Socket = Laya.Socket;
    var Byte = Laya.Byte;
    class NetWork_Socket extends SingletonScene {
        constructor() {
            super();
            Laya.stage.addChild(this);
            this.connect();
        }
        connect() {
            this.socket = new Socket();
            this.socket.connectByUrl("ws://echo.websocket.org:80");
            this.output = this.socket.output;
            this.socket.on(Event$r.OPEN, this, this.onSocketOpen);
            this.socket.on(Event$r.CLOSE, this, this.onSocketClose);
            this.socket.on(Event$r.MESSAGE, this, this.onMessageReveived);
            this.socket.on(Event$r.ERROR, this, this.onConnectError);
        }
        onSocketOpen() {
            console.log("Connected");
            this.socket.send("demonstrate <sendString>");
            var message = "demonstrate <output.writeByte>";
            for (var i = 0; i < message.length; ++i) {
                this.output.writeByte(message.charCodeAt(i));
            }
            this.socket.flush();
        }
        onSocketClose() {
            console.log("Socket closed");
        }
        onMessageReveived(message) {
            console.log("Message from server:");
            if (typeof message == "string") {
                console.log(message);
            }
            else if (message instanceof ArrayBuffer) {
                console.log(new Byte(message).readUTFBytes());
            }
            this.socket.input.clear();
        }
        onConnectError(e) {
            console.log("error");
        }
    }

    var Browser$6 = Laya.Browser;
    class Network_ProtocolBuffer extends SingletonScene {
        constructor() {
            super();
            this.ProtoBuf = Browser$6.window.protobuf;
            Laya.stage.addChild(this);
            console.log(Browser$6.window.protobuf);
            this.ProtoBuf.load("res/protobuf/user.proto", this.onAssetsLoaded);
        }
        onAssetsLoaded(err, root) {
            if (err)
                throw err;
            console.log("proto name:", root.nested.template.Login.name);
        }
    }

    class NetworkMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "POST", "GET", "XML", "Socket", "ProtoBuffer"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    Network_POST.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Network_GET.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Network_XML.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    NetWork_Socket.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    Network_ProtocolBuffer.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class DOM_Form {
        constructor() {
            this.rowHeight = 30;
            this.rowSpacing = 10;
            Laya.init(600, 400);
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
            Laya.stage.bgColor = "#FFFFFF";
            this.form = new Laya.Sprite();
            this.form.size(250, 120);
            this.form.pos((Laya.stage.width - this.form.width) / 2, (Laya.stage.height - this.form.height) / 2);
            Laya.stage.addChild(this.form);
            var rowHeightDelta = this.rowSpacing + this.rowHeight;
            this.showLabel("邮箱", 0, rowHeightDelta * 0);
            this.showLabel("出生日期", 0, rowHeightDelta * 1);
            this.showLabel("密码", 0, rowHeightDelta * 2);
            var emailInput = this.createInputElement();
            var birthdayInput = this.createInputElement();
            var passwordInput = this.createInputElement();
            birthdayInput.type = "date";
            passwordInput.type = "password";
            Laya.stage.on(Laya.Event.RESIZE, this, this.fitDOMElements, [emailInput, birthdayInput, passwordInput]);
        }
        showLabel(label, x, y) {
            var t = new Laya.Text();
            t.height = this.rowHeight;
            t.valign = "middle";
            t.fontSize = 15;
            t.font = "SimHei";
            t.text = label;
            t.pos(x, y);
            this.form.addChild(t);
        }
        createInputElement() {
            var input = Laya.Browser.createElement("input");
            input.style.zIndex = Laya.Render.canvas.zIndex + 1;
            input.style.width = "100px";
            Laya.Browser.document.body.appendChild(input);
            return input;
        }
        fitDOMElements() {
            var dom;
            for (var i = 0; i < arguments.length; i++) {
                dom = arguments[i];
                Laya.Utils.fitDOMElementInArea(dom, this.form, 100, i * (this.rowSpacing + this.rowHeight), 150, this.rowHeight);
            }
        }
    }

    class DOM_Video {
        constructor() {
            Laya.init(800, 600);
            Laya.stage.bgColor = "#FFFFFF";
            Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
            Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
            var videoElement = Laya.Browser.createElement("video");
            Laya.Browser.document.body.appendChild(videoElement);
            videoElement.style.zIndex = Laya.Render.canvas.style.zIndex + 1;
            videoElement.src = "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4";
            videoElement.controls = true;
            videoElement.setAttribute("webkit-playsinline", true);
            videoElement.setAttribute("playsinline", true);
            var reference = new Laya.Sprite();
            Laya.stage.addChild(reference);
            reference.pos(100, 100);
            reference.size(600, 400);
            reference.graphics.drawRect(0, 0, reference.width, reference.height, "#CCCCCC");
            Laya.stage.on(Laya.Event.RESIZE, this, Laya.Utils.fitDOMElementInArea, [videoElement, reference, 0, 0, reference.width, reference.height]);
        }
    }

    class DOMMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "视频", "表单输入"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    new DOM_Video();
                    break;
                case this.btnNameArr[2]:
                    new DOM_Form();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Browser$7 = Laya.Browser;
    var Stat = Laya.Stat;
    class Debug_FPSStats {
        constructor() {
            Laya.init(Browser$7.clientWidth, Browser$7.clientHeight);
            Stat.show(Browser$7.clientWidth - 120 >> 1, Browser$7.clientHeight - 100 >> 1);
        }
    }

    class DebugMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "帧率统计"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    new Debug_FPSStats();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$y = Laya.Sprite;
    var Browser$8 = Laya.Browser;
    var Handler$C = Laya.Handler;
    var Stat$1 = Laya.Stat;
    var Rectangle$5 = Laya.Rectangle;
    var WebGL$3 = Laya.WebGL;
    class PerformanceTest_Maggots {
        constructor() {
            this.texturePath = "res/tinyMaggot.png";
            this.padding = 100;
            this.maggotAmount = 5000;
            this.tick = 0;
            this.maggots = [];
            Laya.init(Browser$8.width, Browser$8.height, WebGL$3);
            Laya.stage.bgColor = "#000000";
            Stat$1.show();
            this.wrapBounds = new Rectangle$5(-this.padding, -this.padding, Laya.stage.width + this.padding * 2, Laya.stage.height + this.padding * 2);
            Laya.loader.load(this.texturePath, Handler$C.create(this, this.onTextureLoaded));
        }
        onTextureLoaded() {
            this.maggotTexture = Laya.loader.getRes(this.texturePath);
            this.initMaggots();
            Laya.timer.frameLoop(1, this, this.animate);
        }
        initMaggots() {
            var maggotContainer;
            for (var i = 0; i < this.maggotAmount; i++) {
                if (i % 16000 == 0)
                    maggotContainer = this.createNewContainer();
                var maggot = this.newMaggot();
                maggotContainer.addChild(maggot);
                this.maggots.push(maggot);
            }
        }
        createNewContainer() {
            var container = new Sprite$y();
            container.size(Browser$8.clientWidth, Browser$8.clientHeight);
            Laya.stage.addChild(container);
            return container;
        }
        newMaggot() {
            var maggot = new Sprite$y();
            maggot.graphics.drawTexture(this.maggotTexture, 0, 0);
            maggot.pivot(16.5, 35);
            var rndScale = 0.8 + Math.random() * 0.3;
            maggot.scale(rndScale, rndScale);
            maggot.rotation = 0.1;
            maggot.x = Math.random() * Laya.stage.width;
            maggot.y = Math.random() * Laya.stage.height;
            maggot.direction = Math.random() * Math.PI;
            maggot.turningSpeed = Math.random() - 0.8;
            maggot.speed = (2 + Math.random() * 2) * 0.2;
            maggot.offset = Math.random() * 100;
            return maggot;
        }
        animate() {
            var maggot;
            var wb = this.wrapBounds;
            var angleUnit = 180 / Math.PI;
            var dir, x = 0.0, y = 0.0;
            for (var i = 0; i < this.maggotAmount; i++) {
                maggot = this.maggots[i];
                maggot.scaleY = 0.90 + Math.sin(this.tick + maggot.offset) * 0.1;
                maggot.direction += maggot.turningSpeed * 0.01;
                dir = maggot.direction;
                x = maggot.x;
                y = maggot.y;
                x += Math.sin(dir) * (maggot.speed * maggot.scaleY);
                y += Math.cos(dir) * (maggot.speed * maggot.scaleY);
                maggot.rotation = (-dir + Math.PI) * angleUnit;
                if (x < wb.x)
                    x += wb.width;
                else if (x > wb.x + wb.width)
                    x -= wb.width;
                if (y < wb.y)
                    y += wb.height;
                else if (y > wb.y + wb.height)
                    y -= wb.height;
                maggot.pos(x, y);
            }
            this.tick += 0.1;
        }
    }

    var Sprite$z = Laya.Sprite;
    var Loader$5 = Laya.Loader;
    var Browser$9 = Laya.Browser;
    var Handler$D = Laya.Handler;
    var Stat$2 = Laya.Stat;
    var WebGL$4 = Laya.WebGL;
    class PerformanceTest_Cartoon {
        constructor() {
            this.colAmount = 100;
            this.extraSpace = 50;
            this.moveSpeed = 2;
            this.rotateSpeed = 2;
            Laya.init(Browser$9.width, Browser$9.height, WebGL$4);
            Laya.stage.bgColor = "#232628";
            Stat$2.show();
            Laya.loader.load("res/cartoonCharacters/cartoonCharactors.json", Handler$D.create(this, this.createCharacters), null, Loader$5.ATLAS);
        }
        createCharacters() {
            this.characterGroup = [];
            for (var i = 0; i < this.colAmount; ++i) {
                var tx = (Laya.stage.width + this.extraSpace * 2) / this.colAmount * i - this.extraSpace;
                var tr = 360 / this.colAmount * i;
                var startY = (Laya.stage.height - 500) / 2;
                this.createCharacter("cartoonCharactors/1.png", 46, 50, tr).pos(tx, 50 + startY);
                this.createCharacter("cartoonCharactors/2.png", 34, 50, tr).pos(tx, 150 + startY);
                this.createCharacter("cartoonCharactors/3.png", 42, 50, tr).pos(tx, 250 + startY);
                this.createCharacter("cartoonCharactors/4.png", 48, 50, tr).pos(tx, 350 + startY);
                this.createCharacter("cartoonCharactors/5.png", 36, 50, tr).pos(tx, 450 + startY);
            }
            Laya.timer.frameLoop(1, this, this.animate);
        }
        createCharacter(skin, pivotX, pivotY, rotation) {
            var charactor = new Sprite$z();
            charactor.loadImage(skin);
            charactor.rotation = rotation;
            charactor.pivot(pivotX, pivotY);
            Laya.stage.addChild(charactor);
            this.characterGroup.push(charactor);
            return charactor;
        }
        animate() {
            for (var i = this.characterGroup.length - 1; i >= 0; --i) {
                this.animateCharactor(this.characterGroup[i]);
            }
        }
        animateCharactor(charactor) {
            charactor.x += this.moveSpeed;
            charactor.rotation += this.rotateSpeed;
            if (charactor.x > Laya.stage.width + this.extraSpace) {
                charactor.x = -this.extraSpace;
            }
        }
    }

    var Stage$4 = Laya.Stage;
    var Text$n = Laya.Text;
    var Stat$3 = Laya.Stat;
    var WebGL$5 = Laya.WebGL;
    var Animation$3 = Laya.Animation;
    var Sprite$A = Laya.Sprite;
    class PerformanceTest_Cartoon2 {
        constructor() {
            this.amount = 500;
            this.character1 = [
                "res/cartoon2/yd-6_01.png",
                "res/cartoon2/yd-6_02.png",
                "res/cartoon2/yd-6_03.png",
                "res/cartoon2/yd-6_04.png",
                "res/cartoon2/yd-6_05.png",
                "res/cartoon2/yd-6_06.png",
                "res/cartoon2/yd-6_07.png",
                "res/cartoon2/yd-6_08.png",
            ];
            this.character2 = [
                "res/cartoon2/yd-3_01.png",
                "res/cartoon2/yd-3_02.png",
                "res/cartoon2/yd-3_03.png",
                "res/cartoon2/yd-3_04.png",
                "res/cartoon2/yd-3_05.png",
                "res/cartoon2/yd-3_06.png",
                "res/cartoon2/yd-3_07.png",
                "res/cartoon2/yd-3_08.png",
            ];
            this.character3 = [
                "res/cartoon2/yd-2_01.png",
                "res/cartoon2/yd-2_02.png",
                "res/cartoon2/yd-2_03.png",
                "res/cartoon2/yd-2_04.png",
                "res/cartoon2/yd-2_05.png",
                "res/cartoon2/yd-2_06.png",
                "res/cartoon2/yd-2_07.png",
                "res/cartoon2/yd-2_08.png",
            ];
            this.character4 = [
                "res/cartoon2/wyd-1_01.png",
                "res/cartoon2/wyd-1_02.png",
                "res/cartoon2/wyd-1_03.png",
                "res/cartoon2/wyd-1_04.png",
                "res/cartoon2/wyd-1_05.png",
                "res/cartoon2/wyd-1_06.png",
                "res/cartoon2/wyd-1_07.png",
                "res/cartoon2/wyd-1_08.png",
            ];
            this.characterSkins = [this.character1, this.character2, this.character3, this.character4];
            this.characters = [];
            Laya.init(1280, 720, WebGL$5);
            Laya.stage.screenMode = Stage$4.SCREEN_HORIZONTAL;
            Stat$3.enable();
            Laya.stage.loadImage("res/cartoon2/background.jpg");
            this.createCharacters();
            this.text = new Text$n();
            this.text.zOrder = 10000;
            this.text.fontSize = 60;
            this.text.color = "#ff0000";
            Laya.stage.addChild(this.text);
            Laya.timer.frameLoop(1, this, this.gameLoop);
        }
        createCharacters() {
            var char;
            var charSkin;
            for (var i = 0; i < this.amount; i++) {
                charSkin = this.characterSkins[Math.floor(Math.random() * this.characterSkins.length)];
                char = new Character(charSkin);
                char.x = Math.random() * (Laya.stage.width + Character.WIDTH * 2);
                char.y = Math.random() * (Laya.stage.height - Character.HEIGHT);
                char.zOrder = char.y;
                char.setSpeed(Math.floor(Math.random() * 2 + 3));
                char.setName(i.toString());
                Laya.stage.addChild(char);
                this.characters.push(char);
            }
        }
        gameLoop() {
            for (var i = this.characters.length - 1; i >= 0; i--) {
                this.characters[i].update();
            }
            if (Laya.timer.currFrame % 60 === 0) {
                this.text.text = Stat$3.FPS.toString();
            }
        }
    }
    class Character extends Sprite$A {
        constructor(images) {
            super();
            this.speed = 5;
            this.createAnimation(images);
            this.createBloodBar();
            this.createNameLabel();
        }
        createAnimation(images) {
            this.animation = new Animation$3();
            this.animation.loadImages(images);
            this.animation.interval = 70;
            this.animation.play(0);
            this.addChild(this.animation);
        }
        createBloodBar() {
            this.bloodBar = new Sprite$A();
            this.bloodBar.loadImage("res/cartoon2/blood_1_r.png");
            this.bloodBar.x = 20;
            this.addChild(this.bloodBar);
        }
        createNameLabel() {
            this.nameLabel = new Text$n();
            this.nameLabel.color = "#FFFFFF";
            this.nameLabel.text = "Default";
            this.nameLabel.fontSize = 13;
            this.nameLabel.width = Character.WIDTH;
            this.nameLabel.align = "center";
            this.addChild(this.nameLabel);
        }
        setSpeed(value) {
            this.speed = value;
        }
        setName(value) {
            this.nameLabel.text = value;
        }
        update() {
            this.x += this.speed;
            if (this.x >= Laya.stage.width + Character.WIDTH)
                this.x = -Character.WIDTH;
        }
    }
    Character.WIDTH = 110;
    Character.HEIGHT = 110;

    var Templet$5 = Laya.Templet;
    var Event$s = Laya.Event;
    var Loader$6 = Laya.Loader;
    var Browser$a = Laya.Browser;
    var Handler$E = Laya.Handler;
    var Stat$4 = Laya.Stat;
    var WebGL$6 = Laya.WebGL;
    class PerformanceTest_Skeleton {
        constructor() {
            this.fileName = "Dragon";
            this.rowCount = 10;
            this.colCount = 10;
            this.xOff = 50;
            this.yOff = 100;
            this.mAnimationArray = [];
            this.mActionIndex = 0;
            this.mSpacingX = Browser$a.width / this.colCount;
            this.mSpacingY = Browser$a.height / this.rowCount;
            Laya.init(Browser$a.width, Browser$a.height, WebGL$6);
            Stat$4.show();
            this.mTexturePath = "res/skeleton/" + this.fileName + "/" + this.fileName + ".png";
            this.mAniPath = "res/skeleton/" + this.fileName + "/" + this.fileName + ".sk";
            Laya.loader.load([{ url: this.mTexturePath, type: Loader$6.IMAGE }, { url: this.mAniPath, type: Loader$6.BUFFER }], Handler$E.create(this, this.onAssetsLoaded));
        }
        onAssetsLoaded() {
            var tTexture = Loader$6.getRes(this.mTexturePath);
            var arraybuffer = Loader$6.getRes(this.mAniPath);
            this.mFactory = new Templet$5();
            this.mFactory.on(Event$s.COMPLETE, this, this.parseComplete);
            this.mFactory.parseData(tTexture, arraybuffer, 10);
        }
        parseComplete() {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    this.mArmature = this.mFactory.buildArmature();
                    this.mArmature.x = this.xOff + j * this.mSpacingX;
                    this.mArmature.y = this.yOff + i * this.mSpacingY;
                    this.mArmature.play(0, true);
                    this.mAnimationArray.push(this.mArmature);
                    Laya.stage.addChild(this.mArmature);
                }
            }
            Laya.stage.on(Event$s.CLICK, this, this.toggleAction);
        }
        toggleAction(e) {
            this.mActionIndex++;
            var tAnimNum = this.mArmature.getAnimNum();
            if (this.mActionIndex >= tAnimNum) {
                this.mActionIndex = 0;
            }
            for (var i = 0, n = this.mAnimationArray.length; i < n; i++) {
                this.mAnimationArray[i].play(this.mActionIndex, true);
            }
        }
    }

    class PerformanceTestMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "虫子", "卡通人物", "卡通人物2", "骨骼"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    new PerformanceTest_Maggots();
                    break;
                case this.btnNameArr[2]:
                    new PerformanceTest_Cartoon();
                    break;
                case this.btnNameArr[3]:
                    new PerformanceTest_Cartoon2();
                    break;
                case this.btnNameArr[4]:
                    new PerformanceTest_Skeleton();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Sprite$B = Laya.Sprite;
    var Text$o = Laya.Text;
    var Browser$b = Laya.Browser;
    var WebGL$7 = Laya.WebGL;
    class PIXI_Example_04 {
        constructor() {
            this.starCount = 2500;
            this.sx = 1.0 + (Math.random() / 20);
            this.sy = 1.0 + (Math.random() / 20);
            this.stars = [];
            this.w = Browser$b.width;
            this.h = Browser$b.height;
            this.slideX = this.w / 2;
            this.slideY = this.h / 2;
            Laya.init(this.w, this.h, WebGL$7);
            this.createText();
            this.start();
        }
        start() {
            for (var i = 0; i < this.starCount; i++) {
                var tempBall = new Sprite$B();
                tempBall.loadImage("res/pixi/bubble_32x32.png");
                tempBall.x = (Math.random() * this.w) - this.slideX;
                tempBall.y = (Math.random() * this.h) - this.slideY;
                tempBall.pivot(16, 16);
                this.stars.push({ sprite: tempBall, x: tempBall.x, y: tempBall.y });
                Laya.stage.addChild(tempBall);
            }
            Laya.stage.on('click', this, this.newWave);
            this.speedInfo.text = 'SX: ' + this.sx + '\nSY: ' + this.sy;
            this.resize();
            Laya.timer.frameLoop(1, this, this.update);
        }
        createText() {
            this.speedInfo = new Text$o();
            this.speedInfo.color = "#FFFFFF";
            this.speedInfo.pos(this.w - 160, 20);
            this.speedInfo.zOrder = 1;
            Laya.stage.addChild(this.speedInfo);
        }
        newWave() {
            this.sx = 1.0 + (Math.random() / 20);
            this.sy = 1.0 + (Math.random() / 20);
            this.speedInfo.text = 'SX: ' + this.sx + '\nSY: ' + this.sy;
        }
        resize() {
            this.w = Laya.stage.width;
            this.h = Laya.stage.height;
            this.slideX = this.w / 2;
            this.slideY = this.h / 2;
        }
        update() {
            for (var i = 0; i < this.starCount; i++) {
                this.stars[i].sprite.x = this.stars[i].x + this.slideX;
                this.stars[i].sprite.y = this.stars[i].y + this.slideY;
                this.stars[i].x = this.stars[i].x * this.sx;
                this.stars[i].y = this.stars[i].y * this.sy;
                if (this.stars[i].x > this.w) {
                    this.stars[i].x = this.stars[i].x - this.w;
                }
                else if (this.stars[i].x < -this.w) {
                    this.stars[i].x = this.stars[i].x + this.w;
                }
                if (this.stars[i].y > this.h) {
                    this.stars[i].y = this.stars[i].y - this.h;
                }
                else if (this.stars[i].y < -this.h) {
                    this.stars[i].y = this.stars[i].y + this.h;
                }
            }
        }
    }

    var Sprite$C = Laya.Sprite;
    var Stage$5 = Laya.Stage;
    var Event$t = Laya.Event;
    var Browser$c = Laya.Browser;
    var Stat$5 = Laya.Stat;
    var WebGL$8 = Laya.WebGL;
    class PIXI_Example_05 {
        constructor() {
            this.n = 2000;
            this.d = 1;
            this.current = 0;
            this.objs = 17;
            this.vx = 0;
            this.vy = 0;
            this.vz = 0;
            this.points1 = [];
            this.points2 = [];
            this.points3 = [];
            this.tpoint1 = [];
            this.tpoint2 = [];
            this.tpoint3 = [];
            this.balls = [];
            Laya.init(Browser$c.width, Browser$c.height, WebGL$8);
            Stat$5.show();
            Laya.stage.scaleMode = Stage$5.SCALE_FULL;
            this.setup();
        }
        setup() {
            Laya.stage.on(Event$t.RESIZE, this, this.onResize);
            this.makeObject(0);
            for (var i = 0; i < this.n; i++) {
                this.tpoint1[i] = this.points1[i];
                this.tpoint2[i] = this.points2[i];
                this.tpoint3[i] = this.points3[i];
                var tempBall = new Sprite$C();
                tempBall.loadImage('res/pixi/pixel.png');
                tempBall.pivot(3, 3);
                tempBall.alpha = 0.5;
                this.balls[i] = tempBall;
                Laya.stage.addChild(tempBall);
            }
            this.onResize();
            Laya.timer.loop(5000, this, this.nextObject);
            Laya.timer.frameLoop(1, this, this.update);
        }
        nextObject() {
            this.current++;
            if (this.current > this.objs) {
                this.current = 0;
            }
            this.makeObject(this.current);
        }
        makeObject(t) {
            var xd;
            var i;
            switch (t) {
                case 0:
                    for (i = 0; i < this.n; i++) {
                        this.points1[i] = -50 + Math.round(Math.random() * 100);
                        this.points2[i] = 0;
                        this.points3[i] = 0;
                    }
                    break;
                case 1:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(t * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(t * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 2:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + (Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(t * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(t * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 3:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 4:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 5:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 6:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 7:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(i * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 8:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(i * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 9:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 10:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 11:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.sin(xd) * 10) * (Math.sin(i * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 12:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.sin(xd) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 13:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.sin(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 14:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.sin(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.sin(xd) * 10) * (Math.sin(i * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 15:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.sin(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
                case 16:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / this.n) * 10);
                        this.points2[i] = (Math.sin(i * 360 / this.n) * 10) * (Math.sin(xd) * 10);
                        this.points3[i] = Math.sin(xd) * 100;
                    }
                    break;
                case 17:
                    for (i = 0; i < this.n; i++) {
                        xd = -90 + Math.round(Math.random() * 180);
                        this.points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                        this.points2[i] = (Math.cos(i * 360 / this.n) * 10) * (Math.sin(i * 360 / this.n) * 10);
                        this.points3[i] = Math.sin(i * 360 / this.n) * 100;
                    }
                    break;
            }
        }
        onResize() {
        }
        update() {
            var x3d, y3d, z3d, tx, ty, tz, ox;
            if (this.d < 200) {
                this.d++;
            }
            this.vx += 0.0075;
            this.vy += 0.0075;
            this.vz += 0.0075;
            for (var i = 0; i < this.n; i++) {
                if (this.points1[i] > this.tpoint1[i]) {
                    this.tpoint1[i] = this.tpoint1[i] + 1;
                }
                if (this.points1[i] < this.tpoint1[i]) {
                    this.tpoint1[i] = this.tpoint1[i] - 1;
                }
                if (this.points2[i] > this.tpoint2[i]) {
                    this.tpoint2[i] = this.tpoint2[i] + 1;
                }
                if (this.points2[i] < this.tpoint2[i]) {
                    this.tpoint2[i] = this.tpoint2[i] - 1;
                }
                if (this.points3[i] > this.tpoint3[i]) {
                    this.tpoint3[i] = this.tpoint3[i] + 1;
                }
                if (this.points3[i] < this.tpoint3[i]) {
                    this.tpoint3[i] = this.tpoint3[i] - 1;
                }
                x3d = this.tpoint1[i];
                y3d = this.tpoint2[i];
                z3d = this.tpoint3[i];
                ty = (y3d * Math.cos(this.vx)) - (z3d * Math.sin(this.vx));
                tz = (y3d * Math.sin(this.vx)) + (z3d * Math.cos(this.vx));
                tx = (x3d * Math.cos(this.vy)) - (tz * Math.sin(this.vy));
                tz = (x3d * Math.sin(this.vy)) + (tz * Math.cos(this.vy));
                ox = tx;
                tx = (tx * Math.cos(this.vz)) - (ty * Math.sin(this.vz));
                ty = (ox * Math.sin(this.vz)) + (ty * Math.cos(this.vz));
                this.balls[i].x = (512 * tx) / (this.d - tz) + Laya.stage.width / 2;
                this.balls[i].y = (Laya.stage.height / 2) - (512 * ty) / (this.d - tz);
            }
        }
    }

    var Sprite$D = Laya.Sprite;
    var Browser$d = Laya.Browser;
    var WebGL$9 = Laya.WebGL;
    class PIXI_Example_21 {
        constructor() {
            this.colors = ["#5D0776", "#EC8A49", "#AF3666", "#F6C84C", "#4C779A"];
            this.colorCount = 0;
            this.isDown = false;
            this.path = [];
            this.color = this.colors[0];
            Laya.init(Browser$d.width, Browser$d.height, WebGL$9);
            Laya.stage.bgColor = "#3da8bb";
            this.createCanvases();
            Laya.timer.frameLoop(1, this, this.animate);
            Laya.stage.on('mousedown', this, this.onMouseDown);
            Laya.stage.on('mousemove', this, this.onMouseMove);
            Laya.stage.on('mouseup', this, this.onMouseUp);
        }
        createCanvases() {
            var graphicsCanvas = new Sprite$D();
            Laya.stage.addChild(graphicsCanvas);
            var liveGraphicsCanvas = new Sprite$D();
            Laya.stage.addChild(liveGraphicsCanvas);
            this.liveGraphics = liveGraphicsCanvas.graphics;
            this.canvasGraphics = graphicsCanvas.graphics;
        }
        onMouseDown() {
            this.isDown = true;
            this.color = this.colors[this.colorCount++ % this.colors.length];
            this.path.length = 0;
        }
        onMouseMove() {
            if (!this.isDown)
                return;
            this.path.push(Laya.stage.mouseX);
            this.path.push(Laya.stage.mouseY);
        }
        onMouseUp() {
            this.isDown = false;
            this.canvasGraphics.drawPoly(0, 0, this.path.concat(), this.color);
        }
        animate() {
            this.liveGraphics.clear();
            this.liveGraphics.drawPoly(0, 0, this.path, this.color);
        }
    }

    var Sprite$E = Laya.Sprite;
    var Stage$6 = Laya.Stage;
    var Point$2 = Laya.Point;
    var Browser$e = Laya.Browser;
    var WebGL$a = Laya.WebGL;
    class PIXI_Example_23 {
        constructor() {
            this.viewWidth = Browser$e.width;
            this.viewHeight = Browser$e.height;
            this.lasers = [];
            this.tick = 0;
            this.frequency = 80;
            this.type = 0;
            Laya.init(this.viewWidth, this.viewHeight, WebGL$a);
            Laya.stage.screenMode = Stage$6.SCREEN_HORIZONTAL;
            Laya.stage.scaleMode = Stage$6.SCALE_NOBORDER;
            Laya.stage.loadImage("res/pixi/laserBG.jpg");
            Laya.stage.frameLoop(1, this, this.animate);
        }
        animate() {
            if (this.tick > this.frequency) {
                this.tick = 0;
                var laser = new Laser();
                laser.loadImage("res/pixi/laser0" + ((this.type % 5) + 1) + ".png");
                this.type++;
                laser.life = 0;
                var pos1;
                var pos2;
                if (this.type % 2) {
                    pos1 = new Point$2(-20, Math.random() * this.viewHeight);
                    pos2 = new Point$2(this.viewWidth, Math.random() * this.viewHeight + 20);
                }
                else {
                    pos1 = new Point$2(Math.random() * this.viewWidth, -20);
                    pos2 = new Point$2(Math.random() * this.viewWidth, this.viewHeight + 20);
                }
                var distX = pos1.x - pos2.x;
                var distY = pos1.y - pos2.y;
                var dist = Math.sqrt(distX * distX + distY * distY) + 40;
                laser.scaleX = dist / 20;
                laser.pos(pos1.x, pos1.y);
                laser.pivotY = 43 / 2;
                laser.blendMode = "lighter";
                laser.rotation = (Math.atan2(distY, distX) + Math.PI) * 180 / Math.PI;
                this.lasers.push(laser);
                Laya.stage.addChild(laser);
                this.frequency *= 0.9;
            }
            for (var i = 0; i < this.lasers.length; i++) {
                laser = this.lasers[i];
                laser.life++;
                if (laser.life > 60 * 0.3) {
                    laser.alpha *= 0.9;
                    laser.scaleY = laser.alpha;
                    if (laser.alpha < 0.01) {
                        this.lasers.splice(i, 1);
                        Laya.stage.removeChild(laser);
                        i--;
                    }
                }
            }
            this.tick += 1;
        }
    }
    class Laser extends Sprite$E {
    }

    class PIXIMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "Example04", "Example05", "Example21", "Example23"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            switch (name) {
                case this.btnNameArr[0]:
                    this.Hide();
                    EventManager.DispatchEvent("BACKTOMAIN");
                    break;
                case this.btnNameArr[1]:
                    new PIXI_Example_04();
                    break;
                case this.btnNameArr[2]:
                    new PIXI_Example_05();
                    break;
                case this.btnNameArr[3]:
                    new PIXI_Example_21();
                    break;
                case this.btnNameArr[4]:
                    new PIXI_Example_23();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class LayaMain2d extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "Sprite", "动画", "骨骼动画", "混合模式", "区块地图",
                "滤镜", "粒子", "音频", "文本", "UI",
                "计时器", "缓动", "2D物理", "鼠标交互", "加载",
                "屏幕适配", "输入设备", "网络和格式", "Dom元素", "调试",
                "性能测试", "其他引擎",
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
            EventManager.RegistEvent("BACKTOMAIN", Laya.Handler.create(this, this.Back2Main));
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = "res/threeDimen/ui/button.png") {
            var btn = new Laya.Button(skin, name);
            btn.on(Laya.Event.CLICK, this, cb, [name]);
            btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
            btn.size(50, 20);
            btn.name = name;
            btn.right = 5;
            btn.top = index * (btn.height + 5);
            this.addChild(btn);
            return btn;
        }
        _onclick(name) {
            this.Hide();
            switch (name) {
                case this.btnNameArr[0]:
                    SpriteMain.getInstance().Show();
                    break;
                case this.btnNameArr[1]:
                    AnimationMain.getInstance().Show();
                    break;
                case this.btnNameArr[2]:
                    SkeletalAnimationMain.getInstance().Show();
                    break;
                case this.btnNameArr[3]:
                    BlendModeMain.getInstance().Show();
                    break;
                case this.btnNameArr[4]:
                    TiledMapMain.getInstance().Show();
                    break;
                case this.btnNameArr[5]:
                    FiltersMain.getInstance().Show();
                    break;
                case this.btnNameArr[6]:
                    ParticleMain.getInstance().Show();
                    break;
                case this.btnNameArr[7]:
                    SoundMain.getInstance().Show();
                    break;
                case this.btnNameArr[8]:
                    TextMain.getInstance().Show();
                    break;
                case this.btnNameArr[9]:
                    UIMain.getInstance().Show();
                    break;
                case this.btnNameArr[10]:
                    TimerMain.getInstance().Show();
                    break;
                case this.btnNameArr[11]:
                    TweenMain.getInstance().Show();
                    break;
                case this.btnNameArr[12]:
                    PhysicsMain.getInstance().Show();
                    break;
                case this.btnNameArr[13]:
                    InteractionMain.getInstance().Show();
                    break;
                case this.btnNameArr[14]:
                    LoaderMain.getInstance().Show();
                    break;
                case this.btnNameArr[15]:
                    SmartScaleMain.getInstance().Show();
                    break;
                case this.btnNameArr[16]:
                    InputDeviceMain.getInstance().Show();
                    break;
                case this.btnNameArr[17]:
                    NetworkMain.getInstance().Show();
                    break;
                case this.btnNameArr[18]:
                    DOMMain.getInstance().Show();
                    break;
                case this.btnNameArr[19]:
                    DebugMain.getInstance().Show();
                    break;
                case this.btnNameArr[20]:
                    PerformanceTestMain.getInstance().Show();
                    break;
                case this.btnNameArr[21]:
                    PIXIMain.getInstance().Show();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
        Back2Main() {
            this.Show();
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
            window['LoadBaiduMapScript']();
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
        LoadExample() {
            LayaMain2d.getInstance().Show();
        }
    }
    new Main().LoadExample();

}());
//# sourceMappingURL=bundle.js.map
