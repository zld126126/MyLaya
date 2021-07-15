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

    class LoadResourceDemo extends SingletonScene {
        constructor() {
            super();
            this.s_scene = null;
            this.sprite3D = null;
            this.PreloadingRes();
        }
        LoadRes() {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = new Laya.Camera();
                this.s_scene.addChild(camera);
                camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
                camera.transform.translate(new Laya.Vector3(3, 20, 47));
                camera.addComponent(CameraMoveScript);
                var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
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
            this.s_scene = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/XunLongShi/XunLongShi.ls");
            this.AutoSetScene3d(this.s_scene);
            var camera = new Laya.Camera();
            this.s_scene.addChild(camera);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            camera.transform.translate(new Laya.Vector3(3, 20, 47));
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            var skyboxMaterial = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
            var skyRenderer = camera.skyRenderer;
            skyRenderer.mesh = Laya.SkyBox.instance;
            skyRenderer.material = skyboxMaterial;
            (this.s_scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
            (this.s_scene.getChildByName('Scenes').getChildByName('Area')).active = false;
            var earth1 = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32)));
            earth1.transform.translate(new Laya.Vector3(17, 20, 0));
            var earthMat = new Laya.BlinnPhongMaterial();
            earthMat.albedoTexture = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png");
            earthMat.albedoIntensity = 1;
            earth1.meshRenderer.material = earthMat;
            this.sprite3D = new Laya.Sprite3D();
            this.s_scene.addChild(this.sprite3D);
            var mesh = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
            var layaMonkey = new Laya.MeshSprite3D(mesh);
            this.sprite3D.addChild(layaMonkey);
            layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
            layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));
            var sp = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
            var layaMonkey2 = this.s_scene.addChild(sp);
            layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
            layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
            this.pangzi = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh");
            this.s_scene.addChild(this.pangzi);
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

    class GarbageCollection extends SingletonScene {
        constructor() {
            super();
            this.castType = 0;
            this.s_scene = null;
            this.loadScene();
            this.addBtn(200, 200, 160, 40, "释放显存", function (e) {
                this.castType++;
                this.castType %= 2;
                switch (this.castType) {
                    case 0:
                        (e.target).label = "释放显存";
                        this.loadScene();
                        break;
                    case 1:
                        (e.target).label = "加载场景";
                        if (this.s_scene)
                            this.garbageCollection();
                        break;
                }
            });
        }
        addBtn(x, y, width, height, text, clickFun) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
                this.changeActionButton.size(width, height);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(x, y);
                this.changeActionButton.on(Laya.Event.CLICK, this, clickFun);
            }));
        }
        loadScene() {
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/ParticleScene/Example_01.ls", Laya.Handler.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
                camera.transform.translate(new Laya.Vector3(0, 1, 0));
                camera.addComponent(CameraMoveScript);
            }));
        }
        garbageCollection() {
            this.s_scene.destroy();
            this.s_scene = null;
            Laya.Resource.destroyUnusedResources();
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

    var Scene3D = Laya.Scene3D;
    var Camera = Laya.Camera;
    var Shader3D = Laya.Shader3D;
    var Vector3 = Laya.Vector3;
    var DirectionLight = Laya.DirectionLight;
    var Loader = Laya.Loader;
    var glTFLoader = Laya.glTFLoader;
    var Handler = Laya.Handler;
    class LoadGltfRosource extends SingletonScene {
        constructor() {
            super();
            Shader3D.debugMode = true;
            this.s_scene = new Scene3D();
            this.camera = this.s_scene.addChild(new Camera);
            this.camera.addComponent(CameraMoveScript);
            this.camera.transform.position = new Vector3(0, 1, 7);
            var directionLight = this.s_scene.addChild(new DirectionLight());
            directionLight.color = new Vector3(0.6, 0.6, 0.6);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls", Handler.create(this, function () {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.ambientColor = new Vector3(0.858, 0.858, 0.858);
                this.s_scene.reflection = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_depthNormalScene/Conventional/Assets/Scenes/depthNormalSceneGIReflection.ltcb.ls");
                this.s_scene.reflectionDecodingFormat = 1;
                this.s_scene.reflectionIntensity = 1;
            }));
            glTFLoader.init();
            var gltfResource = [
                GlobalConfig.ResPath + "res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf",
                GlobalConfig.ResPath + "res/threeDimen/gltf/Duck/Duck.gltf",
                GlobalConfig.ResPath + "res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf"
            ];
            Laya.loader.create(gltfResource, Handler.create(this, this.onGLTFComplate));
        }
        onGLTFComplate(success) {
            if (!success) {
                console.log("gltf load failed");
                return;
            }
            var RiggedFigure = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/RiggedFigure/RiggedFigure.gltf");
            this.s_scene.addChild(RiggedFigure);
            RiggedFigure.transform.position = new Vector3(-2, 0, 0);
            console.log("RiggedFigure: This model is licensed under a Creative Commons Attribution 4.0 International License.");
            var duck = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/Duck/Duck.gltf");
            this.s_scene.addChild(duck);
            var cube = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/gltf/AnimatedCube/AnimatedCube.gltf");
            this.s_scene.addChild(cube);
            cube.transform.position = new Vector3(2.5, 0.6, 0);
            cube.transform.setWorldLossyScale(new Vector3(0.6, 0.6, 0.6));
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
                    LoadResourceDemo.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    GarbageCollection.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    LoadGltfRosource.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
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
            Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, function (mat) {
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

    var Handler$1 = Laya.Handler;
    var Loader$1 = Laya.Loader;
    var Camera$1 = Laya.Camera;
    var Sprite3D = Laya.Sprite3D;
    var Vector3$1 = Laya.Vector3;
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
            Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler$1.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Loader$1.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls");
            this.AutoSetScene3d(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
            Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Handler$1.create(this, function (layaMonkey) {
                scene.addChild(layaMonkey);
                layaMonkey.transform.localScale = new Vector3$1(0.5, 0.5, 0.5);
                layaMonkey.transform.rotate(new Vector3$1(0, 180, 0), true, false);
                layaMonkey.transform.position = new Vector3$1(-28.8, 5, -53);
            }));
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$1.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "渲染到2DSprite"));
                this.changeActionButton.size(240, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
                this.changeActionButton.on(Event.CLICK, this, function () {
                    var renderTargetCamera = scene.addChild(new Camera$1(0, 0.3, 1000));
                    renderTargetCamera.transform.position = new Vector3$1(-28.8, 8, -60);
                    renderTargetCamera.transform.rotate(new Vector3$1(0, 180, 0), true, false);
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

    var Scene3D$1 = Laya.Scene3D;
    var Handler$2 = Laya.Handler;
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
            Scene3D$1.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/BloomScene.ls", Handler$2.create(this, function (scene) {
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
                Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_BloomScene/Conventional/Assets/LensDirt01.png", Handler$2.create(null, function (tex) {
                    bloom.dirtTexture = tex;
                    bloom.dirtIntensity = 2.0;
                }));
                this.loadUI();
            }));
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$2.create(this, function () {
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

    var BlurVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";
    var BlurHorizentalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(1.0,0.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //é«˜æ–¯å‚æ•°\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";
    var BlurVerticalFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform float u_DownSampleValue;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 uvOffset = vec2(0.0,1.0)*u_MainTex_TexelSize.xy*u_DownSampleValue;\r\n    uv = uv - uvOffset*3.0;\r\n    //é«˜æ–¯å‚æ•°\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.324*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.232*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0855*texture2D(u_MainTex,uv);\r\n    uv+=uvOffset;\r\n    color+=0.0205*texture2D(u_MainTex,uv);\r\n\r\n    gl_FragColor = color;\r\n    \r\n\r\n    \r\n}";
    var BlurDownSampleFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nvoid main()\r\n{\r\n    vec4 color = vec4(0.0,0.0,0.0,0.0);\r\n    color += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(-1.0,0.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,-1.0));\r\n\tcolor += texture2D(u_MainTex,v_Texcoord0+u_MainTex_TexelSize.xy*vec2(0.0,1.0));\r\n    gl_FragColor = color/4.0;\r\n    //gl_FragColor = vec4(1.0,0.0,0.0,1.0);\r\n}";
    var BlurDownSampleVS = "#include \"Lighting.glsl\";\r\n#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\nattribute vec4 a_PositionTexcoord;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}";
    var BlurEdgeAdd = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_sourceTexture0;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 mainColor = texture2D(u_MainTex,uv);\r\n    vec4 sourceColor = texture2D(u_sourceTexture0,uv);\r\n    float factor = step(sourceColor.x+sourceColor.y+sourceColor.z,0.001);\r\n    vec4 color = mix(sourceColor,mainColor,factor);\r\n    gl_FragColor =color;\r\n}";
    var BlurEdgeSub = "#if defined(GL_FRAGMENT_PRECISION_HIGH)//Â åŽŸæ¥çš„å†™æ³•ä¼šè¢«æˆ‘ä»¬è‡ªå·±çš„è§£æžæµç¨‹å¤„ç†ï¼Œè€Œæˆ‘ä»¬çš„è§£æžæ˜¯ä¸è®¤å†…ç½®å®çš„ï¼Œå¯¼è‡´è¢«åˆ æŽ‰ï¼Œæ‰€ä»¥æ”¹æˆÂ ifÂ definedÂ äº†\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\nuniform sampler2D u_sourceTexture0;\r\nuniform sampler2D u_sourceTexture1;\r\n\r\nvoid main()\r\n{\r\n    vec2 uv = v_Texcoord0;\r\n    vec4 blurColor = texture2D(u_sourceTexture0,uv);\r\n    vec4 clearColor = texture2D(u_sourceTexture1,uv);\r\n    float factor = step(clearColor.x+clearColor.y+clearColor.z,0.001);\r\n    vec4 color = blurColor*factor;\r\n    color = (1.0-step(color.x+color.y+color.z,0.15))*vec4(1.0,0.0,0.0,1.0);\r\n    gl_FragColor = color;\r\n}";
    class BlurEffect extends Laya.PostProcessEffect {
        constructor() {
            super();
            this._shader = null;
            this._shaderData = new Laya.ShaderData();
            this._downSampleNum = 1;
            this._blurSpreadSize = 1;
            this._blurIterations = 2;
            this._texSize = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            this._shader = Laya.Shader3D.find("blurEffect");
            this._tempRenderTexture = new Array(13);
            BlurEffect.BLUR_TYPE_GaussianBlur = 0;
            BlurEffect.BLUR_TYPE_Simple = 1;
            BlurEffect.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
            BlurEffect.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
            BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
        }
        static init() {
            BlurEffect.BLUR_TYPE_GaussianBlur = 0;
            BlurEffect.BLUR_TYPE_Simple = 1;
            BlurEffect.SHADERVALUE_MAINTEX = Laya.Shader3D.propertyNameToID("u_MainTex");
            BlurEffect.SHADERVALUE_TEXELSIZE = Laya.Shader3D.propertyNameToID("u_MainTex_TexelSize");
            BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE = Laya.Shader3D.propertyNameToID("u_DownSampleValue");
            var attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            var uniformMap = {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DownSampleValue': Laya.Shader3D.PERIOD_MATERIAL,
                'u_sourceTexture0': Laya.Shader3D.PERIOD_MATERIAL,
                'u_sourceTexture1': Laya.Shader3D.PERIOD_MATERIAL
            };
            var shader = Laya.Shader3D.add("blurEffect");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            var shaderpass = subShader.addShaderPass(BlurDownSampleVS, BlurDownSampleFS);
            var renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
            subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            shaderpass = subShader.addShaderPass(BlurVS, BlurVerticalFS);
            renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
            subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            shaderpass = subShader.addShaderPass(BlurVS, BlurHorizentalFS);
            renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
            subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeSub);
            renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
            subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            shaderpass = subShader.addShaderPass(BlurVS, BlurEdgeAdd);
            renderState = shaderpass.renderState;
            renderState.depthTest = Laya.RenderState.DEPTHTEST_ALWAYS;
            renderState.depthWrite = false;
            renderState.cull = Laya.RenderState.CULL_NONE;
            renderState.blend = Laya.RenderState.BLEND_DISABLE;
        }
        get downSampleNum() {
            return this._downSampleNum;
        }
        set downSampleNum(value) {
            this._downSampleNum = Math.min(6, Math.max(value, 0.0));
        }
        get blurSpreadSize() {
            return this._blurSpreadSize;
        }
        set blurSpreadSize(value) {
            this._blurSpreadSize = Math.min(10, Math.max(value, 1.0));
        }
        get blurIterations() {
            return this._blurIterations;
        }
        set blurIterations(value) {
            this._blurIterations = Math.min(Math.max(value, 0.0), 6.0);
        }
        render(context) {
            var cmd = context.command;
            var viewport = context.camera.viewport;
            var scaleFactor = 1.0 / (1 << Math.floor(this._downSampleNum));
            var tw = Math.floor(viewport.width * scaleFactor);
            var th = Math.floor(viewport.height * scaleFactor);
            this._texSize.setValue(1.0 / tw, 1.0 / th, tw, th);
            this._shaderData.setNumber(BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE, this.blurSpreadSize);
            this._shaderData.setVector(BlurEffect.SHADERVALUE_TEXELSIZE, this._texSize);
            var downSampleTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
            downSampleTexture.filterMode = Laya.FilterMode.Bilinear;
            this._tempRenderTexture[0] = downSampleTexture;
            var lastDownTexture = context.source;
            cmd.blitScreenTriangle(lastDownTexture, downSampleTexture, null, this._shader, this._shaderData, 0);
            lastDownTexture = downSampleTexture;
            for (var i = 0; i < this._blurIterations; i++) {
                var blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
                blurTexture.filterMode = Laya.FilterMode.Bilinear;
                cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 1);
                lastDownTexture = blurTexture;
                this._tempRenderTexture[i * 2 + 1] = blurTexture;
                blurTexture = Laya.RenderTexture.createFromPool(tw, th, Laya.RenderTextureFormat.R8G8B8, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
                blurTexture.filterMode = Laya.FilterMode.Bilinear;
                cmd.blitScreenTriangle(lastDownTexture, blurTexture, null, this._shader, this._shaderData, 2);
                lastDownTexture = blurTexture;
                this._tempRenderTexture[i * 2 + 2] = blurTexture;
            }
            context.source = lastDownTexture;
            var maxTexture = this._blurIterations * 2 + 1;
            for (i = 0; i < maxTexture; i++) {
                Laya.RenderTexture.recoverToPool(this._tempRenderTexture[i]);
            }
            context.deferredReleaseTextures.push(lastDownTexture);
        }
    }

    var Scene3D$2 = Laya.Scene3D;
    var CameraClearFlags = Laya.CameraClearFlags;
    var Matrix4x4 = Laya.Matrix4x4;
    var PostProcess$1 = Laya.PostProcess;
    var Button$2 = Laya.Button;
    var Shader3D$1 = Laya.Shader3D;
    var Browser$2 = Laya.Browser;
    var Event$2 = Laya.Event;
    var Handler$3 = Laya.Handler;
    class PostProcess_Blur extends SingletonScene {
        constructor() {
            super();
            Shader3D$1.debugMode = true;
            BlurEffect.init();
            Scene3D$2.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Handler$3.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                this.camera = scene.getChildByName("MainCamera");
                this.camera.addComponent(CameraMoveScript);
                this.camera.clearFlag = CameraClearFlags.Sky;
                this.camera.cullingMask ^= 2;
                this.camera.enableHDR = false;
                var mainCamera = scene.getChildByName("BlurCamera");
                mainCamera.clearFlag = CameraClearFlags.Nothing;
                mainCamera.cullingMask = 2;
                mainCamera.renderingOrder = 1;
                mainCamera.enableHDR = false;
                this.camera.addChild(mainCamera);
                mainCamera.transform.localMatrix = new Matrix4x4();
                this.postProcess = new PostProcess$1();
                var blurEffect = new BlurEffect();
                this.postProcess.addEffect(blurEffect);
                this.camera.postProcess = this.postProcess;
                blurEffect.downSampleNum = 6;
                blurEffect.blurSpreadSize = 1;
                blurEffect.blurIterations = 1;
                this.loadUI();
            }));
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$3.create(this, function () {
                this.btn = Laya.stage.addChild(new Button$2(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭高斯模糊"));
                this.btn.size(200, 40);
                this.btn.labelBold = true;
                this.btn.labelSize = 30;
                this.btn.sizeGrid = "4,4,4,4";
                this.btn.scale(Browser$2.pixelRatio, Browser$2.pixelRatio);
                this.btn.pos(Laya.stage.width / 2 - this.btn.width * Browser$2.pixelRatio / 2, Laya.stage.height - 60 * Browser$2.pixelRatio);
                this.btn.on(Event$2.CLICK, this, function () {
                    var enableHDR = !!this.camera.postProcess;
                    if (enableHDR) {
                        this.btn.label = "开启高斯模糊";
                        this.camera.postProcess = null;
                    }
                    else {
                        this.btn.label = "关闭高斯模糊";
                        this.camera.postProcess = this.postProcess;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.btn) {
                this.btn.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.btn) {
                this.btn.visible = false;
            }
        }
    }

    var EdgeMode;
    (function (EdgeMode) {
        EdgeMode[EdgeMode["ColorEdge"] = 0] = "ColorEdge";
        EdgeMode[EdgeMode["NormalEdge"] = 1] = "NormalEdge";
        EdgeMode[EdgeMode["DepthEdge"] = 2] = "DepthEdge";
    })(EdgeMode || (EdgeMode = {}));
    var EdgeEffectVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\tgl_Position = vec4(a_PositionTexcoord.xy, 0.0, 1.0);\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}\r\n";
    var EdgeEffectFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nuniform vec4 u_DepthBufferParams;\r\n\r\nuniform vec3 u_EdgeColor;\r\n\r\n#ifdef DEPTHEDGE\r\n    uniform float u_Depthhold;\r\n#endif\r\n\r\n#ifdef NORMALEDGE\r\n    uniform float u_NormalHold;\r\n#endif\r\n\r\n#ifdef COLOREDGE\r\n    uniform float u_ColorHold;\r\n#endif\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n#ifdef DEPTHNORMAL\r\n    uniform sampler2D u_DepthNormalTex;\r\n    void getDepthNormal(out float depth, out vec3 normal){\r\n        vec4 col = texture2D(u_DepthNormalTex, v_Texcoord0);\r\n        DecodeDepthNormal(col, depth, normal);\r\n    }\r\n\r\n    float getDepth(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return depth;\r\n    }\r\n\r\n    vec3 getNormal(vec2 uv) {\r\n        float depth;\r\n        vec3 normal;\r\n        vec4 col = texture2D(u_DepthNormalTex, uv);\r\n        DecodeDepthNormal(col, depth, normal);\r\n        return normal;\r\n    }\r\n\r\n#endif\r\n\r\n#ifdef DEPTH\r\n    uniform sampler2D u_DepthTex;\r\n    float getDepth(vec2 uv) {\r\n        float depth = texture2D(u_DepthTex, uv).r;\r\n        depth = Linear01Depth(depth, u_DepthBufferParams);\r\n        return depth;\r\n    }\r\n#endif\r\n\r\nvoid SobelSample(in vec2 uv,out vec3 colorG, out vec3 normalG, out vec3 depthG) {\r\n\r\n    float offsetx = u_MainTex_TexelSize.x;\r\n    float offsety = u_MainTex_TexelSize.y;\r\n    vec2 offsets[9];\r\n    offsets[0] = vec2(-offsetx,  offsety); // å·¦ä¸Š\r\n    offsets[1] = vec2( 0.0,    offsety); // æ­£ä¸Š\r\n    offsets[2] = vec2( offsetx,  offsety); // å³ä¸Š\r\n    offsets[3] = vec2(-offsetx,  0.0);   // å·¦\r\n    offsets[4] = vec2( 0.0,    0.0);   // ä¸­\r\n    offsets[5] = vec2( offsetx,  0.0);   // å³\r\n    offsets[6] = vec2(-offsetx, -offsety); // å·¦ä¸‹\r\n    offsets[7] = vec2( 0.0,   -offsety); // æ­£ä¸‹\r\n    offsets[8] = vec2( offsetx, -offsety); // å³ä¸‹\r\n\r\n    float Gx[9];\r\n    Gx[0] = -1.0; Gx[1] = 0.0; Gx[2] = 1.0; \r\n    Gx[3] = -2.0; Gx[4] = 0.0; Gx[5] = 2.0; \r\n    Gx[6] = -1.0; Gx[7] = 0.0; Gx[8] = 1.0; \r\n\r\n    float Gy[9];\r\n    Gy[0] = 1.0; Gy[1] = 2.0; Gy[2] = 1.0; \r\n    Gy[3] = 0.0; Gy[4] = 0.0; Gy[5] = 0.0; \r\n    Gy[6] = -1.0; Gy[7] = -2.0;Gy[8] = -1.0; \r\n\r\n    vec3 sampleTex[9];\r\n    float sampleDepth[9];\r\n    vec3 sampleNormal[9];\r\n    for (int i = 0; i < 9; i++)\r\n    {\r\n        vec2 uvOffset = uv + offsets[i];\r\n        sampleTex[i] = texture2D(u_MainTex, uvOffset).rgb;\r\n        sampleDepth[i] = getDepth(uvOffset);\r\n        sampleNormal[i] = (getNormal(uvOffset) + 1.0) / 2.0;\r\n    }\r\n\r\n    vec3 colorGx = vec3(0.0);\r\n    vec3 colorGy = vec3(0.0);\r\n    float depthGx = 0.0;\r\n    float depthGy = 0.0;\r\n    vec3 normalGx = vec3(0.0);\r\n    vec3 normalGy = vec3(0.0);\r\n\r\n    for (int i = 0; i < 9; i++) {\r\n        colorGx += sampleTex[i] * Gx[i];\r\n        colorGy += sampleTex[i] * Gy[i];\r\n        depthGx += sampleDepth[i] * Gx[i];\r\n        depthGy += sampleDepth[i] * Gy[i];\r\n        normalGx += sampleNormal[i] * Gx[i];\r\n        normalGy += sampleNormal[i] * Gy[i];\r\n    }\r\n\r\n    float colDepthG = abs(depthGx) + abs(depthGy);\r\n    depthG = vec3(colDepthG);\r\n\r\n    colorG = abs(colorGx) + abs(colorGy);\r\n\r\n    normalG = abs(normalGx) + abs(normalGy);\r\n\r\n}\r\n\r\nfloat ColorGray(vec3 color) {\r\n    return (color.r + color.g + color.b) / 3.0;\r\n}\r\n\r\nvec3 getEdgeValue(float hold, vec3 valueG) {\r\n    return vec3(step(hold, ColorGray(valueG)));\r\n}\r\n\r\nvoid main() {\r\n    \r\n    vec2 uv = v_Texcoord0;\r\n\r\n    vec3 colorG, normalG, depthG;\r\n    SobelSample(uv, colorG, normalG, depthG);\r\n    vec3 edgeColor = vec3(0.2);\r\n\r\n    #if defined(DEPTHEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_Depthhold, depthG);\r\n    #endif\r\n\r\n    #if defined(NORMALEDGE)\r\n        vec3 edgeValue = getEdgeValue(u_NormalHold, normalG);\r\n    #endif\r\n\r\n    #if defined(COLOREDGE)\r\n        vec3 edgeValue = getEdgeValue(u_ColorHold, colorG);\r\n    #endif\r\n\r\n    vec3 fillColor = u_EdgeColor;\r\n\r\n    #ifdef SOURCE\r\n        fillColor = texture2D(u_MainTex, uv).rgb;\r\n    #endif\r\n\r\n    vec3 finalColor = mix(fillColor, edgeColor, edgeValue);\r\n    gl_FragColor = vec4(finalColor, 1.0);\r\n\r\n}";
    class EdgeEffect extends Laya.PostProcessEffect {
        constructor() {
            super();
            this._shader = null;
            this._shaderData = new Laya.ShaderData();
            this._depthBufferparam = new Laya.Vector4();
            this._edgeMode = EdgeMode.NormalEdge;
            if (!EdgeEffect._isShaderInit) {
                EdgeEffect._isShaderInit = true;
                EdgeEffect.EdgeEffectShaderInit();
            }
            this._shader = Laya.Shader3D.find("PostProcessEdge");
            this.edgeColor = new Laya.Vector3(0.2, 0.2, 0.2);
            this.colorHold = 0.7;
            this.normalHold = 0.7;
            this.depthHold = 0.7;
            this.edgeMode = EdgeMode.DepthEdge;
            this.showSource = true;
            EdgeEffect._isShaderInit = false;
            EdgeEffect.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthTex");
            EdgeEffect.DEPTHNORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthNormalTex");
            EdgeEffect.DEPTHBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_DepthBufferParams");
            EdgeEffect.EDGECOLOR = Laya.Shader3D.propertyNameToID("u_EdgeColor");
            EdgeEffect.COLORHOLD = Laya.Shader3D.propertyNameToID("u_ColorHold");
            EdgeEffect.DEPTHHOLD = Laya.Shader3D.propertyNameToID("u_Depthhold");
            EdgeEffect.NORMALHOLD = Laya.Shader3D.propertyNameToID("u_NormalHold");
        }
        get edgeColor() {
            return this._shaderData.getVector3(EdgeEffect.EDGECOLOR);
        }
        set edgeColor(value) {
            this._shaderData.setVector3(EdgeEffect.EDGECOLOR, value);
        }
        get colorHold() {
            return this._shaderData.getNumber(EdgeEffect.COLORHOLD);
        }
        set colorHold(value) {
            this._shaderData.setNumber(EdgeEffect.COLORHOLD, value);
        }
        get depthHold() {
            return this._shaderData.getNumber(EdgeEffect.DEPTHHOLD);
        }
        set depthHold(value) {
            this._shaderData.setNumber(EdgeEffect.DEPTHHOLD, value);
        }
        get normalHold() {
            return this._shaderData.getNumber(EdgeEffect.NORMALHOLD);
        }
        set normalHold(value) {
            this._shaderData.setNumber(EdgeEffect.NORMALHOLD, value);
        }
        get edgeMode() {
            return this._edgeMode;
        }
        get showSource() {
            return this._shaderData.hasDefine(EdgeEffect.SHADERDEFINE_SOURCE);
        }
        set showSource(value) {
            if (value) {
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_SOURCE);
            }
            else {
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_SOURCE);
            }
        }
        set edgeMode(value) {
            this._edgeMode = value;
            switch (value) {
                case EdgeMode.ColorEdge:
                    this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                    break;
                case EdgeMode.NormalEdge:
                    this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                    break;
                case EdgeMode.DepthEdge:
                    this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHEDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_COLOREDGE);
                    this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_NORMALEDGE);
                    break;
            }
        }
        render(context) {
            let cmd = context.command;
            let viewport = context.camera.viewport;
            let camera = context.camera;
            let far = camera.farPlane;
            let near = camera.nearPlane;
            let source = context.source;
            let destination = context.destination;
            let width = viewport.width;
            let height = viewport.height;
            let renderTexture = Laya.RenderTexture.createFromPool(width, height, Laya.TextureFormat.R8G8B8A8, Laya.RenderTextureDepthFormat.DEPTH_16);
            renderTexture.filterMode = Laya.FilterMode.Bilinear;
            if (camera.depthTextureMode == Laya.DepthTextureMode.Depth) {
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTH);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
                this._shaderData.setTexture(EdgeEffect.DEPTHTEXTURE, camera.depthTexture);
            }
            else if (camera.depthTextureMode == Laya.DepthTextureMode.DepthNormals) {
                this._shaderData.addDefine(EdgeEffect.SHADERDEFINE_DEPTHNORMAL);
                this._shaderData.removeDefine(EdgeEffect.SHADERDEFINE_DEPTH);
                this._shaderData.setTexture(EdgeEffect.DEPTHNORMALTEXTURE, camera.depthNormalTexture);
            }
            this._depthBufferparam.setValue(1.0 - far / near, far / near, (near - far) / (near * far), 1 / near);
            this._shaderData.setVector(EdgeEffect.DEPTHBUFFERPARAMS, this._depthBufferparam);
            cmd.blitScreenTriangle(source, renderTexture, null, this._shader, this._shaderData, 0);
            context.source = renderTexture;
            context.deferredReleaseTextures.push(renderTexture);
        }
        static EdgeEffectShaderInit() {
            EdgeEffect.SHADERDEFINE_DEPTH = Laya.Shader3D.getDefineByName("DEPTH");
            EdgeEffect.SHADERDEFINE_DEPTHNORMAL = Laya.Shader3D.getDefineByName("DEPTHNORMAL");
            EdgeEffect.SHADERDEFINE_DEPTHEDGE = Laya.Shader3D.getDefineByName("DEPTHEDGE");
            EdgeEffect.SHADERDEFINE_NORMALEDGE = Laya.Shader3D.getDefineByName("NORMALEDGE");
            EdgeEffect.SHADERDEFINE_COLOREDGE = Laya.Shader3D.getDefineByName("COLOREDGE");
            EdgeEffect.SHADERDEFINE_SOURCE = Laya.Shader3D.getDefineByName("SOURCE");
            let attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            let uniformMap = {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DepthTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DepthNormalTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DepthBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
                'u_ColorHold': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Depthhold': Laya.Shader3D.PERIOD_MATERIAL,
                'u_NormalHold': Laya.Shader3D.PERIOD_MATERIAL
            };
            let shader = Laya.Shader3D.add("PostProcessEdge");
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            let pass = subShader.addShaderPass(EdgeEffectVS, EdgeEffectFS);
            pass.renderState.depthWrite = false;
            EdgeEffect._isShaderInit = false;
            EdgeEffect.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthTex");
            EdgeEffect.DEPTHNORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_DepthNormalTex");
            EdgeEffect.DEPTHBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_DepthBufferParams");
            EdgeEffect.EDGECOLOR = Laya.Shader3D.propertyNameToID("u_EdgeColor");
            EdgeEffect.COLORHOLD = Laya.Shader3D.propertyNameToID("u_ColorHold");
            EdgeEffect.DEPTHHOLD = Laya.Shader3D.propertyNameToID("u_Depthhold");
            EdgeEffect.NORMALHOLD = Laya.Shader3D.propertyNameToID("u_NormalHold");
        }
    }

    var Scene3D$3 = Laya.Scene3D;
    var Camera$2 = Laya.Camera;
    var Shader3D$2 = Laya.Shader3D;
    var Vector3$2 = Laya.Vector3;
    var Quaternion = Laya.Quaternion;
    var MeshSprite3D = Laya.MeshSprite3D;
    var PrimitiveMesh = Laya.PrimitiveMesh;
    var DepthTextureMode = Laya.DepthTextureMode;
    var Loader$2 = Laya.Loader;
    var PostProcess$2 = Laya.PostProcess;
    var DirectionLight$1 = Laya.DirectionLight;
    var Browser$3 = Laya.Browser;
    var Slider = Laya.Slider;
    var Button$3 = Laya.Button;
    var Event$3 = Laya.Event;
    var Handler$4 = Laya.Handler;
    class PostProcess_Edge extends SingletonScene {
        constructor() {
            super();
            this.btns = [];
            this.sliders = [];
            Shader3D$2.debugMode = true;
            this.s_scene = new Scene3D$3();
            this.camera = this.s_scene.addChild(new Camera$2(0, 0.2, 50));
            this.camera.addComponent(CameraMoveScript);
            this.camera.transform.position = new Vector3$2(0, 4, 10);
            this.camera.transform.rotation = new Quaternion(-0.2, 0, 0, 0.97);
            this.addLight();
            let res = [
                GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh",
            ];
            Laya.loader.create(res, Handler$4.create(this, this.onResComplate));
        }
        onResComplate() {
            this.AutoSetScene3d(this.s_scene);
            let sphere = new MeshSprite3D(PrimitiveMesh.createSphere(1), "Sphere");
            this.s_scene.addChild(sphere);
            sphere.transform.position = new Vector3$2(0, 1, 0);
            let plane = new MeshSprite3D(PrimitiveMesh.createPlane(), "Plane");
            this.s_scene.addChild(plane);
            plane.transform.position = new Vector3$2(0, -0.5, 0);
            let cube = new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1), "Cube");
            this.s_scene.addChild(cube);
            cube.transform.position = new Vector3$2(0, 3, 0);
            this.camera.depthTextureMode |= DepthTextureMode.DepthNormals;
            let dude = Loader$2.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh");
            this.s_scene.addChild(dude);
            dude.transform.position = new Vector3$2(1.5, 0, 0);
            dude.transform.rotationEuler = new Vector3$2(0, 180, 0);
            let postProcess = new PostProcess$2();
            this.camera.postProcess = postProcess;
            let edgeEffect = new EdgeEffect();
            postProcess.addEffect(edgeEffect);
            this.addUI(edgeEffect);
        }
        addLight() {
            let dirLightDirections = [new Vector3$2(-1, -1, -1), new Vector3$2(1, -1, -1)];
            let lightColor = new Vector3$2(0.6, 0.6, 0.6);
            for (let index = 0; index < dirLightDirections.length; index++) {
                let dir = dirLightDirections[index];
                Vector3$2.normalize(dir, dirLightDirections[index]);
                let dirLight = new DirectionLight$1();
                this.s_scene.addChild(dirLight);
                dirLight.transform.worldMatrix.setForward(dirLightDirections[index]);
                dirLight.color = lightColor;
            }
        }
        addUI(edgeEffect) {
            Laya.loader.load([GlobalConfig.ResPath + "res/ui/hslider.png", GlobalConfig.ResPath + "res/threeDimen/ui/button.png",
                GlobalConfig.ResPath + "res/ui/hslider$bar.png", GlobalConfig.ResPath + "res/ui/colorPicker.png"], Handler$4.create(this, function () {
                let colorButton = this.addButton(100, 250, 160, 30, "color edge", 20, function () {
                    edgeEffect.edgeMode = EdgeMode.ColorEdge;
                    colorSlider.visible = true;
                    normalSlider.visible = false;
                    depthSlider.visible = false;
                });
                let colorSlider = this.addSlider(100, 290, 300, 0.01, 1, 0.7, 0.01, function (value) {
                    edgeEffect.colorHold = value;
                });
                let normalFunc = function () {
                    edgeEffect.edgeMode = EdgeMode.NormalEdge;
                    colorSlider.visible = false;
                    normalSlider.visible = true;
                    depthSlider.visible = false;
                };
                let normalButton = this.addButton(100, 330, 160, 30, "normal edge", 20, normalFunc);
                let normalSlider = this.addSlider(100, 370, 300, 0.01, 1, 0.7, 0.01, function (value) {
                    edgeEffect.normalHold = value;
                });
                let depthButton = this.addButton(100, 410, 160, 30, "depth edge", 20, function () {
                    edgeEffect.edgeMode = EdgeMode.DepthEdge;
                    colorSlider.visible = false;
                    normalSlider.visible = false;
                    depthSlider.visible = true;
                });
                let depthSlider = this.addSlider(100, 450, 300, 0.01, 1, 0.7, 0.01, function (value) {
                    edgeEffect.depthHold = value;
                });
                let source = this.addButton(100, 490, 160, 30, "show source", 20, function () {
                    edgeEffect.showSource = !edgeEffect.showSource;
                });
                normalFunc();
            }));
        }
        addBtn(x, y, width, height, text, size, clickFunc) {
            let button = Laya.stage.addChild(new Button$3(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
            button.size(width, height);
            button.labelBold = true;
            button.labelSize = size;
            button.sizeGrid = "4,4,4,4";
            button.scale(Browser$3.pixelRatio, Browser$3.pixelRatio);
            button.pos(x, y);
            button.on(Event$3.CLICK, this, clickFunc);
            this.btns.push(button);
            return button;
        }
        addSlider(x, y, width, min, max, value, tick, changeFunc) {
            let slider = Laya.stage.addChild(new Slider(GlobalConfig.ResPath + "res/ui/hslider.png"));
            slider.width = width;
            slider.pos(x, y);
            slider.min = min;
            slider.max = max;
            slider.value = value;
            slider.tick = tick;
            slider.changeHandler = Handler$4.create(this, changeFunc, [], false);
            slider.visible = false;
            this.sliders.push(slider);
            return slider;
        }
        Show() {
            super.Show();
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].visible = true;
            }
            for (var i = 0; i < this.sliders.length; i++) {
                this.sliders[i].visible = true;
            }
        }
        Hide() {
            super.Hide();
            for (var i = 0; i < this.btns.length; i++) {
                this.btns[i].visible = false;
            }
            for (var i = 0; i < this.sliders.length; i++) {
                this.sliders[i].visible = false;
            }
        }
    }

    var FullScreenVert = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME SCREENVS\r\n\r\n#include \"Lighting.glsl\";\r\n\r\nattribute vec4 a_PositionTexcoord;\r\nuniform vec4 u_OffsetScale;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\t\r\n\tgl_Position = vec4(u_OffsetScale.x*2.0-1.0+(a_PositionTexcoord.x+1.0)*u_OffsetScale.z,(1.0-((u_OffsetScale.y*2.0-1.0+(-a_PositionTexcoord.y+1.0)*u_OffsetScale.w)+1.0)/2.0)*2.0-1.0, 0.0, 1.0);\t\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n}\r\n";
    var CoCFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME COCFS\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_ZBufferParams;\r\nuniform vec3 u_CoCParams;\r\n\r\n#ifdef CAMERA_NORMALDEPTH\r\n    uniform sampler2D u_CameraDepthNormalTexture;\r\n#else\r\n    uniform sampler2D u_CameraDepthTexture;\r\n#endif\r\n\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n// Z buffer to linear 0..1 depth\r\nfloat Linear01Depth(float z,vec4 zbufferParams)\r\n{\r\n    return 1.0 / (zbufferParams.x * z + zbufferParams.y);\r\n}\r\n\r\n// Z buffer to linear depth\r\nfloat LinearEyeDepth(float z,vec4 zbufferParams)\r\n{\r\n    return 1.0 / (zbufferParams.z * z + zbufferParams.w);\r\n}\r\n\r\nfloat DecodeFloatRG(vec2 enc )\r\n{\r\n    vec2 kDecodeDot = vec2(1.0, 1.0/255.0);\r\n    return dot( enc, kDecodeDot );\r\n}\r\n\r\nvoid DecodeDepthNormal(vec4 enc, out float depth)\r\n{\r\n    depth = DecodeFloatRG (enc.zw);\r\n}\r\n\r\nvoid main() {\r\n\r\n    #ifdef CAMERA_NORMALDEPTH\r\n        vec4 depthNormal = texture2D(u_CameraDepthNormalTexture, v_Texcoord0);\r\n        float depth = 0.0;\r\n        DecodeDepthNormal(depthNormal, depth);\r\n        depth = ((1.0 / depth) - u_ZBufferParams.y) * (1.0 / u_ZBufferParams.x);\r\n    #else\r\n        float depth = texture2D(u_CameraDepthTexture, v_Texcoord0).x;\r\n    #endif\r\n\r\n    depth = LinearEyeDepth(depth, u_ZBufferParams);\r\n    float farStart = u_CoCParams.x;\r\n    float farEnd = u_CoCParams.y;\r\n\r\n    float coc = (depth - farStart) / (farEnd - farStart);\r\n    coc = clamp(coc, 0.0, 1.0);\r\n    gl_FragColor = vec4(coc, coc, coc, 1.0);\r\n}\r\n";
    var PrefilterFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME PrefilterFS\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_FullCoCTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nconst int kCount = 5;\r\nvec2 kTaps[5];\r\n\r\nvoid main () {\r\n\r\n    kTaps[0] = vec2( 0.0,  0.0);\r\n    kTaps[1] = vec2( 0.9, -0.4);\r\n    kTaps[2] = vec2(-0.9,  0.4);\r\n    kTaps[3] = vec2( 0.4,  0.9);\r\n    kTaps[4] = vec2(-0.4, -0.9);\r\n\r\n    vec3 colorAcc = vec3(0.0);\r\n    float farCoCAcc = 0.0;\r\n    for (int i = 0; i < kCount; i++) {\r\n        vec2 uv = u_MainTex_TexelSize.xy * kTaps[i] + v_Texcoord0;\r\n        vec3 tapColor = texture2D(u_MainTex, uv).rgb;\r\n        float coc = texture2D(u_FullCoCTex, uv).r;\r\n\r\n        colorAcc += tapColor * coc;\r\n        farCoCAcc += coc;\r\n    }\r\n    vec3 color = colorAcc * (1.0 / float(kCount));\r\n    float farCoC = farCoCAcc * (1.0 / float(kCount));\r\n\r\n    // float farCoC = texture2D(u_FullCoCTex, v_Texcoord0).x;\r\n    // vec3 color = texture2D(u_MainTex, v_Texcoord0).rgb;\r\n    // color *= farCoC;\r\n\r\n    gl_FragColor = vec4(color, farCoC);\r\n}";
    var BlurVFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME BlurVFS\r\n\r\nuniform sampler2D u_MainTex;\r\n\r\nuniform vec4 u_SourceSize;\r\nuniform vec4 u_DownSampleScale;\r\nuniform vec3 u_CoCParams;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\n// todo 3 & 5\r\nconst int kTapCount = 3;\r\nfloat kOffsets[3];\r\nfloat kCoeffs[3];\r\n\r\n\r\nvec4 Blur(vec2 dir, float premultiply) {\r\n\r\n    kOffsets[0] = -1.33333333;\r\n    kOffsets[1] = 0.00000000;\r\n    kOffsets[2] = 1.33333333;\r\n\r\n    kCoeffs[0] = 0.35294118;\r\n    kCoeffs[1] = 0.29411765;\r\n    kCoeffs[2] = 0.3529411;\r\n\r\n    vec2 uv = v_Texcoord0;\r\n    // ivec2 positionSS = ivec2(u_SourceSize.xy * uv);\r\n\r\n    vec4 halfColor = texture2D(u_MainTex, uv);\r\n    float samp0CoC = halfColor.a;\r\n\r\n    float maxRadius = u_CoCParams.z;\r\n    vec2 offset = u_SourceSize.zw * dir * samp0CoC * maxRadius;\r\n\r\n    vec4 acc = vec4(0.0);\r\n\r\n    for (int i = 0; i < kTapCount; i++) {\r\n        vec2 sampCoord = uv + kOffsets[i] * offset;\r\n        vec4 samp = texture2D(u_MainTex, sampCoord);\r\n        float sampCoC = samp.w;\r\n        vec3 sampColor = samp.xyz;\r\n\r\n        float weight = clamp(1.0 - (samp0CoC - sampCoC), 0.0, 1.0);\r\n        acc += vec4(sampColor, 1.0) * kCoeffs[i] * weight;\r\n    }\r\n\r\n    acc.xyz /= acc.w + 1e-4;\r\n    return vec4(acc.xyz, 1.0);\r\n}\r\n\r\nvoid main() {\r\n    gl_FragColor = Blur(vec2(0.0, 1.0), 0.0);\r\n    // gl_FragColor = texture2D(u_MainTex, v_Texcoord0);\r\n}\r\n";
    var BlurHFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME BlurHFS\r\n\r\nuniform sampler2D u_MainTex;\r\n\r\nuniform vec4 u_SourceSize;\r\nuniform vec4 u_DownSampleScale;\r\nuniform vec3 u_CoCParams;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nconst int kTapCount = 3;\r\nfloat kOffsets[3];\r\nfloat kCoeffs[3];\r\n\r\nvec4 Blur(vec2 dir, float premultiply) {\r\n\r\n    kOffsets[0] = -1.33333333;\r\n    kOffsets[1] = 0.00000000;\r\n    kOffsets[2] = 1.33333333;\r\n\r\n    kCoeffs[0] = 0.35294118;\r\n    kCoeffs[1] = 0.29411765;\r\n    kCoeffs[2] = 0.3529411;\r\n\r\n    vec2 uv = v_Texcoord0;\r\n    // ivec2 positionSS = ivec2(u_SourceSize.xy * uv);\r\n\r\n    vec4 halfColor = texture2D(u_MainTex, uv);\r\n    float samp0CoC = halfColor.a;\r\n\r\n    float maxRadius = u_CoCParams.z;\r\n    vec2 offset = u_SourceSize.zw  * dir * samp0CoC * maxRadius;\r\n\r\n    vec4 acc = vec4(0.0);\r\n\r\n    for (int i = 0; i < kTapCount; i++) {\r\n        vec2 sampCoord = uv + kOffsets[i] * offset;\r\n        vec4 samp = texture2D(u_MainTex, sampCoord);\r\n        float sampCoC = samp.a;\r\n        vec3 sampColor = samp.rgb;\r\n\r\n        float weight = clamp(1.0 - (samp0CoC - sampCoC), 0.0, 1.0);\r\n        acc += vec4(sampColor, sampCoC) * kCoeffs[i] * weight;\r\n    }\r\n\r\n    acc.xyz /= acc.w + 1e-4;\r\n    return vec4(acc.xyz, samp0CoC);\r\n}\r\n\r\nvoid main() {\r\n    gl_FragColor = Blur(vec2(1.0, 0.0), 1.0);\r\n}";
    var CompositeFS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform sampler2D u_BlurCoCTex;\r\nuniform sampler2D u_FullCoCTex;\r\n\r\nvarying vec2 v_Texcoord0;\r\n\r\nvoid main() {\r\n\r\n    vec3 baseColor = texture2D(u_MainTex, v_Texcoord0).rgb;\r\n    vec4 samplevalue = texture2D(u_BlurCoCTex, v_Texcoord0);\r\n    vec3 farColor = samplevalue.rgb;\r\n    float coc = texture2D(u_FullCoCTex, v_Texcoord0).r;\r\n\r\n    vec3 dstColor = vec3(0.0);\r\n    float dstAlpha = 1.0;\r\n\r\n    float blend = sqrt(coc * 3.14 * 2.0);\r\n    dstColor = farColor * clamp(blend, 0.0, 1.0);\r\n    dstAlpha = clamp(1.0 - blend, 0.0, 1.0);\r\n\r\n\r\n    gl_FragColor = vec4(baseColor * dstAlpha + dstColor, 1.0);\r\n\r\n}";
    class GaussianDoF extends Laya.PostProcessEffect {
        constructor() {
            GaussianDoF.__init__();
            super();
            this._shader = Laya.Shader3D.find("GaussianDoF");
            this._shaderData = new Laya.ShaderData();
            this._shaderData.setVector3(GaussianDoF.COCPARAMS, new Laya.Vector3(10, 30, 1));
            this._zBufferParams = new Laya.Vector4();
            this._sourceSize = new Laya.Vector4();
            this._dowmSampleScale = new Laya.Vector4();
            GaussianDoF.SOURCESIZE = Laya.Shader3D.propertyNameToID("u_SourceSize");
            GaussianDoF.ZBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_ZBufferParams");
            GaussianDoF.COCPARAMS = Laya.Shader3D.propertyNameToID("u_CoCParams");
            GaussianDoF.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthTexture");
            GaussianDoF.NORMALDEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthNormalTexture");
            GaussianDoF.FULLCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_FullCoCTex");
            GaussianDoF.DOWNSAMPLESCALE = Laya.Shader3D.propertyNameToID("u_DownSampleScale");
            GaussianDoF.BLURCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_BlurCoCTex");
        }
        static __init__() {
            GaussianDoF.SOURCESIZE = Laya.Shader3D.propertyNameToID("u_SourceSize");
            GaussianDoF.ZBUFFERPARAMS = Laya.Shader3D.propertyNameToID("u_ZBufferParams");
            GaussianDoF.COCPARAMS = Laya.Shader3D.propertyNameToID("u_CoCParams");
            GaussianDoF.DEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthTexture");
            GaussianDoF.NORMALDEPTHTEXTURE = Laya.Shader3D.propertyNameToID("u_CameraDepthNormalTexture");
            GaussianDoF.FULLCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_FullCoCTex");
            GaussianDoF.DOWNSAMPLESCALE = Laya.Shader3D.propertyNameToID("u_DownSampleScale");
            GaussianDoF.BLURCOCTEXTURE = Laya.Shader3D.propertyNameToID("u_BlurCoCTex");
            GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE = Laya.Shader3D.getDefineByName("CAMERA_NORMALDEPTH");
            let attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            let uniformMap = {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
                'u_ZBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
                'u_CoCParams': Laya.Shader3D.PERIOD_MATERIAL,
                'u_CameraDepthTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_CameraDepthNormalTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_FullCoCTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_SourceSize': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DownSampleScale': Laya.Shader3D.PERIOD_MATERIAL,
                'u_BlurCoCTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MainTex_TexelSize': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let shader = Laya.Shader3D.add("GaussianDoF");
            let cocSubShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(cocSubShader);
            let cocPass = cocSubShader.addShaderPass(FullScreenVert, CoCFS);
            let prefilterSubShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(prefilterSubShader);
            let prefilterPass = prefilterSubShader.addShaderPass(FullScreenVert, PrefilterFS);
            let blurHSubShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(blurHSubShader);
            let blurHPass = blurHSubShader.addShaderPass(FullScreenVert, BlurHFS);
            let blurVSubShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(blurVSubShader);
            let blurVPass = blurVSubShader.addShaderPass(FullScreenVert, BlurVFS);
            let compositeSubShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(compositeSubShader);
            let compositePass = compositeSubShader.addShaderPass(FullScreenVert, CompositeFS);
        }
        set farStart(value) {
            let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
            cocParams.x = value;
            this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
        }
        get farStart() {
            return this._shaderData.getVector3(GaussianDoF.COCPARAMS).x;
        }
        set farEnd(value) {
            let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
            cocParams.y = Math.max(cocParams.x, value);
            this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
        }
        get farEnd() {
            return this._shaderData.getVector3(GaussianDoF.COCPARAMS).y;
        }
        set maxRadius(value) {
            let cocParams = this._shaderData.getVector3(GaussianDoF.COCPARAMS);
            cocParams.z = Math.min(value, 2);
            this._shaderData.setVector3(GaussianDoF.COCPARAMS, cocParams);
        }
        get maxRadius() {
            return this._shaderData.getVector3(GaussianDoF.COCPARAMS).z;
        }
        setupShaderValue(context) {
            let camera = context.camera;
            let source = context.source;
            this._dowmSampleScale.setValue(0.5, 0.5, 2.0, 2.0);
            this._shaderData.setVector(GaussianDoF.DOWNSAMPLESCALE, this._dowmSampleScale);
            let far = camera.farPlane;
            let near = camera.nearPlane;
            this._zBufferParams.setValue(1.0 - far / near, far / near, (near - far) / (near * far), 1 / near);
            this._shaderData.setVector(GaussianDoF.ZBUFFERPARAMS, this._zBufferParams);
            if (camera.depthTextureMode & Laya.DepthTextureMode.Depth) {
                let depthTexture = camera.depthTexture;
                this._shaderData.setTexture(GaussianDoF.DEPTHTEXTURE, depthTexture);
                this._shaderData.removeDefine(GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE);
            }
            else if (camera.depthTextureMode & Laya.DepthTextureMode.DepthNormals) {
                let depthNormalTexture = camera.depthNormalTexture;
                this._shaderData.setTexture(GaussianDoF.NORMALDEPTHTEXTURE, depthNormalTexture);
                this._shaderData.addDefine(GaussianDoF.SHADERDEFINE_DEPTHNORMALTEXTURE);
            }
            else {
                camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
            }
        }
        render(context) {
            let cmd = context.command;
            let viewport = context.camera.viewport;
            let camera = context.camera;
            this.setupShaderValue(context);
            let source = context.source;
            let shader = this._shader;
            let shaderData = this._shaderData;
            let dataTexFormat = Laya.RenderTextureFormat.R16G16B16A16;
            let fullCoC = Laya.RenderTexture.createFromPool(source.width, source.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
            cmd.blitScreenTriangle(source, fullCoC, null, shader, shaderData, 0);
            fullCoC.filterMode = Laya.FilterMode.Bilinear;
            this._shaderData.setTexture(GaussianDoF.FULLCOCTEXTURE, fullCoC);
            let prefilterTex = Laya.RenderTexture.createFromPool(source.width / 2, source.height / 2, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
            cmd.blitScreenTriangle(source, prefilterTex, null, shader, shaderData, 1);
            prefilterTex.filterMode = Laya.FilterMode.Bilinear;
            this._sourceSize.setValue(prefilterTex.width, prefilterTex.height, 1.0 / prefilterTex.width, 1.0 / prefilterTex.height);
            this._shaderData.setValueData(GaussianDoF.SOURCESIZE, this._sourceSize);
            let blurHTex = Laya.RenderTexture.createFromPool(prefilterTex.width, prefilterTex.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
            cmd.blitScreenTriangle(prefilterTex, blurHTex, null, this._shader, this._shaderData, 2);
            let blurVTex = Laya.RenderTexture.createFromPool(prefilterTex.width, prefilterTex.height, dataTexFormat, Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE, 1);
            cmd.blitScreenTriangle(blurHTex, blurVTex, null, this._shader, this._shaderData, 3);
            blurVTex.filterMode = Laya.FilterMode.Bilinear;
            blurVTex.anisoLevel = 1;
            fullCoC.filterMode = Laya.FilterMode.Point;
            this._shaderData.setTexture(GaussianDoF.BLURCOCTEXTURE, blurVTex);
            let finalTex = Laya.RenderTexture.createFromPool(source.width, source.height, source.format, source.depthStencilFormat, 1);
            cmd.blitScreenTriangle(source, finalTex, null, this._shader, this._shaderData, 4);
            context.source = finalTex;
            Laya.RenderTexture.recoverToPool(fullCoC);
            Laya.RenderTexture.recoverToPool(prefilterTex);
            Laya.RenderTexture.recoverToPool(blurHTex);
            Laya.RenderTexture.recoverToPool(blurVTex);
            context.deferredReleaseTextures.push(finalTex);
        }
    }

    var Shader3D$3 = Laya.Shader3D;
    var Loader$3 = Laya.Loader;
    var DepthTextureMode$1 = Laya.DepthTextureMode;
    var PostProcess$3 = Laya.PostProcess;
    var Handler$5 = Laya.Handler;
    class PostProcessDoF extends SingletonScene {
        constructor() {
            super();
            Shader3D$3.debugMode = true;
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls", Handler$5.create(this, this.onComplate));
        }
        onComplate() {
            let scene = this.scene = Loader$3.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_zhuandibanben/Conventional/zhuandibanben.ls");
            this.AutoSetScene3d(scene);
            let camera = this.camera = scene.getChildByName("MainCamera");
            camera.addComponent(CameraMoveScript);
            let mainCamera = scene.getChildByName("BlurCamera");
            mainCamera.removeSelf();
            camera.depthTextureMode |= DepthTextureMode$1.Depth;
            let postProcess = new PostProcess$3();
            camera.postProcess = postProcess;
            let gaussianDoF = new GaussianDoF();
            console.log(gaussianDoF);
            postProcess.addEffect(gaussianDoF);
            gaussianDoF.farStart = 1;
            gaussianDoF.farEnd = 5;
            gaussianDoF.maxRadius = 1.0;
        }
    }

    var BlitScreenVS = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#include \"Lighting.glsl\";\r\n\r\n#define SHADER_NAME ScalableAO:VS\r\n\r\nattribute vec4 a_PositionTexcoord;\r\nuniform vec4 u_OffsetScale;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform mat4 u_Projection;\r\nuniform mat4 u_View;\r\n\r\nvarying mat4 v_inverseView;\r\nvarying mat4 v_inverseProj;\r\n\r\nvoid main() {\t\r\n\tgl_Position = vec4(u_OffsetScale.x*2.0-1.0+(a_PositionTexcoord.x+1.0)*u_OffsetScale.z,(1.0-((u_OffsetScale.y*2.0-1.0+(-a_PositionTexcoord.y+1.0)*u_OffsetScale.w)+1.0)/2.0)*2.0-1.0, 0.0, 1.0);\t\r\n\tv_Texcoord0 = a_PositionTexcoord.zw;\r\n\tgl_Position = remapGLPositionZ(gl_Position);\r\n\r\n\tv_inverseView = INVERSE_MAT(u_View);\r\n\tv_inverseProj = INVERSE_MAT(u_Projection);\r\n}";
    var FragAO = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME FragAO\r\n\r\n#include \"DepthNormalUtil.glsl\";\r\n\r\n// define const\r\n#define SAMPLE_COUNT 6.0\r\n#define TWO_PI 6.28318530718\r\n#define EPSILON 1.0e-4\r\nconst float kBeta = 0.002;\r\nconst float kContrast = 0.6;\r\n// varying\r\nvarying vec2 v_Texcoord0;\r\nvarying mat4 v_inverseProj;\r\n// uniform\r\nuniform sampler2D u_MainTex;\r\nuniform float u_radius;\r\nuniform float u_Intensity;\r\n\r\n\r\nuniform mat4 u_Projection;\r\nuniform vec4 u_ProjectionParams;\r\nuniform mat4 u_ViewProjection;\r\nuniform mat4 u_View;\r\nuniform float u_Time;\r\n\r\n// é‡‡æ · depthNormalTexture, è¿”å›ž positionCS.z, normalVS\r\nfloat GetDepthCSNormalVS(vec2 uv, out vec3 normalVS) {\r\n    vec4 env = texture2D(u_CameraDepthNormalsTexture, uv);\r\n    float depthCS = 0.0;\r\n    DecodeDepthNormal(env, depthCS, normalVS);\r\n    normalVS = normalize(normalVS);\r\n    return depthCS;\r\n}\r\n\r\n// è¿”å›ž è§‚å¯Ÿç©ºé—´æ·±åº¦\r\nfloat GetDepthVS(float depthCS) {\r\n\r\n    return LinearEyeDepth(depthCS, u_ZBufferParams);\r\n    // return depthCS * 20.0;\r\n}\r\n\r\n// æ ¹æ®å±å¹•uvå’Œæ·±åº¦å€¼ï¼Œè®¡ç®— è§‚å¯Ÿç©ºé—´åæ ‡\r\nvec3 GetPositionVS(vec2 uv, float depthCS) {\r\n    vec3 positionNDC = vec3(uv * 2.0 - 1.0, depthCS);\r\n\r\n    vec4 positionVS = v_inverseProj * vec4(positionNDC, 1.0);\r\n    return positionVS.xyz / positionVS.w;\r\n}\r\n\r\nfloat UVRandom(float u, float v) {\r\n    float f = dot(vec2(12.9898, 78.233), vec2(u, v));\r\n    return fract(43758.5453 * sin(f));\r\n}\r\n\r\n// èŽ·å–éšæœºåç§»\r\nvec3 PickSamplePoint(vec2 uv, int i) {\r\n    float index = float(i);\r\n\r\n    float time =sin(u_Time*2.0);\r\n    // todo  é‡‡æ · noise ä»£æ›¿è®¡ç®—éšæœº?\r\n    float u = UVRandom(uv.x + time, uv.y + index) * 2.0 - 1.0;\r\n    float theta = UVRandom(-uv.x - time, uv.y + index) * TWO_PI;\r\n\r\n    vec3 v = vec3(vec2(cos(theta), sin(theta)) * sqrt(1.0 - u * u), u);\r\n    float l = sqrt((index + 1.0) / SAMPLE_COUNT) * u_radius;\r\n    return v * l;\r\n}\r\n\r\nvec4 PackAONormal(float ao, vec3 normal) {\r\n    return vec4(ao, normal * 0.5 + 0.5);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = v_Texcoord0;\r\n    //æ³•çº¿\r\n    vec3 normalVS = vec3(0.0);\r\n    float depthCS = GetDepthCSNormalVS(uv, normalVS);\r\n    //éžçº¿æ€§æ·±åº¦\r\n    depthCS = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture, uv);\r\n    //çº¿æ€§æ·±åº¦\r\n    float depthVS = GetDepthVS(depthCS);\r\n    //èŽ·å¾—è§‚å¯Ÿç©ºé—´çš„ä½ç½®\r\n    vec3 positionVS = GetPositionVS(uv, depthCS);\r\n\r\n    float ao = 0.0;\r\n    vec3 tempNormalVS;\r\n    \r\n    for (int s = 0; s < int(SAMPLE_COUNT); s++) {\r\n        // éšæœºåç§»\r\n        vec3 sampleOffset = PickSamplePoint(uv, s);\r\n        // è°ƒæ•´åç§»æ–¹å‘ï¼Œ ä¸Ž normalVS åŒå‘,ä¿è¯åŠçƒ\r\n        sampleOffset = -sampleOffset * sign(dot(-normalVS , sampleOffset));\r\n        sampleOffset = sampleOffset*0.5;\r\n\r\n        vec3 positionVS_S = sampleOffset + positionVS;\r\n\r\n        // å°†åç§»åŽview space åæ ‡ ä¹˜ä¸ŠæŠ•å½±çŸ©é˜µè½¬æ¢åˆ° clip space\r\n        vec3 positionCS_S = (u_Projection * vec4(positionVS_S, 1.0)).xyz;\r\n        // èŽ·å– åç§»ç‚¹ çš„å±å¹• uv\r\n        vec2 uv_S = (positionCS_S.xy / (-positionVS_S.z) + 1.0) * 0.5;\r\n        // é‡‡æ · uv_S èŽ·å– æ·±åº¦å€¼\r\n        //å–å¾—æ·±åº¦\r\n        float depthCS_S = SAMPLE_DEPTH_TEXTURE(u_CameraDepthTexture, uv_S);\r\n        if (uv_S.x < 0.0 || uv_S.y > 1.0) {\r\n            depthCS_S += 1.0e8;\r\n        }\r\n        //å¾—åˆ°é‡‡æ ·ç‚¹çš„ä¸–ç•Œåæ ‡\r\n        vec3 positionVS_S2 = GetPositionVS(uv_S, depthCS_S);\r\n        vec3 sampleOffset2 = positionVS_S2 - positionVS;\r\n        float a1 = max(dot(sampleOffset2, normalVS) - kBeta * depthVS, 0.0);\r\n        float a2 = dot(sampleOffset2, sampleOffset2) + EPSILON;\r\n        ao += a1/ a2;\r\n    }\r\n\r\n    ao *= u_radius;\r\n\r\n    ao = pow(abs(ao * u_Intensity / SAMPLE_COUNT), kContrast);\r\n\r\n     gl_FragColor = PackAONormal(ao, normalVS);\r\n}";
    var AoBlurHorizontal = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME AOBlurHorizontal\r\n//è´¨é‡\r\n#define BLUR_HIGH_QUALITY 0\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nvarying vec2 v_Texcoord0;\r\n\r\nuniform vec2 u_Delty;\r\n\r\nvec3 GetPackedNormal(vec4 p)\r\n{\r\n    return p.gba * 2.0 - 1.0;\r\n}\r\n\r\nfloat CompareNormal(vec3 d1, vec3 d2)\r\n{\r\n    return smoothstep(0.8, 1.0, dot(d1, d2));\r\n}\r\n\r\nfloat GetPackedAO(vec4 p)\r\n{\r\n    return p.r;\r\n}\r\n\r\nvec4 PackAONormal(float ao, vec3 normal) {\r\n    return vec4(ao, normal * 0.5 + 0.5);\r\n}\r\n\r\nvoid main() {\r\n\t vec2 delta = vec2(u_MainTex_TexelSize.x * 2.0*u_Delty.x,u_Delty.y*u_MainTex_TexelSize.y*2.0);\r\n\t vec2 uv = v_Texcoord0;\r\n\r\n\r\n#if defined(BLUR_HIGH_QUALITY)\r\n\r\n    // High quality 7-tap Gaussian with adaptive sampling\r\n\tvec2 uvtran = uv;\r\n    vec4 p0  = texture2D(u_MainTex,uv);\r\n\tuvtran = uv-delta;\r\n    vec4 p1a = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta;\r\n    vec4 p1b = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta*2.0;\r\n    vec4 p2a =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta*2.0;\r\n    vec4 p2b =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta * 3.2307692308;\r\n    vec4 p3a =  texture2D(u_MainTex,uvtran);;\r\n\tuvtran = uv+delta * 3.2307692308;\r\n    vec4 p3b =  texture2D(u_MainTex,uvtran);;\r\n\r\n    vec3 n0 = GetPackedNormal(p0);\r\n    \r\n\r\n    float w0  = 0.37004405286;\r\n    float w1a = CompareNormal(n0, GetPackedNormal(p1a)) * 0.31718061674;\r\n    float w1b = CompareNormal(n0, GetPackedNormal(p1b)) * 0.31718061674;\r\n    float w2a = CompareNormal(n0, GetPackedNormal(p2a)) * 0.19823788546;\r\n    float w2b = CompareNormal(n0, GetPackedNormal(p2b)) * 0.19823788546;\r\n    float w3a = CompareNormal(n0, GetPackedNormal(p3a)) * 0.11453744493;\r\n    float w3b = CompareNormal(n0, GetPackedNormal(p3b)) * 0.11453744493;\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0)  * w0;\r\n    s += GetPackedAO(p1a) * w1a;\r\n    s += GetPackedAO(p1b) * w1b;\r\n    s += GetPackedAO(p2a) * w2a;\r\n    s += GetPackedAO(p2b) * w2b;\r\n    s += GetPackedAO(p3a) * w3a;\r\n    s += GetPackedAO(p3b) * w3b;\r\n\r\n    s /= w0 + w1a + w1b + w2a + w2b + w3a + w3b;\r\n\r\n#else\r\n\r\n    // Fater 5-tap Gaussian with linear sampling\r\n    vec4 p0  = texture2D(u_MainTex, sampler_MainTex, i.texcoordStereo);\r\n    vec4 p1a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord - delta * 1.3846153846));\r\n    vec4 p1b = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord + delta * 1.3846153846));\r\n    vec4 p2a = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord - delta * 3.2307692308));\r\n    vec4 p2b = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, UnityStereoTransformScreenSpaceTex(i.texcoord + delta * 3.2307692308));\r\n\r\n\tvec2 uvtran = uv;\r\n    vec4 p0  = texture2D(u_MainTex,uv);\r\n\tuvtran = uv-delta * 1.3846153846;\r\n    vec4 p1a = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta * 1.3846153846;\r\n    vec4 p1b = texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv-delta*3.2307692308;\r\n    vec4 p2a =  texture2D(u_MainTex,uvtran);\r\n\tuvtran = uv+delta*3.2307692308;\r\n    vec4 p2b =  texture2D(u_MainTex,uvtran);\r\n\r\n \tvec3 n0 = GetPackedNormal(p0);\r\n\r\n    float w0  = 0.2270270270;\r\n    float w1a = CompareNormal(n0, GetPackedNormal(p1a)) * 0.3162162162;\r\n    float w1b = CompareNormal(n0, GetPackedNormal(p1b)) * 0.3162162162;\r\n    float w2a = CompareNormal(n0, GetPackedNormal(p2a)) * 0.0702702703;\r\n    float w2b = CompareNormal(n0, GetPackedNormal(p2b)) * 0.0702702703;\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0)  * w0;\r\n    s += GetPackedAO(p1a) * w1a;\r\n    s += GetPackedAO(p1b) * w1b;\r\n    s += GetPackedAO(p2a) * w2a;\r\n    s += GetPackedAO(p2b) * w2b;\r\n\r\n    s /= w0 + w1a + w1b + w2a + w2b;\r\n\r\n#endif\r\n\r\n    gl_FragColor = PackAONormal(s, n0);;\r\n}";
    var AOComposition = "#if defined(GL_FRAGMENT_PRECISION_HIGH)\r\n\tprecision highp float;\r\n#else\r\n\tprecision mediump float;\r\n#endif\r\n\r\n#define SHADER_NAME AOBlurHorizontal\r\n//è´¨é‡\r\n#define BLUR_HIGH_QUALITY 0\r\n\r\nuniform sampler2D u_MainTex;\r\nuniform vec4 u_MainTex_TexelSize;\r\nuniform vec3 u_AOColor;\r\nuniform sampler2D u_compositionAoTexture;\r\nvarying vec2 v_Texcoord0;\r\n\r\nvec3 GetPackedNormal(vec4 p)\r\n{\r\n    return p.gba * 2.0 - 1.0;\r\n}\r\nfloat CompareNormal(vec3 d1, vec3 d2)\r\n{\r\n    return smoothstep(0.8, 1.0, dot(d1, d2));\r\n}\r\nfloat GetPackedAO(vec4 p)\r\n{\r\n    return p.r;\r\n}\r\n// Geometry-aware bilateral filter (single pass/small kernel)\r\nfloat BlurSmall(sampler2D tex, vec2 uv, vec2 delta)\r\n{\r\n    vec4 p0 = texture2D(tex,uv);\r\n    vec2 uvtran =uv+vec2(-delta.x,-delta.y) ;\r\n    vec4 p1 = texture2D(tex,uvtran);\r\n    uvtran =uv+vec2(delta.x,-delta.y);\r\n    vec4 p2 = texture2D(tex, uvtran);\r\n    uvtran =uv+vec2(-delta.x,delta.y) ;\r\n    vec4 p3 = texture2D(tex, uvtran);\r\n    uvtran =uv+delta;\r\n    vec4 p4 = texture2D(tex, uvtran);\r\n\r\n    vec3 n0 = GetPackedNormal(p0);\r\n\r\n    float w0 = 1.0;\r\n    float w1 = CompareNormal(n0, GetPackedNormal(p1));\r\n    float w2 = CompareNormal(n0, GetPackedNormal(p2));\r\n    float w3 = CompareNormal(n0, GetPackedNormal(p3));\r\n    float w4 = CompareNormal(n0, GetPackedNormal(p4));\r\n\r\n    float s;\r\n    s  = GetPackedAO(p0) * w0;\r\n    s += GetPackedAO(p1) * w1;\r\n    s += GetPackedAO(p2) * w2;\r\n    s += GetPackedAO(p3) * w3;\r\n    s += GetPackedAO(p4) * w4;\r\n\r\n    return s / (w0 + w1 + w2 + w3 + w4);\r\n}\r\n\r\nvoid main() {\r\n    vec2 uv = v_Texcoord0;\r\n    vec2 delty = u_MainTex_TexelSize.xy;\r\n    float ao = BlurSmall(u_compositionAoTexture,uv,delty);\r\n    vec4 albedo = texture2D(u_MainTex,uv);\r\n    vec4 aocolor = vec4(ao*u_AOColor,ao);\r\n    //albedo.rgb = ao*u_AOColor*albedo.rgb;\r\n    albedo.rgb = albedo.rgb*(1.0-ao)+ao*u_AOColor*ao;\r\n    gl_FragColor = albedo;\r\n\r\n\r\n}";
    class ScalableAO extends Laya.PostProcessEffect {
        constructor() {
            super();
            ScalableAO.HasInit || ScalableAO.init();
            this._shader = Laya.Shader3D.find("ScalableAO");
            this._shaderData = new Laya.ShaderData();
            this._aoBlurHorizontalShader = Laya.Shader3D.find("AOBlurHorizontal");
            this._aoComposition = Laya.Shader3D.find("AOComposition");
            ScalableAO.BlurDelty = Laya.Shader3D.propertyNameToID("u_Delty");
            ScalableAO.AOColor = Laya.Shader3D.propertyNameToID("u_AOColor");
            ScalableAO.aoTexture = Laya.Shader3D.propertyNameToID("u_compositionAoTexture");
            ScalableAO.radius = Laya.Shader3D.propertyNameToID("u_radius");
            ScalableAO.instance = Laya.Shader3D.propertyNameToID("u_Intensity");
            ScalableAO.HasInit = false;
            ScalableAO.deltyHorizontal = new Laya.Vector2(1.0, 0.0);
            ScalableAO.deltyVector = new Laya.Vector2(0.0, 1.0);
        }
        static init() {
            let attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            let uniformMap = {
                'u_Projection': Laya.Shader3D.PERIOD_MATERIAL,
                'u_ProjectionParams': Laya.Shader3D.PERIOD_MATERIAL,
                'u_ViewProjection': Laya.Shader3D.PERIOD_MATERIAL,
                'u_ZBufferParams': Laya.Shader3D.PERIOD_MATERIAL,
                'u_View': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Time': Laya.Shader3D.PERIOD_MATERIAL,
                'u_CameraDepthTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_CameraDepthNormalsTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_radius': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Intensity': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let shader = Laya.Shader3D.add("ScalableAO");
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            shader.addSubShader(subShader);
            subShader.addShaderPass(BlitScreenVS, FragAO);
            attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            shader = Laya.Shader3D.add("AOBlurHorizontal");
            subShader = new Laya.SubShader(attributeMap, {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
                'u_View': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Projection': Laya.Shader3D.PERIOD_MATERIAL
            });
            shader.addSubShader(subShader);
            subShader.addShaderPass(BlitScreenVS, AoBlurHorizontal);
            attributeMap = {
                'a_PositionTexcoord': Laya.VertexMesh.MESH_POSITION0
            };
            shader = Laya.Shader3D.add("AOComposition");
            subShader = new Laya.SubShader(attributeMap, {
                'u_MainTex': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OffsetScale': Laya.Shader3D.PERIOD_MATERIAL,
                'u_View': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Projection': Laya.Shader3D.PERIOD_MATERIAL
            });
            shader.addSubShader(subShader);
            subShader.addShaderPass(BlitScreenVS, AOComposition);
            ScalableAO.BlurDelty = Laya.Shader3D.propertyNameToID("u_Delty");
            ScalableAO.AOColor = Laya.Shader3D.propertyNameToID("u_AOColor");
            ScalableAO.aoTexture = Laya.Shader3D.propertyNameToID("u_compositionAoTexture");
            ScalableAO.radius = Laya.Shader3D.propertyNameToID("u_radius");
            ScalableAO.instance = Laya.Shader3D.propertyNameToID("u_Intensity");
            ScalableAO.HasInit = false;
            ScalableAO.deltyHorizontal = new Laya.Vector2(1.0, 0.0);
            ScalableAO.deltyVector = new Laya.Vector2(0.0, 1.0);
        }
        set aoColor(value) {
            this._shaderData.setVector3(ScalableAO.AOColor, value);
        }
        set instance(value) {
            this._shaderData.setNumber(ScalableAO.instance, value);
        }
        set radius(value) {
            this._shaderData.setNumber(ScalableAO.radius, value);
        }
        setUniform(camera) {
            let scene = camera.scene;
            let shaderData = this._shaderData;
            shaderData.setVector2(ScalableAO.BlurDelty, ScalableAO.deltyHorizontal);
        }
        render(context) {
            let cmd = context.command;
            let viewport = context.camera.viewport;
            let camera = context.camera;
            camera.depthTextureMode |= Laya.DepthTextureMode.DepthNormals;
            camera.depthTextureMode |= Laya.DepthTextureMode.Depth;
            let depthNormalTexture = camera.depthNormalTexture;
            let depthTexture = camera.depthTexture;
            if (!depthNormalTexture || !depthTexture) {
                return;
            }
            depthNormalTexture.wrapModeU = Laya.WarpMode.Clamp;
            depthNormalTexture.wrapModeV = Laya.WarpMode.Clamp;
            let source = context.source;
            let width = source.width;
            let height = source.height;
            let textureFormat = source.format;
            let depthFormat = Laya.RenderTextureDepthFormat.DEPTHSTENCIL_NONE;
            let finalTex = Laya.RenderTexture.createFromPool(width, height, textureFormat, depthFormat);
            let shader = this._shader;
            let shaderData = this._shaderData;
            this.setUniform(camera);
            cmd.blitScreenTriangle(null, finalTex, null, shader, shaderData, 0);
            let blurTex = Laya.RenderTexture.createFromPool(width, height, textureFormat, depthFormat);
            cmd.blitScreenTriangle(finalTex, blurTex, null, this._aoBlurHorizontalShader, shaderData, 0);
            cmd.setShaderDataVector2(shaderData, ScalableAO.BlurDelty, ScalableAO.deltyVector);
            cmd.blitScreenTriangle(blurTex, finalTex, null, this._aoBlurHorizontalShader, this._shaderData, 0);
            cmd.setShaderDataTexture(shaderData, ScalableAO.aoTexture, finalTex);
            cmd.blitScreenTriangle(null, blurTex, null, this._aoComposition, this._shaderData, 0);
            context.source = blurTex;
            context.deferredReleaseTextures.push(finalTex);
            context.deferredReleaseTextures.push(blurTex);
        }
    }

    var Scene3D$4 = Laya.Scene3D;
    var Camera$3 = Laya.Camera;
    var PostProcess$4 = Laya.PostProcess;
    var Shader3D$4 = Laya.Shader3D;
    var Vector3$3 = Laya.Vector3;
    var DirectionLight$2 = Laya.DirectionLight;
    var Sprite3D$1 = Laya.Sprite3D;
    var MeshSprite3D$1 = Laya.MeshSprite3D;
    var PrimitiveMesh$1 = Laya.PrimitiveMesh;
    var BlinnPhongMaterial = Laya.BlinnPhongMaterial;
    var Button$4 = Laya.Button;
    var Browser$4 = Laya.Browser;
    var Event$4 = Laya.Event;
    var Handler$6 = Laya.Handler;
    class ProstProcess_AO extends SingletonScene {
        constructor() {
            super();
            Shader3D$4.debugMode = true;
            this.onResComplate();
        }
        onResComplate() {
            this.s_scene = new Scene3D$4();
            this.s_scene.ambientColor = new Vector3$3(1, 1, 1);
            var camera = this.s_scene.addChild(new Camera$3(0, 0.1, 1000));
            camera.transform.translate(new Vector3$3(0, 1, 5));
            camera.transform.rotate(new Vector3$3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            this.camera = camera;
            var directionLight = this.s_scene.addChild(new DirectionLight$2());
            directionLight.color.setValue(0.5, 0.5, 0.5);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3$3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.addObjectInScene(this.s_scene);
            this.addPostProcess(camera);
            this.loadUI();
        }
        addObjectInScene(scene) {
            let sprite = new Sprite3D$1();
            scene.addChild(sprite);
            let planeMesh = PrimitiveMesh$1.createPlane(10, 10, 1, 1);
            let plane = new MeshSprite3D$1(planeMesh);
            scene.addChild(plane);
            let cubeMesh = PrimitiveMesh$1.createBox();
            let sphere = PrimitiveMesh$1.createSphere(0.3);
            let cube0 = new MeshSprite3D$1(cubeMesh);
            let cube1 = new MeshSprite3D$1(cubeMesh);
            let cube2 = new MeshSprite3D$1(cubeMesh);
            let cube3 = new MeshSprite3D$1(cubeMesh);
            let sphere0 = new MeshSprite3D$1(sphere);
            let sphere1 = new MeshSprite3D$1(sphere);
            let sphere2 = new MeshSprite3D$1(sphere);
            let sphere3 = new MeshSprite3D$1(sphere);
            cube0.meshRenderer.sharedMaterial = new BlinnPhongMaterial;
            sprite.addChild(cube0);
            sprite.addChild(cube1);
            sprite.addChild(cube2);
            sprite.addChild(cube3);
            sprite.addChild(sphere0);
            sprite.addChild(sphere1);
            sprite.addChild(sphere2);
            sprite.addChild(sphere3);
            cube1.transform.position = new Vector3$3(-1, 0, 0);
            cube2.transform.position = new Vector3$3(-1, 0, 1);
            cube3.transform.position = new Vector3$3(-1, 1, 0);
            sphere0.transform.position = new Vector3$3(-3, 0, 0);
            sphere1.transform.position = new Vector3$3(2, 0, 0);
            sphere2.transform.position = new Vector3$3(2, 0.5, 0);
            sphere3.transform.position = new Vector3$3(-1, 0, 2);
        }
        addPostProcess(camera) {
            let postProcess = new PostProcess$4();
            camera.postProcess = postProcess;
            this.postProcess = postProcess;
            let ao = new ScalableAO();
            ao.radius = 0.15;
            ao.aoColor = new Vector3$3(0.0, 0.0, 0.0);
            ao.instance = 0.5;
            postProcess.addEffect(ao);
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$6.create(this, function () {
                this.AutoSetScene3d(this.s_scene);
                this.btn = Laya.stage.addChild(new Button$4(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭AO"));
                this.btn.size(200, 40);
                this.btn.labelBold = true;
                this.btn.labelSize = 30;
                this.btn.sizeGrid = "4,4,4,4";
                this.btn.scale(Browser$4.pixelRatio, Browser$4.pixelRatio);
                this.btn.pos(Laya.stage.width / 2 - this.btn.width * Browser$4.pixelRatio / 2, Laya.stage.height - 60 * Browser$4.pixelRatio);
                this.btn.on(Event$4.CLICK, this, function () {
                    var enableHDR = !!this.camera.postProcess;
                    if (enableHDR) {
                        this.btn.label = "开启AO";
                        this.camera.postProcess = null;
                    }
                    else {
                        this.btn.label = "关闭AO";
                        this.camera.postProcess = this.postProcess;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.btn) {
                this.btn.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.btn) {
                this.btn.visible = false;
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
                    PostProcess_Blur.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    PostProcessBloom.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    PostProcess_Edge.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    PostProcessDoF.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    ProstProcess_AO.getInstance().Click();
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

    var Handler$7 = Laya.Handler;
    var Scene3D$5 = Laya.Scene3D;
    var Camera$4 = Laya.Camera;
    var Vector3$4 = Laya.Vector3;
    var DirectionLight$3 = Laya.DirectionLight;
    var MeshSprite3D$2 = Laya.MeshSprite3D;
    var Loader$4 = Laya.Loader;
    var PBRStandardMaterial = Laya.PBRStandardMaterial;
    var Script3D = Laya.Script3D;
    var PrimitiveMesh$2 = Laya.PrimitiveMesh;
    var Button$5 = Laya.Button;
    var Browser$5 = Laya.Browser;
    var Event$5 = Laya.Event;
    class RotationScript extends Script3D {
        constructor() {
            super(...arguments);
            this.autoRotateSpeed = new Vector3$4(0, 0.05, 0);
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
            ], Handler$7.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Laya.stage.addChild(new Scene3D$5());
            var camera = (scene.addChild(new Camera$4(0, 0.1, 100)));
            camera.transform.translate(new Vector3$4(0, 1.2, 1.6));
            camera.transform.rotate(new Vector3$4(-35, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = scene.addChild(new DirectionLight$3());
            directionLight.color = new Vector3$4(0.85, 0.85, 0.8);
            directionLight.transform.rotate(new Vector3$4(-Math.PI / 3, 0, 0));
            directionLight.shadowDistance = 3;
            directionLight.shadowResolution = 1024;
            var rotationScript = directionLight.addComponent(RotationScript);
            var grid = scene.addChild(Loader$4.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
            grid.getChildAt(0).meshRenderer.receiveShadow = true;
            var layaMonkey = scene.addChild(Loader$4.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            layaMonkey.transform.localScale = new Vector3$4(0.3, 0.3, 0.3);
            layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.castShadow = true;
            var sphereSprite = this.addPBRSphere(PrimitiveMesh$2.createSphere(0.1), new Vector3$4(0, 0.2, 0.5), scene);
            sphereSprite.meshRenderer.castShadow = true;
            sphereSprite.meshRenderer.receiveShadow = true;
            this.loadUI(rotationScript);
        }
        addPBRSphere(sphereMesh, position, scene) {
            var mat = new PBRStandardMaterial();
            mat.smoothness = 0.2;
            var meshSprite = new MeshSprite3D$2(sphereMesh);
            meshSprite.meshRenderer.sharedMaterial = mat;
            var transform = meshSprite.transform;
            transform.localPosition = position;
            scene.addChild(meshSprite);
            return meshSprite;
        }
        loadUI(rottaionScript) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler$7.create(this, function () {
                this.rotationButton = Laya.stage.addChild(new Button$5("res/threeDimen/ui/button.png", "Stop Rotation"));
                this.rotationButton.size(150, 30);
                this.rotationButton.labelSize = 20;
                this.rotationButton.sizeGrid = "4,4,4,4";
                this.rotationButton.scale(Browser$5.pixelRatio, Browser$5.pixelRatio);
                this.rotationButton.pos(Laya.stage.width / 2 - this.rotationButton.width * Browser$5.pixelRatio / 2, Laya.stage.height - 40 * Browser$5.pixelRatio);
                this.rotationButton.on(Event$5.CLICK, this, function () {
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

    var Shader3D$5 = Laya.Shader3D;
    var Handler$8 = Laya.Handler;
    var Scene3D$6 = Laya.Scene3D;
    var SpotLight = Laya.SpotLight;
    var MeshSprite3D$3 = Laya.MeshSprite3D;
    class SpotLightShadowMap extends SingletonScene {
        constructor() {
            super();
            Shader3D$5.debugMode = true;
            Scene3D$6.load(GlobalConfig.ResPath + "res/threeDimen/testNewFunction/LayaScene_depthScene/Conventional/depthScene.ls", Handler$8.create(this, function (scene) {
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
                if (childSprite instanceof MeshSprite3D$3) {
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

    var Handler$9 = Laya.Handler;
    var Scene3D$7 = Laya.Scene3D;
    var Vector3$5 = Laya.Vector3;
    var PointLight = Laya.PointLight;
    var SpotLight$1 = Laya.SpotLight;
    var Script3D$1 = Laya.Script3D;
    class LightMoveScript extends Script3D$1 {
        constructor() {
            super(...arguments);
            this.forward = new Vector3$5();
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
            Scene3D$7.load(GlobalConfig.ResPath + "res/threeDimen/scene/MultiLightScene/InventoryScene_Forest.ls", Handler$9.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
                camera.transform.localPosition = new Vector3$5(8.937199060699333, 61.364798067809126, -66.77836086472654);
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
                    offsets[i] = new Vector3$5((Math.random() - 0.5) * 10, pointLight.range * 0.75, (Math.random() - 0.5) * 10);
                    moveRanges[i] = new Vector3$5((Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40);
                }
                var spotLight = scene.addChild(new SpotLight$1());
                spotLight.transform.localPosition = new Vector3$5(0.0, 9.0, -35.0);
                spotLight.transform.localRotationEuler = new Vector3$5(-15.0, 180.0, 0.0);
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

    var Vector3$6 = Laya.Vector3;
    var Shader3D$6 = Laya.Shader3D;
    var Scene3D$8 = Laya.Scene3D;
    var Handler$a = Laya.Handler;
    var PrimitiveMesh$3 = Laya.PrimitiveMesh;
    var Vector4 = Laya.Vector4;
    var PBRStandardMaterial$1 = Laya.PBRStandardMaterial;
    var MeshSprite3D$4 = Laya.MeshSprite3D;
    class PBRMaterialDemo extends SingletonScene {
        constructor() {
            super();
            Shader3D$6.debugMode = true;
            Scene3D$8.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_EmptyScene/Conventional/EmptyScene.ls", Handler$a.create(this, function (scene) {
                this.s_scene = scene;
                this.AutoSetScene3d(this.s_scene);
                var camera = scene.getChildByName("Main Camera");
                var moveScript = camera.addComponent(CameraMoveScript);
                moveScript.rotaionSpeed = 0.005;
                var sphereMesh = PrimitiveMesh$3.createSphere(0.25, 32, 32);
                const row = 6;
                this.addSpheresSpecialMetallic(sphereMesh, new Vector3$6(0, 1.5, 0), scene, row, new Vector4(186 / 255, 110 / 255, 64 / 255, 1.0), 1.0);
                this.addSpheresSmoothnessMetallic(sphereMesh, new Vector3$6(0, 0, 0), scene, 3, row, new Vector4(1.0, 1.0, 1.0, 1.0));
                this.addSpheresSpecialMetallic(sphereMesh, new Vector3$6(0, -1.5, 0), scene, row, new Vector4(0.0, 0.0, 0.0, 1.0), 0.0);
            }));
        }
        addPBRSphere(sphereMesh, position, scene, color, smoothness, metallic) {
            var mat = new PBRStandardMaterial$1();
            mat.albedoColor = color;
            mat.smoothness = smoothness;
            mat.metallic = metallic;
            var meshSprite = new MeshSprite3D$4(sphereMesh);
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
                    Vector3$6.add(offset, pos, pos);
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
                Vector3$6.add(offset, pos, pos);
                this.addPBRSphere(sphereMesh, pos, scene, color, smoothness, metallic);
            }
        }
    }
    PBRMaterialDemo._tempPos = new Vector3$6();

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

    var Sprite3D$2 = Laya.Sprite3D;
    var Scene3D$9 = Laya.Scene3D;
    var Camera$5 = Laya.Camera;
    var Vector3$7 = Laya.Vector3;
    var Vector4$1 = Laya.Vector4;
    var MeshSprite3D$5 = Laya.MeshSprite3D;
    var PrimitiveMesh$4 = Laya.PrimitiveMesh;
    var DirectionLight$4 = Laya.DirectionLight;
    var Texture2D$1 = Laya.Texture2D;
    var BlinnPhongMaterial$1 = Laya.BlinnPhongMaterial;
    var TextureFormat = Laya.TextureFormat;
    var HalfFloatUtils = Laya.HalfFloatUtils;
    var FilterMode = Laya.FilterMode;
    class HalfFloatTexture extends SingletonScene {
        constructor() {
            super();
            var scene = new Scene3D$9();
            var camera = scene.addChild(new Camera$5(0, 0.1, 100));
            camera.transform.translate(new Vector3$7(0, 2, 5));
            camera.transform.rotate(new Vector3$7(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$1(0.2, 0.2, 0.2, 1.0);
            var directionLight = scene.addChild(new DirectionLight$4());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3$7(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.sprite3D = scene.addChild(new Sprite3D$2());
            var box = this.sprite3D.addChild(new MeshSprite3D$5(PrimitiveMesh$4.createPlane(1, 1)));
            box.transform.position = new Vector3$7(0.0, 1.0, 2.5);
            box.transform.rotate(new Vector3$7(90, 0, 0), false, false);
            var material = new BlinnPhongMaterial$1();
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
    var Scene3D$a = Laya.Scene3D;
    var Camera$6 = Laya.Camera;
    var Vector3$8 = Laya.Vector3;
    var Vector4$2 = Laya.Vector4;
    var MeshSprite3D$6 = Laya.MeshSprite3D;
    var PrimitiveMesh$5 = Laya.PrimitiveMesh;
    var Browser$6 = Laya.Browser;
    var Texture2D$2 = Laya.Texture2D;
    var Handler$b = Laya.Handler;
    class GPUCompression_ASTC extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Scene3D$a();
            var camera = this.s_scene.addChild(new Camera$6(0, 0.1, 100));
            camera.transform.translate(new Vector3$8(0, 2, 5));
            camera.transform.rotate(new Vector3$8(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$2(0.2, 0.2, 0.2, 1.0);
            let meshSprite = new MeshSprite3D$6(PrimitiveMesh$5.createBox());
            this.mat = new UnlitMaterial();
            this.s_scene.addChild(meshSprite);
            meshSprite.meshRenderer.sharedMaterial = this.mat;
            if (!Browser$6.onAndroid && !Browser$6.onIOS) {
                console.log("PC不支持ASTC纹理");
                return;
            }
            Texture2D$2.load(GlobalConfig.ResPath + "res/threeDimen/texture/ASTC4x4Test.ktx", Handler$b.create(this, function (texture) {
                this.mat.albedoTexture = texture;
                this.AutoSetScene3d(this.s_scene);
            }));
        }
    }

    var UnlitMaterial$1 = Laya.UnlitMaterial;
    var Scene3D$b = Laya.Scene3D;
    var Camera$7 = Laya.Camera;
    var Vector3$9 = Laya.Vector3;
    var Vector4$3 = Laya.Vector4;
    var MeshSprite3D$7 = Laya.MeshSprite3D;
    var PrimitiveMesh$6 = Laya.PrimitiveMesh;
    var Browser$7 = Laya.Browser;
    var Texture2D$3 = Laya.Texture2D;
    var Handler$c = Laya.Handler;
    class GPUCompression_ETC2 extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Scene3D$b();
            var camera = this.s_scene.addChild(new Camera$7(0, 0.1, 100));
            camera.transform.translate(new Vector3$9(0, 2, 5));
            camera.transform.rotate(new Vector3$9(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            camera.clearColor = new Vector4$3(0.2, 0.2, 0.2, 1.0);
            let meshSprite = new MeshSprite3D$7(PrimitiveMesh$6.createBox());
            this.mat = new UnlitMaterial$1();
            this.s_scene.addChild(meshSprite);
            meshSprite.meshRenderer.sharedMaterial = this.mat;
            if (!Browser$7.onAndroid) {
                console.log("只有安卓支持ETC");
                return;
            }
            Texture2D$3.load(GlobalConfig.ResPath + "res/threeDimen/texture/ETC2Test.ktx", Handler$c.create(this, function (texture) {
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

    class AnimationLayerBlend extends SingletonScene {
        constructor() {
            super();
            this.motionCross = false;
            this.blendType = 0;
            this.motionIndex = 0;
            this.motions = ["run", "run_2", "attack", "attack_1", "attack_2", "dead", "idle_2", "idle_3", "idle_4", "idle4", "reload", "replace", "replace_2", "stop"];
            this.btns = [];
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_Sniper/Sniper.ls", Laya.Handler.create(this, this.sceneLoaded));
        }
        sceneLoaded(scene) {
            this.AutoSetScene3d(scene);
            var animator = scene.getChildAt(2).getComponent(Laya.Animator);
            this.addbtn(100, 100, 160, 30, "动画过渡:否", 20, function (e) {
                this.motionCross = !this.motionCross;
                if (this.motionCross)
                    e.target.label = "动画过渡:是";
                else
                    e.target.label = "动画过渡:否";
            });
            this.addbtn(100, 160, 160, 30, "混合模式:全身", 20, function (e) {
                this.blendType++;
                (this.blendType === 3) && (this.blendType = 0);
                switch (this.blendType) {
                    case 0:
                        e.target.label = "混合模式:全身";
                        break;
                    case 1:
                        e.target.label = "混合模式:上身";
                        break;
                    case 2:
                        e.target.label = "混合模式:下身";
                        break;
                }
            });
            this.addbtn(100, 220, 260, 40, "切换动作:attack_2", 28, function (e) {
                switch (this.blendType) {
                    case 0:
                        if (this.motionCross) {
                            animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                            animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                        }
                        else {
                            animator.play(this.motions[this.motionIndex], 0);
                            animator.play(this.motions[this.motionIndex], 1);
                        }
                        break;
                    case 1:
                        if (this.motionCross)
                            animator.crossFade(this.motions[this.motionIndex], 0.2, 0);
                        else
                            animator.play(this.motions[this.motionIndex], 0);
                        break;
                    case 2:
                        if (this.motionCross)
                            animator.crossFade(this.motions[this.motionIndex], 0.2, 1);
                        else
                            animator.play(this.motions[this.motionIndex], 1);
                        break;
                }
                e.target.label = "切换动作:" + this.motions[this.motionIndex];
                this.motionIndex++;
                (this.motionIndex === this.motions.length) && (this.motionIndex = 0);
            });
        }
        addbtn(x, y, width, height, text, size, clickFun) {
            var thiss = this;
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                var changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
                changeActionButton.size(width, height);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = size;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                changeActionButton.pos(x, y);
                changeActionButton.on(Laya.Event.CLICK, thiss, clickFun);
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

    class AnimatorStateScriptDemo$1 extends SingletonScene {
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
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh",
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
            var asst1 = state1.addScript(AnimatorStateScriptTest);
            asst1.text = this.text;
            this.animator.addState(state1);
            this.AutoSetScene3d(this.s_scene);
            var state2 = new Laya.AnimatorState();
            state2.name = "ride";
            state2.clipStart = 0 / 581;
            state2.clipEnd = 33 / 581;
            state2.clip = this.animator.getDefaultState().clip;
            state2.clip.islooping = true;
            var asst2 = state2.addScript(AnimatorStateScriptTest);
            asst2.text = this.text;
            this.animator.addState(state2);
            this.animator.speed = 0.0;
            var state3 = new Laya.AnimatorState();
            state3.name = "动作状态三";
            state3.clipStart = 34 / 581;
            state3.clipEnd = 100 / 581;
            state3.clip = this.animator.getDefaultState().clip;
            state3.clip.islooping = true;
            var asst3 = state3.addScript(AnimatorStateScriptTest);
            asst3.text = this.text;
            this.animator.addState(state3);
            this.animator.speed = 0.0;
            this.loadUI();
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
            this.textName.x = Laya.stage.width / 2 - 50;
            this.text.x = Laya.stage.width / 2 - 50;
            this.text.y = 50;
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换动作状态");
                Laya.stage.addChild(this.changeActionButton);
                this.changeActionButton.size(200, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.curStateIndex++;
                    if (this.curStateIndex % 3 == 0) {
                        this.animator.speed = 0.0;
                        this.animator.play("hello");
                        this.curActionName = "hello";
                        this.textName.text = "当前动作状态名称:" + "hello";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 3 == 1) {
                        this.animator.speed = 0.0;
                        this.animator.play("ride");
                        this.curActionName = "ride";
                        this.textName.text = "当前动作状态名称:" + "ride";
                        this.animator.speed = 1.0;
                    }
                    else if (this.curStateIndex % 3 == 2) {
                        this.animator.speed = 0.0;
                        this.animator.play("动作状态三");
                        this.curActionName = "动作状态三";
                        this.textName.text = "当前动作状态名称:" + "动作状态三";
                        this.animator.speed = 1.0;
                    }
                });
            }));
        }
        Show() {
            super.Show();
            if (this.changeActionButton) {
                this.changeActionButton.visible = true;
            }
            if (this.text) {
                this.text.visible = true;
            }
            if (this.textName) {
                this.textName.visible = true;
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
            if (this.textName) {
                this.textName.visible = false;
            }
        }
    }
    class AnimatorStateScriptTest extends Laya.AnimatorStateScript {
        constructor() {
            super();
            this._text = null;
        }
        get text() {
            return this._text;
        }
        set text(value) {
            this._text = value;
        }
        onStateEnter() {
            console.log("动画开始播放了");
            this._text.text = "动画状态：动画开始播放";
        }
        onStateUpdate() {
            console.log("动画状态更新了");
            this._text.text = "动画状态：动画更新中";
        }
        onStateExit() {
            console.log("动画退出了");
            this._text.text = "动画状态：动画开始退出";
        }
    }

    class BoneLinkSprite3D extends SingletonScene {
        constructor() {
            super();
            this._dragonScale = new Laya.Vector3(1.5, 1.5, 1.5);
            this._rotation = new Laya.Quaternion(-0.5, -0.5, 0.5, -0.5);
            this._position = new Laya.Vector3(-0.2, 0.0, 0.0);
            this._scale = new Laya.Vector3(0.75, 0.75, 0.75);
            this.curStateIndex = 0;
            var resource = [
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh",
                GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh",
            ];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onLoadFinish));
        }
        onLoadFinish() {
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Laya.Vector3(0.5, 0.5, 0.5);
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 3, 5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.role = this.s_scene.addChild(new Laya.Sprite3D());
            this.pangzi = this.role.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/PangZi.lh"));
            this.animator = this.pangzi.getChildAt(0).getComponent(Laya.Animator);
            this.AutoSetScene3d(this.s_scene);
            var state1 = new Laya.AnimatorState();
            state1.name = "hello";
            state1.clipStart = 296 / 581;
            state1.clipEnd = 346 / 581;
            state1.clip = this.animator.getDefaultState().clip;
            state1.clip.islooping = true;
            this.animator.addState(state1);
            this.animator.play("hello");
            var state2 = new Laya.AnimatorState();
            state2.name = "ride";
            state2.clipStart = 3 / 581;
            state2.clipEnd = 33 / 581;
            state2.clip = this.animator.getDefaultState().clip;
            state2.clip.islooping = true;
            this.animator.addState(state2);
            this.dragon1 = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_H_001.lh");
            this.dragon1.transform.localScale = this._dragonScale;
            this.aniSprte3D1 = this.dragon1.getChildAt(0);
            this.dragonAnimator1 = this.aniSprte3D1.getComponent(Laya.Animator);
            var state3 = new Laya.AnimatorState();
            state3.name = "run";
            state3.clipStart = 50 / 644;
            state3.clipEnd = 65 / 644;
            state3.clip = this.dragonAnimator1.getDefaultState().clip;
            state3.clip.islooping = true;
            this.dragonAnimator1.addState(state3);
            this.dragon2 = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/BoneLinkScene/R_kl_S_009.lh");
            this.dragon2.transform.localScale = this._dragonScale;
            this.aniSprte3D2 = this.dragon2.getChildAt(0);
            this.dragonAnimator2 = this.aniSprte3D2.getComponent(Laya.Animator);
            var state4 = new Laya.AnimatorState();
            state4.name = "run";
            state4.clipStart = 50 / 550;
            state4.clipEnd = 65 / 550;
            state4.clip = this.dragonAnimator2.getDefaultState().clip;
            state4.clip.islooping = true;
            this.dragonAnimator2.addState(state4);
            this.loadUI();
        }
        loadUI() {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                this.changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "乘骑坐骑"));
                this.changeActionButton.size(160, 40);
                this.changeActionButton.labelBold = true;
                this.changeActionButton.labelSize = 30;
                this.changeActionButton.sizeGrid = "4,4,4,4";
                this.changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Laya.Browser.pixelRatio / 2, Laya.stage.height - 100 * Laya.Browser.pixelRatio);
                this.changeActionButton.on(Laya.Event.CLICK, this, function () {
                    this.curStateIndex++;
                    if (this.curStateIndex % 3 == 1) {
                        this.changeActionButton.label = "切换坐骑";
                        this.s_scene.addChild(this.dragon1);
                        this.aniSprte3D1.addChild(this.role);
                        this.dragonAnimator1.linkSprite3DToAvatarNode("point", this.role);
                        this.animator.play("ride");
                        this.dragonAnimator1.play("run");
                        this.pangzi.transform.localRotation = this._rotation;
                        this.pangzi.transform.localPosition = this._position;
                        this.pangzi.transform.localScale = this._scale;
                    }
                    else if (this.curStateIndex % 3 == 2) {
                        this.changeActionButton.label = "卸下坐骑";
                        this.dragonAnimator1.unLinkSprite3DToAvatarNode(this.role);
                        this.aniSprte3D1.removeChild(this.role);
                        this.dragon1.removeSelf();
                        this.s_scene.addChild(this.dragon2);
                        this.aniSprte3D2.addChild(this.role);
                        this.dragonAnimator2.linkSprite3DToAvatarNode("point", this.role);
                        this.animator.play("ride");
                        this.dragonAnimator2.play("run");
                        this.pangzi.transform.localRotation = this._rotation;
                        this.pangzi.transform.localPosition = this._position;
                        this.pangzi.transform.localScale = this._scale;
                    }
                    else {
                        this.changeActionButton.label = "乘骑坐骑";
                        this.dragonAnimator2.unLinkSprite3DToAvatarNode(this.role);
                        this.aniSprte3D2.removeChild(this.role);
                        this.dragon2.removeSelf();
                        this.s_scene.addChild(this.role);
                        this.animator.play("hello");
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

    class MaterialAnimation extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/materialScene/Conventional/layaScene.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    var Scene3D$c = Laya.Scene3D;
    var Handler$d = Laya.Handler;
    var BitmapFont = Laya.BitmapFont;
    var Text = Laya.Text;
    var Browser$8 = Laya.Browser;
    var Event$6 = Laya.Event;
    class SkeletonMask extends SingletonScene {
        constructor() {
            super();
            this.fontName = "fontClip";
            this.texts = [];
            this.loadFont();
            Scene3D$c.load(GlobalConfig.ResPath + "res/threeDimen/LayaScene_MaskModelTest/Conventional/MaskModelTest.ls", Handler$d.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Camera");
            }));
        }
        loadFont() {
            var bitmapFont = new BitmapFont();
            bitmapFont.loadFont(GlobalConfig.ResPath + "res/threeDimen/LayaScene_MaskModelTest/font/fontClip.fnt", new Handler$d(this, this.onFontLoaded, [bitmapFont]));
        }
        onFontLoaded(bitmapFont) {
            bitmapFont.setSpaceWidth(10);
            Text.registerBitmapFont(this.fontName, bitmapFont);
            this.createText(this.fontName);
            this.createText1(this.fontName);
            this.createText2(this.fontName);
        }
        createText(font) {
            var txt = new Text();
            txt.width = 250;
            txt.wordWrap = true;
            txt.text = "带有骨骼遮罩的动画";
            txt.color = "#FFFFFFFF";
            txt.leading = 5;
            txt.fontSize = 10;
            txt.zOrder = 999999999;
            txt.scale(Browser$8.pixelRatio, Browser$8.pixelRatio);
            txt.pos(Laya.stage.width / 2 - 50, Laya.stage.height / 2);
            Laya.stage.on(Event$6.RESIZE, txt, () => {
                txt.pos(Laya.stage.width / 2 - 50, Laya.stage.height / 2);
            });
            this.texts.push(txt);
            Laya.stage.addChild(txt);
        }
        createText1(font) {
            var txt = new Text();
            txt.width = 250;
            txt.wordWrap = true;
            txt.text = "正常动画一";
            txt.color = "#FFFFFFFF";
            txt.size(200, 300);
            txt.leading = 5;
            txt.fontSize = 15;
            txt.zOrder = 999999999;
            txt.pos(Laya.stage.width / 2 - 240, Laya.stage.height / 2);
            Laya.stage.on(Event$6.RESIZE, txt, () => {
                txt.pos(Laya.stage.width / 2 - 240, Laya.stage.height / 2);
            });
            this.texts.push(txt);
            Laya.stage.addChild(txt);
        }
        createText2(font) {
            var txt = new Text();
            txt.width = 250;
            txt.wordWrap = true;
            txt.text = "正常动画二";
            txt.color = "#FFFFFFFF";
            txt.leading = 5;
            txt.zOrder = 999999999;
            txt.fontSize = 15;
            txt.pos(Laya.stage.width / 2 + 140, Laya.stage.height / 2);
            Laya.stage.on(Event$6.RESIZE, txt, () => {
                txt.pos(Laya.stage.width / 2 + 140, Laya.stage.height / 2);
            });
            this.texts.push(txt);
            Laya.stage.addChild(txt);
        }
        Show() {
            super.Show();
            for (var i = 0; i < this.texts.length; i++) {
                this.texts[i].visible = true;
            }
        }
        Hide() {
            super.Hide();
            for (var i = 0; i < this.texts.length; i++) {
                this.texts[i].visible = false;
            }
        }
    }

    var Shader3D$7 = Laya.Shader3D;
    var Sprite3D$3 = Laya.Sprite3D;
    var Scene3D$d = Laya.Scene3D;
    var Vector3$a = Laya.Vector3;
    var Animator = Laya.Animator;
    var Handler$e = Laya.Handler;
    class SimpleSkinAnimationInstance extends SingletonScene {
        constructor() {
            super();
            this.animatorName = ["run", "chongci", "dead", "xuli", "stand"];
            this.widthNums = 30;
            this.step = 10;
            Shader3D$7.debugMode = true;
            this.s_scene = new Scene3D$d();
            this.s_scene.ambientColor = new Vector3$a(0.5, 0.5, 0.5);
            var path = GlobalConfig.ResPath + "res/threeDimen/texAnimation/Conventional/LayaMonkey.lh";
            Sprite3D$3.load(path, Handler$e.create(this, function (sprite) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(sprite);
                this.oriSprite3D = this.s_scene.getChildAt(0).getChildAt(2);
                this.sceneBuild();
                var animate = this.oriSprite3D.getComponent(Animator);
                animate.play("chongci");
            }));
        }
        cloneSprite(pos, quaterial) {
            var clonesprite = this.oriSprite3D.clone();
            this.s_scene.addChild(clonesprite);
            var animate = clonesprite.getComponent(Animator);
            var nums = Math.round(Math.random() * 4);
            animate.play(this.animatorName[nums], 0, Math.random());
            clonesprite.transform.position = pos;
            clonesprite.transform.rotationEuler = quaterial;
        }
        sceneBuild() {
            var left = -0.5 * this.step * (this.widthNums);
            var right = -1 * left;
            for (var i = left; i < right; i += this.step)
                for (var j = left; j < right; j += this.step) {
                    var xchange = (Math.random() - 0.5) * 10;
                    var zchange = (Math.random() - 0.5) * 10;
                    var quaterial = new Vector3$a(0, Math.random() * 180, 0);
                    this.cloneSprite(new Vector3$a(i + xchange, 0, j + zchange), quaterial);
                }
        }
    }

    class CameraAnimation extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/cameraDonghua/Conventional/layaScene.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    class RigidbodyAnimationDemo extends SingletonScene {
        constructor() {
            super();
            Laya.Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_RigidbodyAnimation/Conventional/scene.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Main Camera");
                camera.addComponent(CameraMoveScript);
            }));
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
                    AnimationLayerBlend.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    AnimatorStateScriptDemo$1.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    BoneLinkSprite3D.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    MaterialAnimation.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    RigidbodyAnimationDemo.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    CameraAnimation.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    SimpleSkinAnimationInstance.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    SkeletonMask.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class PhysicsWorld_BaseCollider extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            var directionlight = this.s_scene.addChild(new Laya.DirectionLight());
            directionlight.diffuseColor = new Laya.Vector3(0.6, 0.6, 0.6);
            var mat = directionlight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionlight.transform.worldMatrix = mat;
            this.mat1 = new Laya.BlinnPhongMaterial();
            this.mat2 = new Laya.BlinnPhongMaterial();
            this.mat3 = new Laya.BlinnPhongMaterial();
            this.mat4 = new Laya.BlinnPhongMaterial();
            this.mat5 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat1.albedoTexture = tex;
            }));
            this.mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat3.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat2.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function (tex) {
                this.mat4.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function (tex) {
                this.mat5.albedoTexture = tex;
            }));
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
            plane.meshRenderer.material = planeMat;
            var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(10, 0, 10);
            planeStaticCollider.colliderShape = planeShape;
            planeStaticCollider.friction = 2;
            planeStaticCollider.restitution = 0.3;
            this.randomAddPhysicsSprite();
        }
        randomAddPhysicsSprite() {
            Laya.timer.loop(1000, this, this.loopfun);
        }
        loopfun() {
            var random = Math.floor(Math.random() * 3) % 3;
            switch (random) {
                case 0:
                    this.addBox();
                    break;
                case 1:
                    this.addSphere();
                    break;
                case 2:
                    this.addCapsule();
                case 3:
                    this.addCone();
                    break;
                case 4:
                    this.addCylinder();
                    break;
                default:
                    break;
            }
        }
        addBox() {
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addSphere() {
            var radius = Math.random() * 0.2 + 0.2;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = this.mat2;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            sphere.transform.position = this.tmpVector;
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
        addCapsule() {
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = this.mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
        addCone() {
            let raidius = Math.random() * 0.2 + 0.2;
            let height = Math.random() * 0.5 + 0.8;
            let cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
            this.s_scene.addChild(cone);
            cone.meshRenderer.material = this.mat4;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            cone.transform.position = this.tmpVector;
            let rigidBody = cone.addComponent(Laya.Rigidbody3D);
            let coneShape = new Laya.ConeColliderShape(raidius, height);
            rigidBody.colliderShape = coneShape;
            rigidBody.mass = 10;
        }
        addCylinder() {
            let raidius = Math.random() * 0.2 + 0.2;
            let height = Math.random() * 0.5 + 0.8;
            let cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
            this.s_scene.addChild(cylinder);
            cylinder.meshRenderer.material = this.mat5;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            cylinder.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            cylinder.transform.rotationEuler = this.tmpVector;
            let rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
            let cylinderShape = new Laya.CylinderColliderShape(raidius, height);
            rigidBody.colliderShape = cylinderShape;
            rigidBody.mass = 10;
        }
    }

    class PhysicsWorld_BuildingBlocks extends SingletonScene {
        constructor() {
            super();
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult();
            this.ZERO = new Laya.Vector3(0, 0, 0);
            this.ONE = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(4.5, 6, 4.5));
            this.camera.transform.rotate(new Laya.Vector3(-30, 45, 0), true, false);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            this.mat1 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat1.albedoTexture = tex;
            }));
            this.mesh1 = Laya.PrimitiveMesh.createBox(0.5, 0.33, 2);
            this.mesh2 = Laya.PrimitiveMesh.createBox(2, 0.33, 0.5);
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(13, 13, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            plane.meshRenderer.material = planeMat;
            plane.meshRenderer.receiveShadow = true;
            var rigidBody = plane.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(13, 0, 13);
            rigidBody.colliderShape = boxShape;
            this.addMouseEvent();
            this.addBox();
        }
        addBox() {
            for (let i = 0; i < 8; i++) {
                this.addVerticalBox(-0.65, 0.165 + i * 0.33 * 2, 0);
                this.addVerticalBox(0, 0.165 + i * 0.33 * 2, 0);
                this.addVerticalBox(0.65, 0.165 + i * 0.33 * 2, 0);
                this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, -0.65);
                this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0);
                this.addHorizontalBox(0, 0.165 + 0.33 + i * 0.33 * 2, 0.65);
            }
        }
        addVerticalBox(x, y, z) {
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(this.mesh1));
            box.meshRenderer.material = this.mat1;
            box.meshRenderer.castShadow = true;
            box.meshRenderer.receiveShadow = true;
            box.transform.position = new Laya.Vector3(x, y, z);
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            rigidBody.mass = 10;
            rigidBody.friction = 0.4;
            rigidBody.restitution = 0.2;
            var boxShape = new Laya.BoxColliderShape(0.5, 0.33, 2);
            rigidBody.colliderShape = boxShape;
        }
        addHorizontalBox(x, y, z) {
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(this.mesh2));
            box.meshRenderer.material = this.mat1;
            box.meshRenderer.castShadow = true;
            box.meshRenderer.receiveShadow = true;
            this.tmpVector.setValue(x, y, z);
            box.transform.position = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            rigidBody.mass = 10;
            rigidBody.friction = 1.0;
            rigidBody.restitution = 0.2;
            var boxShape = new Laya.BoxColliderShape(2, 0.33, 0.5);
            rigidBody.colliderShape = boxShape;
        }
        addMouseEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.onMouseUp);
            Laya.stage.on(Laya.Event.MOUSE_OUT, this, onmouseout);
        }
        onMouseDown() {
            this.posX = this.point.x = Laya.MouseManager.instance.mouseX;
            this.posY = this.point.y = Laya.MouseManager.instance.mouseY;
            this.camera.viewportPointToRay(this.point, this.ray);
            this.s_scene.physicsSimulation.rayCast(this.ray, this._outHitResult);
            if (this._outHitResult.succeeded) {
                var collider = this._outHitResult.collider;
                this.hasSelectedSprite = collider.owner;
                this.hasSelectedRigidBody = collider;
                collider.angularFactor = this.ZERO;
                collider.angularVelocity = this.ZERO;
                collider.linearFactor = this.ZERO;
                collider.linearVelocity = this.ZERO;
            }
            Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
        }
        onMouseMove() {
            this.delX = Laya.MouseManager.instance.mouseX - this.posX;
            this.delY = Laya.MouseManager.instance.mouseY - this.posY;
            if (this.hasSelectedSprite) {
                this.tmpVector.setValue(this.delX / 4, 0, this.delY / 4);
                this.hasSelectedRigidBody.linearVelocity = this.tmpVector;
            }
            this.posX = Laya.MouseManager.instance.mouseX;
            this.posY = Laya.MouseManager.instance.mouseY;
        }
        onMouseUp() {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            if (this.hasSelectedSprite) {
                this.hasSelectedRigidBody.angularFactor = this.ONE;
                this.hasSelectedRigidBody.linearFactor = this.ONE;
                this.hasSelectedSprite = null;
            }
        }
        onMouseOut() {
            Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.onMouseMove);
            if (this.hasSelectedSprite) {
                this.hasSelectedRigidBody.angularFactor = this.ONE;
                this.hasSelectedRigidBody.linearFactor = this.ONE;
                this.hasSelectedSprite = null;
            }
        }
    }

    class PhysicsWorld_Character extends SingletonScene {
        constructor() {
            super();
            this.translateW = new Laya.Vector3(0, 0, -0.2);
            this.translateS = new Laya.Vector3(0, 0, 0.2);
            this.translateA = new Laya.Vector3(-0.2, 0, 0);
            this.translateD = new Laya.Vector3(0.2, 0, 0);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
            this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            this.mat1 = new Laya.BlinnPhongMaterial();
            this.mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                this.mat1.albedoTexture = tex;
                this.AutoSetScene3d(this.s_scene);
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat3.albedoTexture = tex;
            }));
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            plane.meshRenderer.material = planeMat;
            var rigidBody = plane.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(20, 0, 20);
            rigidBody.colliderShape = boxShape;
            for (var i = 0; i < 60; i++) {
                this.addBox();
                this.addCapsule();
            }
            this.addCharacter();
        }
        addCharacter() {
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (monkey) {
                this.s_scene.addChild(monkey);
                monkey.transform.localScale = new Laya.Vector3(1, 1, 1);
                var character = monkey.addComponent(Laya.CharacterController);
                var sphereShape = new Laya.CapsuleColliderShape(1.0, 3.4);
                sphereShape.localOffset = new Laya.Vector3(0, 1.7, 0);
                character.colliderShape = sphereShape;
                this.kinematicSphere = monkey;
                Laya.timer.frameLoop(1, this, this.onKeyDown);
            }));
        }
        onKeyDown() {
            var character = this.kinematicSphere.getComponent(Laya.CharacterController);
            Laya.KeyBoardManager.hasKeyDown(87) && character.move(this.translateW);
            Laya.KeyBoardManager.hasKeyDown(83) && character.move(this.translateS);
            Laya.KeyBoardManager.hasKeyDown(65) && character.move(this.translateA);
            Laya.KeyBoardManager.hasKeyDown(68) && character.move(this.translateD);
            Laya.KeyBoardManager.hasKeyDown(69) && character.jump();
        }
        addBox() {
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            box.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            box.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addCapsule() {
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = this.mat3;
            capsule.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            capsule.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
    }

    class PhysicsWorld_CollisionFiflter extends SingletonScene {
        constructor() {
            super();
            this.translateW = new Laya.Vector3(0, 0, -0.2);
            this.translateS = new Laya.Vector3(0, 0, 0.2);
            this.translateA = new Laya.Vector3(-0.2, 0, 0);
            this.translateD = new Laya.Vector3(0.2, 0, 0);
            this.translateQ = new Laya.Vector3(-0.01, 0, 0);
            this.translateE = new Laya.Vector3(0.01, 0, 0);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
            this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            this.mat1 = new Laya.BlinnPhongMaterial();
            this.mat2 = new Laya.BlinnPhongMaterial();
            this.mat3 = new Laya.BlinnPhongMaterial();
            this.mat4 = new Laya.BlinnPhongMaterial();
            this.mat5 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat1.albedoTexture = tex;
            }));
            this.mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat3.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat2.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function (tex) {
                this.mat4.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function (tex) {
                this.mat5.albedoTexture = tex;
            }));
            this.plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            this.plane.meshRenderer.material = planeMat;
            var staticCollider = this.plane.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(20, 0, 20);
            staticCollider.colliderShape = boxShape;
            this.addKinematicSphere();
            for (var i = 0; i < 30; i++) {
                this.addBox();
                this.addCapsule();
                this.addCone();
                this.addCylinder();
                this.addSphere();
            }
        }
        addKinematicSphere() {
            var mat2 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
                mat2.albedoTexture = tex;
            }));
            mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
            var radius = 0.8;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = mat2;
            sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 60;
            rigidBody.isKinematic = true;
            rigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;
            this.kinematicSphere = sphere;
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }
        onKeyDown() {
            Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);
            Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);
            Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);
            Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);
            Laya.KeyBoardManager.hasKeyDown(81) && this.plane.transform.translate(this.translateQ);
            Laya.KeyBoardManager.hasKeyDown(69) && this.plane.transform.translate(this.translateE);
        }
        addBox() {
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            this.tmpVector.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(0, Math.random() * 360, 0);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
            rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;
        }
        addCapsule() {
            var mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                mat3.albedoTexture = tex;
            }));
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
            rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;
        }
        addSphere() {
            let radius = Math.random() * 0.2 + 0.2;
            let sphere = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius));
            this.s_scene.addChild(sphere);
            sphere.meshRenderer.material = this.mat2;
            let pos = sphere.transform.position;
            pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            sphere.transform.position = pos;
            let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            let sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
            rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;
        }
        addCone() {
            let raidius = Math.random() * 0.2 + 0.2;
            let height = Math.random() * 0.5 + 0.8;
            let cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
            this.s_scene.addChild(cone);
            cone.meshRenderer.material = this.mat4;
            let pos = cone.transform.position;
            pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            cone.transform.position = pos;
            let rigidBody = cone.addComponent(Laya.Rigidbody3D);
            let coneShape = new Laya.ConeColliderShape(raidius, height);
            rigidBody.colliderShape = coneShape;
            rigidBody.mass = 10;
            rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4;
        }
        addCylinder() {
            let raidius = Math.random() * 0.2 + 0.2;
            let height = Math.random() * 0.5 + 0.8;
            let cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
            this.s_scene.addChild(cylinder);
            cylinder.meshRenderer.material = this.mat5;
            let transform = cylinder.transform;
            let pos = transform.position;
            pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            transform.position = pos;
            let rotationEuler = transform.rotationEuler;
            rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            transform.rotationEuler = rotationEuler;
            let rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
            let cylinderShape = new Laya.CylinderColliderShape(raidius, height);
            rigidBody.colliderShape = cylinderShape;
            rigidBody.mass = 10;
            rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5;
        }
    }

    class PhysicsWorld_CompoundCollider extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(5.2, 4, 5.2));
            this.camera.transform.rotate(new Laya.Vector3(-25, 45, 0), true, false);
            this.camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(13, 13, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
            planeMat.shininess = 1;
            plane.meshRenderer.material = planeMat;
            plane.meshRenderer.receiveShadow = true;
            var staticCollider = plane.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(13, 0, 13);
            staticCollider.colliderShape = planeShape;
            staticCollider.friction = 2;
            this.randomAddPhysicsSprite();
        }
        randomAddPhysicsSprite() {
            Laya.timer.loop(1000, this, function () {
                var random = Math.floor(Math.random() * 2) % 2;
                switch (random) {
                    case 0:
                        this.addTable();
                        break;
                    case 1:
                        this.addObject();
                        break;
                    default:
                        break;
                }
            });
        }
        addTable() {
            var mat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                mat.albedoTexture = tex;
            }));
            mat.shininess = 1;
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/Physics/table.lm", Laya.Handler.create(this, function (mesh) {
                var table = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                table.transform.position = new Laya.Vector3(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
                table.transform.rotationEuler = new Laya.Vector3(Math.random() * 360, Math.random() * 360, Math.random() * 360);
                table.transform.scale = new Laya.Vector3(3, 3, 3);
                table.meshRenderer.material = mat;
                var rigidBody = table.addComponent(Laya.Rigidbody3D);
                rigidBody.mass = 10;
                rigidBody.friction = 1;
                var compoundShape = new Laya.CompoundColliderShape();
                var boxShape = new Laya.BoxColliderShape(0.5, 0.4, 0.045);
                this.tmpVector.setValue(0, 0, 0.125);
                boxShape.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape);
                var boxShape1 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
                this.tmpVector.setValue(-0.2, -0.148, -0.048);
                boxShape1.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape1);
                var boxShape2 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
                this.tmpVector.setValue(0.2, -0.148, -0.048);
                boxShape2.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape2);
                var boxShape3 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
                this.tmpVector.setValue(-0.2, 0.153, -0.048);
                boxShape3.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape3);
                var boxShape4 = new Laya.BoxColliderShape(0.1, 0.1, 0.3);
                this.tmpVector.setValue(0.2, 0.153, -0.048);
                boxShape4.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape4);
                rigidBody.colliderShape = compoundShape;
            }));
        }
        addObject() {
            var mat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                mat.albedoTexture = tex;
            }));
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/Physics/object.lm", Laya.Handler.create(this, function (mesh) {
                var object = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                this.tmpVector.setValue(Math.random() * 4 - 2, 5, Math.random() * 4 - 2);
                object.transform.position = this.tmpVector;
                this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
                object.transform.rotationEuler = this.tmpVector;
                this.tmpVector.setValue(0.01, 0.01, 0.01);
                object.transform.scale = this.tmpVector;
                object.meshRenderer.material = mat;
                var rigidBody = object.addComponent(Laya.Rigidbody3D);
                rigidBody.mass = 3;
                rigidBody.friction = 0.3;
                var compoundShape = new Laya.CompoundColliderShape();
                var boxShape = new Laya.BoxColliderShape(40, 40, 40);
                this.tmpVector.setValue(0, 0, -20);
                boxShape.localOffset = this.tmpVector;
                compoundShape.addChildShape(boxShape);
                var sphereShape = new Laya.SphereColliderShape(25);
                this.tmpVector.setValue(0, 0, 24);
                sphereShape.localOffset = this.tmpVector;
                compoundShape.addChildShape(sphereShape);
                rigidBody.colliderShape = compoundShape;
            }));
        }
    }

    class PhysicsWorld_ContinueCollisionDetection extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.s_scene.physicsSimulation.gravity = new Laya.Vector3(0, -98.0, 0);
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.mat2 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat2.albedoTexture = tex;
            }));
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Laya.Handler.create(null, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(10, 10, 0, 0);
            plane.meshRenderer.material = planeMat;
            var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(10, 0, 10);
            planeStaticCollider.colliderShape = planeShape;
            planeStaticCollider.friction = 2;
            planeStaticCollider.restitution = 0.3;
            Laya.timer.loop(200, this, function () {
                this.addSphere();
            });
        }
        addSphere() {
            var radius = Math.random() * 0.2 + 0.2;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = this.mat2;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            sphere.transform.position = this.tmpVector;
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
            rigidBody.ccdSweptSphereRadius = radius;
            rigidBody.ccdMotionThreshold = 0.0001;
        }
    }

    class PhysicsWorld_Kinematic extends SingletonScene {
        constructor() {
            super();
            this.translateW = new Laya.Vector3(0, 0, -0.2);
            this.translateS = new Laya.Vector3(0, 0, 0.2);
            this.translateA = new Laya.Vector3(-0.2, 0, 0);
            this.translateD = new Laya.Vector3(0.2, 0, 0);
            this.translateQ = new Laya.Vector3(-0.01, 0, 0);
            this.translateE = new Laya.Vector3(0.01, 0, 0);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
            this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.mat1 = new Laya.BlinnPhongMaterial();
            this.mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat1.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat3.albedoTexture = tex;
            }));
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            plane.meshRenderer.material = planeMat;
            var rigidBody = plane.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(20, 0, 20);
            rigidBody.colliderShape = boxShape;
            for (var i = 0; i < 60; i++) {
                this.addBox();
                this.addCapsule();
            }
            this.addKinematicSphere();
        }
        addKinematicSphere() {
            var mat2 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
                mat2.albedoTexture = tex;
            }));
            mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
            var radius = 0.8;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = mat2;
            sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 60;
            rigidBody.isKinematic = true;
            this.kinematicSphere = sphere;
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }
        onKeyDown() {
            Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);
            Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);
            Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);
            Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);
            Laya.KeyBoardManager.hasKeyDown(81) && this.kinematicSphere.transform.translate(this.translateQ);
            Laya.KeyBoardManager.hasKeyDown(69) && this.kinematicSphere.transform.translate(this.translateE);
        }
        addBox() {
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addCapsule() {
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = this.mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
    }

    class PhysicsWorld_MeshCollider extends SingletonScene {
        constructor() {
            super();
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
            directionLight.transform.worldMatrix = mat;
            directionLight.color = new Laya.Vector3(1, 1, 1);
            this.mat1 = new Laya.BlinnPhongMaterial();
            this.mat2 = new Laya.BlinnPhongMaterial();
            this.mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                this.mat1.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat2.albedoTexture = tex;
            }));
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat3.albedoTexture = tex;
            }));
            Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"], Laya.Handler.create(this, this.complete));
        }
        complete() {
            var mesh = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
            var albedo = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
            var normal = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
            var mat = new Laya.BlinnPhongMaterial();
            mat.specularColor = new Laya.Vector4(0.5, 0.5, 0.5, 0.5);
            mat.albedoTexture = albedo;
            mat.normalTexture = normal;
            var lizard = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
            lizard.transform.localPosition = new Laya.Vector3(-2, 0, 0);
            lizard.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
            lizard.meshRenderer.material = mat;
            var lizardCollider = lizard.addComponent(Laya.PhysicsCollider);
            var meshShape = new Laya.MeshColliderShape();
            meshShape.mesh = mesh;
            lizardCollider.colliderShape = meshShape;
            lizardCollider.friction = 2;
            lizardCollider.restitution = 0.3;
            var lizard1 = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
            lizard1.transform.localPosition = new Laya.Vector3(3, 0, 0);
            lizard1.transform.localRotationEuler = new Laya.Vector3(0, 80, 0);
            lizard1.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
            lizard1.meshRenderer.material = mat;
            var lizardCollider1 = lizard1.addComponent(Laya.PhysicsCollider);
            var meshShape1 = new Laya.MeshColliderShape();
            meshShape1.mesh = mesh;
            lizardCollider1.colliderShape = meshShape1;
            lizardCollider1.friction = 2;
            lizardCollider1.restitution = 0.3;
            this.randomAddPhysicsSprite();
        }
        randomAddPhysicsSprite() {
            Laya.timer.loop(1000, this, function () {
                var random = Math.floor(Math.random() * 3) % 3;
                switch (random) {
                    case 0:
                        this.addBox();
                        break;
                    case 1:
                        this.addSphere();
                        break;
                    case 2:
                        this.addCapsule();
                        break;
                    default:
                        break;
                }
            });
        }
        addBox() {
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addSphere() {
            var radius = Math.random() * 0.2 + 0.2;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = this.mat2;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            sphere.transform.position = this.tmpVector;
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
        addCapsule() {
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = this.mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
    }

    class TriggerCollisionScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onTriggerEnter(other) {
            this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 1.0, 0.0, 1.0);
        }
        onTriggerStay(other) {
        }
        onTriggerExit(other) {
            this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        }
        onCollisionEnter(collision) {
            if (collision.other.owner === this.kinematicSprite)
                this.owner.meshRenderer.sharedMaterial.albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
        }
        onCollisionStay(collision) {
        }
        onCollisionExit(collision) {
        }
    }
    class PhysicsWorld_TriggerAndCollisionEvent extends SingletonScene {
        constructor() {
            super();
            this.translateW = new Laya.Vector3(0, 0, -0.2);
            this.translateS = new Laya.Vector3(0, 0, 0.2);
            this.translateA = new Laya.Vector3(-0.2, 0, 0);
            this.translateD = new Laya.Vector3(0.2, 0, 0);
            this.translateQ = new Laya.Vector3(-0.01, 0, 0);
            this.translateE = new Laya.Vector3(0.01, 0, 0);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
            this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            plane.meshRenderer.material = planeMat;
            var staticCollider = plane.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(20, 0, 20);
            staticCollider.colliderShape = boxShape;
            this.addKinematicSphere();
            for (var i = 0; i < 30; i++) {
                this.addBoxAndTrigger();
                this.addCapsuleCollision();
            }
        }
        addKinematicSphere() {
            var mat2 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
                mat2.albedoTexture = tex;
            }));
            mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
            var radius = 0.8;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = mat2;
            sphere.transform.position = new Laya.Vector3(0, 0.8, 0);
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 60;
            rigidBody.isKinematic = true;
            this.kinematicSphere = sphere;
            Laya.timer.frameLoop(1, this, this.onKeyDown);
        }
        onKeyDown() {
            Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);
            Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);
            Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);
            Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);
            Laya.KeyBoardManager.hasKeyDown(81) && this.kinematicSphere.transform.translate(this.translateQ);
            Laya.KeyBoardManager.hasKeyDown(69) && this.kinematicSphere.transform.translate(this.translateE);
        }
        addBoxAndTrigger() {
            var mat1 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
                mat1.albedoTexture = tex;
            }));
            mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = mat1;
            box.transform.position = new Laya.Vector3(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
            box.transform.rotationEuler = new Laya.Vector3(0, Math.random() * 360, 0);
            var staticCollider = box.addComponent(Laya.PhysicsCollider);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            staticCollider.colliderShape = boxShape;
            staticCollider.isTrigger = true;
            var script = box.addComponent(TriggerCollisionScript);
            script.kinematicSprite = this.kinematicSphere;
        }
        addCapsuleCollision() {
            var mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                mat3.albedoTexture = tex;
            }));
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
            var script = capsule.addComponent(TriggerCollisionScript);
            script.kinematicSprite = this.kinematicSphere;
        }
        addSphere() {
            var mat2 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex) {
                mat2.albedoTexture = tex;
            }));
            var radius = Math.random() * 0.2 + 0.2;
            var sphere = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius)));
            sphere.meshRenderer.material = mat2;
            this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            sphere.transform.position = this.tmpVector;
            var rigidBody = sphere.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.SphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
    }

    class PhysicsWorld_RayShapeCast extends SingletonScene {
        constructor() {
            super();
            this.btns = [];
            this.castType = 0;
            this.castAll = false;
            this.ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            this.hitResult = new Laya.HitResult();
            this.hitResults = new Array();
            this.debugSprites = new Array();
            this.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
            this.albedoColor2 = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);
            this.tmpVector = new Laya.Vector3(0, 0, 0);
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 8, 20));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                planeMat.albedoTexture = tex;
            }));
            planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
            plane.meshRenderer.material = planeMat;
            var rigidBody = plane.addComponent(Laya.PhysicsCollider);
            var boxCollider = new Laya.BoxColliderShape(20, 0, 20);
            rigidBody.colliderShape = boxCollider;
            for (var i = 0; i < 60; i++) {
                this.addBox();
                this.addCapsule();
            }
            this.addBtn(200, 200, 160, 40, "射线模式", function (e) {
                this.castType++;
                this.castType %= 4;
                switch (this.castType) {
                    case 0:
                        e.target.label = "射线模式";
                        break;
                    case 1:
                        e.target.label = "盒子模式";
                        break;
                    case 2:
                        e.target.label = "球模式";
                        break;
                    case 3:
                        e.target.label = "胶囊模式";
                        break;
                }
            });
            this.addBtn(200, 300, 160, 40, "不穿透", function (e) {
                if (this.castAll) {
                    e.target.label = "不穿透";
                    this.castAll = false;
                }
                else {
                    e.target.label = "穿透";
                    this.castAll = true;
                }
            });
            this.addBtn(200, 400, 160, 40, "检测", function (e) {
                if (this.hitResult.succeeded)
                    this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                if (this.hitResults.length > 0) {
                    for (var i = 0, n = this.hitResults.length; i < n; i++)
                        this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor;
                    this.hitResults.length = 0;
                }
                if (this.debugSprites.length > 0) {
                    for (i = 0, n = this.debugSprites.length; i < n; i++)
                        this.debugSprites[i].destroy();
                    this.debugSprites.length = 0;
                }
                var from = new Laya.Vector3(0, 1, 10);
                var to = new Laya.Vector3(0, 1, -5);
                switch (this.castType) {
                    case 0:
                        var lineSprite = this.s_scene.addChild(new Laya.PixelLineSprite3D(1));
                        lineSprite.addLine(from, to, Laya.Color.RED, Laya.Color.RED);
                        this.debugSprites.push(lineSprite);
                        if (this.castAll) {
                            this.s_scene.physicsSimulation.raycastAllFromTo(from, to, this.hitResults);
                            for (i = 0, n = this.hitResults.length; i < n; i++)
                                this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        else {
                            this.s_scene.physicsSimulation.raycastFromTo(from, to, this.hitResult);
                            this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        break;
                    case 1:
                        var boxCollider = new Laya.BoxColliderShape(1.0, 1.0, 1.0);
                        for (i = 0; i < 21; i++) {
                            var boxSprite = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1.0, 1.0, 1.0)));
                            var mat = new Laya.BlinnPhongMaterial();
                            mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                            mat.renderMode = Laya.BlinnPhongMaterial.RENDERMODE_TRANSPARENT;
                            boxSprite.meshRenderer.material = mat;
                            var position = new Laya.Vector3();
                            Laya.Vector3.lerp(from, to, i / 20, position);
                            boxSprite.transform.localPosition = position;
                            this.debugSprites.push(boxSprite);
                        }
                        if (this.castAll) {
                            this.s_scene.physicsSimulation.shapeCastAll(boxCollider, from, to, this.hitResults);
                            for (i = 0, n = this.hitResults.length; i < n; i++)
                                this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        else {
                            if (this.s_scene.physicsSimulation.shapeCast(boxCollider, from, to, this.hitResult))
                                this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        break;
                    case 2:
                        var sphereCollider = new Laya.SphereColliderShape(0.5);
                        for (i = 0; i < 41; i++) {
                            var sphereSprite = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.5)));
                            var mat = new Laya.BlinnPhongMaterial();
                            mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                            mat.renderMode = 2;
                            sphereSprite.meshRenderer.material = mat;
                            var position = new Laya.Vector3();
                            Laya.Vector3.lerp(from, to, i / 40, position);
                            sphereSprite.transform.localPosition = position;
                            this.debugSprites.push(sphereSprite);
                        }
                        if (this.castAll) {
                            this.s_scene.physicsSimulation.shapeCastAll(sphereCollider, from, to, this.hitResults);
                            for (i = 0, n = this.hitResults.length; i < n; i++)
                                this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        else {
                            if (this.s_scene.physicsSimulation.shapeCast(sphereCollider, from, to, this.hitResult))
                                this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        break;
                    case 3:
                        var capsuleCollider = new Laya.CapsuleColliderShape(0.25, 1.0);
                        for (i = 0; i < 41; i++) {
                            var capsuleSprite = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.25, 1.0)));
                            var mat = new Laya.BlinnPhongMaterial();
                            mat.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 0.5);
                            mat.renderMode = 2;
                            capsuleSprite.meshRenderer.material = mat;
                            var position = new Laya.Vector3();
                            Laya.Vector3.lerp(from, to, i / 40, position);
                            capsuleSprite.transform.localPosition = position;
                            this.debugSprites.push(capsuleSprite);
                        }
                        if (this.castAll) {
                            this.s_scene.physicsSimulation.shapeCastAll(capsuleCollider, from, to, this.hitResults);
                            for (i = 0, n = this.hitResults.length; i < n; i++)
                                this.hitResults[i].collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        else {
                            if (this.s_scene.physicsSimulation.shapeCast(capsuleCollider, from, to, this.hitResult))
                                this.hitResult.collider.owner.meshRenderer.sharedMaterial.albedoColor = this.albedoColor2;
                        }
                        break;
                }
            });
        }
        addBtn(x, y, width, height, text, clikFun) {
            Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Laya.Handler.create(this, function () {
                var changeActionButton = Laya.stage.addChild(new Laya.Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
                changeActionButton.size(width, height);
                changeActionButton.labelBold = true;
                changeActionButton.labelSize = 30;
                changeActionButton.sizeGrid = "4,4,4,4";
                changeActionButton.scale(Laya.Browser.pixelRatio, Laya.Browser.pixelRatio);
                changeActionButton.pos(x, y);
                changeActionButton.on(Laya.Event.CLICK, this, clikFun);
                this.btns.push(changeActionButton);
            }));
        }
        addBox() {
            var mat1 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex) {
                mat1.albedoTexture = tex;
            }));
            var sX = Math.random() * 0.75 + 0.25;
            var sY = Math.random() * 0.75 + 0.25;
            var sZ = Math.random() * 0.75 + 0.25;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ)));
            box.meshRenderer.material = mat1;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            box.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            box.transform.rotationEuler = this.tmpVector;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addCapsule() {
            var mat3 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex) {
                mat3.albedoTexture = tex;
            }));
            var raidius = Math.random() * 0.2 + 0.2;
            var height = Math.random() * 0.5 + 0.8;
            var capsule = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height)));
            capsule.meshRenderer.material = mat3;
            this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
            capsule.transform.position = this.tmpVector;
            this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
            capsule.transform.rotationEuler = this.tmpVector;
            var rigidBody = capsule.addComponent(Laya.Rigidbody3D);
            var sphereShape = new Laya.CapsuleColliderShape(raidius, height);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
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

    var Scene3D$e = Laya.Scene3D;
    var Camera$8 = Laya.Camera;
    var Vector3$b = Laya.Vector3;
    var DirectionLight$5 = Laya.DirectionLight;
    var MeshSprite3D$8 = Laya.MeshSprite3D;
    var PrimitiveMesh$7 = Laya.PrimitiveMesh;
    var Rigidbody3D = Laya.Rigidbody3D;
    var BoxColliderShape = Laya.BoxColliderShape;
    var Texture2D$4 = Laya.Texture2D;
    var BlinnPhongMaterial$2 = Laya.BlinnPhongMaterial;
    var FixedConstraint = Laya.FixedConstraint;
    var Script3D$2 = Laya.Script3D;
    var Handler$f = Laya.Handler;
    class PhysicsWorld_ConstraintFixedJoint extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Scene3D$e();
            this.camera = this.s_scene.addChild(new Camera$8(0, 0.1, 100));
            this.camera.transform.translate(new Vector3$b(0, 3, 10));
            this.camera.clearColor = null;
            var directionLight = this.s_scene.addChild(new DirectionLight$5());
            directionLight.color = new Vector3$b(1, 1, 1);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3$b(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            this.addbox();
        }
        addbox() {
            var box = this.s_scene.addChild(new MeshSprite3D$8(PrimitiveMesh$7.createBox(1, 1, 1)));
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(0, 5, 0);
            transform.position = pos;
            var rigidBody = box.addComponent(Rigidbody3D);
            var boxShape = new BoxColliderShape(1, 1, 1);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
            rigidBody.isKinematic = true;
            var box2 = this.s_scene.addChild(new MeshSprite3D$8(PrimitiveMesh$7.createBox(1, 1, 1)));
            var transform2 = box2.transform;
            var pos2 = transform2.position;
            pos2.setValue(0, 3, 0);
            transform2.position = pos2;
            var rigidBody2 = box2.addComponent(Rigidbody3D);
            var boxShape2 = new BoxColliderShape(1, 1, 1);
            rigidBody2.colliderShape = boxShape2;
            rigidBody2.mass = 10;
            Texture2D$4.load(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png", Handler$f.create(this, function (texture) {
                this.AutoSetScene3d(this.s_scene);
                var blinnMat = new BlinnPhongMaterial$2();
                blinnMat.albedoTexture = texture;
                box.meshRenderer.material = blinnMat;
                box2.meshRenderer.material = blinnMat;
            }));
            var fixedConstraint = box.addComponent(FixedConstraint);
            fixedConstraint.anchor = new Vector3$b(0, 0, 0);
            fixedConstraint.connectAnchor = new Vector3$b(0, 2, 0);
            box.addComponent(FixedEventTest);
            fixedConstraint.setConnectRigidBody(rigidBody, rigidBody2);
        }
    }
    class FixedEventTest extends Script3D$2 {
        onStart() {
            this.fixedConstraint = this.owner.getComponent(FixedConstraint);
            this.fixedConstraint.breakForce = 1000;
        }
        onUpdate() {
            if (this.fixedConstraint) {
                if (this.fixedConstraint.connectedBody) {
                    var mass = this.fixedConstraint.connectedBody.mass;
                    this.fixedConstraint.connectedBody.mass = mass + 1;
                }
            }
        }
        onJointBreak() {
            console.log("break");
        }
    }

    var Scene3D$f = Laya.Scene3D;
    var Camera$9 = Laya.Camera;
    var Shader3D$8 = Laya.Shader3D;
    var Vector3$c = Laya.Vector3;
    var DirectionLight$6 = Laya.DirectionLight;
    var MeshSprite3D$9 = Laya.MeshSprite3D;
    var PrimitiveMesh$8 = Laya.PrimitiveMesh;
    var BlinnPhongMaterial$3 = Laya.BlinnPhongMaterial;
    var Texture2D$5 = Laya.Texture2D;
    var Vector4$4 = Laya.Vector4;
    var Rigidbody3D$1 = Laya.Rigidbody3D;
    var ConfigurableConstraint = Laya.ConfigurableConstraint;
    var BoxColliderShape$1 = Laya.BoxColliderShape;
    var SphereColliderShape = Laya.SphereColliderShape;
    var Handler$g = Laya.Handler;
    class PhysicsWorld_ConfigurableJoint extends SingletonScene {
        constructor() {
            super();
            Config3D.useCannonPhysics = false;
            Shader3D$8.debugMode = true;
            this.s_scene = new Scene3D$f();
            this.camera = this.s_scene.addChild(new Camera$9(0, 0.1, 100));
            this.camera.transform.translate(new Vector3$c(0, 3, 30));
            this.camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new DirectionLight$6());
            directionLight.color = new Vector3$c(1, 1, 1);
            directionLight.transform.worldMatrix.setForward(new Vector3$c(-1.0, -1.0, 1.0));
            var plane = this.s_scene.addChild(new MeshSprite3D$9(PrimitiveMesh$8.createPlane(40, 40, 40, 40)));
            plane.transform.position = new Vector3$c(0, -2.0, 0);
            var planeMat = new BlinnPhongMaterial$3();
            Texture2D$5.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler$g.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                planeMat.albedoTexture = tex;
            }));
            var tilingOffset = planeMat.tilingOffset;
            tilingOffset.setValue(5, 5, 0, 0);
            planeMat.tilingOffset = tilingOffset;
            plane.meshRenderer.material = planeMat;
            this.springTest();
            this.bounceTest();
            this.alongZAixs();
            this.freeRotate();
            this.rotateAngularX();
            this.rotateAngularPoint();
        }
        springTest() {
            var boxA = this.addRigidBodySphere(new Vector3$c(7, 3, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            boxARigid.overrideGravity = true;
            boxARigid.isKinematic = true;
            var boxB = this.addRigidBodyBox(new Vector3$c(10, 0, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -3, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(-3, 0, 0);
            configurableConstraint.maxLinearLimit = new Vector3$c(3, 0, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.linearLimitSpring = new Vector3$c(100, 0, 0);
            configurableConstraint.linearDamp = new Vector3$c(0, 0, 0);
        }
        bounceTest() {
            var boxA = this.addRigidBodySphere(new Vector3$c(7, 3, 3), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(7, 0, 3), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -3, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(-2, 0, 0);
            configurableConstraint.maxLinearLimit = new Vector3$c(2, 0, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.linearBounce = new Vector3$c(0.5, 0, 0);
            boxBRigid.applyImpulse(new Vector3$c(100, 0, 0));
        }
        bounceTestY() {
            var boxA = this.addRigidBodySphere(new Vector3$c(0, 4, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(0, 2, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -2, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(0, -2, 0);
            configurableConstraint.maxLinearLimit = new Vector3$c(0, 10, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
        }
        rotateAngularX() {
            var boxA = this.addRigidBodySphere(new Vector3$c(-2, 3, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(-2, 1, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -2, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minAngularLimit = new Vector3$c(-2, 0, 0);
            configurableConstraint.maxAngularLimit = new Vector3$c(2, 0, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_FREE;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            boxBRigid.angularVelocity = new Vector3$c(5, 0, 0);
        }
        rotateAngularZ() {
            var boxA = this.addRigidBodySphere(new Vector3$c(-7, 6, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(-7, 4, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -2, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minAngularLimit = new Vector3$c(0, 0, -1);
            configurableConstraint.maxAngularLimit = new Vector3$c(0, 0, 1);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            boxBRigid.angularVelocity = new Vector3$c(0.0, 0, 0.5);
        }
        rotateAngularY() {
            var boxA = this.addRigidBodySphere(new Vector3$c(-5, 6, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(-5, 4, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -2, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 0, 0);
            configurableConstraint.minAngularLimit = new Vector3$c(0, -1, 0);
            configurableConstraint.maxAngularLimit = new Vector3$c(0, 1, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            boxBRigid.angularVelocity = new Vector3$c(0.0, 0.5, 0);
        }
        freeRotate() {
            var boxA = this.addRigidBodySphere(new Vector3$c(-6, 3, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(-6, 1, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, -1, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 1, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_FREE;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_FREE;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_FREE;
            boxBRigid.angularVelocity = new Vector3$c(20, 2, 10);
        }
        rotateAngularPoint() {
            var boxA = this.addRigidBodySphere(new Vector3$c(0, 15, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(6, 15, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, 0, 0);
            configurableConstraint.connectAnchor = new Vector3$c(-6, 0, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_FREE;
        }
        alongXAixs() {
            var boxA = this.addRigidBodySphere(new Vector3$c(0, 0, -4), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(5, 0, -4), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, 0, 0);
            configurableConstraint.connectAnchor = new Vector3$c(-5, 0, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(-2, 0, 0);
            configurableConstraint.maxLinearLimit = new Vector3$c(2, 0, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            boxBRigid.linearVelocity = new Vector3$c(1.0, 0.0, 0);
        }
        alongYAixs() {
            var boxA = this.addRigidBodySphere(new Vector3$c(0, 0, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(5, 0, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, 0, 0);
            configurableConstraint.connectAnchor = new Vector3$c(-5, 0, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(0, -3, 0);
            configurableConstraint.maxLinearLimit = new Vector3$c(0, 3, 0);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            boxBRigid.linearVelocity = new Vector3$c(0.0, 1.0, 0);
        }
        alongZAixs() {
            var boxA = this.addRigidBodySphere(new Vector3$c(2, 3, 0), 1);
            var boxARigid = boxA.getComponent(Rigidbody3D$1);
            var boxB = this.addRigidBodyBox(new Vector3$c(2, 0, 0), 1);
            boxB.meshRenderer.material.albedoColor = new Vector4$4(1, 0, 0, 1);
            var boxBRigid = boxB.getComponent(Rigidbody3D$1);
            var configurableConstraint = boxA.addComponent(ConfigurableConstraint);
            configurableConstraint.setConnectRigidBody(boxARigid, boxBRigid);
            configurableConstraint.anchor = new Vector3$c(0, 0, 0);
            configurableConstraint.connectAnchor = new Vector3$c(0, 3, 0);
            configurableConstraint.minLinearLimit = new Vector3$c(0, 0, -4);
            configurableConstraint.maxLinearLimit = new Vector3$c(0, 0, 4);
            configurableConstraint.XMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.YMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.ZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LIMITED;
            configurableConstraint.angularXMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularYMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            configurableConstraint.angularZMotion = ConfigurableConstraint.CONFIG_MOTION_TYPE_LOCKED;
            boxBRigid.linearVelocity = new Vector3$c(0.0, 0.0, 4);
        }
        addRigidBodyBox(pos, scale) {
            var box = this.s_scene.addChild(new MeshSprite3D$9(PrimitiveMesh$8.createBox(scale, scale, scale)));
            box.transform.position = pos;
            var mat = new BlinnPhongMaterial$3();
            box.meshRenderer.material = mat;
            var rigidBody = box.addComponent(Rigidbody3D$1);
            var boxShape = new BoxColliderShape$1(scale, scale, scale);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 1;
            rigidBody.friction = 0.5;
            rigidBody.restitution = 10.0;
            return box;
        }
        addRigidBodySphere(pos, scale) {
            var sphere = this.s_scene.addChild(new MeshSprite3D$9(PrimitiveMesh$8.createSphere(0.2)));
            sphere.transform.position = pos;
            var mat = new BlinnPhongMaterial$3();
            mat.albedoColor = new Vector4$4(0, 1, 0, 1);
            sphere.meshRenderer.material = mat;
            var rigidBody = sphere.addComponent(Rigidbody3D$1);
            var boxShape = new SphereColliderShape(0.2);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 1;
            rigidBody.friction = 0.5;
            rigidBody.restitution = 0.0;
            rigidBody.isKinematic = true;
            return sphere;
        }
    }

    class Physics3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页",
                "基础碰撞器", "选取物体", "角色碰撞器", "碰撞器过滤器", "碰撞器混合",
                "连续碰撞检测", "刚起碰撞", "网格碰撞器", "射线检测", "触发和碰撞事件",
                "固定关节", "可配置关节"
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
                    PhysicsWorld_BaseCollider.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    PhysicsWorld_BuildingBlocks.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    PhysicsWorld_Character.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    PhysicsWorld_CollisionFiflter.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    PhysicsWorld_CompoundCollider.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    PhysicsWorld_ContinueCollisionDetection.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    PhysicsWorld_Kinematic.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    PhysicsWorld_MeshCollider.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    PhysicsWorld_RayShapeCast.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    PhysicsWorld_TriggerAndCollisionEvent.getInstance().Click();
                    break;
                case this.btnNameArr[11]:
                    PhysicsWorld_ConstraintFixedJoint.getInstance().Click();
                    break;
                case this.btnNameArr[12]:
                    PhysicsWorld_ConfigurableJoint.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Scene3D$g = Laya.Scene3D;
    var Camera$a = Laya.Camera;
    var BlinnPhongMaterial$4 = Laya.BlinnPhongMaterial;
    var Vector3$d = Laya.Vector3;
    var DirectionLight$7 = Laya.DirectionLight;
    var MeshSprite3D$a = Laya.MeshSprite3D;
    var Texture2D$6 = Laya.Texture2D;
    var PrimitiveMesh$9 = Laya.PrimitiveMesh;
    var CannonPhysicsCollider = Laya.CannonPhysicsCollider;
    var CannonRigidbody3D = Laya.CannonRigidbody3D;
    var CannonBoxColliderShape = Laya.CannonBoxColliderShape;
    var CannonSphereColliderShape = Laya.CannonSphereColliderShape;
    var CannonCompoundColliderShape = Laya.CannonCompoundColliderShape;
    var Handler$h = Laya.Handler;
    class CannonPhysicsWorld_BaseCollider extends SingletonScene {
        constructor() {
            super();
            Laya3D.init(0, 0, null, Handler$h.create(this, () => {
                Config3D.useCannonPhysics = true;
                this.s_scene = new Scene3D$g();
                var camera = this.s_scene.addChild(new Camera$a(0, 0.1, 100));
                camera.transform.translate(new Vector3$d(0, 6, 9.5));
                camera.transform.rotate(new Vector3$d(-15, 0, 0), true, false);
                camera.addComponent(CameraMoveScript);
                camera.clearColor = null;
                var directionLight = this.s_scene.addChild(new DirectionLight$7());
                directionLight.color = new Vector3$d(0.6, 0.6, 0.6);
                var mat = directionLight.transform.worldMatrix;
                mat.setForward(new Vector3$d(-1.0, -1.0, -1.0));
                directionLight.transform.worldMatrix = mat;
                var plane = this.s_scene.addChild(new MeshSprite3D$a(PrimitiveMesh$9.createPlane(10, 10, 10, 10)));
                var planeMat = new BlinnPhongMaterial$4();
                Texture2D$6.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler$h.create(this, function (tex) {
                    this.AutoSetScene3d(this.s_scene);
                    planeMat.albedoTexture = tex;
                }));
                var tilingOffset = planeMat.tilingOffset;
                tilingOffset.setValue(5, 5, 0, 0);
                planeMat.tilingOffset = tilingOffset;
                plane.meshRenderer.material = planeMat;
                var planeCollider = plane.addComponent(CannonPhysicsCollider);
                var planeShape = new CannonBoxColliderShape(10, 0.01, 10);
                planeCollider.colliderShape = planeShape;
                planeCollider.friction = 2;
                planeCollider.restitution = 0.3;
                this.mat1 = new BlinnPhongMaterial$4();
                this.mat2 = new BlinnPhongMaterial$4();
                this.mat3 = new BlinnPhongMaterial$4();
                Texture2D$6.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Handler$h.create(this, function (tex) {
                    this.mat1.albedoTexture = tex;
                }));
                Texture2D$6.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Handler$h.create(this, function (tex) {
                    this.mat2.albedoTexture = tex;
                }));
                Texture2D$6.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Handler$h.create(this, function (tex) {
                    this.mat3.albedoTexture = tex;
                }));
                Laya.timer.loop(3000, this, function () {
                    var random = Math.random();
                    if (random < 0.33)
                        this.addCompoundColliderShape();
                    else if (random < 0.66)
                        this.addSphere();
                    else
                        this.addBox();
                });
            }));
        }
        addBox() {
            var sX = 1;
            var sY = 1;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$a(PrimitiveMesh$9.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat1;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(Math.random() * 2 - 2, 10, Math.random() * 2 - 2);
            transform.position = pos;
            var scale = transform.getWorldLossyScale();
            scale.setValue(Math.random(), Math.random(), Math.random());
            transform.setWorldLossyScale(scale);
            var rigidBody = box.addComponent(CannonRigidbody3D);
            var boxShape = new CannonBoxColliderShape(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addSphere() {
            var radius = 1;
            var sphere = this.s_scene.addChild(new MeshSprite3D$a(PrimitiveMesh$9.createSphere(1)));
            sphere.meshRenderer.material = this.mat2;
            var sphereTransform = sphere.transform;
            var pos = sphereTransform.position;
            pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
            var scale = sphereTransform.getWorldLossyScale();
            scale.setValue(0.5, 0.5, 0.5);
            sphereTransform.setWorldLossyScale(scale);
            sphereTransform.position = pos;
            var rigidBody = sphere.addComponent(CannonRigidbody3D);
            var sphereShape = new CannonSphereColliderShape(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
        addCompoundColliderShape() {
            var x = Math.random() * 4 - 2;
            var y = 10;
            var z = Math.random() * 4 - 2;
            var mesh = this.addMeshBox(x, y, z);
            var scale = mesh.transform.getWorldLossyScale();
            scale.setValue(0.5, 0.5, 0.5);
            mesh.transform.setWorldLossyScale(scale);
            this.s_scene.addChild(mesh);
            var rigidBody = mesh.addComponent(CannonRigidbody3D);
            var boxShape0 = new CannonBoxColliderShape(1, 1, 1);
            var boxShape1 = new CannonBoxColliderShape(1, 1, 1);
            var boxShape2 = new CannonBoxColliderShape(1, 1, 1);
            var boxShape3 = new CannonBoxColliderShape(1, 1, 1);
            var boxCompoundShape = new CannonCompoundColliderShape();
            boxCompoundShape.addChildShape(boxShape0, new Vector3$d(0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape1, new Vector3$d(0.5, -0.5, 0));
            boxCompoundShape.addChildShape(boxShape2, new Vector3$d(-0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape3, new Vector3$d(-0.5, -0.5));
            rigidBody.colliderShape = boxCompoundShape;
            rigidBody.mass = 10;
        }
        addMeshBox(x, y, z) {
            var sX = 2;
            var sY = 2;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$a(PrimitiveMesh$9.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat3;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(x, y, z);
            transform.position = pos;
            return box;
        }
    }

    var Scene3D$h = Laya.Scene3D;
    var BlinnPhongMaterial$5 = Laya.BlinnPhongMaterial;
    var Camera$b = Laya.Camera;
    var MeshSprite3D$b = Laya.MeshSprite3D;
    var Vector3$e = Laya.Vector3;
    var DirectionLight$8 = Laya.DirectionLight;
    var Texture2D$7 = Laya.Texture2D;
    var PrimitiveMesh$a = Laya.PrimitiveMesh;
    var CannonPhysicsCollider$1 = Laya.CannonPhysicsCollider;
    var CannonBoxColliderShape$1 = Laya.CannonBoxColliderShape;
    var Script3D$3 = Laya.Script3D;
    var Event$7 = Laya.Event;
    var CannonRigidbody3D$1 = Laya.CannonRigidbody3D;
    var CannonSphereColliderShape$1 = Laya.CannonSphereColliderShape;
    var CannonCompoundColliderShape$1 = Laya.CannonCompoundColliderShape;
    var Handler$i = Laya.Handler;
    class CannonPhysicsWorld_ColliderEvent extends SingletonScene {
        constructor() {
            super();
            this.speed = 0.1;
            this.tempSpeed = new Vector3$e();
            Laya3D.init(0, 0, null, Handler$i.create(this, () => {
                Config3D.useCannonPhysics = true;
                this.s_scene = new Scene3D$h();
                this.camera = this.s_scene.addChild(new Camera$b(0, 0.1, 100));
                this.camera.transform.translate(new Vector3$e(0, 6, 15));
                this.camera.transform.rotate(new Vector3$e(-15, 0, 0), true, false);
                this.camera.addComponent(CameraMoveScript);
                this.camera.clearColor = null;
                var directionLight = this.s_scene.addChild(new DirectionLight$8());
                directionLight.color = new Vector3$e(0.6, 0.6, 0.6);
                var mat = directionLight.transform.worldMatrix;
                mat.setForward(new Vector3$e(-1.0, -1.0, -1.0));
                directionLight.transform.worldMatrix = mat;
                var plane = this.s_scene.addChild(new MeshSprite3D$b(PrimitiveMesh$a.createPlane(20, 20, 10, 10)));
                var planeMat = new BlinnPhongMaterial$5();
                Texture2D$7.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler$i.create(this, function (tex) {
                    this.AutoSetScene3d(this.s_scene);
                    planeMat.albedoTexture = tex;
                }));
                var tilingOffset = planeMat.tilingOffset;
                tilingOffset.setValue(5, 5, 0, 0);
                planeMat.tilingOffset = tilingOffset;
                plane.meshRenderer.material = planeMat;
                var planeCollider = plane.addComponent(CannonPhysicsCollider$1);
                var planeShape = new CannonBoxColliderShape$1(20, 0.01, 20);
                planeCollider.colliderShape = planeShape;
                planeCollider.friction = 2;
                planeCollider.restitution = 0.3;
                this.mat1 = new BlinnPhongMaterial$5();
                this.mat2 = new BlinnPhongMaterial$5();
                this.mat3 = new BlinnPhongMaterial$5();
                Texture2D$7.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Handler$i.create(this, function (tex) {
                    this.mat1.albedoTexture = tex;
                }));
                Texture2D$7.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Handler$i.create(this, function (tex) {
                    this.mat2.albedoTexture = tex;
                }));
                Texture2D$7.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Handler$i.create(this, function (tex) {
                    this.mat3.albedoTexture = tex;
                }));
                this.addBox(false);
                this.addSphere();
                this.addCompoundColliderShape();
                this.Kinematic = this.addBox(true);
                this.Kinematic.transform.position = new Vector3$e(0, 0.5, 5);
                this.Kinematic.addComponent(colliderCheck);
                Laya.stage.on(Event$7.KEY_DOWN, this, this.keyDown);
                Laya.stage.on(Event$7.KEY_PRESS, this, this.keyDown);
            }));
        }
        addBox(isKinematic) {
            var sX = 1;
            var sY = 1;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$b(PrimitiveMesh$a.createBox(sX, sY, sZ)));
            box.name = "box";
            box.meshRenderer.material = this.mat1;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(-5, 5, 0);
            transform.position = pos;
            var rigidBody = box.addComponent(CannonRigidbody3D$1);
            var boxShape = new CannonBoxColliderShape$1(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
            rigidBody.isKinematic = isKinematic;
            return box;
        }
        addSphere() {
            var radius = 1;
            var sphere = this.s_scene.addChild(new MeshSprite3D$b(PrimitiveMesh$a.createSphere(1)));
            sphere.name = "sphere";
            sphere.meshRenderer.material = this.mat2;
            var sphereTransform = sphere.transform;
            var pos = sphereTransform.position;
            pos.setValue(0, 1, 0);
            sphereTransform.position = pos;
            var physicsCollider = sphere.addComponent(CannonPhysicsCollider$1);
            var sphereShape = new CannonSphereColliderShape$1(radius);
            physicsCollider.colliderShape = sphereShape;
            physicsCollider.isTrigger = true;
        }
        addCompoundColliderShape() {
            var mesh = this.addMeshBox(5, 5, 0);
            mesh.name = "compound";
            var scale = mesh.transform.getWorldLossyScale();
            scale.setValue(0.5, 0.5, 0.5);
            mesh.transform.setWorldLossyScale(scale);
            this.s_scene.addChild(mesh);
            var rigidBody = mesh.addComponent(CannonRigidbody3D$1);
            var boxShape0 = new CannonBoxColliderShape$1(1, 1, 1);
            var boxShape1 = new CannonBoxColliderShape$1(1, 1, 1);
            var boxShape2 = new CannonBoxColliderShape$1(1, 1, 1);
            var boxShape3 = new CannonBoxColliderShape$1(1, 1, 1);
            var boxCompoundShape = new CannonCompoundColliderShape$1();
            boxCompoundShape.addChildShape(boxShape0, new Vector3$e(0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape1, new Vector3$e(0.5, -0.5, 0));
            boxCompoundShape.addChildShape(boxShape2, new Vector3$e(-0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape3, new Vector3$e(-0.5, -0.5));
            rigidBody.colliderShape = boxCompoundShape;
            rigidBody.mass = 10;
        }
        addMeshBox(x, y, z) {
            var sX = 2;
            var sY = 2;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$b(PrimitiveMesh$a.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat3;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(x, y, z);
            transform.position = pos;
            return box;
        }
        keyDown(e) {
            switch (e.keyCode) {
                case 87:
                    this.tempSpeed.setValue(0, 0, -this.speed);
                    break;
                case 83:
                    this.tempSpeed.setValue(0, 0, this.speed);
                    break;
                case 65:
                    this.tempSpeed.setValue(-this.speed, 0, 0);
                    break;
                case 68:
                    this.tempSpeed.setValue(this.speed, 0, 0);
                    break;
            }
            this.Kinematic.transform.translate(this.tempSpeed);
        }
    }
    class colliderCheck extends Script3D$3 {
        onTriggerEnter(other) {
            console.log("triggerEnter");
        }
        onTriggerStay(other) {
            console.log("triggerStay");
        }
        onTriggerExit(other) {
            console.log("triggerExit");
        }
        onCollisionEnter(collision) {
            console.log("collisionEnter");
        }
        onCollisionStay(collision) {
            console.log("collisionStay");
        }
        onCollisionExit(collision) {
            console.log("collisionexit");
        }
    }

    var Scene3D$i = Laya.Scene3D;
    var Camera$c = Laya.Camera;
    var Vector3$f = Laya.Vector3;
    var DirectionLight$9 = Laya.DirectionLight;
    var MeshSprite3D$c = Laya.MeshSprite3D;
    var BlinnPhongMaterial$6 = Laya.BlinnPhongMaterial;
    var PrimitiveMesh$b = Laya.PrimitiveMesh;
    var Texture2D$8 = Laya.Texture2D;
    var CannonPhysicsCollider$2 = Laya.CannonPhysicsCollider;
    var CannonBoxColliderShape$2 = Laya.CannonBoxColliderShape;
    var CannonRigidbody3D$2 = Laya.CannonRigidbody3D;
    var CannonSphereColliderShape$2 = Laya.CannonSphereColliderShape;
    var Handler$j = Laya.Handler;
    class CannonPhysicsWorld_PhysicsProperty extends SingletonScene {
        constructor() {
            super();
            Laya3D.init(0, 0, null, Handler$j.create(this, () => {
                Config3D.useCannonPhysics = true;
                this.s_scene = new Scene3D$i();
                var camera = this.s_scene.addChild(new Camera$c(0, 0.1, 100));
                camera.transform.translate(new Vector3$f(0, 6, 9.5));
                camera.transform.rotate(new Vector3$f(-15, 0, 0), true, false);
                camera.addComponent(CameraMoveScript);
                camera.clearColor = null;
                var directionLight = this.s_scene.addChild(new DirectionLight$9());
                directionLight.color = new Vector3$f(0.6, 0.6, 0.6);
                var mat = directionLight.transform.worldMatrix;
                mat.setForward(new Vector3$f(-1.0, -1.0, -1.0));
                directionLight.transform.worldMatrix = mat;
                var plane = this.s_scene.addChild(new MeshSprite3D$c(PrimitiveMesh$b.createPlane(20, 20, 10, 10)));
                var planeMat = new BlinnPhongMaterial$6();
                Texture2D$8.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler$j.create(this, function (tex) {
                    this.AutoSetScene3d(this.s_scene);
                    planeMat.albedoTexture = tex;
                }));
                plane.meshRenderer.material = planeMat;
                var planeCollider = plane.addComponent(CannonPhysicsCollider$2);
                var planeShape = new CannonBoxColliderShape$2(20, 0.01, 20);
                planeCollider.restitution = 1.0;
                planeCollider.colliderShape = planeShape;
                planeCollider.friction = 0.1;
                this.addSphere(-4, 5, 0, 0, 0);
                this.addSphere(-2, 5, 0, 0.5, 0);
                this.addSphere(0, 5, 0, 0.9, 0);
                this.addSphere(2, 1, 0, 0, 0.5).linearVelocity = new Vector3$f(0, 0, -5);
                this.addSphere(4, 1, 0, 0, 0.8).linearVelocity = (new Vector3$f(0, 0, -5));
                this.addBox(6, 0.6, 0, 0.1).linearVelocity = new Vector3$f(0, 0, -10);
                this.addBox(8, 0.6, 0, 0.5).linearVelocity = new Vector3$f(0, 0, -10);
            }));
        }
        addSphere(x, y, z, restitution, damp) {
            var radius = 1;
            var sphere = this.s_scene.addChild(new MeshSprite3D$c(PrimitiveMesh$b.createSphere(1)));
            var sphereTransform = sphere.transform;
            var pos = sphereTransform.position;
            pos.setValue(x, y, z);
            var scale = sphereTransform.getWorldLossyScale();
            scale.setValue(0.5, 0.5, 0.5);
            sphereTransform.setWorldLossyScale(scale);
            sphereTransform.position = pos;
            var rigidBody = sphere.addComponent(CannonRigidbody3D$2);
            var sphereShape = new CannonSphereColliderShape$2(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
            rigidBody.restitution = restitution;
            rigidBody.angularDamping = damp;
            rigidBody.linearDamping = 0.1;
            return rigidBody;
        }
        addBox(x, y, z, friction) {
            var sX = 1;
            var sY = 1;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$c(PrimitiveMesh$b.createBox(sX, sY, sZ)));
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(x, y, z);
            transform.position = pos;
            var rigidBody = box.addComponent(CannonRigidbody3D$2);
            var boxShape = new CannonBoxColliderShape$2(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
            rigidBody.friction = friction;
            return rigidBody;
        }
    }

    var Scene3D$j = Laya.Scene3D;
    var BlinnPhongMaterial$7 = Laya.BlinnPhongMaterial;
    var Camera$d = Laya.Camera;
    var Vector2 = Laya.Vector2;
    var Ray = Laya.Ray;
    var Vector3$g = Laya.Vector3;
    var Vector4$5 = Laya.Vector4;
    var MeshSprite3D$d = Laya.MeshSprite3D;
    var DirectionLight$a = Laya.DirectionLight;
    var Texture2D$9 = Laya.Texture2D;
    var PrimitiveMesh$c = Laya.PrimitiveMesh;
    var CannonPhysicsCollider$3 = Laya.CannonPhysicsCollider;
    var CannonBoxColliderShape$3 = Laya.CannonBoxColliderShape;
    var Event$8 = Laya.Event;
    var CannonRigidbody3D$3 = Laya.CannonRigidbody3D;
    var CannonSphereColliderShape$3 = Laya.CannonSphereColliderShape;
    var CannonCompoundColliderShape$2 = Laya.CannonCompoundColliderShape;
    var MouseManager = Laya.MouseManager;
    var CannonHitResult = Laya.CannonHitResult;
    var Handler$k = Laya.Handler;
    class CannonPhysicsWorld_RayCheck extends SingletonScene {
        constructor() {
            super();
            this.point = new Vector2();
            this.ray = new Ray(new Vector3$g(), new Vector3$g());
            this.colorRed = new Vector4$5(1, 0, 0, 1);
            this.colorWrite = new Vector4$5(1, 1, 1, 1);
            Laya3D.init(0, 0, null, Handler$k.create(this, () => {
                Config3D.useCannonPhysics = true;
                this.s_scene = new Scene3D$j();
                this.camera = this.s_scene.addChild(new Camera$d(0, 0.1, 100));
                this.camera.transform.translate(new Vector3$g(0, 6, 9.5));
                this.camera.transform.rotate(new Vector3$g(-15, 0, 0), true, false);
                this.camera.addComponent(CameraMoveScript);
                this.camera.clearColor = null;
                var directionLight = this.s_scene.addChild(new DirectionLight$a());
                directionLight.color = new Vector3$g(0.6, 0.6, 0.6);
                var mat = directionLight.transform.worldMatrix;
                mat.setForward(new Vector3$g(-1.0, -1.0, -1.0));
                directionLight.transform.worldMatrix = mat;
                var plane = this.s_scene.addChild(new MeshSprite3D$d(PrimitiveMesh$c.createPlane(20, 20, 10, 10)));
                var planeMat = new BlinnPhongMaterial$7();
                Texture2D$9.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler$k.create(this, function (tex) {
                    this.AutoSetScene3d(this.s_scene);
                    planeMat.albedoTexture = tex;
                }));
                var tilingOffset = planeMat.tilingOffset;
                tilingOffset.setValue(5, 5, 0, 0);
                planeMat.tilingOffset = tilingOffset;
                plane.meshRenderer.material = planeMat;
                var planeCollider = plane.addComponent(CannonPhysicsCollider$3);
                var planeShape = new CannonBoxColliderShape$3(20, 0.01, 20);
                planeCollider.colliderShape = planeShape;
                planeCollider.friction = 2;
                planeCollider.restitution = 0.3;
                this.mat1 = new BlinnPhongMaterial$7();
                this.mat2 = new BlinnPhongMaterial$7();
                this.mat3 = new BlinnPhongMaterial$7();
                Texture2D$9.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Handler$k.create(this, function (tex) {
                    this.mat1.albedoTexture = tex;
                }));
                Texture2D$9.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Handler$k.create(this, function (tex) {
                    this.mat2.albedoTexture = tex;
                }));
                Texture2D$9.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Handler$k.create(this, function (tex) {
                    this.mat3.albedoTexture = tex;
                }));
                this.addBox();
                this.addSphere();
                this.addCompoundColliderShape();
                Laya.stage.on(Event$8.MOUSE_DOWN, this, this.mouseDown);
            }));
        }
        addBox() {
            var sX = 1;
            var sY = 1;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$d(PrimitiveMesh$c.createBox(sX, sY, sZ)));
            box.name = "box";
            box.meshRenderer.material = this.mat1;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(-5, 5, 0);
            transform.position = pos;
            var rigidBody = box.addComponent(CannonRigidbody3D$3);
            var boxShape = new CannonBoxColliderShape$3(sX, sY, sZ);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
        addSphere() {
            var radius = 1;
            var sphere = this.s_scene.addChild(new MeshSprite3D$d(PrimitiveMesh$c.createSphere(1)));
            sphere.name = "sphere";
            sphere.meshRenderer.material = this.mat2;
            var sphereTransform = sphere.transform;
            var pos = sphereTransform.position;
            pos.setValue(0, 5, 0);
            sphereTransform.position = pos;
            var rigidBody = sphere.addComponent(CannonRigidbody3D$3);
            var sphereShape = new CannonSphereColliderShape$3(radius);
            rigidBody.colliderShape = sphereShape;
            rigidBody.mass = 10;
        }
        addCompoundColliderShape() {
            var mesh = this.addMeshBox(5, 5, 0);
            mesh.name = "compound";
            var scale = mesh.transform.getWorldLossyScale();
            scale.setValue(0.5, 0.5, 0.5);
            mesh.transform.setWorldLossyScale(scale);
            this.s_scene.addChild(mesh);
            var rigidBody = mesh.addComponent(CannonRigidbody3D$3);
            var boxShape0 = new CannonBoxColliderShape$3(1, 1, 1);
            var boxShape1 = new CannonBoxColliderShape$3(1, 1, 1);
            var boxShape2 = new CannonBoxColliderShape$3(1, 1, 1);
            var boxShape3 = new CannonBoxColliderShape$3(1, 1, 1);
            var boxCompoundShape = new CannonCompoundColliderShape$2();
            boxCompoundShape.addChildShape(boxShape0, new Vector3$g(0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape1, new Vector3$g(0.5, -0.5, 0));
            boxCompoundShape.addChildShape(boxShape2, new Vector3$g(-0.5, 0.5, 0));
            boxCompoundShape.addChildShape(boxShape3, new Vector3$g(-0.5, -0.5));
            rigidBody.colliderShape = boxCompoundShape;
            rigidBody.mass = 10;
        }
        addMeshBox(x, y, z) {
            var sX = 2;
            var sY = 2;
            var sZ = 1;
            var box = this.s_scene.addChild(new MeshSprite3D$d(PrimitiveMesh$c.createBox(sX, sY, sZ)));
            box.meshRenderer.material = this.mat3;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(x, y, z);
            transform.position = pos;
            return box;
        }
        mouseDown() {
            this.point.x = MouseManager.instance.mouseX;
            this.point.y = MouseManager.instance.mouseY;
            this.camera.viewportPointToRay(this.point, this.ray);
            var out = new CannonHitResult();
            this.s_scene.cannonPhysicsSimulation.rayCast(this.ray, out);
            if (out.succeeded) {
                var selectSprite3D = out.collider.owner;
                selectSprite3D.meshRenderer.sharedMaterial.albedoColor = this.colorRed;
                if (this.oldSelectMesh)
                    if (selectSprite3D != this.oldSelectMesh)
                        this.oldSelectMesh.meshRenderer.sharedMaterial.albedoColor = this.colorWrite;
                this.oldSelectMesh = selectSprite3D;
            }
        }
    }

    class CannonPhysics3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "基础碰撞器", "碰撞事件", "物理属性", "射线检测"
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
                    CannonPhysicsWorld_BaseCollider.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    CannonPhysicsWorld_ColliderEvent.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    CannonPhysicsWorld_PhysicsProperty.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    CannonPhysicsWorld_RayCheck.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class MouseInteraction extends SingletonScene {
        constructor() {
            super();
            this.posX = 0.0;
            this.posY = 0.0;
            this.point = new Laya.Vector2();
            this.text = new Laya.Text();
            this.s_scene = new Laya.Scene3D();
            this._ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            this.point = new Laya.Vector2();
            this._outHitResult = new Laya.HitResult();
            this._camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(this._camera);
            this._camera.transform.translate(new Laya.Vector3(0, 0.7, 5));
            this._camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            this._camera.addComponent(CameraMoveScript);
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
            grid.layer = 10;
            var staticLayaMonkey = new Laya.MeshSprite3D(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm"));
            this.s_scene.addChild(staticLayaMonkey);
            staticLayaMonkey.meshRenderer.material = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/Materials/T_Diffuse.lmat");
            staticLayaMonkey.transform.position = new Laya.Vector3(0, 0, 0.5);
            staticLayaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
            staticLayaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
            var layaMonkey_clone1 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            var layaMonkey_clone2 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            var layaMonkey_clone3 = Laya.Sprite3D.instantiate(staticLayaMonkey, this.s_scene, false, new Laya.Vector3(0.0, 0, 0.5));
            staticLayaMonkey.name = "大熊";
            layaMonkey_clone1.name = "二熊";
            layaMonkey_clone2.name = "三熊";
            layaMonkey_clone3.name = "小小熊";
            layaMonkey_clone1.transform.translate(new Laya.Vector3(1.5, 0, 0.0));
            layaMonkey_clone2.transform.translate(new Laya.Vector3(-1.5, 0, 0.0));
            layaMonkey_clone3.transform.translate(new Laya.Vector3(2.5, 0, 0.0));
            layaMonkey_clone2.transform.rotate(new Laya.Vector3(0, 60, 0), false, false);
            var scale = new Laya.Vector3(0.1, 0.1, 0.1);
            layaMonkey_clone3.transform.localScale = scale;
            var meshCollider = staticLayaMonkey.addComponent(Laya.PhysicsCollider);
            var meshShape = new Laya.MeshColliderShape();
            meshShape.mesh = staticLayaMonkey.meshFilter.sharedMesh;
            meshCollider.colliderShape = meshShape;
            var meshCollider1 = layaMonkey_clone1.addComponent(Laya.PhysicsCollider);
            var meshShape1 = new Laya.MeshColliderShape();
            meshShape1.mesh = layaMonkey_clone1.meshFilter.sharedMesh;
            meshCollider1.colliderShape = meshShape1;
            var meshCollider2 = layaMonkey_clone2.addComponent(Laya.PhysicsCollider);
            var meshShape2 = new Laya.MeshColliderShape();
            meshShape2.mesh = layaMonkey_clone2.meshFilter.sharedMesh;
            meshCollider2.colliderShape = meshShape2;
            var meshCollider3 = layaMonkey_clone3.addComponent(Laya.PhysicsCollider);
            var meshShape3 = new Laya.MeshColliderShape();
            meshShape3.mesh = layaMonkey_clone3.meshFilter.sharedMesh;
            meshCollider3.colliderShape = meshShape3;
            this.text.x = Laya.stage.width / 2 - 50;
            this.text = new Laya.Text();
            this.text.overflow = Laya.Text.HIDDEN;
            this.text.color = "#FFFFFF";
            this.text.font = "Impact";
            this.text.fontSize = 20;
            this.text.x = Laya.stage.width / 2;
            Laya.stage.addChild(this.text);
            this.addMouseEvent();
        }
        addMouseEvent() {
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.onMouseDown);
        }
        onMouseDown() {
            this.point.x = Laya.MouseManager.instance.mouseX;
            this.point.y = Laya.MouseManager.instance.mouseY;
            this._camera.viewportPointToRay(this.point, this._ray);
            this.s_scene.physicsSimulation.rayCast(this._ray, this._outHitResult);
            if (this._outHitResult.succeeded) {
                this.text.text = "点击到了" + this._outHitResult.collider.owner.name;
            }
        }
        Show() {
            super.Show();
            if (this.text) {
                this.text.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.text) {
                this.text.visible = false;
            }
        }
    }
    class SceneScript extends Laya.Script3D {
        constructor() {
            super();
            this._albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
            this.box = null;
        }
        onAwake() {
            this.box = this.owner;
        }
        onUpdate() {
        }
        onMouseDown() {
        }
        onCollisionEnter(collision) {
            this.box.meshRenderer.sharedMaterial.albedoColor = this._albedoColor;
        }
    }

    class MultiTouch extends SingletonScene {
        constructor() {
            super();
            this._upVector3 = new Laya.Vector3(0, 1, 0);
            this._upVector3 = new Laya.Vector3(0, 1, 0);
            var resource = [GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
            Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            var scene = new Laya.Scene3D();
            this.AutoSetScene3d(scene);
            var camera = new Laya.Camera(0, 0.1, 100);
            scene.addChild(camera);
            camera.name = "camera";
            camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            var monkey = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
            monkey.addComponent(MonkeyScript);
            scene.addChild(monkey);
            camera.transform.lookAt(monkey.transform.position, new Laya.Vector3(0, 1, 0));
            this.text = new Laya.Text();
            this.text.x = Laya.stage.width / 2 - 100;
            this.text.y = 50;
            this.text.text = "触控点归零";
            this.text.name = "ceshi";
            this.text.overflow = Laya.Text.HIDDEN;
            this.text.color = "#FFFFFF";
            this.text.font = "Impact";
            this.text.fontSize = 20;
            this.text.borderColor = "#FFFF00";
            Laya.stage.addChild(this.text);
            this.infoText = new Laya.Text();
            this.infoText.x = Laya.stage.width / 2 - 100;
            this.infoText.text = "单指旋转，双指缩放";
            this.infoText.overflow = Laya.Text.HIDDEN;
            this.infoText.color = "#FFFFFF";
            this.infoText.font = "Impact";
            this.infoText.fontSize = 20;
            this.infoText.borderColor = "#FFFF00";
            Laya.stage.addChild(this.infoText);
        }
        Show() {
            super.Show();
            if (this.text) {
                this.text.visible = true;
            }
            if (this.infoText) {
                this.infoText.visible = true;
            }
        }
        Hide() {
            super.Hide();
            if (this.text) {
                this.text.visible = false;
            }
            if (this.infoText) {
                this.infoText.visible = false;
            }
        }
    }
    class MonkeyScript extends Laya.Script3D {
        constructor() {
            super();
            this.distance = 0.0;
            this.sprite3DSacle = new Laya.Vector3();
            this._scene = null;
            this._text = null;
            this._camera = null;
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.lastPosition = new Laya.Vector2(0, 0);
            this.distance = 0.0;
            this.disVector1 = new Laya.Vector2(0, 0);
            this.disVector2 = new Laya.Vector2(0, 0);
            this.isTwoTouch = false;
            this.first = true;
            this.twoFirst = true;
        }
        onStart() {
            this._scene = this.owner.parent;
            this._text = this._scene.parent.getChildByName("ceshi");
            this._camera = this._scene.getChildByName("camera");
        }
        onUpdate() {
            var touchCount = this._scene.input.touchCount();
            if (1 === touchCount) {
                if (this.isTwoTouch) {
                    return;
                }
                this._text.text = "触控点为1";
                var touch = this._scene.input.getTouch(0);
                if (this.first) {
                    this.lastPosition.x = touch.position.x;
                    this.lastPosition.y = touch.position.y;
                    this.first = false;
                }
                else {
                    var deltaY = touch.position.y - this.lastPosition.y;
                    var deltaX = touch.position.x - this.lastPosition.x;
                    this.lastPosition.x = touch.position.x;
                    this.lastPosition.y = touch.position.y;
                    this.owner.transform.rotate(new Laya.Vector3(1 * deltaY / 2, 1 * deltaX / 2, 0), true, false);
                }
            }
            else if (2 === touchCount) {
                this._text.text = "触控点为2";
                this.isTwoTouch = true;
                var touch = this._scene.input.getTouch(0);
                var touch2 = this._scene.input.getTouch(1);
                if (this.twoFirst) {
                    this.disVector1.x = touch.position.x - touch2.position.x;
                    this.disVector1.y = touch.position.y - touch2.position.y;
                    this.distance = Laya.Vector2.scalarLength(this.disVector1);
                    this.sprite3DSacle = this.owner.transform.scale;
                    this.twoFirst = false;
                }
                else {
                    this.disVector2.x = touch.position.x - touch2.position.x;
                    this.disVector2.y = touch.position.y - touch2.position.y;
                    var distance2 = Laya.Vector2.scalarLength(this.disVector2);
                    let factor = 0.001 * (distance2 - this.distance);
                    this.sprite3DSacle.x += factor;
                    this.sprite3DSacle.y += factor;
                    this.sprite3DSacle.z += factor;
                    this.owner.transform.scale = this.sprite3DSacle;
                    this.distance = distance2;
                }
            }
            else if (0 === touchCount) {
                this._text.text = "触控点归零";
                this.first = true;
                this.twoFirst = true;
                this.lastPosition.x = 0;
                this.lastPosition.y = 0;
                this.isTwoTouch = false;
            }
        }
        onLateUpdate() {
        }
    }

    class MouseInteractionMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "鼠标交互", "多点触控"
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
                    MouseInteraction.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    MultiTouch.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class ScriptDemo extends SingletonScene {
        constructor() {
            super();
            this._translate = new Laya.Vector3(0, 3, 3);
            this._rotation = new Laya.Vector3(-30, 0, 0);
            this._rotation2 = new Laya.Vector3(0, 45, 0);
            this._forward = new Laya.Vector3(1, -1, 0);
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(this._translate);
            camera.transform.rotate(this._rotation, true, false);
            camera.clearColor = null;
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var lightColor = directionLight.color;
            lightColor.setValue(0.6, 0.6, 0.6);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(this._forward);
            directionLight.transform.worldMatrix = mat;
            var box = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1), "MOs"));
            box.transform.rotate(this._rotation2, false, false);
            var material = new Laya.PBRSpecularMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/layabox.png", Laya.Handler.create(this, function (text) {
                this.AutoSetScene3d(this.s_scene);
                material.albedoTexture = text;
                box.meshRenderer.material = material;
                box.addComponent(BoxControlScript);
            }));
            Laya.timer.once(4000, this, this.onLoop, [box]);
        }
        onLoop(box) {
            console.log("移除组件");
            var boxContro = box.getComponent(BoxControlScript);
            boxContro.destroy();
        }
    }
    class BoxControlScript extends Laya.Script3D {
        constructor() {
            super();
            this._albedoColor = new Laya.Vector4(1, 0, 0, 1);
            this._rotation = new Laya.Vector3(0, 0.5, 0);
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
            var material = this.box.meshRenderer.material;
            material.albedoColor = this._albedoColor;
        }
        onUpdate() {
            this.box.transform.rotate(this._rotation, false, false);
        }
        onDisable() {
            console.log("组件设置为不可用");
        }
    }

    class ScriptMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "脚本示例"
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
                    ScriptDemo.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class Sky_SkyBox extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            this.camera.transform.rotate(new Laya.Vector3(10, 0, 0), true, false);
            this.camera.addComponent(CameraMoveScript);
            this.camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            Laya.BaseMaterial.load(GlobalConfig.ResPath + "res/threeDimen/skyBox/DawnDusk/SkyBox.lmat", Laya.Handler.create(this, function (mat) {
                this.AutoSetScene3d(this.s_scene);
                var skyRenderer = this.s_scene.skyRenderer;
                skyRenderer.mesh = Laya.SkyBox.instance;
                skyRenderer.material = mat;
                Laya.timer.frameLoop(1, this, this.onFrameLoop);
                Laya.timer.frameLoop(1, this, function () {
                    this.s_scene.skyRenderer.material.exposure = Math.sin(this.exposureNumber += 0.01) + 1;
                    this.s_scene.skyRenderer.material.rotation += 0.01;
                });
            }));
        }
    }

    class Sky_Procedural extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.addComponent(CameraMoveScript);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            this.directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            var mat = this.directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            this.directionLight.transform.worldMatrix = mat;
            this.rotation = new Laya.Vector3(-0.01, 0, 0);
            var skyRenderer = this.s_scene.skyRenderer;
            skyRenderer.mesh = Laya.SkyDome.instance;
            skyRenderer.material = new Laya.SkyProceduralMaterial();
            Laya.timer.frameLoop(1, this, this.onFrameLoop);
            this.AutoSetScene3d(this.s_scene);
        }
        onFrameLoop() {
            this.directionLight.transform.rotate(this.rotation);
        }
    }

    class SkyMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "天空盒", "程序化天空"
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
                    Sky_SkyBox.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Sky_Procedural.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class Particle_EternalLight extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 2, 4));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/particle/ETF_Eternal_Light.lh", Laya.Handler.create(this, function (sprite) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(sprite);
            }));
        }
    }

    class Particle_BurningGround extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 2, 4));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/particle/ETF_Burning_Ground.lh", Laya.Handler.create(this, function (sprite) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(sprite);
            }));
        }
    }

    class Particle3DMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "永恒之光", "燃烧大地"
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
                    Particle_EternalLight.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Particle_BurningGround.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class TrailRender extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 1000);
            this.s_scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 8, 10));
            camera.transform.rotate(new Laya.Vector3(-45, 0, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SOLIDCOLOR;
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-Math.PI / 3, 0, 0));
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, function (plane) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(plane);
            }));
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/trail/Cube.lh", Laya.Handler.create(this, function (sprite) {
                this.s_scene.addChild(sprite);
            }));
        }
    }

    class TrailMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "拖尾示例"
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
                    TrailRender.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class CustomMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("CustomShader");
            CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
            CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");
        }
        get diffuseTexture() {
            return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
        }
        set diffuseTexture(value) {
            this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
        }
        set marginalColor(value) {
            this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
        }
    }

    class Shader_Simple extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.initShader();
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)));
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1.5));
            camera.addComponent(CameraMoveScript);
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                this.AutoSetScene3d(this.s_scene);
                var layaMonkey = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                var customMaterial = new CustomMaterial();
                layaMonkey.meshRenderer.sharedMaterial = customMaterial;
                Laya.timer.frameLoop(1, this, function () {
                    layaMonkey.transform.rotate(this.rotation, false);
                });
            }));
        }
        initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE
            };
            var vs = `
        #include "Lighting.glsl"; 
        attribute vec4 a_Position;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        attribute vec3 a_Normal;
        varying vec3 v_Normal;
        void main()
        {
        gl_Position = u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        v_Normal=worldMat*a_Normal;
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            var ps = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        varying vec3 v_Normal;
        void main()
        {
        gl_FragColor=vec4(v_Normal,1.0);
        }`;
            var customShader = Laya.Shader3D.add("CustomShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class Shader_GlowingEdge extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            this.initShader();
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh", Laya.Handler.create(this, function (dude) {
                this.s_scene.addChild(dude);
                var customMaterial1 = new CustomMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/head.png", Laya.Handler.create(this, function (tex) {
                    customMaterial1.diffuseTexture = tex;
                }));
                customMaterial1.marginalColor = new Laya.Vector3(1, 0.7, 0);
                var customMaterial2 = new CustomMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/jacket.png", Laya.Handler.create(this, function (tex) {
                    customMaterial2.diffuseTexture = tex;
                }));
                customMaterial2.marginalColor = new Laya.Vector3(1, 0.7, 0);
                var customMaterial3 = new CustomMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/pants.png", Laya.Handler.create(this, function (tex) {
                    customMaterial3.diffuseTexture = tex;
                }));
                customMaterial3.marginalColor = new Laya.Vector3(1, 0.7, 0);
                var customMaterial4 = new CustomMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/Assets/dude/upBodyC.png", Laya.Handler.create(this, function (tex) {
                    customMaterial4.diffuseTexture = tex;
                }));
                customMaterial4.marginalColor = new Laya.Vector3(1, 0.7, 0);
                var baseMaterials = new Array();
                baseMaterials[0] = customMaterial1;
                baseMaterials[1] = customMaterial2;
                baseMaterials[2] = customMaterial3;
                baseMaterials[3] = customMaterial4;
                dude.getChildAt(0).getChildAt(0).skinnedMeshRenderer.sharedMaterials = baseMaterials;
                dude.transform.position = new Laya.Vector3(0, 0.5, 0);
                dude.transform.scale = new Laya.Vector3(0.2, 0.2, 0.2);
                dude.transform.rotate(new Laya.Vector3(0, 180, 0), false, false);
            }));
            var earth = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(0.5, 128, 128)));
            var customMaterial = new CustomMaterial();
            Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/earth.png", Laya.Handler.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                customMaterial.diffuseTexture = tex;
            }));
            customMaterial.marginalColor = new Laya.Vector3(0.0, 0.3, 1.0);
            earth.meshRenderer.sharedMaterial = customMaterial;
            Laya.timer.frameLoop(1, this, function () {
                earth.transform.rotate(this.rotation, true);
            });
        }
        initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
                'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
            };
            var uniformMap = {
                'u_Bones': Laya.Shader3D.PERIOD_CUSTOM,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_texture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL,
                'u_SunLight.color': Laya.Shader3D.PERIOD_SCENE,
            };
            var vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        varying vec2 v_Texcoord;
        varying vec3 v_Normal;
        #ifdef BONE
        attribute vec4 a_BoneIndices;
        attribute vec4 a_BoneWeights;
        const int c_MaxBoneCount = 24;
        uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        #if defined(DIRECTIONLIGHT)
        varying vec3 v_PositionWorld;
        #endif
        void main()
        {
        #ifdef BONE
        mat4 skinTransform=mat4(0.0);
        skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position = skinTransform * a_Position;
        gl_Position=u_MvpMatrix * position;
        mat3 worldMat=mat3(u_WorldMat * skinTransform);
        #else
        gl_Position=u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        #endif
        v_Texcoord=a_Texcoord;
        v_Normal=worldMat*a_Normal;
        #if defined(DIRECTIONLIGHT)
        #ifdef BONE
        v_PositionWorld=(u_WorldMat*position).xyz;
        #else
        v_PositionWorld=(u_WorldMat*a_Position).xyz;
        #endif
        #endif
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            var ps = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        #include "Lighting.glsl";
        varying vec2 v_Texcoord;
        uniform sampler2D u_texture;
        uniform vec3 u_marginalColor;
        varying vec3 v_Normal;
        #if defined(DIRECTIONLIGHT)
            uniform vec3 u_CameraPos;
            varying vec3 v_PositionWorld;
            uniform DirectionLight u_SunLight;
        #endif
        void main()
        {
            gl_FragColor=texture2D(u_texture,v_Texcoord);
            vec3 normal=normalize(v_Normal);
            vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);
            float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));
            vec3 lightColor = u_SunLight.color;
            vec3 Emissive = 2.0 * lightColor * u_marginalColor * pow(Rim,3.0);  
            gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);
        }`;
            var customShader = Laya.Shader3D.add("CustomShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class CustomTerrainMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("CustomTerrainShader");
        }
        static __init__() {
            CustomTerrainMaterial.SPLATALPHATEXTURE = Laya.Shader3D.propertyNameToID("u_SplatAlphaTexture");
            CustomTerrainMaterial.DIFFUSETEXTURE1 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture1");
            CustomTerrainMaterial.DIFFUSETEXTURE2 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture2");
            CustomTerrainMaterial.DIFFUSETEXTURE3 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture3");
            CustomTerrainMaterial.DIFFUSETEXTURE4 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture4");
            CustomTerrainMaterial.DIFFUSETEXTURE5 = Laya.Shader3D.propertyNameToID("u_DiffuseTexture5");
            CustomTerrainMaterial.DIFFUSESCALE1 = Laya.Shader3D.propertyNameToID("u_DiffuseScale1");
            CustomTerrainMaterial.DIFFUSESCALE2 = Laya.Shader3D.propertyNameToID("u_DiffuseScale2");
            CustomTerrainMaterial.DIFFUSESCALE3 = Laya.Shader3D.propertyNameToID("u_DiffuseScale3");
            CustomTerrainMaterial.DIFFUSESCALE4 = Laya.Shader3D.propertyNameToID("u_DiffuseScale4");
            CustomTerrainMaterial.DIFFUSESCALE5 = Laya.Shader3D.propertyNameToID("u_DiffuseScale5");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM1");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM2");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM3");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM4");
            CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5 = Laya.Shader3D.getDefineByName("CUSTOM_DETAIL_NUM5");
        }
        get splatAlphaTexture() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.SPLATALPHATEXTURE);
        }
        set splatAlphaTexture(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.SPLATALPHATEXTURE, value);
        }
        get diffuseTexture1() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE1);
        }
        set diffuseTexture1(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE1, value);
            this._setDetailNum(1);
        }
        get diffuseTexture2() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE2);
        }
        set diffuseTexture2(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE2, value);
            this._setDetailNum(2);
        }
        get diffuseTexture3() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE3);
        }
        set diffuseTexture3(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE3, value);
            this._setDetailNum(3);
        }
        get diffuseTexture4() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE4);
        }
        set diffuseTexture4(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE4, value);
            this._setDetailNum(4);
        }
        get diffuseTexture5() {
            return this._shaderValues.getTexture(CustomTerrainMaterial.DIFFUSETEXTURE5);
        }
        set diffuseTexture5(value) {
            this._shaderValues.setTexture(CustomTerrainMaterial.DIFFUSETEXTURE5, value);
            this._setDetailNum(5);
        }
        setDiffuseScale1(scale1) {
            this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE1, scale1);
        }
        setDiffuseScale2(scale2) {
            this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE2, scale2);
        }
        setDiffuseScale3(scale3) {
            this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE3, scale3);
        }
        setDiffuseScale4(scale4) {
            this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE4, scale4);
        }
        setDiffuseScale5(scale5) {
            this._shaderValues.setVector(CustomTerrainMaterial.DIFFUSESCALE5, scale5);
        }
        _setDetailNum(value) {
            switch (value) {
                case 1:
                    this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 2:
                    this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 3:
                    this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 4:
                    this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    break;
                case 5:
                    this._shaderValues.addDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM5);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM1);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM2);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM3);
                    this._shaderValues.removeDefine(CustomTerrainMaterial.SHADERDEFINE_DETAIL_NUM4);
                    break;
            }
        }
        static initShader() {
            CustomTerrainMaterial.__init__();
            let attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
            };
            let uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_SplatAlphaTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture5': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale5': Laya.Shader3D.PERIOD_MATERIAL
            };
            let vs = `
            attribute vec4 a_Position;
            attribute vec2 a_Texcoord0;
            attribute vec3 a_Normal;
            uniform mat4 u_MvpMatrix;
            varying vec2 v_Texcoord0;
            void main()
            {
                gl_Position = u_MvpMatrix * a_Position;
                v_Texcoord0 = a_Texcoord0;
            }`;
            let ps = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            uniform sampler2D u_SplatAlphaTexture;
            uniform sampler2D u_DiffuseTexture1;
            uniform sampler2D u_DiffuseTexture2;
            uniform sampler2D u_DiffuseTexture3;
            uniform sampler2D u_DiffuseTexture4;
            uniform sampler2D u_DiffuseTexture5;
            uniform vec2 u_DiffuseScale1;
            uniform vec2 u_DiffuseScale2;
            uniform vec2 u_DiffuseScale3;
            uniform vec2 u_DiffuseScale4;
            uniform vec2 u_DiffuseScale5;
            varying vec2 v_Texcoord0;
            void main()
            {
                #ifdef CUSTOM_DETAIL_NUM1
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r;
                #elif  defined(CUSTOM_DETAIL_NUM2)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
                #elif defined(CUSTOM_DETAIL_NUM3)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
                #elif defined(CUSTOM_DETAIL_NUM4)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
                #elif defined(CUSTOM_DETAIL_NUM5)
                    vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
                    vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
                    vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
                    vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
                    vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
                    vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
                    gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
                #else
                #endif
            }`;
            let customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            customTerrianShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class Shader_Terrain extends SingletonScene {
        constructor() {
            super();
            this.initShader();
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000));
            camera.transform.rotate(new Laya.Vector3(-18, 180, 0), false, false);
            camera.transform.translate(new Laya.Vector3(-28, 20, -18), false);
            camera.addComponent(CameraMoveScript);
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/terrain_New-Part-01.lm", Laya.Handler.create(this, function (mesh) {
                this.AutoSetScene3d(this.s_scene);
                var terrain = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                var customMaterial = new CustomTerrainMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/splatAlphaTexture.png", Laya.Handler.create(null, function (tex) {
                    customMaterial.splatAlphaTexture = tex;
                }));
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/ground_01.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture1 = tex;
                }));
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/ground_02.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture2 = tex;
                }));
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/ground_03.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture3 = tex;
                }));
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/Terrain/ground_04.jpg", Laya.Handler.create(null, function (tex) {
                    customMaterial.diffuseTexture4 = tex;
                }));
                customMaterial.setDiffuseScale1(new Laya.Vector2(27.92727, 27.92727));
                customMaterial.setDiffuseScale2(new Laya.Vector2(13.96364, 13.96364));
                customMaterial.setDiffuseScale3(new Laya.Vector2(18.61818, 18.61818));
                customMaterial.setDiffuseScale4(new Laya.Vector2(13.96364, 13.96364));
                terrain.meshRenderer.sharedMaterial = customMaterial;
            }));
        }
        initShader() {
            CustomTerrainMaterial.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_SplatAlphaTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseTexture5': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale1': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale2': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale3': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale4': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DiffuseScale5': Laya.Shader3D.PERIOD_MATERIAL
            };
            var vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord0;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        varying vec2 v_Texcoord0;
        void main()
        {
          gl_Position = u_MvpMatrix * a_Position;
          v_Texcoord0 = a_Texcoord0;
          gl_Position=remapGLPositionZ(gl_Position);
       }`;
            var ps = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform sampler2D u_SplatAlphaTexture;
        uniform sampler2D u_DiffuseTexture1;
        uniform sampler2D u_DiffuseTexture2;
        uniform sampler2D u_DiffuseTexture3;
        uniform sampler2D u_DiffuseTexture4;
        uniform sampler2D u_DiffuseTexture5;
        uniform vec2 u_DiffuseScale1;
        uniform vec2 u_DiffuseScale2;
        uniform vec2 u_DiffuseScale3;
        uniform vec2 u_DiffuseScale4;
        uniform vec2 u_DiffuseScale5;
        varying vec2 v_Texcoord0;
        void main()
        {
        #ifdef CUSTOM_DETAIL_NUM1
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r;
        #elif defined(CUSTOM_DETAIL_NUM2)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r + color2.xyz * (1.0 - splatAlpha.r);
        #elif defined(USTOM_DETAIL_NUM3)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * (1.0 - splatAlpha.r - splatAlpha.g);
        #elif defined(CUSTOM_DETAIL_NUM4)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b);
        #elif defined(CUSTOM_DETAIL_NUM5)
        vec4 splatAlpha = texture2D(u_SplatAlphaTexture, v_Texcoord0);
        vec4 color1 = texture2D(u_DiffuseTexture1, v_Texcoord0 * u_DiffuseScale1);
        vec4 color2 = texture2D(u_DiffuseTexture2, v_Texcoord0 * u_DiffuseScale2);
        vec4 color3 = texture2D(u_DiffuseTexture3, v_Texcoord0 * u_DiffuseScale3);
        vec4 color4 = texture2D(u_DiffuseTexture4, v_Texcoord0 * u_DiffuseScale4);
        vec4 color5 = texture2D(u_DiffuseTexture5, v_Texcoord0 * u_DiffuseScale5);
        gl_FragColor.xyz = color1.xyz * splatAlpha.r  + color2.xyz * splatAlpha.g + color3.xyz * splatAlpha.b + color4.xyz * splatAlpha.a + color5.xyz * (1.0 - splatAlpha.r - splatAlpha.g - splatAlpha.b - splatAlpha.a);
        #else
        #endif
        }`;
            var customTerrianShader = Laya.Shader3D.add("CustomTerrainShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customTerrianShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class MultiplePassOutlineMaterial extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("MultiplePassOutlineShader");
            this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, 0.01581197);
            this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, 1);
            this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, new Laya.Vector4(1.0, 1.0, 1.0, 0.0));
            MultiplePassOutlineMaterial.ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
            MultiplePassOutlineMaterial.OUTLINECOLOR = Laya.Shader3D.propertyNameToID("u_OutlineColor");
            MultiplePassOutlineMaterial.OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
            MultiplePassOutlineMaterial.OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");
        }
        static __init__() {
        }
        get albedoTexture() {
            return this._shaderValues.getTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE);
        }
        set albedoTexture(value) {
            this._shaderValues.setTexture(MultiplePassOutlineMaterial.ALBEDOTEXTURE, value);
        }
        get outlineColor() {
            return this._shaderValues.getVector(MultiplePassOutlineMaterial.OUTLINECOLOR);
        }
        set outlineColor(value) {
            this._shaderValues.setVector(MultiplePassOutlineMaterial.OUTLINECOLOR, value);
        }
        get outlineWidth() {
            return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH);
        }
        set outlineWidth(value) {
            value = Math.max(0.0, Math.min(0.05, value));
            this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINEWIDTH, value);
        }
        get outlineLightness() {
            return this._shaderValues.getNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS);
        }
        set outlineLightness(value) {
            value = Math.max(0.0, Math.min(1.0, value));
            this._shaderValues.setNumber(MultiplePassOutlineMaterial.OUTLINELIGHTNESS, value);
        }
        static initShader() {
            MultiplePassOutlineMaterial.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OutlineColor': Laya.Shader3D.PERIOD_MATERIAL,
                'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
                'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL
            };
            var customShader = Laya.Shader3D.add("MultiplePassOutlineShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            let vs1 = `
        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        
        uniform mat4 u_MvpMatrix; 
        uniform float u_OutlineWidth;

        
        void main() 
        {
           vec4 position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);
           gl_Position = u_MvpMatrix * position;
        }`;
            let ps1 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
           precision mediump float;
        #endif
        uniform vec4 u_OutlineColor; 
        uniform float u_OutlineLightness;
    
        void main()
        {
           vec3 finalColor = u_OutlineColor.rgb * u_OutlineLightness;
           gl_FragColor = vec4(finalColor,0.0); 
        }`;
            var pass1 = subShader.addShaderPass(vs1, ps1);
            pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
            let vs2 = `
        #include "Lighting.glsl"

        attribute vec4 a_Position; 
        attribute vec2 a_Texcoord0;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        
        attribute vec3 a_Normal; 
        varying vec3 v_Normal; 
        varying vec2 v_Texcoord0; 
        
        void main() 
        {
           gl_Position = u_MvpMatrix * a_Position;
           mat3 worldMat=mat3(u_WorldMat); 
           v_Normal=worldMat*a_Normal; 
           v_Texcoord0 = a_Texcoord0;
           gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            let ps2 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        varying vec2 v_Texcoord0;
        varying vec3 v_Normal;
        
        uniform sampler2D u_AlbedoTexture;
        
        
        void main()
        {
           vec4 albedoTextureColor = vec4(1.0);
           
           albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
           gl_FragColor=albedoTextureColor;
        }`;
            subShader.addShaderPass(vs2, ps2);
        }
    }

    class Shader_MultiplePassOutline extends SingletonScene {
        constructor() {
            super();
            this.rotation = new Laya.Vector3(0, 0.01, 0);
            MultiplePassOutlineMaterial.initShader();
            this.s_scene = new Laya.Scene3D();
            var camera = (this.s_scene.addChild(new Laya.Camera(0, 0.1, 1000)));
            camera.transform.translate(new Laya.Vector3(0, 0.85, 1.7));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            Laya.Mesh.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                this.AutoSetScene3d(this.s_scene);
                var layaMonkey = this.s_scene.addChild(new Laya.MeshSprite3D(mesh));
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                var customMaterial = new MultiplePassOutlineMaterial();
                Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey2/Assets/LayaMonkey/diffuse.png", Laya.Handler.create(this, function (texture) {
                    customMaterial.albedoTexture = texture;
                }));
                layaMonkey.meshRenderer.sharedMaterial = customMaterial;
                Laya.timer.frameLoop(1, this, function () {
                    layaMonkey.transform.rotate(this.rotation, false);
                });
            }));
        }
    }

    class ShaderMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "简单Shader", "边缘光照Shader", "地形Shader", "描边Shader"
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
                    Shader_Simple.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    Shader_GlowingEdge.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Shader_Terrain.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Shader_MultiplePassOutline.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Loader$5 = Laya.Loader;
    var Handler$l = Laya.Handler;
    class StaticBatchingTest extends SingletonScene {
        constructor() {
            super();
            Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls"], Handler$l.create(this, this.onComplete));
        }
        onComplete() {
            var scene = Loader$5.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_city01/Conventional/city01.ls");
            this.AutoSetScene3d(scene);
            var camera = scene.getChildByName("Main Camera");
            camera.addComponent(CameraMoveScript);
        }
    }

    var Vector3$h = Laya.Vector3;
    var Camera$e = Laya.Camera;
    var Texture2D$a = Laya.Texture2D;
    var Matrix4x4$1 = Laya.Matrix4x4;
    var PrimitiveMesh$d = Laya.PrimitiveMesh;
    var BlinnPhongMaterial$8 = Laya.BlinnPhongMaterial;
    var MeshSprite3D$e = Laya.MeshSprite3D;
    var Handler$m = Laya.Handler;
    class DynamicBatchTest extends SingletonScene {
        constructor() {
            super();
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Vector3$h(1, 1, 1);
            var camera = this.s_scene.addChild(new Camera$e(0, 0.1, 1000));
            camera.transform.translate(new Vector3$h(0, 6.2, 10.5));
            camera.transform.rotate(new Vector3$h(-40, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            Texture2D$a.load(GlobalConfig.ResPath + "res/threeDimen/layabox.png", Handler$m.create(this, function (tex) {
                this.AutoSetScene3d(this.s_scene);
                var radius = new Vector3$h(0, 0, 1);
                var radMatrix = new Matrix4x4$1();
                var circleCount = 50;
                var boxMesh = PrimitiveMesh$d.createBox(0.02, 0.02, 0.02);
                var boxMat = new BlinnPhongMaterial$8();
                boxMat.albedoTexture = tex;
                for (var i = 0; i < circleCount; i++) {
                    radius.z = 1.0 + i * 0.15;
                    radius.y = i * 0.03;
                    var oneCircleCount = 100 + i * 15;
                    for (var j = 0; j < oneCircleCount; j++) {
                        var boxSprite = new MeshSprite3D$e(boxMesh);
                        boxSprite.meshRenderer.sharedMaterial = boxMat;
                        var localPos = boxSprite.transform.localPosition;
                        var rad = ((Math.PI * 2) / oneCircleCount) * j;
                        Matrix4x4$1.createRotationY(rad, radMatrix);
                        Vector3$h.transformCoordinate(radius, radMatrix, localPos);
                        boxSprite.transform.localPosition = localPos;
                        this.s_scene.addChild(boxSprite);
                    }
                }
            }));
        }
    }

    class PerformanceMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "静态合批", "动态合批"
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
                    StaticBatchingTest.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    DynamicBatchTest.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    var Script3D$4 = Laya.Script3D;
    var Vector3$i = Laya.Vector3;
    var Event$9 = Laya.Event;
    var MouseManager$1 = Laya.MouseManager;
    var Scene3D$k = Laya.Scene3D;
    var Text$1 = Laya.Text;
    var Browser$9 = Laya.Browser;
    var Handler$n = Laya.Handler;
    class RotationScript$1 extends Script3D$4 {
        constructor() {
            super();
            this._mouseDown = false;
            this._rotate = new Vector3$i();
            this._autoRotateSpeed = new Vector3$i(0, 0.25, 0);
            Laya.stage.on(Event$9.MOUSE_DOWN, this, function () {
                this._mouseDown = true;
                this._lastMouseX = MouseManager$1.instance.mouseX;
            });
            Laya.stage.on(Event$9.MOUSE_UP, this, function () {
                this._mouseDown = false;
            });
        }
        onUpdate() {
            if (this._mouseDown) {
                var deltaX = MouseManager$1.instance.mouseX - this._lastMouseX;
                this._rotate.y = deltaX * 0.2;
                this.model.transform.rotate(this._rotate, false, false);
                this._lastMouseX = MouseManager$1.instance.mouseX;
            }
            else {
                this.model.transform.rotate(this._autoRotateSpeed, false, false);
            }
        }
    }
    class DamagedHelmetModelShow extends SingletonScene {
        constructor() {
            super();
            this.txts = [];
            Scene3D$k.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_DamagedHelmetScene/Conventional/DamagedHelmetScene.ls", Handler$n.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var damagedHelmet = scene.getChildAt(1).getChildAt(0);
                var rotationScript = damagedHelmet.addComponent(RotationScript$1);
                rotationScript.model = damagedHelmet;
                var size = 20;
                this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
                size = 10;
                this.addText(size, Laya.stage.height - size * 4, "Battle Damaged Sci-fi Helmet by theblueturtle_    www.leonardocarrion.com", "#FFFF00");
            }));
        }
        addText(size, y, text, color) {
            var cerberusText = new Text$1();
            cerberusText.color = color;
            cerberusText.fontSize = size * Browser$9.pixelRatio;
            cerberusText.x = size;
            cerberusText.y = y;
            cerberusText.text = text;
            Laya.stage.addChild(cerberusText);
            this.txts.push(cerberusText);
        }
        Show() {
            super.Show();
            for (var i = 0; i < this.txts.length; i++) {
                this.txts[i].visible = true;
            }
        }
        Hide() {
            super.Hide();
            for (var i = 0; i < this.txts.length; i++) {
                this.txts[i].visible = false;
            }
        }
    }

    var Scene3D$l = Laya.Scene3D;
    var Handler$o = Laya.Handler;
    class GhostModelShow extends SingletonScene {
        constructor() {
            super();
            Scene3D$l.load(GlobalConfig.ResPath + "res/threeDimen/scene/PBRScene/Demo.ls", Handler$o.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                var camera = scene.getChildByName("Camera");
                camera.addComponent(CameraMoveScript);
            }));
        }
    }

    var Script3D$5 = Laya.Script3D;
    var Vector3$j = Laya.Vector3;
    var Event$a = Laya.Event;
    var MouseManager$2 = Laya.MouseManager;
    var Scene3D$m = Laya.Scene3D;
    var Text$2 = Laya.Text;
    var Browser$a = Laya.Browser;
    var AmbientMode = Laya.AmbientMode;
    var Handler$p = Laya.Handler;
    class RotationScript$2 extends Script3D$5 {
        constructor() {
            super();
            this._mouseDown = false;
            this._rotate = new Vector3$j();
            Laya.stage.on(Event$a.MOUSE_DOWN, this, function () {
                this._mouseDown = true;
                this._lastMouseX = MouseManager$2.instance.mouseX;
            });
            Laya.stage.on(Event$a.MOUSE_UP, this, function () {
                this._mouseDown = false;
            });
        }
        onUpdate() {
            if (this._mouseDown) {
                var deltaX = MouseManager$2.instance.mouseX - this._lastMouseX;
                this._rotate.y = deltaX * 0.2;
                this.model.transform.rotate(this._rotate, false, false);
                this._lastMouseX = MouseManager$2.instance.mouseX;
            }
        }
    }
    class CerberusModelShow extends SingletonScene {
        constructor() {
            super();
            this.txts = [];
            Scene3D$m.load(GlobalConfig.ResPath + "res/threeDimen/scene/LayaScene_CerberusScene/Conventional/CerberusScene.ls", Handler$p.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientMode = AmbientMode.SphericalHarmonics;
                var model = scene.getChildByName("Cerberus_LP");
                var rotationScript = model.addComponent(RotationScript$2);
                rotationScript.model = model;
                var size = 20;
                this.addText(size, size * 4, "Drag the screen to rotate the model.", "#F09900");
                size = 10;
                this.addText(size, Laya.stage.height - size * 4, "Cerberus by Andrew Maximov     http://artisaverb.info/PBT.html", "#FFFF00");
            }));
        }
        addText(size, y, text, color) {
            var cerberusText = new Text$2();
            cerberusText.color = color;
            cerberusText.fontSize = size * Browser$a.pixelRatio;
            cerberusText.x = size;
            cerberusText.y = y;
            cerberusText.text = text;
            this.txts.push(cerberusText);
            Laya.stage.addChild(cerberusText);
        }
        Show() {
            super.Show();
            for (var i = 0; i < this.txts.length; i++) {
                this.txts[i].visible = true;
            }
        }
        Hide() {
            super.Hide();
            for (var i = 0; i < this.txts.length; i++) {
                this.txts[i].visible = false;
            }
        }
    }

    class DemoMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页", "幽灵模型", "损坏头盔模型", "地狱犬枪模型"
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
                    GhostModelShow.getInstance().Show();
                    break;
                case this.btnNameArr[2]:
                    DamagedHelmetModelShow.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    CerberusModelShow.getInstance().Click();
                    break;
            }
            console.log(name + "按钮_被点击");
        }
    }

    class Laya3DCombineHtml extends SingletonScene {
        constructor() {
            super();
            var div = Laya.Browser.window.document.createElement("div");
            div.innerHTML = "<h1 style='color: red;'>此内容来源于HTML网页, 可直接在html代码中书写 - h1标签</h1>";
            document.body.appendChild(div);
            var config3D = new Config3D();
            config3D.isAlpha = true;
            Laya3D.init(0, 0, config3D);
            Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
            Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
            Laya.stage.bgColor = null;
            this.s_scene = new Laya.Scene3D();
            var camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.clearColor = null;
            var directionLight = this.s_scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.7, 0.6, 0.6);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(layaMonkey);
            }));
        }
    }

    var MeshTerrainSprite3D = Laya.MeshTerrainSprite3D;
    var Sprite3D$4 = Laya.Sprite3D;
    var Vector3$k = Laya.Vector3;
    var Scene3D$n = Laya.Scene3D;
    var Texture2D$b = Laya.Texture2D;
    var Loader$6 = Laya.Loader;
    var Animator$1 = Laya.Animator;
    var AnimatorState = Laya.AnimatorState;
    var Camera$f = Laya.Camera;
    var Tween = Laya.Tween;
    var Event$b = Laya.Event;
    var Handler$q = Laya.Handler;
    class AStarFindPath extends SingletonScene {
        constructor() {
            super();
            this._position = new Vector3$k(0, 0, 0);
            this._upVector3 = new Vector3$k(0, 1, 0);
            this._tarPosition = new Vector3$k(0, 0, 0);
            this._finalPosition = new Vector3$k(0, 0, 0);
            this._rotation = new Vector3$k(-45, 180, 0);
            this._rotation2 = new Vector3$k(0, 180, 0);
            this.index = 0;
            this.curPathIndex = 0;
            this.nextPathIndex = 1;
            this.pointCount = 10;
            this.path = [];
            var resource = [{ url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Scene3D$n, priority: 1 },
                { url: GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Sprite3D$4, priority: 1 },
                { url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Texture2D$b, priority: 1, constructParams: [1024, 1024, 1, false, true] },
                { url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Texture2D$b, priority: 1, constructParams: [64, 64, 1, false, true] }];
            Laya.loader.create(resource, Handler$q.create(this, this.onLoadFinish));
        }
        onLoadFinish() {
            this.s_scene = Loader$6.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/XunLongShi.ls");
            this.initPath(this.s_scene);
            this.AutoSetScene3d(this.s_scene);
            var meshSprite3D = this.s_scene.getChildByName('Scenes').getChildByName('HeightMap');
            meshSprite3D.active = false;
            var heightMap = Loader$6.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png");
            this.terrainSprite = MeshTerrainSprite3D.createFromMeshAndHeightMap(meshSprite3D.meshFilter.sharedMesh, heightMap, 6.574996471405029, 10.000000953674316);
            this.terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;
            this.aStarMap = Loader$6.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png");
            var aStarArr = this.createGridFromAStarMap(this.aStarMap);
            this.graph = new window.Graph(aStarArr);
            this.opts = [];
            this.opts.closest = true;
            this.opts.heuristic = window.astar.heuristics.diagonal;
            this.moveSprite3D = this.s_scene.addChild(new Sprite3D$4());
            this.moveSprite3D.transform.position = this.path[0];
            this.layaMonkey = this.moveSprite3D.addChild(Loader$6.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
            var tmpLocalScale = this.layaMonkey.transform.localScale;
            tmpLocalScale.setValue(0.5, 0.5, 0.5);
            var aniSprite3d = this.layaMonkey.getChildAt(0);
            var animator = aniSprite3d.getComponent(Animator$1);
            var state = new AnimatorState();
            state.name = "run";
            state.clipStart = 40 / 150;
            state.clipEnd = 70 / 150;
            state.clip = animator.getDefaultState().clip;
            animator.addState(state);
            animator.play("run");
            var mat = this.layaMonkey.getChildAt(0).getChildAt(0).skinnedMeshRenderer.sharedMaterial;
            mat.albedoIntensity = 8;
            this.layaMonkey.transform.position.cloneTo(this._finalPosition);
            var moveCamera = this.moveSprite3D.addChild(new Camera$f());
            var tmpLocalPosition = moveCamera.transform.localPosition;
            tmpLocalPosition.setValue(-1.912066, 10.07926, -10.11014);
            moveCamera.transform.localPosition = tmpLocalPosition;
            moveCamera.transform.rotate(this._rotation, true, false);
            moveCamera.addComponent(CameraMoveScript);
            Laya.stage.on(Event$b.MOUSE_UP, this, function () {
                this.index = 0;
                var startPoint = this.getGridIndex(this.path[this.curPathIndex % this.pointCount].x, this.path[this.curPathIndex++ % this.pointCount].z);
                var endPoint = this.getGridIndex(this.path[this.nextPathIndex % this.pointCount].x, this.path[this.nextPathIndex++ % this.pointCount].z);
                var start = this.graph.grid[startPoint.x][startPoint.z];
                var end = this.graph.grid[endPoint.x][endPoint.z];
                this._everyPath = window.astar.search(this.graph, start, end, {
                    closest: this.opts.closest
                });
                if (this._everyPath && this._everyPath.length > 0) {
                    this.resPath = this.getRealPosition(start, this._everyPath);
                }
            });
            Laya.timer.loop(40, this, this.loopfun);
        }
        loopfun() {
            if (this.resPath && this.index < this.resPath.length) {
                this._position.x = this.resPath[this.index].x;
                this._position.z = this.resPath[this.index++].z;
                this._position.y = this.terrainSprite.getHeight(this._position.x, this._position.z);
                if (isNaN(this._position.y)) {
                    this._position.y = this.moveSprite3D.transform.position.y;
                }
                if (this.index === 1) {
                    this._tarPosition.x = this.resPath[this.resPath.length - 1].x;
                    this._tarPosition.z = this.resPath[this.resPath.length - 1].z;
                    this._tarPosition.y = this.moveSprite3D.transform.position.y;
                    this.layaMonkey.transform.lookAt(this._tarPosition, this._upVector3, false);
                    this.layaMonkey.transform.rotate(this._rotation2, false, false);
                }
                Tween.to(this._finalPosition, { x: this._position.x, y: this._position.y, z: this._position.z }, 40);
                this.moveSprite3D.transform.position = this._finalPosition;
            }
        }
        initPath(scene) {
            for (var i = 0; i < this.pointCount; i++) {
                var str = "path" + i;
                this.path.push(scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str).transform.localPosition);
            }
        }
        getGridIndex(x, z) {
            var minX = this.terrainSprite.minX;
            var minZ = this.terrainSprite.minZ;
            var cellX = this.terrainSprite.width / this.aStarMap.width;
            var cellZ = this.terrainSprite.depth / this.aStarMap.height;
            var gridX = Math.floor((x - minX) / cellX);
            var gridZ = Math.floor((z - minZ) / cellZ);
            var boundWidth = this.aStarMap.width - 1;
            var boundHeight = this.aStarMap.height - 1;
            (gridX > boundWidth) && (gridX = boundWidth);
            (gridZ > boundHeight) && (gridZ = boundHeight);
            (gridX < 0) && (gridX = 0);
            (gridZ < 0) && (gridZ = 0);
            var res = [];
            res.x = gridX;
            res.z = gridZ;
            return res;
        }
        getRealPosition(start, path) {
            var resPath = [];
            var minX = this.terrainSprite.minX;
            var minZ = this.terrainSprite.minZ;
            var cellX = this.terrainSprite.width / this.aStarMap.width;
            var cellZ = this.terrainSprite.depth / this.aStarMap.height;
            var halfCellX = cellX / 2;
            var halfCellZ = cellZ / 2;
            resPath[0] = [];
            resPath[0].x = start.x * cellX + halfCellX + minX;
            resPath[0].z = start.y * cellZ + halfCellZ + minZ;
            for (var i = 1; i < path.length; i++) {
                var gridPos = path[i];
                resPath[i] = [];
                resPath[i].x = gridPos.x * cellX + halfCellX + minX;
                resPath[i].z = gridPos.y * cellZ + halfCellZ + minZ;
            }
            return resPath;
        }
        createGridFromAStarMap(texture) {
            var textureWidth = texture.width;
            var textureHeight = texture.height;
            var pixelsInfo = texture.getPixels();
            var aStarArr = [];
            var index = 0;
            for (var w = 0; w < textureWidth; w++) {
                var colaStarArr = aStarArr[w] = [];
                for (var h = 0; h < textureHeight; h++) {
                    var r = pixelsInfo[index++];
                    var g = pixelsInfo[index++];
                    var b = pixelsInfo[index++];
                    var a = pixelsInfo[index++];
                    if (r == 255 && g == 255 && b == 255 && a == 255)
                        colaStarArr[h] = 1;
                    else {
                        colaStarArr[h] = 0;
                    }
                }
            }
            ;
            return aStarArr;
        }
    }

    class Scene2DPlayer3D extends SingletonScene {
        constructor() {
            super();
            this.pos = new Laya.Vector3(310, 500, 0);
            this._translate = new Laya.Vector3(0, 0, 0);
            this._translateW = new Laya.Vector3(0, 0, -0.2);
            this._translateS = new Laya.Vector3(0, 0, 0.2);
            this._translateA = new Laya.Vector3(-0.2, 0, 0);
            this._translateD = new Laya.Vector3(0.2, 0, 0);
            this.dialog = new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/secne.jpg");
            Laya.stage.addChild(this.dialog);
            this.s_scene = new Laya.Scene3D();
            var camera = new Laya.Camera(0, 0.1, 1000);
            this.s_scene.addChild(camera);
            camera.transform.rotate(new Laya.Vector3(-45, 0, 0), false, false);
            camera.transform.translate(new Laya.Vector3(5, -10, 1));
            camera.orthographic = true;
            camera.orthographicVerticalSize = 10;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            Laya.Sprite3D.load(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (layaMonkey) {
                this.AutoSetScene3d(this.s_scene);
                this.s_scene.addChild(layaMonkey);
                this._layaMonkey = layaMonkey;
                layaMonkey.transform.localScale = new Laya.Vector3(0.3, 0.3, 0.3);
                camera.convertScreenCoordToOrthographicCoord(this.pos, this._translate);
                layaMonkey.transform.position = this._translate;
                layaMonkey.transform.rotationEuler = new Laya.Vector3(-30, 0, 0);
                Laya.timer.frameLoop(1, this, this.onKeyDown);
            }));
        }
        onKeyDown() {
            Laya.KeyBoardManager.hasKeyDown(87) && this._layaMonkey.transform.translate(this._translateW);
            Laya.KeyBoardManager.hasKeyDown(83) && this._layaMonkey.transform.translate(this._translateS);
            Laya.KeyBoardManager.hasKeyDown(65) && this._layaMonkey.transform.translate(this._translateA);
            Laya.KeyBoardManager.hasKeyDown(68) && this._layaMonkey.transform.translate(this._translateD);
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

    class Secne3DPlayer2D extends SingletonScene {
        constructor() {
            super();
            this._position = new Laya.Vector3();
            this._outPos = new Laya.Vector4();
            this.scaleDelta = 0;
            this.s_scene = new Laya.Scene3D();
            this.camera = new Laya.Camera(0, 0.1, 100);
            this.s_scene.addChild(this.camera);
            this.camera.transform.translate(new Laya.Vector3(0, 0.35, 1));
            this.camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = new Laya.DirectionLight();
            this.s_scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            Laya.loader.create(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh", Laya.Handler.create(this, this.onComplete));
        }
        onComplete() {
            this.AutoSetScene3d(this.s_scene);
            var grid = this.s_scene.addChild(Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
            this.layaMonkey2D = Laya.stage.addChild(new Laya.Image(GlobalConfig.ResPath + "res/threeDimen/monkey.png"));
            Laya.timer.frameLoop(1, this, this.animate);
        }
        animate() {
            this._position.x = Math.sin(this.scaleDelta += 0.01);
            this.camera.viewport.project(this._position, this.camera.projectionViewMatrix, this._outPos);
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

    class AdvanceMain extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "返回主页",
                "Laya3D与网页混合", "寻路导航", "2D场景+3D人物", "2D人物+3D场景", "3D文字纹理",
                "视频纹理", "毛玻璃", "轮廓", "Instance渲染", "草地",
                "反射探针", "相机深度模式纹理展示", "次表面散射"
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
                    Laya3DCombineHtml.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    AStarFindPath.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    Scene2DPlayer3D.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    Secne3DPlayer2D.getInstance().Click();
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
                case this.btnNameArr[10]:
                    break;
                case this.btnNameArr[11]:
                    break;
                case this.btnNameArr[12]:
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
                    Physics3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[11]:
                    CannonPhysics3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[12]:
                    MouseInteractionMain.getInstance().Show();
                    break;
                case this.btnNameArr[13]:
                    ScriptMain.getInstance().Show();
                    break;
                case this.btnNameArr[14]:
                    SkyMain.getInstance().Show();
                    break;
                case this.btnNameArr[15]:
                    Particle3DMain.getInstance().Show();
                    break;
                case this.btnNameArr[16]:
                    TrailMain.getInstance().Show();
                    break;
                case this.btnNameArr[17]:
                    ShaderMain.getInstance().Show();
                    break;
                case this.btnNameArr[18]:
                    PerformanceMain.getInstance().Show();
                    break;
                case this.btnNameArr[19]:
                    AdvanceMain.getInstance().Show();
                    break;
                case this.btnNameArr[20]:
                    DemoMain.getInstance().Show();
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
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
        Load() {
            LayaMain3d.getInstance().LoadExamples();
        }
    }
    new Main().Load();

}());
//# sourceMappingURL=bundle.js.map
