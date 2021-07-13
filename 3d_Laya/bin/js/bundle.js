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

    class SingletonMainScene extends Laya.Scene {
        constructor() {
            super();
            EventManager.RegistEvent("BACKTOMAIN", Laya.Handler.create(this, this.Back2Main));
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
        Back2Main() {
            this.Hide();
        }
    }

    class CameraMoveScript extends Laya.Script3D {
        constructor() {
            super();
            this._tempVector3 = new Laya.Vector3();
            this.yawPitchRoll = new Laya.Vector3();
            this.resultRotation = new Laya.Quaternion();
            this.tempRotationZ = new Laya.Quaternion();
            this.tempRotationX = new Laya.Quaternion();
            this.tempRotationY = new Laya.Quaternion();
            this.rotaionSpeed = 0.00006;
        }
        onAwake() {
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.on(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
            this.camera = this.owner;
        }
        _onDestroy() {
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_DOWN, this, this.mouseDown);
            Laya.stage.off(Laya.Event.RIGHT_MOUSE_UP, this, this.mouseUp);
        }
        onUpdate() {
            var elapsedTime = Laya.timer.delta;
            if (!isNaN(this.lastMouseX) && !isNaN(this.lastMouseY) && this.isMouseDown) {
                var scene = this.owner.scene;
                Laya.KeyBoardManager.hasKeyDown(87) && this.moveForward(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(83) && this.moveForward(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(65) && this.moveRight(-0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(68) && this.moveRight(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(81) && this.moveVertical(0.01 * elapsedTime);
                Laya.KeyBoardManager.hasKeyDown(69) && this.moveVertical(-0.01 * elapsedTime);
                var offsetX = Laya.stage.mouseX - this.lastMouseX;
                var offsetY = Laya.stage.mouseY - this.lastMouseY;
                var yprElem = this.yawPitchRoll;
                yprElem.x -= offsetX * this.rotaionSpeed * elapsedTime;
                yprElem.y -= offsetY * this.rotaionSpeed * elapsedTime;
                this.updateRotation();
            }
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
        }
        mouseDown() {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this.isMouseDown = true;
        }
        mouseUp() {
            this.isMouseDown = false;
        }
        moveForward(distance) {
            this._tempVector3.x = 0;
            this._tempVector3.y = 0;
            this._tempVector3.z = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveRight(distance) {
            this._tempVector3.y = 0;
            this._tempVector3.z = 0;
            this._tempVector3.x = distance;
            this.camera.transform.translate(this._tempVector3);
        }
        moveVertical(distance) {
            this._tempVector3.x = this._tempVector3.z = 0;
            this._tempVector3.y = distance;
            this.camera.transform.translate(this._tempVector3, false);
        }
        updateRotation() {
            if (Math.abs(this.yawPitchRoll.y) < 1.50) {
                Laya.Quaternion.createFromYawPitchRoll(this.yawPitchRoll.x, this.yawPitchRoll.y, this.yawPitchRoll.z, this.tempRotationZ);
                this.tempRotationZ.cloneTo(this.camera.transform.localRotation);
                this.camera.transform.localRotation = this.camera.transform.localRotation;
            }
        }
    }

    var GlobalConfig;
    (function (GlobalConfig) {
        GlobalConfig.ResPath = "https://layaair.ldc.layabox.com/demo2/h5/";
    })(GlobalConfig || (GlobalConfig = {}));

    class LoadResourceDemo {
        constructor() {
            this._scene = null;
            this.sprite3D = null;
            Laya3D.init(0, 0);
            Laya.Stat.show();
            this.PreloadingRes();
        }
        LoadRes() {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene) {
                this._scene = scene;
                Laya.stage.addChild(this._scene);
                var camera = new Laya.Camera();
                this._scene.addChild(camera);
                camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
                camera.transform.translate(new Laya.Vector3(3, 20, 47));
                camera.addComponent(CameraMoveScript);
                var directionLight = this._scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1, 1, 1);
                directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
                Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(null, function (mat) {
                    var skyRenderer = camera.skyRenderer;
                    skyRenderer.mesh = Laya.SkyBox.instance;
                    skyRenderer.material = mat;
                }));
                (scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
                (scene.getChildByName('Scenes').getChildByName('Area')).active = false;
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(null, function (tex) {
                    var earth1 = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
                    earth1.transform.translate(new Laya.Vector3(17, 20, 0));
                    var earthMat = new Laya.BlinnPhongMaterial();
                    earthMat.albedoTexture = tex;
                    earthMat.albedoIntensity = 1;
                    earth1.meshRenderer.material = earthMat;
                }));
                Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                    var layaMonkey = scene.addChild(new Laya.MeshSprite3D(mesh));
                    layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
                    layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                    layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));
                }));
                Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (sp) {
                    var layaMonkey2 = scene.addChild(sp);
                    layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
                    layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
                }));
                Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh", Laya.Handler.create(this, function (sp) {
                    this.pangzi = scene.addChild(sp);
                    this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
                    this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
                    this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator);
                    Laya.AnimationClip.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani", Laya.Handler.create(this, function (aniClip) {
                        var state1 = new Laya.AnimatorState();
                        state1.name = "hello";
                        state1.clipStart = 0 / 581;
                        state1.clipEnd = 581 / 581;
                        state1.clip = aniClip;
                        state1.clip.islooping = true;
                        this.pangziAnimator.addState(state1);
                        this.pangziAnimator.play("hello");
                    }));
                }));
            }));
        }
        PreloadingRes() {
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls",
                GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat",
                GlobalConfig.ResPath + "res/threeDimen/texture/earth.png",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this._scene = Laya.stage.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls"));
            var camera = new Laya.Camera();
            this._scene.addChild(camera);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.transform.translate(new Laya.Vector3(3, 20, 47));
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this._scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            var skyboxMaterial = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
            var skyRenderer = camera.skyRenderer;
            skyRenderer.mesh = Laya.SkyBox.instance;
            skyRenderer.material = skyboxMaterial;
            (this._scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
            (this._scene.getChildByName('Scenes').getChildByName('Area')).active = false;
            var earth1 = this._scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
            earth1.transform.translate(new Laya.Vector3(17, 20, 0));
            var earthMat = new Laya.BlinnPhongMaterial();
            earthMat.albedoTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png");
            earthMat.albedoIntensity = 1;
            earth1.meshRenderer.material = earthMat;
            this.sprite3D = new Laya.Sprite3D();
            this._scene.addChild(this.sprite3D);
            var mesh = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
            var layaMonkey = new Laya.MeshSprite3D(mesh);
            this.sprite3D.addChild(layaMonkey);
            layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));
            var sp = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
            var layaMonkey2 = this._scene.addChild(sp);
            layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
            layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
            this.pangzi = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh");
            this._scene.addChild(this.pangzi);
            this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
            this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
            this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator);
            var pangAni = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani");
            var state1 = new Laya.AnimatorState();
            state1.name = "hello";
            state1.clipStart = 0 / 581;
            state1.clipEnd = 581 / 581;
            state1.clip = pangAni;
            state1.clip.islooping = true;
            this.pangziAnimator.addState(state1);
            this.pangziAnimator.play("hello");
        }
    }

    class GarbageCollection {
        constructor() {
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            this.castType = 0;
            this.scene = null;
            this.loadScene();
            this.addButton(200, 200, 160, 40, "释放显存", function (e) {
                this.castType++;
                this.castType %= 2;
                switch (this.castType) {
                    case 0:
                        (e.target).label = "释放显存";
                        this.loadScene();
                        break;
                    case 1:
                        (e.target).label = "加载场景";
                        if (this.scene)
                            this.garbageCollection();
                        break;
                }
            });
        }
        addButton(x, y, width, height, text, clickFun) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                var changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
                changeActionButton.size(width, height);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                changeActionButton.pos(x, y);
                changeActionButton.on(Laya.Event.CLICK, this, clickFun);
            }));
        }
        loadScene() {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, function (scene) {
                this.scene = Laya.stage.addChildAt(scene, 0);
                var camera = this.scene.addChild(new Laya.Camera(0, 0.1, 100));
                camera.transform.translate(new Laya.Vector3(0, 1, 0));
                camera.addComponent(CameraMoveScript);
            }));
        }
        garbageCollection() {
            this.scene.destroy();
            this.scene = null;
            Laya.Resource.destroyUnusedResources();
        }
    }

    class ResourceMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "资源加载", "释放显存", "加载Gltf资源"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    new LoadResourceDemo();
                    break;
                case this.btnNameArr[2]:
                    new GarbageCollection();
                    break;
                case this.btnNameArr[3]:
                    console.log("TODO:未来实现");
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class SingletonScene {
        constructor() {
            this.isShow = false;
            EventManager.RegistEvent("SETSCENE3D", Laya.Handler.create(this, this.SetScene3d));
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new this();
            }
            return this.instance;
        }
        addButton(x, y, width, height, text, clickFun) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.backbtn = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text);
                Laya.stage.addChild(this.backbtn);
                this.backbtn.size(width, height);
                this.backbtn.pos(x, y);
                this.backbtn.on(Laya.Event.CLICK, this, clickFun);
            }));
        }
        SetScene3d(scene) {
            if (!this.CurrentScene) {
                this.CurrentScene = scene;
                Laya.stage.addChild(this.CurrentScene);
                this.Show();
            }
        }
        GetScene3d() {
            return this.CurrentScene;
        }
        AutoSetScene3d(scene) {
            EventManager.DispatchEvent("BACKTOMAIN");
            EventManager.DispatchEvent("SETSCENE3D", scene);
        }
        AddReturn() {
            this.addButton(50, 50, 100, 40, "返回主页", function (e) {
                this.Hide();
                if (this.backbtn) {
                    this.backbtn.visible = false;
                    this.backbtn.destroy();
                    this.backbtn = null;
                }
                EventManager.DispatchEvent("BACKTOMAIN");
                this.isShow = false;
            });
        }
        Show() {
            if (this.CurrentScene) {
                this.CurrentScene.visible = true;
                this.AddReturn();
            }
            Laya.Stat.show();
        }
        Hide() {
            if (this.CurrentScene) {
                this.CurrentScene.visible = false;
            }
            Laya.Stat.hide();
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
            if (this.CurrentScene) {
                this.CurrentScene.destroy();
            }
        }
    }

    class SceneLoad1 extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_dudeScene/Conventional/dudeScene.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    class SceneLoad2 extends SingletonScene {
        constructor() {
            super();
            Laya3D.init(0, 0);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.enableFog = true;
                scene.fogColor = new Laya.Vector3(0, 0, 0.6);
                scene.fogStart = 10;
                scene.fogRange = 40;
                scene.ambientColor = new Laya.Vector3(0.6, 0, 0);
                var camera = new Laya.Camera();
                scene.addChild(camera);
                camera.transform.translate(new Laya.Vector3(10, 15, -25));
                camera.transform.rotate(new Laya.Vector3(-20, 170, 0), false, false);
                camera.aspectRatio = 0;
                camera.nearPlane = 0.1;
                camera.farPlane = 1000;
                camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
                camera.fieldOfView = 60;
                camera.addComponent(CameraMoveScript);
                Laya.Material.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox3/SkyBox.lmat", Laya.Handler.create(this, function (mat) {
                    var skyRenderer = camera.skyRenderer;
                    skyRenderer.mesh = Laya.SkyBox.instance;
                    skyRenderer.material = mat;
                }));
                var light = scene.addChild(new Laya.DirectionLight());
                light.transform.translate(new Laya.Vector3(0, 2, 5));
                var mat = light.transform.worldMatrix;
                mat.setForward(new Laya.Vector3(0, -5, 1));
                light.transform.worldMatrix = mat;
                light.diffuseColor = new Laya.Vector3(0.3, 0.3, 0.3);
                scene.getChildByName('Scenes').getChildByName('HeightMap').active = false;
                scene.getChildByName('Scenes').getChildByName('Area').active = false;
            }));
        }
    }

    class EnvironmentalReflection extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.scene = null;
            this.teapot = null;
            var scene = new Laya.Scene3D();
            scene.reflectionMode = Laya.Scene3D.REFLECTIONMODE_CUSTOM;
            var camera = new Laya.Camera(0, 0.1, 100);
            scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 2, 3));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(null, function (mat) {
                this.AutoSetScene3d(scene);
                var skyRenderer = camera.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = mat;
                scene.customReflection = mat.textureCube;
                var exposureNumber = 0;
                mat.exposure = 0.6 + 1;
            }));
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            this.sprite3D = new Laya.Sprite3D();
            scene.addChild(this.sprite3D);
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/teapot/teapot-Teapot001.lm", Laya.Handler.create(this, function (mesh) {
                this.teapot = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh));
                this.teapot.transform.position = new Laya.Vector3(0, 1.75, 2);
                this.teapot.transform.rotate(new Laya.Vector3(-90, 0, 0), false, false);
                this.sprite3D.addChild(this.teapot);
                var pbrMat = new Laya.PBRStandardMaterial();
                pbrMat.enableReflection = true;
                pbrMat.metallic = 1;
                this.teapot.meshRenderer.material = pbrMat;
            }));
        }
    }

    class LightmapScene extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.addChild(new Laya.Camera(0, 0.1, 100));
                camera.transform.translate(new Laya.Vector3(0, 1, 0));
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    class Scene3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "场景加载1", "场景加载2", "环境反射", "光照贴图"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    SceneLoad1.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    SceneLoad2.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    EnvironmentalReflection.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    LightmapScene.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class CameraDemo extends SingletonScene {
        constructor() {
            super();
            this.index = 0;
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png",
                GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            var scene = new Laya.Scene3D();
            this.AutoSetScene3d(scene);
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
            this.camera.fieldOfView = 60;
            this.camera.addComponent(CameraMoveScript);
            scene.addChild(this.camera);
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            var sprite = new Laya.Sprite3D;
            scene.addChild(sprite);
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
            sprite.addChild(box);
            box.transform.position = new Laya.Vector3(0.0, 0.0, 2);
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var materialBill = new Laya.BlinnPhongMaterial;
            box.meshRenderer.material = materialBill;
            var tex = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png");
            materialBill.albedoTexture = tex;
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "正透切换");
                Laya.stage.addChild(this.changeActionButton);
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2 - 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.index++;
                    if (this.index % 2 === 1) {
                        this.camera.orthographic = true;
                        this.camera.orthographicVerticalSize = 7;
                    }
                    else {
                        this.camera.orthographic = false;
                    }
                });
                this.changeActionButton2 = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换背景");
                Laya.stage.addChild(this.changeActionButton2);
                this.changeActionButton2.size(160, 40);
                this.changeActionButton2.labelBold = true;
                this.changeActionButton2.labelSize = 30;
                this.changeActionButton2.sizeGrid = "4,4,4,4";
                this.changeActionButton2.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton2.pos(Laya.stage.width / 2 - this.changeActionButton2.width * Laya.Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton2.on(Laya.Event.CLICK, this, function () {
                    this.index++;
                    if (this.index % 2 === 1) {
                        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
                        var skyboxMaterial = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
                        var skyRenderer = this.camera.skyRenderer;
                        skyRenderer.mesh = Laya.SkyBox.instance;
                        skyRenderer.material = skyboxMaterial;
                    }
                    else {
                        this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
            if (this.changeActionButton2) {
                this.changeActionButton2.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
            if (this.changeActionButton2) {
                this.changeActionButton2.visible = false;
            }
        }
    }

    class CameraLookAt extends SingletonScene {
        constructor() {
            super();
            this.index = 0;
            this.upVector = new Laya.Vector3(0, 1, 0);
            Laya3D.init(1000, 500);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.Stat.show();
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png",
                GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox3/skyBox3.lmat"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            var scene = new Laya.Scene3D();
            this.AutoSetScene3d(scene);
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
            this.camera.fieldOfView = 60;
            this.camera.addComponent(CameraMoveScript);
            scene.addChild(this.camera);
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            var sprite = new Laya.Sprite3D;
            scene.addChild(sprite);
            this.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
            sprite.addChild(this.box);
            this.box.transform.position = new Laya.Vector3(1.5, 0.0, 2);
            this.box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            this.capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20));
            this.capsule.transform.position = new Laya.Vector3(-1.5, 0.0, 2);
            sprite.addChild(this.capsule);
            this.cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(0.25, 1, 20));
            this.cylinder.transform.position = new Laya.Vector3(0.0, 0.0, 2);
            sprite.addChild(this.cylinder);
            var materialBill = new Laya.BlinnPhongMaterial;
            this.box.meshRenderer.material = materialBill;
            this.capsule.meshRenderer.material = materialBill;
            this.cylinder.meshRenderer.material = materialBill;
            var tex = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png");
            materialBill.albedoTexture = tex;
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换注视目标"));
                this.changeActionButton.size(200, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.index++;
                    if (this.index % 3 === 1) {
                        this.camera.transform.lookAt(this.box.transform.position, this.upVector);
                    }
                    else if (this.index % 3 === 2) {
                        this.camera.transform.lookAt(this.cylinder.transform.position, this.upVector);
                    }
                    else {
                        this.camera.transform.lookAt(this.capsule.transform.position, this.upVector);
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class MultiCamera extends SingletonScene {
        constructor() {
            super();
            var scene = new Laya.Scene3D();
            this.camera1 = scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera1.clearColor = new Laya.Vector4(0.3, 0.3, 0.3, 1.0);
            this.camera1.transform.translate(new Laya.Vector3(0, 0, 1.5));
            this.camera1.normalizedViewport = new Laya.Viewport(0, 0, 0.5, 1.0);
            this.camera2 = scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera2.clearColor = new Laya.Vector4(0.0, 0.0, 1.0, 1.0);
            this.camera2.transform.translate(new Laya.Vector3(0, 0, 1.5));
            this.camera2.normalizedViewport = new Laya.Viewport(0.5, 0.0, 0.5, 0.5);
            this.camera2.addComponent(CameraMoveScript);
            this.camera2.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(this, function (mat) {
                this.AutoSetScene3d(scene);
                var skyRenderer = this.camera2.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = mat;
            }));
            var directionLight = scene.addChild(new Laya.DirectionLight());
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (sp) {
                var layaMonkey = scene.addChild(sp);
            }));
        }
    }

    class CameraRay extends SingletonScene {
        constructor() {
            super();
            this._outHitResult = new Laya.HitResult();
            this.outs = new Array();
            this.posX = 0.0;
            this.posY = 0.0;
            this.point = new Laya.Vector2();
            this.s_scene = new Laya.Scene3D();
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(this.camera);
            this.camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            this.camera.addComponent(CameraMoveScript);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10));
            this.s_scene.addChild(plane);
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Laya.Handler.create(this, function (tex) {
                planeMat.albedoTexture = tex;
                this.AutoSetScene3d(this.s_scene);
            }));
            planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
            plane.meshRenderer.material = planeMat;
            var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(10, 0, 10);
            planeStaticCollider.colliderShape = planeShape;
            planeStaticCollider.friction = 2;
            planeStaticCollider.restitution = 0.3;
            this.addMouseEvent();
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
        }
        addBoxXYZ(x, y, z) {
            var mat1 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
                mat1.albedoTexture = tex;
            }));
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ));
            this.s_scene.addChild(box);
            box.meshRenderer.material = mat1;
            this.tmpVector.setValue(x, y, z);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addMouseEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown() {
            if (!this.isShow) {
                return;
            }
            this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
            this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
            this.camera.viewportPointToRay(this.point, this._ray);
            this.s_scene.physicsSimulation.rayCastAll(this._ray, this.outs);
            if (this.outs.length != 0) {
                for (var i = 0; i < this.outs.length; i++)
                    this.addBoxXYZ(this.outs[i].point.x, this.outs[i].point.y, this.outs[i].point.z);
            }
        }
    }

    class CameraLayer extends SingletonScene {
        constructor() {
            super();
            this.changeActionButton = null;
            this.layerIndex = null;
            this.camera = null;
            this.s_scene = new Laya.Scene3D();
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(this.camera);
            this.camera.transform.translate(new Laya.Vector3(0, 0.7, 3));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            this.camera.addComponent(CameraMoveScript);
            this.camera.removeAllLayers();
            this.camera.addLayer(5);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            Laya.loader.create([
                GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
            ], Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            var grid = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
            grid.getChildAt(0).meshRenderer.receiveShadow = true;
            grid.getChildAt(0).layer = 5;
            var staticLayaMonkey = new Laya.MeshSprite3D(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"));
            this.s_scene.addChild(staticLayaMonkey);
            staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
            staticLayaMonkey.layer = 1;
            staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, 0.5);
            staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            staticLayaMonkey.meshRenderer.castShadow = true;
            var layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            var layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            var layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            layaMonkey_clone1.layer = 2;
            layaMonkey_clone2.layer = 3;
            layaMonkey_clone3.layer = 0;
            layaMonkey_clone1.transform.translate(new Laya.Vector3(1.5, 0, 0.0));
            layaMonkey_clone2.transform.translate(new Laya.Vector3(-1.5, 0, 0.0));
            layaMonkey_clone3.transform.translate(new Laya.Vector3(2.5, 0, 0.0));
            layaMonkey_clone2.transform.rotate(new Laya.Vector3(0, 60, 0), false, false);
            var scale = new Laya.Vector3(0.1, 0.1, 0.1);
            layaMonkey_clone3.transform.localScale = scale;
            this.loadUI();
        }
        loadUI() {
            this.layerIndex = 0;
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换图层"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.camera.removeAllLayers();
                    this.layerIndex++;
                    this.camera.addLayer(this.layerIndex % 4);
                    this.camera.addLayer(5);
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class OrthographicCamera extends SingletonScene {
        constructor() {
            super();
            this.pos = new Laya.Vector3(310, 500, 0);
            this._translate = new Laya.Vector3(0, 0, 0);
            var scene = new Laya.Scene3D();
            this.dialog = new Laya.Image(GlobalConfig.ResPath + "res/cartoon2/background.jpg");
            Laya.stage.addChild(this.dialog);
            var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.rotate(new Laya.Vector3(-45, 0, 0), false, false);
            camera.transform.translate(new Laya.Vector3(5, -10, 1));
            camera.orthographic = true;
            camera.orthographicVerticalSize = 10;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = scene.addChild(new Laya.DirectionLight());
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                this.AutoSetScene3d(scene);
                scene.addChild(layaMonkey);
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
                layaMonkey.transform.position = this._translate;
                Laya.stage.on(Laya.Event.RESIZE, this, function () {
                    camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
                    layaMonkey.transform.position = this._translate;
                });
            }));
        }
        Show() {
            super.Show();
            if (this.dialog) {
                this.dialog.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.dialog) {
                this.dialog.visible = false;
            }
        }
    }

    class D3SpaceToD2Space extends SingletonScene {
        constructor() {
            super();
            this._position = new Laya.Vector3();
            this._outPos = new Laya.Vector4();
            this.scaleDelta = 0;
            this.scale = new Laya.Vector3(0.1, 0.1, 0.1);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var completeHandler = Laya.Handler.create(this, this.onComplete);
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", completeHandler);
        }
        onComplete() {
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey3D) {
                this.AutoSetScene3d(this.s_scene);
                this.layaMonkey3D = layaMonkey3D;
                this.s_scene.addChild(layaMonkey3D);
                this.layaMonkey2D = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/monkey.png");
                Laya.stage.addChild(this.layaMonkey2D);
                Laya.timer.frameLoop(1, this, this.animate);
            }));
        }
        animate() {
            if (!this.isShow) {
                return;
            }
            this._position.x = Math.sin(this.scaleDelta += 0.01);
            this.layaMonkey3D.transform.position = this._position;
            this.layaMonkey3D.transform.scale = this.scale;
            this.camera.viewport.project(this.layaMonkey3D.transform.position, this.camera.projectionViewMatrix, this._outPos);
            this.layaMonkey2D.pos(this._outPos.x / Laya.stage.clientScaleX, this._outPos.y / Laya.stage.clientScaleY);
        }
        Show() {
            super.Show();
            if (this.layaMonkey2D) {
                this.layaMonkey2D.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.layaMonkey2D) {
                this.layaMonkey2D.visible = false;
            }
        }
    }

    class RenderTarget3DTo2DSprite extends SingletonScene {
        constructor() {
            super();
            this._pos = new Laya.Vector3(310, 500, 0);
            this._translate = new Laya.Vector3(0, 0, 0);
            this._translate2 = new Laya.Vector3(5, -10, 1);
            this._translate3 = new Laya.Vector3(0, 0, -0.2);
            this._translate4 = new Laya.Vector3(0, 0, 0.2);
            this._translate5 = new Laya.Vector3(-0.2, 0, 0);
            this._translate6 = new Laya.Vector3(0.2, 0, 0);
            this._rotation = new Laya.Vector3(-45, 0, 0);
            this.dialog = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/secne.jpg");
            Laya.stage.addChild(this.dialog);
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.rotate(this._rotation, false, false);
            camera.addComponent(CameraMoveScript);
            camera.transform.translate(this._translate2);
            camera.orthographic = true;
            camera.clearFlag = Laya.CameraClearFlags.SolidColor;
            camera.clearColor = new Laya.Vector4(0.5, 0.0, 0.0, 0.5);
            var renderTexture = new Laya.RenderTexture(512, 512, Laya.RenderTextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
            camera.renderTarget = renderTexture;
            camera.orthographicVerticalSize = 10;
            this.s_scene.addChild(new Laya.DirectionLight());
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(layaMonkey);
                this._layaMonkey = layaMonkey;
                var transform = layaMonkey.transform;
                var localScale = transform.localScale;
                var rotationEuler = transform.rotationEuler;
                camera.convertScreenCoordToOrthographicCoord(this._pos, this._translate);
                transform.position = this._translate;
                localScale.setValue(0.5, 0.5, 0.5);
                transform.localScale = localScale;
                rotationEuler.setValue(-30, 0, 0);
                transform.rotationEuler = rotationEuler;
                this.scene3DImage = new Laya.Image();
                this.scene3DImage.source = new Laya.Texture(renderTexture);
                Laya.stage.addChild(this.scene3DImage);
                Laya.timer.frameLoop(1, this, this.onKeyDown);
            }));
        }
        onKeyDown() {
            var transform = this._layaMonkey.transform;
            Laya.KeyBoardManager.hasKeyDown(87) && transform.translate(this._translate3);
            Laya.KeyBoardManager.hasKeyDown(83) && transform.translate(this._translate4);
            Laya.KeyBoardManager.hasKeyDown(65) && transform.translate(this._translate5);
            Laya.KeyBoardManager.hasKeyDown(68) && transform.translate(this._translate6);
        }
        Show() {
            super.Show();
            if (this.dialog) {
                this.dialog.visible = true;
            }
            if (this.scene3DImage) {
                this.scene3DImage.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.dialog) {
                this.dialog.visible = false;
            }
            if (this.scene3DImage) {
                this.scene3DImage.visible = false;
            }
        }
    }

    class RenderTargetCamera extends SingletonScene {
        constructor() {
            super();
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Laya.loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls");
            this.AutoSetScene3d(scene);
            var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
            camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.addComponent(CameraMoveScript);
            var renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
            renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            renderTargetCamera.renderTarget = new Laya.RenderTexture(2048, 2048);
            renderTargetCamera.renderingOrder = -1;
            renderTargetCamera.addComponent(CameraMoveScript);
            this.renderTargetObj = scene.getChildAt(0).getChildByName("RenderTarget");
            Laya.loader.load(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", Laya.Handler.create(this, function () {
                var btn = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "渲染目标");
                this.changeActionButton = btn;
                Laya.stage.addChild(this.changeActionButton);
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    (this.renderTargetObj.meshRenderer.material).albedoTexture = renderTargetCamera.renderTarget;
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    var Camera = Laya.Camera;
    var Sprite3D = Laya.Sprite3D;
    var Vector3 = Laya.Vector3;
    var Button = Laya.Button;
    var Browser = Laya.Browser;
    var RenderTexture = Laya.RenderTexture;
    var Event = Laya.Event;
    var BaseCamera = Laya.BaseCamera;
    var Texture = Laya.Texture;
    var Sprite = Laya.Sprite;
    class RenderTargetTo2DSprite extends SingletonScene {
        constructor() {
            super();
            Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls");
            this.AutoSetScene3d(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler.create(this, function (layaMonkey) {
                scene.addChild(layaMonkey);
                layaMonkey.transform.localScale = new Vector3(0.5, 0.5, 0.5);
                layaMonkey.transform.rotate(new Vector3(0, 180, 0), true, false);
                layaMonkey.transform.position = new Vector3(-28.8, 5, -53);
            }));
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "渲染到2DSprite"));
                this.changeActionButton.size(240, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
                this.changeActionButton.on(Event.CLICK, this, function () {
                    var renderTargetCamera = scene.addChild(new Camera(0, 0.3, 1000));
                    renderTargetCamera.transform.position = new Vector3(-28.8, 8, -60);
                    renderTargetCamera.transform.rotate(new Vector3(0, 180, 0), true, false);
                    renderTargetCamera.renderTarget = new RenderTexture(512, 512);
                    renderTargetCamera.renderingOrder = -1;
                    renderTargetCamera.clearFlag = BaseCamera.CLEARFLAG_SKY;
                    var rtex = new Texture(renderTargetCamera.renderTarget, Texture.DEF_UV);
                    this.sp = new Sprite();
                    Laya.stage.addChild(this.sp);
                    this.sp.graphics.drawTexture(rtex);
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
            if (this.sp) {
                this.sp.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
            if (this.sp) {
                this.sp.visible = false;
            }
        }
    }

    class PickPixel extends SingletonScene {
        constructor() {
            super();
            this.isPick = false;
            this.text = new Laya.Text();
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls", GlobalConfig.ResPath + "res/threeDimen/texture/earth.png"], Laya.Handler.create(this, this.onComplete));
        }
        onMouseDown() {
            var posX = Laya.MouseManager.instance.mouseX;
            var posY = Laya.MouseManager.instance.mouseY;
            var out = new Uint8Array(4);
            this.renderTargetCamera.renderTarget.getData(posX, posY, 1, 1, out);
            this.text.text = out[0] + " " + out[1] + " " + out[2] + " " + out[3];
        }
        onResize() {
            var stageHeight = Laya.stage.height;
            var stageWidth = Laya.stage.width;
            this.renderTargetCamera.renderTarget.destroy();
            this.renderTargetCamera.renderTarget = new Laya.RenderTexture(stageWidth, stageHeight);
            this.text.x = Laya.stage.width / 2;
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
        }
        onComplete() {
            var scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/CourtyardScene/Courtyard.ls");
            this.AutoSetScene3d(scene);
            var camera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.translate(new Laya.Vector3(57, 2.5, 58));
            camera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.addComponent(CameraMoveScript);
            this.renderTargetCamera = scene.addChild(new Laya.Camera(0, 0.1, 1000));
            this.renderTargetCamera.transform.translate(new Laya.Vector3(57, 2.5, 58));
            this.renderTargetCamera.transform.rotate(new Laya.Vector3(-10, 150, 0), true, false);
            var stageHeight = Laya.stage.height;
            var stageWidth = Laya.stage.width;
            this.renderTargetCamera.renderTarget = new Laya.RenderTexture(stageWidth, stageHeight);
            this.renderTargetCamera.renderingOrder = -1;
            this.renderTargetCamera.addComponent(CameraMoveScript);
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "拾取像素"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    if (this.isPick) {
                        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, null);
                        this.changeActionButton.label = "拾取像素";
                        this.isPick = false;
                    }
                    else {
                        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
                        this.changeActionButton.label = "结束拾取";
                        this.isPick = true;
                    }
                });
            }));
            this.text.x = Laya.stage.width / 2 - 50;
            this.text.y = 50;
            this.text.overflow = Laya.Text.HIDDEN;
            this.text.color = "#FFFFFF";
            this.text.font = "Impact";
            this.text.fontSize = 20;
            this.text.borderColor = "#FFFF00";
            this.text.x = Laya.stage.width / 2;
            this.text.text = "选中的颜色：";
            Laya.stage.addChild(this.text);
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
            if (this.text) {
                this.text.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
            if (this.text) {
                this.text.visible = false;
            }
        }
    }

    class CameraMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "摄像机示例", "摄像机捕捉目标", "多照相机", "创建射线",
                "可视遮罩层", "正交摄像机", "3D空间转2D空间", "渲染3D到2DSprite", "渲染到纹理",
                "渲染到2DSprite", "拾取像素"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    CameraDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    CameraLookAt.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    MultiCamera.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    CameraRay.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    CameraLayer.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    OrthographicCamera.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    D3SpaceToD2Space.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    RenderTarget3DTo2DSprite.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    RenderTargetCamera.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    RenderTargetTo2DSprite.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    PickPixel.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Scene3D = Laya.Scene3D;
    var Handler$1 = Laya.Handler;
    var PostProcess = Laya.PostProcess;
    var BloomEffect = Laya.BloomEffect;
    var Color = Laya.Color;
    var Texture2D = Laya.Texture2D;
    var Button$1 = Laya.Button;
    var Browser$1 = Laya.Browser;
    var Event$1 = Laya.Event;
    class PostProcessBloom extends SingletonScene {
        constructor() {
            super();
            this.camera = null;
            Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Handler$1.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                this.camera = scene.getChildByName("Main Camera");
                this.camera.addComponent(CameraMoveScript);
                var postProcess = new PostProcess();
                var bloom = new BloomEffect();
                postProcess.addEffect(bloom);
                this.camera.postProcess = postProcess;
                this.camera.enableHDR = true;
                bloom.intensity = 5;
                bloom.threshold = 0.9;
                bloom.softKnee = 0.5;
                bloom.clamp = 65472;
                bloom.diffusion = 5;
                bloom.anamorphicRatio = 0.0;
                bloom.color = new Color(1, 1, 1, 1);
                bloom.fastMode = true;
                Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Handler$1.create(null, function (tex) {
                    bloom.dirtTexture = tex;
                    bloom.dirtIntensity = 2.0;
                }));
                this.loadUI();
            }));
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$1.create(this, function () {
                this.button = Laya.stage.addChild(new Button$1(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭HDR"));
                this.button.size(200, 40);
                this.button.labelBold = true;
                this.button.labelSize = 30;
                this.button.sizeGrid = "4,4,4,4";
                this.button.scale(Browser$1.pixelRatio, Browser$1.pixelRatio);
                this.button.pos(Laya.stage.width / 2 - this.button.width * Browser$1.pixelRatio / 2, Laya.stage.height - 60 * Browser$1.pixelRatio);
                this.button.on(Event$1.CLICK, this, function () {
                    var enableHDR = this.camera.enableHDR;
                    if (enableHDR)
                        this.button.label = "开启HDR";
                    else
                        this.button.label = "关闭HDR";
                    this.camera.enableHDR = !enableHDR;
                });
            }));
        }
        Show() {
            super.Show();
            if (this.button) {
                this.button.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.button) {
                this.button.visible = false;
            }
        }
    }

    class PostProcessMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "后处理模糊", "后处理Bloom", "后处理边缘", "后处理景深", "后处理AO"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    PostProcessBloom.getInstance().Click();
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

    class DirectionLightDemo extends SingletonScene {
        constructor() {
            super();
            this._quaternion = new Laya.Quaternion();
            this._direction = new Laya.Vector3();
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
                this.AutoSetScene3d(this.s_scene);
                var grid = this.s_scene.addChild(sprite);
                Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                    var layaMonkey = this.s_scene.addChild(layaMonkey);
                    var aniSprite3d = layaMonkey.getChildAt(0);
                    var animator = aniSprite3d.getComponent(Laya.Animator);
                    var state = new Laya.AnimatorState();
                    state.name = "run";
                    state.clipStart = 40 / 150;
                    state.clipEnd = 70 / 150;
                    state.clip = animator.getDefaultState().clip;
                    animator.addState(state);
                    animator.play("run");
                    Laya.timer.frameLoop(1, this, function () {
                        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
                        directionLight.transform.worldMatrix.getForward(this._direction);
                        Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                        directionLight.transform.worldMatrix.setForward(this._direction);
                        var mat = directionLight.transform.worldMatrix;
                        mat.setForward(this._direction);
                        directionLight.transform.worldMatrix = mat;
                    });
                }));
            }));
        }
    }

    class PointLightDemo extends SingletonScene {
        constructor() {
            super();
            this._temp_position = new Laya.Vector3();
            this._temp_quaternion = new Laya.Quaternion();
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Laya.Vector3(0.1, 0.1, 0.1);
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var pointLight = this.s_scene.addChild(new Laya.PointLight());
            pointLight.color = new Laya.Vector3(1.0, 0.5, 0.0);
            pointLight.transform.position = new Laya.Vector3(0.4, 0.4, 0.0);
            pointLight.range = 3.0;
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
                var grid = this.s_scene.addChild(sprite);
                this.AutoSetScene3d(this.s_scene);
                Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                    this.s_scene.addChild(layaMonkey);
                    var aniSprite3d = layaMonkey.getChildAt(0);
                    var animator = aniSprite3d.getComponent(Laya.Animator);
                    var state = new Laya.AnimatorState();
                    state.name = "attack";
                    state.clipStart = 75 / 150;
                    state.clipEnd = 110 / 150;
                    state.clip = animator.getDefaultState().clip;
                    animator.addState(state);
                    animator.play("attack");
                    Laya.timer.frameLoop(1, this, function () {
                        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._temp_quaternion);
                        Laya.Vector3.transformQuat(pointLight.transform.position, this._temp_quaternion, this._temp_position);
                        pointLight.transform.position = this._temp_position;
                    });
                }));
            }));
        }
    }

    class SpotLightDemo extends SingletonScene {
        constructor() {
            super();
            this._quaternion = new Laya.Quaternion();
            this._direction = new Laya.Vector3();
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 0.7, 1.3));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var spotLight = this.s_scene.addChild(new Laya.SpotLight());
            spotLight.color = new Laya.Vector3(1, 1, 0);
            spotLight.transform.position = new Laya.Vector3(0.0, 1.2, 0.0);
            var mat = spotLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(0.15, -1.0, 0.0));
            spotLight.transform.worldMatrix = mat;
            spotLight.range = 6.0;
            spotLight.spotAngle = 32;
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (sprite) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(sprite);
                Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                    this.s_scene.addChild(layaMonkey);
                    var aniSprite3d = layaMonkey.getChildAt(0);
                    var animator = aniSprite3d.getComponent(Laya.Animator);
                    var state = new Laya.AnimatorState();
                    state.name = "happy";
                    state.clipStart = 115 / 150;
                    state.clipEnd = 150 / 150;
                    state.clip = animator.getDefaultState().clip;
                    animator.addState(state);
                    animator.play("happy");
                    Laya.timer.frameLoop(1, this, function () {
                        Laya.Quaternion.createFromYawPitchRoll(0.025, 0, 0, this._quaternion);
                        spotLight.transform.worldMatrix.getForward(this._direction);
                        Laya.Vector3.transformQuat(this._direction, this._quaternion, this._direction);
                        var mat = spotLight.transform.worldMatrix;
                        mat.setForward(this._direction);
                        spotLight.transform.worldMatrix = mat;
                    });
                }));
            }));
        }
    }

    var Handler$2 = Laya.Handler;
    var Scene3D$1 = Laya.Scene3D;
    var Camera$1 = Laya.Camera;
    var Vector3$1 = Laya.Vector3;
    var DirectionLight = Laya.DirectionLight;
    var MeshSprite3D = Laya.MeshSprite3D;
    var Loader$1 = Laya.Loader;
    var PBRStandardMaterial = Laya.PBRStandardMaterial;
    var Script3D = Laya.Script3D;
    var PrimitiveMesh = Laya.PrimitiveMesh;
    var Button$2 = Laya.Button;
    var Browser$2 = Laya.Browser;
    var Event$2 = Laya.Event;
    class RotationScript extends Script3D {
        constructor() {
            super(...arguments);
            this.autoRotateSpeed = new Vector3$1(0, 0.05, 0);
            this.rotation = true;
        }
        onUpdate() {
            if (this.rotation)
                this.owner.transform.rotate(this.autoRotateSpeed, false);
        }
    }
    class RealTimeShadow extends SingletonScene {
        constructor() {
            super();
            Laya.loader.create([
                GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
            ], Handler$2.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Laya.stage.addChild(new Scene3D$1());
            var camera = (scene.addChild(new Camera$1(0, 0.1, 100)));
            camera.transform.translate(new Vector3$1(0, 1.2, 1.6));
            camera.transform.rotate(new Vector3$1(-35, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = scene.addChild(new DirectionLight());
            directionLight.color = new Vector3$1(0.85, 0.85, 0.8);
            directionLight.transform.rotate(new Vector3$1(-Math.PI / 3, 0, 0));
            directionLight.shadowDistance = 3;
            directionLight.shadowResolution = 1024;
            var rotationScript = directionLight.addComponent(RotationScript);
            var grid = scene.addChild(Loader$1.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
            grid.getChildAt(0).meshRenderer.receiveShadow = true;
            var layaMonkey = scene.addChild(Loader$1.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            layaMonkey.transform.localScale = new Vector3$1(0.3, 0.3, 0.3);
            layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.castShadow = true;
            var sphereSprite = this.addPBRSphere(PrimitiveMesh.createSphere(0.1), new Vector3$1(0, 0.2, 0.5), scene);
            sphereSprite.meshRenderer.castShadow = true;
            sphereSprite.meshRenderer.receiveShadow = true;
            this.loadUI(rotationScript);
        }
        addPBRSphere(sphereMesh, position, scene) {
            var mat = new PBRStandardMaterial();
            mat.smoothness = 0.2;
            var meshSprite = new MeshSprite3D(sphereMesh);
            meshSprite.meshRenderer.sharedMaterial = mat;
            var transform = meshSprite.transform;
            transform.localPosition = position;
            scene.addChild(meshSprite);
            return meshSprite;
        }
        loadUI(rottaionScript) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$2.create(this, function () {
                this.rotationButton = Laya.stage.addChild(new Button$2("res/threeDimen/ui/button.png", "Stop Rotation"));
                this.rotationButton.size(150, 30);
                this.rotationButton.labelSize = 20;
                this.rotationButton.sizeGrid = "4,4,4,4";
                this.rotationButton.scale(Browser$2.pixelRatio, Browser$2.pixelRatio);
                this.rotationButton.pos(Laya.stage.width / 2 - this.rotationButton.width * Browser$2.pixelRatio / 2, Laya.stage.height - 40 * Browser$2.pixelRatio);
                this.rotationButton.on(Event$2.CLICK, this, function () {
                    if (rottaionScript.rotation) {
                        this.rotationButton.label = "Start Rotation";
                        rottaionScript.rotation = false;
                    }
                    else {
                        this.rotationButton.label = "Stop Rotation";
                        rottaionScript.rotation = true;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.rotationButton) {
                this.rotationButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.rotationButton) {
                this.rotationButton.visible = false;
            }
        }
    }

    var Shader3D = Laya.Shader3D;
    var Handler$3 = Laya.Handler;
    var Scene3D$2 = Laya.Scene3D;
    var SpotLight = Laya.SpotLight;
    var MeshSprite3D$1 = Laya.MeshSprite3D;
    class SpotLightShadowMap extends SingletonScene {
        constructor() {
            super();
            Shader3D.debugMode = true;
            Scene3D$2.load(GlobalConfig.ResPath + "res/threeDimen/testNewFunction/LayaScene_depthScene/Conventional/depthScene.ls", Handler$3.create(this, function (scene) {
                this.demoScene = scene;
                this.AutoSetScene3d(this.demoScene);
                this.camera = scene.getChildByName("Camera");
                this.camera.addComponent(CameraMoveScript);
                this.camera.active = true;
                this.receaveRealShadow(this.demoScene);
            }));
        }
        receaveRealShadow(scene3d) {
            var childLength = scene3d.numChildren;
            for (var i = 0; i < childLength; i++) {
                var childSprite = scene3d.getChildAt(i);
                if (childSprite instanceof MeshSprite3D$1) {
                    childSprite.meshRenderer.receiveShadow = true;
                    childSprite.meshRenderer.castShadow = true;
                }
                else if (childSprite instanceof SpotLight) {
                    childSprite.shadowDistance = 3;
                    childSprite.shadowResolution = 512;
                }
            }
            return;
        }
    }

    var Handler$4 = Laya.Handler;
    var Scene3D$3 = Laya.Scene3D;
    var Vector3$2 = Laya.Vector3;
    var PointLight = Laya.PointLight;
    var SpotLight$1 = Laya.SpotLight;
    var Script3D$1 = Laya.Script3D;
    class LightMoveScript extends Script3D$1 {
        constructor() {
            super(...arguments);
            this.forward = new Vector3$2();
            this.lights = [];
            this.offsets = [];
            this.moveRanges = [];
        }
        onUpdate() {
            var seed = Laya.timer.currTimer * 0.002;
            for (var i = 0, n = this.lights.length; i < n; i++) {
                var transform = this.lights[i].transform;
                var pos = transform.localPosition;
                var off = this.offsets[i];
                var ran = this.moveRanges[i];
                pos.x = off.x + Math.sin(seed) * ran.x;
                pos.y = off.y + Math.sin(seed) * ran.y;
                pos.z = off.z + Math.sin(seed) * ran.z;
                transform.localPosition = pos;
            }
        }
    }
    class MultiLight extends SingletonScene {
        constructor() {
            super();
            var c = new Config3D();
            c.maxLightCount = 16;
            Scene3D$3.load(GlobalConfig.ResPath + "res/threeDimen/scene/MultiLightScene/InventoryScene_Forest.ls", Handler$4.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
                camera.transform.localPosition = new Vector3$2(8.937199060699333, 61.364798067809126, -66.77836086472654);
                var moveScript = camera.addComponent(LightMoveScript);
                var moverLights = moveScript.lights;
                var offsets = moveScript.offsets;
                var moveRanges = moveScript.moveRanges;
                moverLights.length = 15;
                for (var i = 0; i < 15; i++) {
                    var pointLight = scene.addChild(new PointLight());
                    pointLight.range = 2.0 + Math.random() * 8.0;
                    pointLight.color.setValue(Math.random(), Math.random(), Math.random());
                    pointLight.intensity = 6.0 + Math.random() * 8;
                    moverLights[i] = pointLight;
                    offsets[i] = new Vector3$2((Math.random() - 0.5) * 10, pointLight.range * 0.75, (Math.random() - 0.5) * 10);
                    moveRanges[i] = new Vector3$2((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
                }
                var spotLight = scene.addChild(new SpotLight$1());
                spotLight.transform.localPosition = new Vector3$2(0.0, 9.0, -35.0);
                spotLight.transform.localRotationEuler = new Vector3$2(-15.0, 180.0, 0.0);
                spotLight.color.setValue(Math.random(), Math.random(), Math.random());
                spotLight.range = 50;
                spotLight.intensity = 15;
                spotLight.spotAngle = 60;
            }));
        }
    }

    class LightingMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "方向光", "点光", "聚光", "实时阴影", "Spot实时阴影", "多光源"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    DirectionLightDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    PointLightDemo.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    SpotLightDemo.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    RealTimeShadow.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    SpotLightShadowMap.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    MultiLight.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class SkinnedMeshSprite3DDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            var dude = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh"));
            var scale = new Laya.Vector3(0.1, 0.1, 0.1);
            dude.transform.localScale = scale;
            dude.transform.rotate(new Laya.Vector3(0, 3.14, 0));
        }
    }

    class Sprite3DParent extends SingletonScene {
        constructor() {
            super();
            this.btns = [];
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this.AutoSetScene3d(this.s_scene);
            var layaMonkeyParent = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            var layaMonkeySon = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey2/LayaMonkey.lh");
            layaMonkeySon.transform.translate(new Laya.Vector3(2.5, 0, 0));
            var scale = new Laya.Vector3(0.5, 0.5, 0.5);
            layaMonkeySon.transform.localScale = scale;
            layaMonkeyParent.addChild(layaMonkeySon);
            this.addBtn(30, 100, 50, 20, "移动父级猴子", 10, function (e) {
                layaMonkeyParent.transform.translate(new Laya.Vector3(-0.1, 0, 0));
            });
            this.addBtn(30, 120, 50, 20, "放大父级猴子", 10, function (e) {
                var scale = new Laya.Vector3(0.2, 0.2, 0.2);
                layaMonkeyParent.transform.localScale = scale;
            });
            this.addBtn(30, 140, 50, 20, "旋转父级猴子", 10, function (e) {
                layaMonkeyParent.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            });
            this.addBtn(30, 160, 50, 20, "移动子级猴子", 10, function (e) {
                layaMonkeySon.transform.translate(new Laya.Vector3(-0.1, 0, 0));
            });
            this.addBtn(30, 180, 50, 20, "放大子级猴子", 10, function (e) {
                var scale = new Laya.Vector3(1, 1, 1);
                layaMonkeySon.transform.localScale = scale;
            });
            this.addBtn(30, 200, 50, 20, "旋转子级猴子", 10, function (e) {
                layaMonkeySon.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            });
        }
        addBtn(x, y, width, height, text, size, clickFun) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                var changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
                changeActionButton.size(width, height);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = size;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                changeActionButton.pos(x, y);
                changeActionButton.on(Laya.Event.CLICK, this, clickFun);
                this.btns.push(changeActionButton);
            }));
        }
        Show() {
            super.Show();
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].visible = true;
            }
        }
        Hide() {
            super.Hide();
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].visible = false;
            }
        }
    }

    class TransformDemo extends SingletonScene {
        constructor() {
            super();
            this.position = new Laya.Vector3(0, 0, 0);
            this.position1 = new Laya.Vector3(0, 0, 0);
            this.rotate = new Laya.Vector3(0, 1, 0);
            this.scale = new Laya.Vector3();
            this.rotate1 = new Laya.Vector3(0, 0, 0);
            this.scaleDelta = 0;
            this.scaleValue = 0;
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.8, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            Laya.loader.create([
                GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
            ], Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            var grid = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
            var staticLayaMonkey = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm")));
            staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
            var staticMonkeyTransform = staticLayaMonkey.transform;
            var staticPos = staticMonkeyTransform.position;
            staticPos.setValue(0, 0, 0.5);
            staticMonkeyTransform.position = staticPos;
            var staticScale = staticMonkeyTransform.localScale;
            staticScale.setValue(0.3, 0.3, 0.3);
            staticMonkeyTransform.localScale = staticScale;
            staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            staticLayaMonkey.removeSelf();
            this.layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
            this.layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
            this.layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, this.position1);
            this.clone1Transform = this.layaMonkey_clone1.transform;
            this.clone2Transform = this.layaMonkey_clone2.transform;
            this.clone3Transform = this.layaMonkey_clone3.transform;
            this.position1.setValue(-1.5, 0, 0.0);
            this.clone2Transform.translate(this.position1);
            this.position1.setValue(1.0, 0, 0.0);
            this.clone3Transform.translate(this.position1);
            this.rotate1.setValue(0, 60, 0);
            this.clone2Transform.rotate(this.rotate1, false, false);
            var scale = this.clone3Transform.localScale;
            scale.setValue(0.1, 0.1, 0.1);
            this.clone3Transform.localScale = scale;
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate() {
            if (!this.isShow) {
                return;
            }
            this.scaleValue = Math.sin(this.scaleDelta += 0.1);
            this.position.y = Math.max(0, this.scaleValue / 2);
            ;
            this.layaMonkey_clone1.transform.position = this.position;
            this.layaMonkey_clone2.transform.rotate(this.rotate, false, false);
            this.scale.x = this.scale.y = this.scale.z = Math.abs(this.scaleValue) / 5;
            this.layaMonkey_clone3.transform.localScale = this.scale;
        }
    }

    class Tool {
        constructor() { }
        static linearModel(sprite3D, lineSprite3D, color) {
            if (sprite3D instanceof Laya.MeshSprite3D) {
                var meshSprite3D = sprite3D;
                var mesh = meshSprite3D.meshFilter.sharedMesh;
                var positions = [];
                mesh.getPositions(positions);
                var indices = mesh.getSubMesh(0).getIndices();
                for (var i = 0; i < indices.length; i += 3) {
                    var vertex0 = positions[indices[i]];
                    var vertex1 = positions[indices[i + 1]];
                    var vertex2 = positions[indices[i + 2]];
                    Laya.Vector3.transformCoordinate(vertex0, meshSprite3D.transform.worldMatrix, this.transVertex0);
                    Laya.Vector3.transformCoordinate(vertex1, meshSprite3D.transform.worldMatrix, this.transVertex1);
                    Laya.Vector3.transformCoordinate(vertex2, meshSprite3D.transform.worldMatrix, this.transVertex2);
                    lineSprite3D.addLine(this.transVertex0, this.transVertex1, color, color);
                    lineSprite3D.addLine(this.transVertex1, this.transVertex2, color, color);
                    lineSprite3D.addLine(this.transVertex2, this.transVertex0, color, color);
                }
            }
            for (var i = 0, n = sprite3D.numChildren; i < n; i++)
                Tool.linearModel((sprite3D.getChildAt(i)), lineSprite3D, color);
        }
    }
    Tool.transVertex0 = new Laya.Vector3();
    Tool.transVertex1 = new Laya.Vector3();
    Tool.transVertex2 = new Laya.Vector3();

    class PixelLineSprite3DDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 2, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.sprite3D = this.s_scene.addChild(new Laya.Sprite3D());
            this.lineSprite3D = this.s_scene.addChild(new Laya.Sprite3D());
            var sphere = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20)));
            sphere.transform.position = new Laya.Vector3(0.0, 0.75, 2);
            var sphereLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(3500));
            Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);
            this.sprite3D.active = false;
            ;
            this.lineSprite3D.active = true;
            this.AutoSetScene3d(this.s_scene);
        }
    }

    class Sprite3DClone extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Laya.Vector3(1, 1, 1);
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            var layaMonkey = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            var layaMonkey_clone1 = Laya.Sprite3D.instantiate(layaMonkey, this.s_scene, false, new Laya.Vector3(0.6, 0, 0));
            var layaMonkey_clone2 = this.s_scene.addChild(Laya.Sprite3D.instantiate(layaMonkey, null, false, new Laya.Vector3(-0.6, 0, 0)));
        }
    }

    class Sprite3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "蒙皮精灵", "子父级关系", "变换示例", "克隆精灵", "像素线精灵"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    SkinnedMeshSprite3DDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Sprite3DParent.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    TransformDemo.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Sprite3DClone.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    PixelLineSprite3DDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class MeshLoad extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.curStateIndex = 0;
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            this.sprite3D = this.s_scene.addChild(new Laya.Sprite3D());
            this.lineSprite3D = this.s_scene.addChild(new Laya.Sprite3D());
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                this.AutoSetScene3d(this.s_scene);
                var layaMonkey = this.sprite3D.addChild(new Laya.MeshSprite3D(mesh));
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                var layaMonkeyLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(5000));
                Tool.linearModel(layaMonkey, layaMonkeyLineSprite3D, Laya.Color.GREEN);
                var plane = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(6, 6, 10, 10)));
                plane.transform.position = new Laya.Vector3(0, 0, -1);
                var planeLineSprite3D = this.lineSprite3D.addChild(new Laya.PixelLineSprite3D(1000));
                Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);
                Laya.timer.frameLoop(1, this, function () {
                    layaMonkeyLineSprite3D.transform.rotate(this.rotation, false);
                    layaMonkey.transform.rotate(this.rotation, false);
                });
                this.lineSprite3D.active = false;
                this.loadUI();
            }));
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "正常模式"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    if (++this.curStateIndex % 2 == 1) {
                        this.sprite3D.active = false;
                        this.lineSprite3D.active = true;
                        this.changeActionButton.label = "网格模式";
                    }
                    else {
                        this.sprite3D.active = true;
                        this.lineSprite3D.active = false;
                        this.changeActionButton.label = "正常模式";
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class CustomMesh extends SingletonScene {
        constructor() {
            super();
            this.curStateIndex = 0;
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 2, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.sprite3D = new Laya.Sprite3D();
            this.s_scene.addChild(this.sprite3D);
            this.lineSprite3D = new Laya.Sprite3D();
            this.s_scene.addChild(this.lineSprite3D);
            var box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5));
            this.sprite3D.addChild(box);
            box.transform.position = new Laya.Vector3(2.0, 0.25, 0.6);
            box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
            var boxLineSprite3D = new Laya.PixelLineSprite3D(100);
            this.lineSprite3D.addChild(boxLineSprite3D);
            Tool.linearModel(box, boxLineSprite3D, Laya.Color.GREEN);
            var sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.25, 20, 20));
            this.sprite3D.addChild(sphere);
            sphere.transform.position = new Laya.Vector3(1.0, 0.25, 0.6);
            var sphereLineSprite3D = new Laya.PixelLineSprite3D(3500);
            this.lineSprite3D.addChild(sphereLineSprite3D);
            Tool.linearModel(sphere, sphereLineSprite3D, Laya.Color.GREEN);
            var cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(0.25, 1, 20));
            this.sprite3D.addChild(cylinder);
            cylinder.transform.position = new Laya.Vector3(0, 0.5, 0.6);
            var cylinderLineSprite3D = new Laya.PixelLineSprite3D(1000);
            this.lineSprite3D.addChild(cylinderLineSprite3D);
            Tool.linearModel(cylinder, cylinderLineSprite3D, Laya.Color.GREEN);
            var capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20));
            this.sprite3D.addChild(capsule);
            capsule.transform.position = new Laya.Vector3(-1.0, 0.5, 0.6);
            var capsuleLineSprite3D = new Laya.PixelLineSprite3D(3000);
            this.lineSprite3D.addChild(capsuleLineSprite3D);
            Tool.linearModel(capsule, capsuleLineSprite3D, Laya.Color.GREEN);
            var cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(0.25, 0.75));
            this.sprite3D.addChild(cone);
            cone.transform.position = new Laya.Vector3(-2.0, 0.375, 0.6);
            var coneLineSprite3D = new Laya.PixelLineSprite3D(500);
            this.lineSprite3D.addChild(coneLineSprite3D);
            Tool.linearModel(cone, coneLineSprite3D, Laya.Color.GREEN);
            var plane = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(6, 6, 10, 10));
            this.sprite3D.addChild(plane);
            var planeLineSprite3D = new Laya.PixelLineSprite3D(1000);
            this.lineSprite3D.addChild(planeLineSprite3D);
            Tool.linearModel(plane, planeLineSprite3D, Laya.Color.GRAY);
            this.lineSprite3D.active = false;
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "/res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.AutoSetScene3d(this.s_scene);
                this.changeActionButton = new Laya.Button(GlobalConfig.ResPath + "/res/threeDimen/ui/button.png", "正常模式");
                Laya.stage.addChild(this.changeActionButton);
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    if (++this.curStateIndex % 2 == 1) {
                        this.sprite3D.active = false;
                        this.lineSprite3D.active = true;
                        this.changeActionButton.label = "网格模式";
                    }
                    else {
                        this.sprite3D.active = true;
                        this.lineSprite3D.active = false;
                        this.changeActionButton.label = "正常模式";
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class ChangeMesh extends SingletonScene {
        constructor() {
            super();
            this.index = 0;
            this.sphere = null;
            this.box = null;
            this.capsule = null;
            this.cylinder = null;
            this.cone = null;
            this.changeActionButton = null;
            this.index = 0;
            var resource = [GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls"];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this.s_scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls");
            var camera = this.s_scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            this.sphere = this.s_scene.getChildByName("Sphere");
            this.sphereMesh = this.sphere.meshFilter.sharedMesh;
            this.box = Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5);
            this.capsule = Laya.PrimitiveMesh.createCapsule(0.25, 1, 10, 20);
            this.cylinder = Laya.PrimitiveMesh.createCylinder(0.25, 1, 20);
            this.cone = Laya.PrimitiveMesh.createCone(0.25, 0.75);
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.AutoSetScene3d(this.s_scene);
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换Mesh"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.index++;
                    if (this.index % 5 === 1) {
                        this.sphere.meshFilter.sharedMesh = this.box;
                    }
                    else if (this.index % 5 === 2) {
                        this.sphere.meshFilter.sharedMesh = this.capsule;
                    }
                    else if (this.index % 5 === 3) {
                        this.sphere.meshFilter.sharedMesh = this.cylinder;
                    }
                    else if (this.index % 5 === 3) {
                        this.sphere.meshFilter.sharedMesh = this.cone;
                    }
                    else {
                        this.sphere.meshFilter.sharedMesh = this.sphereMesh;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class MeshMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "网格加载", "自定义网格", "切换网格"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    MeshLoad.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    CustomMesh.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    ChangeMesh.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class MaterialDemo extends SingletonScene {
        constructor() {
            super();
            this.index = 0;
            this.sphere = null;
            this.pbrStandardMaterial = null;
            this.pbrTexture = null;
            this.billinMaterial = null;
            this.changeActionButton = null;
            this.index = 0;
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls",
                GlobalConfig.ResPath + "res/threeDimen/texture/earth.png",
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this.s_scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/ChangeMaterialDemo/Conventional/scene.ls");
            var camera = this.s_scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            this.sphere = this.s_scene.getChildByName("Sphere");
            this.billinMaterial = this.sphere.meshRenderer.material;
            this.pbrStandardMaterial = new Laya.PBRStandardMaterial();
            this.pbrTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png");
            this.pbrStandardMaterial.albedoTexture = this.pbrTexture;
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.AutoSetScene3d(this.s_scene);
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换材质"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.index++;
                    if (this.index % 2 === 1) {
                        this.sphere.meshRenderer.material = this.pbrStandardMaterial;
                    }
                    else {
                        this.sphere.meshRenderer.material = this.billinMaterial;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }

    class BlinnPhongMaterialLoad extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 0.9, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                this.AutoSetScene3d(this.s_scene);
                var layaMonkey = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                Laya.Material.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat", Laya.Handler.create(null, function (mat) {
                    layaMonkey.meshRenderer.material = mat;
                }));
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                Laya.timer.frameLoop(1, this, function () {
                    layaMonkey.transform.rotate(this.rotation, false);
                });
            }));
        }
    }

    class BlinnPhong_DiffuseMap extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var sphereMesh = Laya.PrimitiveMesh.createSphere();
            var earth1 = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh));
            earth1.transform.position = new Laya.Vector3(-0.6, 0, 0);
            var earth2 = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh));
            earth2.transform.position = new Laya.Vector3(0.6, 0, 0);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
                this.AutoSetScene3d(this.s_scene);
                material.albedoTexture = texture;
            }));
            earth2.meshRenderer.material = material;
            Laya.timer.frameLoop(1, this, function () {
                earth1.transform.rotate(this.rotation, false);
                earth2.transform.rotate(this.rotation, false);
            });
        }
    }

    class BlinnPhong_NormalMap extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.normalMapUrl = [
                GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizardeye_norm.png",
                GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png",
                GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/rock_norm.png"
            ];
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 0.6, 1.1));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
            directionLight.transform.worldMatrix = mat;
            directionLight.color = new Laya.Vector3(1, 1, 1);
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, this.onComplete), null, Laya3D.HIERARCHY);
        }
        onComplete(s) {
            this.AutoSetScene3d(this.s_scene);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/lizard.lh", Laya.Handler.create(this, function (sprite) {
                var monster1 = this.s_scene.addChild(sprite);
                monster1.transform.position = new Laya.Vector3(-0.6, 0, 0);
                monster1.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
                var monster2 = Laya.Sprite3D.instantiate(monster1, this.s_scene, false, new Laya.Vector3(0.6, 0, 0));
                monster2.transform.localScale = new Laya.Vector3(0.075, 0.075, 0.075);
                for (var i = 0; i < monster2.getChildByName("lizard").numChildren; i++) {
                    var meshSprite3D = monster2.getChildByName("lizard").getChildAt(i);
                    var material = meshSprite3D.meshRenderer.material;
                    Laya.Texture2D.load(this.normalMapUrl[i], Laya.Handler.create(this, function (mat, texture) {
                        mat.normalTexture = texture;
                    }, [material]));
                }
                Laya.timer.frameLoop(1, this, function () {
                    monster1.transform.rotate(this.rotation);
                    monster2.transform.rotate(this.rotation);
                });
            }));
        }
    }

    class BlinnPhong_SpecularMap extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.specularMapUrl = [
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/headS.png",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/jacketS.png",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/pantsS.png",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/upBodyS.png"
            ];
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 3, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function (sprite) {
                var dude1 = this.s_scene.addChild(sprite);
                dude1.transform.position = new Laya.Vector3(-1.5, 0, 0);
                var dude2 = Laya.Sprite3D.instantiate(dude1, this.scene, false, new Laya.Vector3(1.5, 0, 0));
                var skinnedMeshSprite3d = dude2.getChildAt(0).getChildAt(0);
                for (var i = 0; i < skinnedMeshSprite3d.skinnedMeshRenderer.materials.length; i++) {
                    var material = skinnedMeshSprite3d.skinnedMeshRenderer.materials[i];
                    Laya.Texture2D.load(this.specularMapUrl[i], Laya.Handler.create(this, function (mat, tex) {
                        mat.specularTexture = tex;
                    }, [material]));
                }
                Laya.timer.frameLoop(1, this, function () {
                    dude1.transform.rotate(this.rotation);
                    dude2.transform.rotate(this.rotation);
                });
            }));
        }
    }

    class Blinnphong_Transmission extends SingletonScene {
        constructor() {
            super();
            this.resource = [
                GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png",
                GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg"
            ];
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/TransmissionScene.ls", Laya.Handler.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
                this.rabbitModel = scene.getChildByName("rabbit");
                this.monkeyModel = scene.getChildByName("monkey");
                this.rabbitMaterial = this.rabbitModel.meshRenderer.sharedMaterial;
                this.monkeyMaterial = this.monkeyModel.meshRenderer.sharedMaterial;
                this.loadThinkNessTexture();
            }));
        }
        loadThinkNessTexture() {
            Laya.loader.create(this.resource, Laya.Handler.create(this, this.onPreLoadFinish));
        }
        onPreLoadFinish() {
            this.monkeyMaterial.normalTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/monkeyThinkness.png");
            this.rabbitMaterial.normalTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_TransmissionScene/Conventional/Assets/rabbitthickness.jpg");
        }
    }

    var Vector3$3 = Laya.Vector3;
    var Shader3D$1 = Laya.Shader3D;
    var Scene3D$4 = Laya.Scene3D;
    var Handler$5 = Laya.Handler;
    var PrimitiveMesh$1 = Laya.PrimitiveMesh;
    var Vector4 = Laya.Vector4;
    var PBRStandardMaterial$1 = Laya.PBRStandardMaterial;
    var MeshSprite3D$2 = Laya.MeshSprite3D;
    class PBRMaterialDemo extends SingletonScene {
        constructor() {
            super();
            Shader3D$1.debugMode = true;
            Scene3D$4.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_EmptyScene/Conventional/EmptyScene.ls", Handler$5.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                var moveScript = camera.addComponent(CameraMoveScript);
                moveScript.rotaionSpeed = 0.005;
                var sphereMesh = PrimitiveMesh$1.createSphere(0.25, 32, 32);
                const row = 6;
                this.addSpheresSpecialMetallic(sphereMesh, new Vector3$3(0, 1.5, 0), scene, row, new Vector4(186 / 255, 110 / 255, 64 / 255, 1.0), 1.0);
                this.addSpheresSmoothnessMetallic(sphereMesh, new Vector3$3(0, 0, 0), scene, 3, row, new Vector4(1.0, 1.0, 1.0, 1.0));
                this.addSpheresSpecialMetallic(sphereMesh, new Vector3$3(0, -1.5, 0), scene, row, new Vector4(0.0, 0.0, 0.0, 1.0), 0.0);
            }));
        }
        addPBRSphere(sphereMesh, position, scene, color, smoothness, metallic) {
            var mat = new PBRStandardMaterial$1();
            mat.albedoColor = color;
            mat.smoothness = smoothness;
            mat.metallic = metallic;
            var meshSprite = new MeshSprite3D$2(sphereMesh);
            meshSprite.meshRenderer.sharedMaterial = mat;
            var transform = meshSprite.transform;
            transform.localPosition = position;
            scene.addChild(meshSprite);
            return mat;
        }
        addSpheresSmoothnessMetallic(sphereMesh, offset, scene, row, col, color) {
            const width = col * 0.5;
            const height = row * 0.5;
            for (var i = 0, n = col; i < n; i++) {
                for (var j = 0, m = row; j < m; j++) {
                    var smoothness = i / (n - 1);
                    var metallic = 1.0 - j / (m - 1);
                    var pos = PBRMaterialDemo._tempPos;
                    pos.setValue(-width / 2 + i * width / (n - 1), height / 2 - j * height / (m - 1), 3.0);
                    Vector3$3.add(offset, pos, pos);
                    this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
                }
            }
        }
        addSpheresSpecialMetallic(sphereMesh, offset, scene, col, color, metallic = 0) {
            const width = col * 0.5;
            for (var i = 0, n = col; i < n; i++) {
                var smoothness = i / (n - 1);
                var metallic = metallic;
                var pos = PBRMaterialDemo._tempPos;
                pos.setValue(-width / 2 + i * width / (n - 1), 0, 3.0);
                Vector3$3.add(offset, pos, pos);
                this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
            }
        }
    }
    PBRMaterialDemo._tempPos = new Vector3$3();

    class EffectMaterialDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var earth = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere()));
            earth.transform.position = new Laya.Vector3(0, 0, 0);
            var material = new Laya.EffectMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
                this.AutoSetScene3d(this.s_scene);
                material.texture = texture;
                material.color = new Laya.Vector4(0, 0, 0.6, 1);
            }));
            earth.meshRenderer.material = material;
            Laya.timer.frameLoop(1, this, function () {
                earth.transform.rotate(this.rotation, false);
            });
        }
    }

    class UnlitMaterialDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            var sphereMesh = Laya.PrimitiveMesh.createSphere();
            var earth1 = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh));
            earth1.transform.position = new Laya.Vector3(-0.6, 0, 0);
            var earth2 = this.s_scene.addChild(new Laya.MeshSprite3D(sphereMesh));
            earth2.transform.position = new Laya.Vector3(0.6, 0, 0);
            var material = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
                this.AutoSetScene3d(this.s_scene);
                material.albedoTexture = texture;
                material.albedoIntensity = 1;
            }));
            earth1.meshRenderer.material = material;
            var material2 = new Laya.UnlitMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (texture) {
                material2.albedoTexture = texture;
                material2.albedoIntensity = 1;
                material2.albedoColor = new Laya.Vector4(0, 0, 0.6, 1);
            }));
            earth2.meshRenderer.material = material2;
            Laya.timer.frameLoop(1, this, function () {
                earth1.transform.rotate(this.rotation, false);
                earth2.transform.rotate(this.rotation, false);
            });
        }
    }

    class WaterPrimaryMaterialDemo extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_water/Conventional/Default.ls", Laya.Handler.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    class MaterialMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页",
                "材质示例", "BP材质加载", "BP漫反射贴图", "BP法线贴图", "BP高光贴图",
                "BP透射", "PBR材质", "Effect材质", "Unlit材质", "WaterPrimary材质"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    MaterialDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    BlinnPhongMaterialLoad.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    BlinnPhong_DiffuseMap.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    BlinnPhong_NormalMap.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    BlinnPhong_SpecularMap.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    Blinnphong_Transmission.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    PBRMaterialDemo.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    EffectMaterialDemo.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    UnlitMaterialDemo.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    WaterPrimaryMaterialDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class TextureDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 2, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Laya.Vector4(0.2, 0.2, 0.2, 1.0);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.sprite3D = this.s_scene.addChild(new Laya.Sprite3D());
            var box = this.sprite3D.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.5, 0.5, 0.5)));
            box.transform.position = new Laya.Vector3(0.0, 1.0, 2.5);
            box.transform.rotate(new Laya.Vector3(0, 0, 0), false, false);
            var mater = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png", Laya.Handler.create(this, function (texture) {
                this.AutoSetScene3d(this.s_scene);
                texture.wrapModeU = Laya.BaseTexture.WARPMODE_CLAMP;
                texture.wrapModeV = Laya.BaseTexture.WARPMODE_REPEAT;
                texture.filterMode = Laya.BaseTexture.FILTERMODE_BILINEAR;
                texture.anisoLevel = 2;
                mater.albedoTexture = texture;
                var tilingOffset = mater.tilingOffset;
                tilingOffset.setValue(2, 2, 0, 0);
                mater.tilingOffset = tilingOffset;
                box.meshRenderer.material = mater;
            }));
        }
    }

    class TextureGPUCompression extends SingletonScene {
        constructor() {
            super();
            if (Laya.Browser.onAndroid) {
                Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/Android/scene.ls", Laya.Handler.create(this, function (scene) {
                    Laya.stage.addChild(scene);
                    var camera = scene.getChildByName("Main Camera");
                    camera.addComponent(CameraMoveScript);
                }));
            }
            else if (Laya.Browser.onIOS) {
                Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/IOS/scene.ls", Laya.Handler.create(this, function (scene) {
                    Laya.stage.addChild(scene);
                    var camera = scene.getChildByName("Main Camera");
                    camera.addComponent(CameraMoveScript);
                }));
            }
            else {
                Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_TextureGPUCompression/Conventional/scene.ls", Laya.Handler.create(this, function (scene) {
                    this.AutoSetScene3d(scene);
                    var camera = scene.getChildByName("Main Camera");
                    camera.addComponent(CameraMoveScript);
                }));
            }
        }
    }

    var Sprite3D$1 = Laya.Sprite3D;
    var Scene3D$5 = Laya.Scene3D;
    var Camera$2 = Laya.Camera;
    var Vector3$4 = Laya.Vector3;
    var Vector4$1 = Laya.Vector4;
    var MeshSprite3D$3 = Laya.MeshSprite3D;
    var PrimitiveMesh$2 = Laya.PrimitiveMesh;
    var DirectionLight$1 = Laya.DirectionLight;
    var Texture2D$1 = Laya.Texture2D;
    var BlinnPhongMaterial = Laya.BlinnPhongMaterial;
    var TextureFormat = Laya.TextureFormat;
    var HalfFloatUtils = Laya.HalfFloatUtils;
    var FilterMode = Laya.FilterMode;
    class HalfFloatTexture extends SingletonScene {
        constructor() {
            super();
            var scene = new Scene3D$5();
            var camera = scene.addChild(new Camera$2(0, 0.1, 100));
            camera.transform.translate(new Vector3$4(0, 2, 5));
            camera.transform.rotate(new Vector3$4(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$1(0.2, 0.2, 0.2, 1.0);
            var directionLight = scene.addChild(new DirectionLight$1());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3$4(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.sprite3D = scene.addChild(new Sprite3D$1());
            var box = this.sprite3D.addChild(new MeshSprite3D$3(PrimitiveMesh$2.createPlane(1, 1)));
            box.transform.position = new Vector3$4(0.0, 1.0, 2.5);
            box.transform.rotate(new Vector3$4(90, 0, 0), false, false);
            var material = new BlinnPhongMaterial();
            material.albedoTexture = this.createHalfFloatTexture();
            box.meshRenderer.sharedMaterial = material;
            this.AutoSetScene3d(scene);
        }
        createHalfFloatTexture() {
            var texture = new Texture2D$1(50, 50, TextureFormat.R32G32B32A32, false, true);
            var pixelData = new Uint16Array(50 * 50 * 4);
            var pixelIndex;
            var step = 1.0 / 50;
            for (var x = 0, n = 50; x < n; x++) {
                for (var y = 0, m = 50; y < m; y++) {
                    pixelIndex = (x + y * 50) * 4;
                    pixelData[pixelIndex] = HalfFloatUtils.roundToFloat16Bits(1.0);
                    pixelData[pixelIndex + 1] = HalfFloatUtils.roundToFloat16Bits(x * step);
                    pixelData[pixelIndex + 2] = HalfFloatUtils.roundToFloat16Bits(y * step);
                    pixelData[pixelIndex + 3] = HalfFloatUtils.roundToFloat16Bits(1.0);
                }
            }
            texture.setPixels(pixelData, 0);
            texture.filterMode = FilterMode.Bilinear;
            return texture;
        }
    }

    var UnlitMaterial = Laya.UnlitMaterial;
    var Scene3D$6 = Laya.Scene3D;
    var Camera$3 = Laya.Camera;
    var Vector3$5 = Laya.Vector3;
    var Vector4$2 = Laya.Vector4;
    var MeshSprite3D$4 = Laya.MeshSprite3D;
    var PrimitiveMesh$3 = Laya.PrimitiveMesh;
    var Browser$3 = Laya.Browser;
    var Texture2D$2 = Laya.Texture2D;
    var Handler$6 = Laya.Handler;
    class GPUCompression_ASTC extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Scene3D$6();
            var camera = this.s_scene.addChild(new Camera$3(0, 0.1, 100));
            camera.transform.translate(new Vector3$5(0, 2, 5));
            camera.transform.rotate(new Vector3$5(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$2(0.2, 0.2, 0.2, 1.0);
            let meshSprite = new MeshSprite3D$4(PrimitiveMesh$3.createBox());
            this.mat = new UnlitMaterial();
            this.s_scene.addChild(meshSprite);
            meshSprite.meshRenderer.sharedMaterial = this.mat;
            if (!Browser$3.onAndroid && !Browser$3.onIOS) {
                console.log("PC不支持ASTC纹理");
                return;
            }
            Texture2D$2.load(GlobalConfig.ResPath + "res/threeDimen/texture/ASTC4x4Test.ktx", Handler$6.create(this, function (texture) {
                this.mat.albedoTexture = texture;
                this.AutoSetScene3d(this.s_scene);
            }));
        }
    }

    var UnlitMaterial$1 = Laya.UnlitMaterial;
    var Scene3D$7 = Laya.Scene3D;
    var Camera$4 = Laya.Camera;
    var Vector3$6 = Laya.Vector3;
    var Vector4$3 = Laya.Vector4;
    var MeshSprite3D$5 = Laya.MeshSprite3D;
    var PrimitiveMesh$4 = Laya.PrimitiveMesh;
    var Browser$4 = Laya.Browser;
    var Texture2D$3 = Laya.Texture2D;
    var Handler$7 = Laya.Handler;
    class GPUCompression_ETC2 extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Scene3D$7();
            var camera = this.s_scene.addChild(new Camera$4(0, 0.1, 100));
            camera.transform.translate(new Vector3$6(0, 2, 5));
            camera.transform.rotate(new Vector3$6(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$3(0.2, 0.2, 0.2, 1.0);
            let meshSprite = new MeshSprite3D$5(PrimitiveMesh$4.createBox());
            this.mat = new UnlitMaterial$1();
            this.s_scene.addChild(meshSprite);
            meshSprite.meshRenderer.sharedMaterial = this.mat;
            if (!Browser$4.onAndroid) {
                console.log("只有安卓支持ETC");
                return;
            }
            Texture2D$3.load(GlobalConfig.ResPath + "res/threeDimen/texture/ETC2Test.ktx", Handler$7.create(this, function (texture) {
                this.mat.albedoTexture = texture;
                this.AutoSetScene3d(this.s_scene);
            }));
        }
    }

    class TextureMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "纹理示例", "纹理压缩", "半浮点数纹理", "GPU压缩ASTC", "GPU压缩ETC2"
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    TextureDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    TextureGPUCompression.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    HalfFloatTexture.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    GPUCompression_ASTC.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    GPUCompression_ETC2.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class AnimatorDemo extends SingletonScene {
        constructor() {
            super();
            this.PlayStopIndex = 0;
            this.curStateIndex = 0;
            this.text = new Laya.Text();
            this.textName = new Laya.Text();
            this.curActionName = null;
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
        }
        onLoadFinish() {
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
            var camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 3, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var role = new Laya.Sprite3D();
            this.s_scene.addChild(role);
            var pangzi = role.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"));
            this.animator = pangzi.getChildAt(0).getComponent(Laya.Animator);
            var state1 = new Laya.AnimatorState();
            state1.name = "hello";
            state1.clipStart = 296 / 581;
            state1.clipEnd = 346 / 581;
            state1.clip = this.animator.getDefaultState().clip;
            state1.clip.islooping = true;
            state1.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state1);
            this.AutoSetScene3d(this.s_scene);
            var state2 = new Laya.AnimatorState();
            state2.name = "ride";
            state2.clipStart = 0 / 581;
            state2.clipEnd = 33 / 581;
            state2.clip = this.animator.getDefaultState().clip;
            state2.clip.islooping = true;
            state2.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state2);
            this.animator.speed = 0.0;
            var state3 = new Laya.AnimatorState();
            state3.name = "动作状态三";
            state3.clipStart = 34 / 581;
            state3.clipEnd = 100 / 581;
            state3.clip = this.animator.getDefaultState().clip;
            state3.clip.islooping = true;
            state3.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state3);
            this.animator.speed = 0.0;
            var state4 = new Laya.AnimatorState();
            state4.name = "动作状态四";
            state4.clipStart = 101 / 581;
            state4.clipEnd = 200 / 581;
            state4.clip = this.animator.getDefaultState().clip;
            state4.clip.islooping = true;
            state4.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state4);
            this.animator.speed = 0.0;
            var state5 = new Laya.AnimatorState();
            state5.name = "动作状态五";
            state5.clipStart = 201 / 581;
            state5.clipEnd = 295 / 581;
            state5.clip = this.animator.getDefaultState().clip;
            state5.clip.islooping = true;
            state5.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state5);
            this.animator.speed = 0.0;
            var state6 = new Laya.AnimatorState();
            state6.name = "动作状态六";
            state6.clipStart = 345 / 581;
            state6.clipEnd = 581 / 581;
            state6.clip = this.animator.getDefaultState().clip;
            state6.clip.islooping = true;
            state6.addScript(AnimatorStateScriptDemo);
            this.animator.addState(state6);
            this.animator.speed = 0.0;
            this.loadUI();
            this.textName.x = Laya.stage.width / 2 - 50;
            this.text.x = Laya.stage.width / 2 - 50;
            this.text.y = 50;
            this.textName.overflow = Laya.Text.HIDDEN;
            this.textName.color = "#FFFFFF";
            this.textName.font = "Impact";
            this.textName.fontSize = 20;
            this.textName.borderColor = "#FFFF00";
            this.textName.x = Laya.stage.width / 2;
            this.textName.text = "当前动作状态名称：";
            Laya.stage.addChild(this.textName);
            this.text.overflow = Laya.Text.HIDDEN;
            this.text.color = "#FFFFFF";
            this.text.font = "Impact";
            this.text.fontSize = 20;
            this.text.borderColor = "#FFFF00";
            this.text.x = Laya.stage.width / 2;
            this.text.text = "当前动作状态进度：";
            Laya.stage.addChild(this.text);
            Laya.timer.frameLoop(1, this, this.onFrame);
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "播放动画");
                Laya.stage.addChild(this.changeActionButton);
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2 - 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.PlayStopIndex++;
                    if (this.changeActionButton.label === "暂停动画") {
                        this.changeActionButton.label = "播放动画";
                        this.animator.speed = 0.0;
                    }
                    else if (this.changeActionButton.label === "播放动画") {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.play(this.curActionName);
                        this.animator.speed = 1.0;
                    }
                });
                this.changeActionButton2 = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换动作状态");
                Laya.stage.addChild(this.changeActionButton2);
                this.changeActionButton2.size(200, 40);
                this.changeActionButton2.labelBold = true;
                this.changeActionButton2.labelSize = 30;
                this.changeActionButton2.sizeGrid = "4,4,4,4";
                this.changeActionButton2.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton2.pos(Laya.stage.width / 2 - this.changeActionButton2.width * Laya.Browser.pixelRatio / 2 + 100, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton2.on(Laya.Event.CLICK, this, function () {
                    this.curStateIndex++;
                    if (this.curStateIndex % 6 == 0) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("hello");
                        this.curActionName = "hello";
                        this.textName.text = "当前动作状态名称:" + "hello";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 6 == 1) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("ride");
                        this.curActionName = "ride";
                        this.textName.text = "当前动作状态名称:" + "ride";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 6 == 2) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("动作状态三");
                        this.curActionName = "动作状态三";
                        this.textName.text = "当前动作状态名称:" + "动作状态三";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 6 == 3) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("动作状态四");
                        this.curActionName = "动作状态四";
                        this.textName.text = "当前动作状态名称:" + "动作状态四";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 6 == 4) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("动作状态五");
                        this.curActionName = "动作状态五";
                        this.textName.text = "当前动作状态名称:" + "动作状态五";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 6 == 5) {
                        this.changeActionButton.label = "暂停动画";
                        this.animator.speed = 0.0;
                        this.animator.play("动作状态六");
                        this.curActionName = "动作状态六";
                        this.textName.text = "当前动作状态名称:" + "动作状态六";
                        this.animator.speed = 1.0;
                    }
                });
            }));
        }
        onFrame() {
            if (this.animator.speed > 0.0) {
                var curNormalizedTime = this.animator.getCurrentAnimatorPlayState(0).normalizedTime;
                this.text.text = "当前动画状态进度：" + curNormalizedTime;
            }
        }
        Show() {
            super.Show();
            if (this.textName) {
                this.textName.visible = true;
            }
            if (this.text) {
                this.text.visible = true;
            }
            if (this.changeActionButton2) {
                this.changeActionButton2.visible = true;
            }
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.textName) {
                this.textName.visible = false;
            }
            if (this.text) {
                this.text.visible = false;
            }
            if (this.changeActionButton2) {
                this.changeActionButton2.visible = false;
            }
            if (this.changeActionButton) {
                this.changeActionButton.visible = false;
            }
        }
    }
    class AnimatorStateScriptDemo extends Laya.AnimatorStateScript {
        constructor() {
            super();
        }
        onStateEnter() {
            console.log("动画开始播放了");
        }
        onStateUpdate() {
            console.log("动画状态更新了");
        }
        onStateExit() {
            console.log("动画退出了");
        }
    }

    class Animation3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页",
                "动画示例", "动画过渡和混合", "动画状态脚本", "蒙皮动画挂点", "材质动画",
                "刚体动画", "摄像机动画", "预烘焙动画", "骨骼动画遮罩",
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    AnimatorDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    break;
                case this.btnNameArr[3]:
                    break;
                case this.btnNameArr[4]:
                    break;
                case this.btnNameArr[5]:
                    break;
                case this.btnNameArr[6]:
                    break;
                case this.btnNameArr[7]:
                    break;
                case this.btnNameArr[8]:
                    break;
                case this.btnNameArr[9]:
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class LayaMain3d extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "Resource", "Scene3D", "摄像机", "后处理", "光照",
                "3D精灵", "Mesh网格", "材质", "纹理", "动画",
                "物理系统", "canoon物理", "鼠标交互", "脚本", "天空",
                "粒子系统", "拖尾系统", "自定义Shader", "性能测试", "高级应用",
                "展示案例",
            ];
            Laya.stage.addChild(this);
            this.LoadExamples();
        }
        LoadExamples() {
            for (let index = 0; index < this.btnNameArr.length; index++) {
                this.createButton(this.btnNameArr[index], this._onclick, index);
            }
        }
        createButton(name, cb, index, skin = GlobalConfig.ResPath + "res/threeDimen/ui/button.png") {
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
                    ResourceMain.getInstance().Show();
                    break;
                case this.btnNameArr[1]:
                    Scene3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[2]:
                    CameraMain.getInstance().Show();
                    break;
                case this.btnNameArr[3]:
                    PostProcessMain.getInstance().Show();
                    break;
                case this.btnNameArr[4]:
                    LightingMain.getInstance().Show();
                    break;
                case this.btnNameArr[5]:
                    Sprite3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[6]:
                    MeshMain.getInstance().Show();
                    break;
                case this.btnNameArr[7]:
                    MaterialMain.getInstance().Show();
                    break;
                case this.btnNameArr[8]:
                    TextureMain.getInstance().Show();
                    break;
                case this.btnNameArr[9]:
                    Animation3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[10]:
                    break;
                case this.btnNameArr[11]:
                    break;
                case this.btnNameArr[12]:
                    break;
                case this.btnNameArr[13]:
                    break;
                case this.btnNameArr[14]:
                    break;
                case this.btnNameArr[15]:
                    break;
                case this.btnNameArr[16]:
                    break;
                case this.btnNameArr[17]:
                    break;
                case this.btnNameArr[18]:
                    break;
                case this.btnNameArr[19]:
                    break;
                case this.btnNameArr[20]:
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
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
        LoadExamples() {
            LayaMain3d.getInstance().LoadExamples();
        }
    }
    new Main().LoadExamples();

}());
//# sourceMappingURL=bundle.js.map
