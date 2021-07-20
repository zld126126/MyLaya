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

    var GlobalConfig;
    (function (GlobalConfig) {
        GlobalConfig.ResPath = "https://layaair.ldc.layabox.com/demo2/h5/";
    })(GlobalConfig || (GlobalConfig = {}));

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
        MouseDown(e) {
            this.camera.transform.localRotation.getYawPitchRoll(this.yawPitchRoll);
            this.lastMouseX = Laya.stage.mouseX;
            this.lastMouseY = Laya.stage.mouseY;
            this.isMouseDown = true;
            console.log("dowm");
        }
        mouseUp(e) {
            this.isMouseDown = false;
            console.log("up");
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

    class J3_BlinnPhone extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J3_BlinnPhoneShader");
        }
        static initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
            };
            let VS = `

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;

            void main()
            {
                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_LightBuffer;

            void main()
            {   
                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 0.1;
                float gloss = 1.0;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J3_BlinnPhoneShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J3_DiffBlinnPhone extends Laya.Material {
        static initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
            };
            let VS = `

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;

            void main()
            {
                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                float ln = max (0.0, dot (-lightVec,v_Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
                vec3 diffuse = diffuseColor * lightColor * ln;

                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 0.1;
                float gloss = 0.2;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular + diffuse, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J3_DiffBlinnPhoneShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
        constructor() {
            super();
            this.setShaderName("J3_DiffBlinnPhoneShader");
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

    class J3_BlinnPhone_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J3_BlinnPhone.initShader();
            J3_DiffBlinnPhone.initShader();
            var scene = new Laya.Scene3D();
            scene.ambientColor = new Laya.Vector3(0.2, 0.1, 0.2);
            var camera = new Laya.Camera(0, 0.1, 100);
            scene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 2, 4));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            var directionLight = new Laya.DirectionLight();
            scene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, 0));
            var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
            scene.addChild(Capsule);
            Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
            var J3_DiffBlinnPhoneMat = new J3_DiffBlinnPhone();
            Capsule.meshRenderer.material = J3_DiffBlinnPhoneMat;
            this.AutoSetScene3d(scene);
            Laya.timer.frameLoop(1, this, function () { Capsule.transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
        }
    }

    class J4_DiffuseTexture extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J4_DiffuseTextureShader");
            this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
        }
        static __init__() {
            J4_DiffuseTexture.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
            J4_DiffuseTexture.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        static __initDefine__() {
            J4_DiffuseTexture.SHADERDEFINE_LEGACYSINGALLIGHTING = Laya.Shader3D.getDefineByName("LEGACYSINGLELIGHTING");
            J4_DiffuseTexture.SHADERDEFINE_MAINTEXTURE = Laya.Shader3D.getDefineByName("MAINTEXTURE");
            J4_DiffuseTexture.SHADERDEFINE_TILINGOFFSET = Laya.Shader3D.getDefineByName("TILINGOFFSET");
            J4_DiffuseTexture.SHADERDEFINE_ADDTIVEFOG = Laya.Shader3D.getDefineByName("ADDTIVEFOG");
        }
        get DiffuseTexture() {
            return this._shaderValues.getTexture(J4_DiffuseTexture.DiffuseTexture);
        }
        set DiffuseTexture(value) {
            this._shaderValues.setTexture(J4_DiffuseTexture.DiffuseTexture, value);
        }
        get TilingOffset() { return this._shaderValues.getVector(J4_DiffuseTexture.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J4_DiffuseTexture.TilingOffset, value); }
        static initShader() {
            J4_DiffuseTexture.__init__();
            J4_DiffuseTexture.__initDefine__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            void main()
            {
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            uniform vec3 u_AmbientColor;   //环境光
            uniform sampler2D u_DiffuseTexture;
            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 Normal = normalize(v_Normal);

                float ln = max (0.0, dot (-lightVec,Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_DiffuseTexture, v_Texcoord0);
                vec3 diffuse = difTex.rgb * diffuseColor * lightColor * ln;
        
                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 1.0;
                float gloss = 1.0;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,Normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular + diffuse, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J4_DiffuseTextureShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J4_DiffuseTexture_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J4_DiffuseTexture.initShader();
            this.s_scene = new Laya.Scene3D();
            this.s_scene.ambientColor = new Laya.Vector3(0.1, 0.1, 0.1);
            var camera = new Laya.Camera(0, 0.1, 100);
            camera.transform.translate(new Laya.Vector3(0, 2, 4));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            camera.addComponent(CameraMoveScript);
            this.s_scene.addChild(camera);
            var directionLight = new Laya.DirectionLight();
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -2));
            this.s_scene.addChild(directionLight);
            var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
            Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
            this.s_scene.addChild(Capsule);
            var material = new J4_DiffuseTexture();
            Capsule.meshRenderer.material = material;
            Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function (tex) {
                material.DiffuseTexture = tex;
                console.log(tex);
                this.AutoSetScene3d(this.s_scene);
            }));
            material.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
        }
    }

    class J3_DiffusePixe extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J3_DiffusePixeShader");
        }
        static initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
            };
            let VS = `

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;

            varying vec3 v_Normal;

            void main()
            {
                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = normalize(worldMat*a_Normal);

                gl_Position = u_MvpMatrix * a_Position;
            } `;
            let FS = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            //加载lighting库
            #include "Lighting.glsl";

            varying vec3 v_Normal;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                float ln = max (0.0, dot (-lightVec,v_Normal));  //兰伯特
                ln = ln*0.5 + 0.5; //半兰伯特

                vec3 diffuseColor = vec3(0.5, 0.5, 0.5);

                vec3 Color = diffuseColor * lightColor * ln;

                gl_FragColor = vec4(Color,1.0);

            }`;
            var customShader = Laya.Shader3D.add("J3_DiffusePixeShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J3_DiffuseVertex extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J3_DiffuseVertexShader");
        }
        static initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;

            //声明传递给片元着色器的变量
            varying vec3 v_VertexColor;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                mat3 worldMat = mat3(u_WorldMat);       //转成三维矩阵

                vec3 normal = normalize(worldMat*a_Normal);  //物体空间法线转化成世界空间，且归一化


                //漫反射计算公式
                float ln = max (0.0, dot (-lightVec,normal));

                v_VertexColor = lightColor * ln;

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            //接收顶点着色器的变量
            varying vec3 v_VertexColor;

            void main()
            {                    
                gl_FragColor = vec4(v_VertexColor,1.0);
            }`;
            var customShader = Laya.Shader3D.add("J3_DiffuseVertexShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J3_DiffusePixe_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J3_DiffusePixe.initShader();
            J3_DiffuseVertex.initShader();
            var scene = new Laya.Scene3D();
            scene.ambientColor = new Laya.Vector3(0.2, 0.1, 0.2);
            var camera = new Laya.Camera(0, 0.1, 100);
            camera.transform.translate(new Laya.Vector3(0, 2, 4));
            camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
            var directionLight = new Laya.DirectionLight();
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-1, -1, -2));
            var Capsule = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(0.5, 2, 15, 25));
            Capsule.transform.position = new Laya.Vector3(0, 0.0, 1);
            scene.addChild(camera);
            scene.addChild(directionLight);
            scene.addChild(Capsule);
            this.AutoSetScene3d(scene);
            var J3_DiffuseVertexMat = new J3_DiffuseVertex();
            Capsule.meshRenderer.material = J3_DiffuseVertexMat;
        }
    }

    class J4_NormalTexture extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J4_NormalTextureShader");
            this.TilingOffset = new Laya.Vector4(3.0, 3.0, 0.0, 0.0);
        }
        static __init__() {
            J4_NormalTexture.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
            J4_NormalTexture.NORMALTEXTURE = Laya.Shader3D.propertyNameToID("u_NormalMap");
            J4_NormalTexture.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        get DiffuseTexture() { return this._shaderValues.getTexture(J4_NormalTexture.DiffuseTexture); }
        set DiffuseTexture(value) { this._shaderValues.setTexture(J4_NormalTexture.DiffuseTexture, value); }
        get normalTexture() { return this._shaderValues.getTexture(J4_NormalTexture.NORMALTEXTURE); }
        set normalTexture(value) { this._shaderValues.setTexture(J4_NormalTexture.NORMALTEXTURE, value); }
        get TilingOffset() { return this._shaderValues.getVector(J4_NormalTexture.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J4_NormalTexture.TilingOffset, value); }
        static initShader() {
            J4_NormalTexture.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_NormalMap': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;
            attribute vec4 a_Tangent0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying vec3 v_Tangent;
            varying vec3 v_Binormal;

            void main()
            {
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                v_Tangent = a_Tangent0.xyz * worldMat;
                v_Binormal = cross(v_Normal,v_Tangent) * a_Tangent0.w;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying vec3 v_Tangent;
            varying vec3 v_Binormal;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_DiffuseTexture;
            uniform sampler2D u_NormalMap;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                vec3 normalMap = texture2D(u_NormalMap, v_Texcoord0).rgb;
                normalMap.xy *= 1.0;

                normalMap = normalize(NormalSampleToWorldSpace(normalMap, normal, v_Tangent,v_Binormal));
                
                float ln = max (0.0, dot (-lightVec,normalMap));  
                ln = ln*0.5 + 0.5; 

                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);
                vec4 difTex = texture2D(u_DiffuseTexture, v_Texcoord0);
                vec3 diffuse = difTex.rgb * diffuseColor * lightColor * ln;
        
                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 2.0;
                float gloss = 1.0;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h, normalMap));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular + diffuse, 1.0);
                //gl_FragColor = vec4(difTex.rgb, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J4_NormalTextureShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J4_NormalTexture_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J4_NormalTexture.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var material = new J4_NormalTexture();
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = material;
                scene.getChildAt(2).meshRenderer.material = material;
                Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function (tex) {
                    material.DiffuseTexture = tex;
                    console.log(tex);
                }));
                Laya.Texture2D.load("res/textures/Wall02_Normal.png", Laya.Handler.create(this, function (tex) {
                    material.normalTexture = tex;
                    console.log(tex);
                }));
                material.TilingOffset = new Laya.Vector4(2.0, 1.0, 0.0, 0.0);
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
            }));
        }
    }

    class J5_AlphaBlending extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J5_AlphaBlendingShader");
            this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
        }
        static __init__() {
            J5_AlphaBlending.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
            J5_AlphaBlending.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        get DiffuseTexture() { return this._shaderValues.getTexture(J5_AlphaBlending.DiffuseTexture); }
        set DiffuseTexture(value) { this._shaderValues.setTexture(J5_AlphaBlending.DiffuseTexture, value); }
        get TilingOffset() { return this._shaderValues.getVector(J5_AlphaBlending.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J5_AlphaBlending.TilingOffset, value); }
        static initShader() {
            J5_AlphaBlending.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec2 v_Texcoord0;

            void main()
            {
                
                v_Texcoord0=a_Texcoord0;
                //v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);
                v_Normal = mat3(u_WorldMat) * a_Normal;
                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec2 v_Texcoord0;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_DiffuseTexture;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 normal = normalize(v_Normal);

                float ln = dot (lightVec,normal);  
                ln = ln*0.5 + 0.5; 

                vec4 diffuse = texture2D(u_DiffuseTexture, v_Texcoord0);

                if(diffuse.a < 0.4) discard;

                gl_FragColor = vec4(diffuse);
                //gl_FragColor = vec4(diffuse.rgb, 1.0);

            }`;
            var custom = Laya.Shader3D.add("J5_AlphaBlendingShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            custom.addSubShader(subShader);
            var ShaderPass = subShader.addShaderPass(VS, FS);
            ShaderPass.renderState.cull = 2;
            ShaderPass.renderState.blend = 1;
            ShaderPass.renderState.srcBlend = 770;
            ShaderPass.renderState.dstBlend = 771;
            ShaderPass.renderState.depthWrite = false;
            ShaderPass.renderState.depthTest = 515;
        }
    }

    class J5_AlphaBlending_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J4_NormalTexture.initShader();
            J5_AlphaBlending.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var material = new J4_NormalTexture();
                var alphaBlendMat = new J5_AlphaBlending();
                alphaBlendMat.renderQueue = 3000;
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = alphaBlendMat;
                scene.getChildAt(1).getChildAt(1).active = true;
                scene.getChildAt(2).meshRenderer.material = material;
                Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function (tex) {
                    material.DiffuseTexture = tex;
                    console.log(tex);
                }));
                Laya.Texture2D.load("res/textures/Wall02_Normal.png", Laya.Handler.create(this, function (tex) {
                    material.normalTexture = tex;
                    console.log(tex);
                }));
                material.TilingOffset = new Laya.Vector4(2.0, 1.0, 0.0, 0.0);
                Laya.Texture2D.load("res/textures/transparentTex.png", Laya.Handler.create(this, function (tex) {
                    alphaBlendMat.DiffuseTexture = tex;
                    console.log(tex);
                }));
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
            }));
        }
    }

    class J6_LightMap extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J4_LightMapShader");
        }
        static __init__() {
            J6_LightMap.LightMap = Laya.Shader3D.propertyNameToID("u_LightMap");
            J6_LightMap.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
        }
        get LightMap() { return this._shaderValues.getTexture(J6_LightMap.LightMap); }
        set LightMap(value) { this._shaderValues.setTexture(J6_LightMap.LightMap, value); }
        get DiffuseTexture() { return this._shaderValues.getTexture(J6_LightMap.DiffuseTexture); }
        set DiffuseTexture(value) { this._shaderValues.setTexture(J6_LightMap.DiffuseTexture, value); }
        static initShader() {
            J6_LightMap.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_Texcoord1': Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
                'u_LightmapScaleOffset': Laya.Shader3D.PERIOD_SPRITE,
                'u_LightMap': Laya.Shader3D.PERIOD_SPRITE,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;
            attribute vec2 a_Texcoord1;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            varying vec2 v_LightMapUV;

            void main()
            {
                v_Texcoord0 = a_Texcoord0;

                v_LightMapUV = a_Texcoord1;

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying vec2 v_LightMapUV;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_DiffuseTexture;
            uniform sampler2D u_LightMap;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                float ln = max (0.0, dot (lightVec,v_Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_DiffuseTexture, v_Texcoord0);
                vec4 LightMap = texture2D(u_DiffuseTexture, v_LightMapUV);

                vec3 diffuse = difTex.rgb * diffuseColor * lightColor * ln;
        
                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 0.1;
                float gloss = 0.2;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(LightMap.rgb, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J4_LightMapShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J6_LightMap_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J6_LightMap.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var LightMapMat01 = new J6_LightMap();
                var LightMapMat02 = new J6_LightMap();
                console.log(scene.getChildAt(2));
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = LightMapMat01;
                scene.getChildAt(2).meshRenderer.material = LightMapMat02;
                Laya.Texture2D.load("res/models/lightMap/Assets/A-mesh/lightMap/Lightmap-1_comp_light.png", Laya.Handler.create(this, function (tex) {
                    LightMapMat01.DiffuseTexture = tex;
                    console.log(tex);
                }));
                Laya.Texture2D.load("res/models/lightMap/Assets/A-mesh/lightMap/Lightmap-0_comp_light.png", Laya.Handler.create(this, function (tex) {
                    LightMapMat02.DiffuseTexture = tex;
                    console.log(tex);
                }));
            }));
        }
    }

    class J6_shadow_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            window['J6_shadow_initShader']();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                directionLight.shadow = true;
                directionLight.shadowDistance = 10;
                directionLight.shadowResolution = 4096;
                directionLight.shadowPSSMCount = 1;
                directionLight.shadowPCFType = 3;
                var shadowMat01 = new window['NewJ6_shadow']();
                var shadowMat02 = new window['NewJ6_shadow']();
                console.log(scene.getChildAt(2));
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = shadowMat01;
                scene.getChildAt(1).getChildAt(0).meshRenderer.castShadow = true;
                scene.getChildAt(1).getChildAt(0).meshRenderer.receiveShadow = true;
                scene.getChildAt(2).meshRenderer.material = shadowMat02;
                scene.getChildAt(2).meshRenderer.receiveShadow = true;
                Laya.Texture2D.load("res/textures/Wall02_Diffuse.png", Laya.Handler.create(this, function (tex) {
                    shadowMat01.DiffuseTexture = tex;
                    shadowMat02.DiffuseTexture = tex;
                    console.log(tex);
                }));
            }));
        }
    }

    class J7_AnimUV extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J7_AnimUVShader");
            this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
        }
        get DiffuseTexture() { return this._shaderValues.getTexture(J7_AnimUV.DiffuseTexture); }
        set DiffuseTexture(value) { this._shaderValues.setTexture(J7_AnimUV.DiffuseTexture, value); }
        get TilingOffset() { return this._shaderValues.getVector(J7_AnimUV.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J7_AnimUV.TilingOffset, value); }
        static initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
                'u_Time': Laya.Shader3D.PERIOD_SCENE,
                'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;
            attribute vec4 a_MvpMatrix;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;
            uniform float u_Time;
            uniform mat4 u_ViewProjection;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying float v_Frequency;

            void main()
            {
                //Frequency频率
                v_Frequency = (u_Time * 0.05);
                v_Texcoord0 = a_Texcoord0;

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec4 Position = a_Position;

                //Magnitude 振幅
                float _Magnitude = 0.00051;

                //WaveLen 波长
                float _WaveLen = 300.0;

                Position.y += sin(u_Time*2.0 + Position.x*_WaveLen + Position.y*_WaveLen)*_Magnitude;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec2 v_Texcoord0;
            varying float v_Frequency;
            
            uniform sampler2D u_DiffuseTexture;

            void main()
            {
                vec3 diffuseColor = vec3(0.4, 0.4, 0.6);
                vec3 diffuseColor2 = vec3(0.4, 0.6, 0.4);

                vec2 Tiling = v_Texcoord0 * 2.0;

                //UV纹理动画
                //vec3 diffuse = texture2D(u_DiffuseTexture, Tiling + v_Frequency).rgb;

                vec2 rimPanningU = (Tiling + v_Frequency * vec2(1.1,0));
                vec2 rimPanningV = (Tiling + v_Frequency * vec2(0,0.8));

                float rimTexRU = texture2D(u_DiffuseTexture, rimPanningU).r;
                float rimTexRV = texture2D(u_DiffuseTexture, rimPanningV).r;

                float rimTexBU = texture2D(u_DiffuseTexture, rimPanningU).g;
                float rimTexBV = texture2D(u_DiffuseTexture, rimPanningV).g;

                float rimTexR = 1.0 - (rimTexRU - rimTexRV); 
                float rimTexB = 1.0 - (rimTexBU - rimTexBV); 

                vec3 diffuse = diffuseColor * rimTexR*0.5 + diffuseColor2 * rimTexB*0.5;
        
                gl_FragColor = vec4(diffuse, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J7_AnimUVShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }
    J7_AnimUV.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
    J7_AnimUV.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");

    class J7_AnimUV_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J7_AnimUV.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var material = new J7_AnimUV();
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = material;
                scene.getChildAt(2).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(0).meshRenderer.enable = false;
                scene.getChildAt(1).getChildAt(1).meshRenderer.enable = false;
                Laya.Texture2D.load("res/textures/water_normal.jpg", Laya.Handler.create(this, function (tex) {
                    material.DiffuseTexture = tex;
                    console.log(tex);
                }));
                material.TilingOffset = new Laya.Vector4(2.0, 1.0, 0.0, 0.0);
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
            }));
        }
    }

    class J8_MatCap extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J8_MatCapShader");
            this.TilingOffset = new Laya.Vector4(3.0, 3.0, 0.0, 0.0);
        }
        get MatCapTexture() { return this._shaderValues.getTexture(J8_MatCap.MatCapTexture); }
        set MatCapTexture(value) { this._shaderValues.setTexture(J8_MatCap.MatCapTexture, value); }
        get TilingOffset() { return this._shaderValues.getVector(J8_MatCap.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J8_MatCap.TilingOffset, value); }
        static __init__() {
            J8_MatCap.MatCapTexture = Laya.Shader3D.propertyNameToID("u_MatCapTexture");
            J8_MatCap.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        static initShader() {
            J8_MatCap.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_MatCapTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            };
            var LightSh = Laya.Shader3D.add("J8_MatCapShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            let VS = `
        #include "Lighting.glsl";

        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        attribute vec2 a_Texcoord0;

        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        uniform vec3 u_CameraPos;
        uniform vec4 u_TilingOffset;

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        void main()
        {
            v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

            mat3 worldMat = mat3(u_WorldMat);
            v_Normal = worldMat * a_Normal;

            vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
            v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

            ModelViewMatrix = inverse(mat3(u_MvpMatrix)); //逆转置矩阵

            gl_Position = u_MvpMatrix * a_Position;

        } `;
            let FS = `

        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        
        #include "Lighting.glsl";

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        uniform vec3 u_AmbientColor;   //环境光

        uniform sampler2D u_MatCapTexture;

        void main()
        {   
            vec3 ViewDir = normalize(v_ViewDir);
            vec3 normal = normalize(v_Normal);

            vec3 ViewNormal = vec3( dot(normal, normalize(ModelViewMatrix[0])), dot(normal, normalize(ModelViewMatrix[1])), 1.0);
            //vec2 matCapUV = ViewNormal.xy*0.5+0.5;  //从[-1,1]映射到[0,1]

            vec3 r = reflect(ViewDir, ViewNormal);
            float m = 2.0 * sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
            vec2 matCapUV = r.xy/m + 0.5;

            vec3 MatCapDiffuse = texture2D(u_MatCapTexture, matCapUV).rgb;

            vec4 difTex = texture2D(u_MatCapTexture, v_Texcoord0);

            gl_FragColor = vec4(MatCapDiffuse.rgb, 1.0);

        }`;
            subShader.addShaderPass(VS, FS);
        }
    }

    class J8_MatCapAudi extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J8_MatCapAudiShader");
            this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
            this.MainColor = new Laya.Vector3(0.5, 0.5, 0.5);
        }
        get MatCapTexture() { return this._shaderValues.getTexture(J8_MatCapAudi.MatCapTexture); }
        set MatCapTexture(value) { this._shaderValues.setTexture(J8_MatCapAudi.MatCapTexture, value); }
        get OccMap() { return this._shaderValues.getTexture(J8_MatCapAudi.OccMap); }
        set OccMap(value) { this._shaderValues.setTexture(J8_MatCapAudi.OccMap, value); }
        get MainColor() { return this._shaderValues.getVector(J8_MatCapAudi.MainColor); }
        set MainColor(value) { this._shaderValues.setVector(J8_MatCapAudi.MainColor, value); }
        get TilingOffset() { return this._shaderValues.getVector(J8_MatCapAudi.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J8_MatCapAudi.TilingOffset, value); }
        static __init__() {
            J8_MatCapAudi.MatCapTexture = Laya.Shader3D.propertyNameToID("u_MatCapTexture");
            J8_MatCapAudi.OccMap = Laya.Shader3D.propertyNameToID("u_OccMap");
            J8_MatCapAudi.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
            J8_MatCapAudi.MainColor = Laya.Shader3D.propertyNameToID("u_MainColor");
        }
        static initShader() {
            J8_MatCapAudi.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_OccMap': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MatCapTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
                'u_MainColor': Laya.Shader3D.PERIOD_MATERIAL,
            };
            var LightSh = Laya.Shader3D.add("J8_MatCapAudiShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            let VS = `
        #include "Lighting.glsl";

        attribute vec4 a_Position;
        attribute vec3 a_Normal;
        attribute vec2 a_Texcoord0;

        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        uniform vec3 u_CameraPos;
        uniform vec4 u_TilingOffset;

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        void main()
        {
            v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

            mat3 worldMat = mat3(u_WorldMat);
            v_Normal = worldMat * a_Normal;

            vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
            v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

            ModelViewMatrix = inverse(mat3(u_MvpMatrix)); //逆转置矩阵

            gl_Position = u_MvpMatrix * a_Position;

        } `;
            let FS = `

        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        
        #include "Lighting.glsl";

        varying vec3 v_Normal;
        varying vec3 v_ViewDir;
        varying vec2 v_Texcoord0;
        varying mat3 ModelViewMatrix;

        uniform vec3 u_AmbientColor;   //环境光
        uniform vec3 u_MainColor;

        uniform sampler2D u_MatCapTexture;
        uniform sampler2D u_OccMap;

        void main()
        {   
            vec3 ViewDir = normalize(v_ViewDir);
            vec3 normal = normalize(v_Normal);

            vec3 ViewNormal = vec3( dot(normal, normalize(ModelViewMatrix[0])), dot(normal, normalize(ModelViewMatrix[1])), 1.0);
            //vec2 matCapUV = ViewNormal.xy*0.5+0.5;  //从[-1,1]映射到[0,1]

            vec3 r = reflect(ViewDir, ViewNormal);
            float m = 2.0 * sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
            vec2 matCapUV = r.xy/m + 0.5;

            vec3 MatCap = texture2D(u_MatCapTexture, matCapUV).rgb;
            vec3 OccMap= texture2D(u_OccMap, v_Texcoord0).rgb;
            vec3 color = vec3(u_MainColor + OccMap *MatCap);

            gl_FragColor = vec4(color, 1.0);

        }`;
            var ShaderPass = subShader.addShaderPass(VS, FS);
            ShaderPass.renderState.cull = 2;
            ShaderPass.renderState.depthWrite = true;
            ShaderPass.renderState.depthTest = 515;
        }
    }

    class J8_MatCap_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J8_MatCap.initShader();
            J8_MatCapAudi.initShader();
            J3_DiffusePixe.initShader();
            J4_DiffuseTexture.initShader();
            Laya.Scene3D.load("res/models/Audi_A4/audiA4.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var bodyMaterial = new J8_MatCapAudi();
                var CarBase = new J3_DiffusePixe();
                var CarFaceMat = new J8_MatCapAudi();
                var CarLineMat = new J8_MatCapAudi();
                var CarGlassMat = new J8_MatCapAudi();
                var CarLunGuMat = new J8_MatCapAudi();
                var CarLunTaiMat = new J8_MatCapAudi();
                var CarTaillight = new J8_MatCapAudi();
                var ZhongKuMat = new J4_DiffuseTexture();
                var DiZuoMat = new J4_DiffuseTexture();
                var groundMat = new J4_DiffuseTexture();
                var windowMat = new J8_MatCapAudi();
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = groundMat;
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/ground_shadow.jpg", Laya.Handler.create(this, function (tex) { groundMat.DiffuseTexture = tex; }));
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = bodyMaterial;
                Laya.Texture2D.load("res/textures/MatCap/matcap029_B.jpg", Laya.Handler.create(this, function (tex) { bodyMaterial.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/CarBody.png", Laya.Handler.create(this, function (tex) { bodyMaterial.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(2).meshRenderer.material = CarFaceMat;
                CarFaceMat.MainColor = new Laya.Vector3(0.1, 0.1, 0.1);
                Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarFaceMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/carFace.jpg", Laya.Handler.create(this, function (tex) { CarFaceMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(3).meshRenderer.material = CarLineMat;
                scene.getChildAt(1).getChildAt(4).meshRenderer.material = CarLineMat;
                scene.getChildAt(1).getChildAt(5).meshRenderer.material = CarLineMat;
                CarLineMat.MainColor = new Laya.Vector3(0.15, 0.15, 0.15);
                Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarLineMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/carline.jpg", Laya.Handler.create(this, function (tex) { CarLineMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(6).meshRenderer.material = DiZuoMat;
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/diZuo.png", Laya.Handler.create(this, function (tex) { DiZuoMat.DiffuseTexture = tex; }));
                scene.getChildAt(1).getChildAt(7).meshRenderer.material = CarGlassMat;
                CarGlassMat.MainColor = new Laya.Vector3(0.0, 0.0, 0.0);
                Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarGlassMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { CarGlassMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(8).meshRenderer.material = CarLunGuMat;
                scene.getChildAt(1).getChildAt(9).meshRenderer.material = CarLunGuMat;
                scene.getChildAt(1).getChildAt(10).meshRenderer.material = CarLunGuMat;
                scene.getChildAt(1).getChildAt(11).meshRenderer.material = CarLunGuMat;
                CarLunGuMat.MainColor = new Laya.Vector3(0.15, 0.15, 0.15);
                Laya.Texture2D.load("res/textures/MatCap/matcap018.jpg", Laya.Handler.create(this, function (tex) { CarLunGuMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/lungu.png", Laya.Handler.create(this, function (tex) { CarLunGuMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(12).meshRenderer.material = CarLunTaiMat;
                CarLunTaiMat.MainColor = new Laya.Vector3(0.1, 0.1, 0.1);
                Laya.Texture2D.load("res/textures/MatCap/matcap020.jpg", Laya.Handler.create(this, function (tex) { CarLunTaiMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/lunTai.png", Laya.Handler.create(this, function (tex) { CarLunTaiMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(13).meshRenderer.material = CarTaillight;
                CarTaillight.MainColor = new Laya.Vector3(0.6, 0.1, 0.1);
                Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarTaillight.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { CarTaillight.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(14).meshRenderer.material = windowMat;
                windowMat.MainColor = new Laya.Vector3(0.0, 0.0, 0.0);
                Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { windowMat.MatCapTexture = tex; }));
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { windowMat.OccMap = tex; }));
                scene.getChildAt(1).getChildAt(15).meshRenderer.material = ZhongKuMat;
                Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/CarID.jpg", Laya.Handler.create(this, function (tex) { ZhongKuMat.DiffuseTexture = tex; }));
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.002, 0), false); });
            }));
        }
    }

    class J8_Reflect extends Laya.Material {
        constructor() {
            super();
            this.setShaderName("J8_ReflectShader");
            this.TilingOffset = new Laya.Vector4(3.0, 3.0, 0.0, 0.0);
        }
        static __init__() {
            J8_Reflect.ReflectTexture = Laya.Shader3D.propertyNameToID("u_ReflectTexture");
            J8_Reflect.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
            J8_Reflect.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
        }
        get DiffuseTexture() { return this._shaderValues.getTexture(J8_Reflect.DiffuseTexture); }
        set DiffuseTexture(value) { this._shaderValues.setTexture(J8_Reflect.DiffuseTexture, value); }
        get ReflectTexture() { return this._shaderValues.getTexture(J8_Reflect.ReflectTexture); }
        set ReflectTexture(value) { this._shaderValues.setTexture(J8_Reflect.ReflectTexture, value); }
        get TilingOffset() { return this._shaderValues.getVector(J8_Reflect.TilingOffset); }
        set TilingOffset(value) { this._shaderValues.setVector(J8_Reflect.TilingOffset, value); }
        static initShader() {
            J8_Reflect.__init__();
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            };
            var uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
                'u_ReflectTexture': Laya.Shader3D.PERIOD_SCENE,
                'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            };
            let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying vec3 v_TexcoordCube;

            void main()
            {
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                v_TexcoordCube = vec3(-a_Position.x,a_Position.yz);//转换坐标系 

                gl_Position = u_MvpMatrix * a_Position;

            } `;
            let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying vec3 v_TexcoordCube;

            uniform vec3 u_AmbientColor;   //环境光
            uniform sampler2D u_DiffuseTexture;

            uniform sampler2D u_ReflectTexture;

            void main()
            {   
                //vec3 lightVec = normalize(u_DirectionLight.Direction);
                //vec3 lightColor = u_DirectionLight.Color;
                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                //float ln = max (0.0, dot (-lightVec,v_Normal));  
                //ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_ReflectTexture, v_Texcoord0);

                vec3 diffuse = difTex.rgb * diffuseColor;
        
                vec3 incident = -ViewDir;
                vec3 reflectionVector = reflect(incident, normal);

                vec3 reflectionColor = textureCube(u_ReflectTexture, vec3(-reflectionVector.x, reflectionVector.yz)).rgb;

                //vec3 reflectionColor = texture2D(u_DiffuseTexture, vec2(reflectionVector.xy)).rgb;

                gl_FragColor = vec4(reflectionColor, 1.0);

            }`;
            var LightSh = Laya.Shader3D.add("J8_ReflectShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap);
            LightSh.addSubShader(subShader);
            subShader.addShaderPass(VS, FS);
        }
    }

    class J8_Reflect_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J8_Reflect.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var material = new J8_Reflect();
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = material;
                scene.getChildAt(2).meshRenderer.material = material;
                material.ReflectTexture = scene.reflectionTexture;
                Laya.Texture2D.load("res/textures/MatCap/matcap017.jpg", Laya.Handler.create(this, function (tex) {
                    material.DiffuseTexture = tex;
                    console.log(tex);
                }));
                material.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(2).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
            }));
        }
    }

    class J9_PostProcess_Scene extends SingletonScene {
        constructor() {
            super();
            this.init();
        }
        init() {
            J8_MatCap.initShader();
            Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function (scene) {
                this.AutoSetScene3d(scene);
                scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
                console.log(scene);
                var camera = scene.getChildByName("Camera");
                var postProcess = new Laya.PostProcess();
                console.log(postProcess);
                var bloom = new Laya.BloomEffect();
                postProcess.addEffect(bloom);
                camera.postProcess = postProcess;
                camera.enableHDR = true;
                bloom.intensity = 5.0;
                bloom.threshold = 0.90;
                bloom.softKnee = 0.5;
                bloom.clamp = 65472.0;
                bloom.diffusion = 5.0;
                bloom.anamorphicRatio = 0.0;
                bloom.color = new Laya.Color(1.0, 1.0, 1.0, 1.0);
                bloom.fastMode = true;
                Laya.Texture2D.load("res/textures/LensDirt01.png", Laya.Handler.create(this, function (tex) {
                    bloom.dirtTexture = tex;
                    bloom.dirtIntensity = 4.0;
                }));
                var directionLight = scene.addChild(new Laya.DirectionLight());
                directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
                directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));
                var material = new J8_MatCap();
                scene.getChildAt(1).getChildAt(0).meshRenderer.material = material;
                scene.getChildAt(1).getChildAt(1).meshRenderer.material = material;
                scene.getChildAt(2).meshRenderer.material = material;
                Laya.Texture2D.load("res/textures/MatCap/matcap017.jpg", Laya.Handler.create(this, function (tex) {
                    material.MatCapTexture = tex;
                    console.log(tex);
                }));
                material.TilingOffset = new Laya.Vector4(2.0, 2.0, 0.0, 0.0);
                Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false); });
            }));
        }
    }

    class LayaMainShader extends SingletonMainScene {
        constructor() {
            super();
            this.btnNameArr = [
                "BlinnPhone", "DiffusePixe", "DiffuseTexture", "NormalTexture", "AlphaBlending",
                "LightMap", "Shadow", "AnimUV", "MatCap", "Reflect",
                "PostProcess"
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
                    J3_BlinnPhone_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[1]:
                    J3_DiffusePixe_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[2]:
                    J4_DiffuseTexture_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[3]:
                    J4_NormalTexture_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[4]:
                    J5_AlphaBlending_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[5]:
                    J6_LightMap_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[6]:
                    J6_shadow_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[7]:
                    J7_AnimUV_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[8]:
                    J8_MatCap_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[9]:
                    J8_Reflect_Scene.getInstance().Click();
                    break;
                case this.btnNameArr[10]:
                    J9_PostProcess_Scene.getInstance().Click();
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
            LayaMainShader.getInstance().LoadExamples();
        }
    }
    new Main().Load();

}());
//# sourceMappingURL=bundle.js.map
