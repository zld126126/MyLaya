import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";

export class LoadResourceDemo {
    private _scene: Laya.Scene3D;
    private sprite3D: Laya.Sprite3D;
    private pangzi: Laya.Sprite3D;
    private pangziAnimator: Laya.Animator;
    constructor() {
        this._scene = null;
        this.sprite3D = null;
        //初始化引擎
        Laya3D.init(0, 0);
        //Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        //Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        //显示性能面板
        Laya.Stat.show();

        //加载资源
        //this.LoadRes();

        //批量预加载方式
        this.PreloadingRes();
    }
    LoadRes() {
        //场景加载
        Laya.Scene3D.load(GlobalConfig.ResPath+"res/threeDimen/scene/XunLongShi/XunLongShi.ls", Laya.Handler.create(this, function (scene) {
            this._scene = scene;
            Laya.stage.addChild(this._scene);
            //添加相机
            var camera = new Laya.Camera();
            this._scene.addChild(camera);
            //设置相机清楚标记，使用天空
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
            //调整相机的位置
            camera.transform.translate(new Laya.Vector3(3, 20, 47));
            //相机视角控制组件(脚本)
            camera.addComponent(CameraMoveScript);
            //添加光照
            var directionLight = this._scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

            //材质加载
            Laya.BaseMaterial.load(GlobalConfig.ResPath+"res/threeDimen/skyBox/skyBox2/skyBox2.lmat", Laya.Handler.create(null, function (mat): void {
                //获取相机的天空渲染器
                var skyRenderer: Laya.SkyRenderer = camera.skyRenderer;
                //创建天空盒的mesh
                skyRenderer.mesh = Laya.SkyBox.instance;
                //设置天空盒材质
                skyRenderer.material = mat;
            }));

            (scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
            (scene.getChildByName('Scenes').getChildByName('Area')).active = false;

            //加载纹理
            Laya.Texture2D.load(GlobalConfig.ResPath+"res/threeDimen/texture/earth.png", Laya.Handler.create(null, function (tex): void {
                //使用纹理
                var earth1 = scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32))) as Laya.MeshSprite3D;
                earth1.transform.translate(new Laya.Vector3(17, 20, 0));

                var earthMat = new Laya.BlinnPhongMaterial();
                earthMat.albedoTexture = tex;
                earthMat.albedoIntensity = 1;
                earth1.meshRenderer.material = earthMat;
            }));

            //加载Mesh
            Laya.Mesh.load(GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm", Laya.Handler.create(this, function (mesh) {
                var layaMonkey = scene.addChild(new Laya.MeshSprite3D(mesh));
                layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
                layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
                layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));
            }));
            //加载精灵
            Laya.Sprite3D.load(GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", Laya.Handler.create(this, function (sp) {
                var layaMonkey2 = scene.addChild(sp);
                layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
                layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
            }));

            //加载胖子精灵
            Laya.Sprite3D.load(GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh", Laya.Handler.create(this, function (sp: Laya.Sprite3D): void {
                this.pangzi = scene.addChild(sp) as Laya.Sprite3D;
                this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
                this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
                //获取动画组件
                this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;

                Laya.AnimationClip.load(GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani", Laya.Handler.create(this, function (aniClip: Laya.AnimationClip): void {
                    //创建动作状态
                    var state1 = new Laya.AnimatorState();
                    //动作名称
                    state1.name = "hello";
                    //动作播放起始时间
                    state1.clipStart = 0 / 581;
                    //动作播放结束时间
                    state1.clipEnd = 581 / 581;
                    //设置动作
                    state1.clip = aniClip;
                    //设置动作循环
                    state1.clip.islooping = true;
                    //为动画组件添加一个动作状态
                    this.pangziAnimator.addState(state1);
                    //播放动作
                    this.pangziAnimator.play("hello");
                }));
            }));

        }));
    }
    //批量预加载方式
    PreloadingRes() {
        //预加载所有资源
        var resource = [
            GlobalConfig.ResPath+"res/threeDimen/scene/XunLongShi/XunLongShi.ls",
            GlobalConfig.ResPath+"res/threeDimen/skyBox/skyBox2/skyBox2.lmat",
            GlobalConfig.ResPath+"res/threeDimen/texture/earth.png",
            GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm",
            GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh",
            GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani"];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onPreLoadFinish));
    }
    onPreLoadFinish() {
        //初始化3D场景
        this._scene = Laya.stage.addChild(Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/scene/XunLongShi/XunLongShi.ls")) as Laya.Scene3D;

        //添加相机
        var camera = new Laya.Camera();
        this._scene.addChild(camera);
        //设置相机清楚标记，使用天空
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_SKY;
        //调整相机的位置
        camera.transform.translate(new Laya.Vector3(3, 20, 47));
        //相机视角控制组件(脚本)
        camera.addComponent(CameraMoveScript);

        //添加光照
        var directionLight = new Laya.DirectionLight();
        this._scene.addChild(directionLight);
        //光照颜色
        directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));

        //使用材质
        var skyboxMaterial = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/skyBox/skyBox2/skyBox2.lmat");
        var skyRenderer = camera.skyRenderer;
        skyRenderer.mesh = Laya.SkyBox.instance;
        skyRenderer.material = skyboxMaterial;

        //激活场景中的子节点
        (this._scene.getChildByName('Scenes').getChildByName('HeightMap')).active = false;
        (this._scene.getChildByName('Scenes').getChildByName('Area')).active = false;

        //使用纹理
        var earth1 = this._scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(5, 32, 32))) as Laya.MeshSprite3D;
        earth1.transform.translate(new Laya.Vector3(17, 20, 0));

        var earthMat = new Laya.BlinnPhongMaterial();
        earthMat.albedoTexture = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/texture/earth.png");
        earthMat.albedoIntensity = 1;
        earth1.meshRenderer.material = earthMat;

        //创建一个精灵
        this.sprite3D = new Laya.Sprite3D();
        this._scene.addChild(this.sprite3D);
        //获取Mesh资源
        var mesh = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/Assets/LayaMonkey/LayaMonkey-LayaMonkey.lm");
        //为精灵设置Mesh资源
        var layaMonkey = new Laya.MeshSprite3D(mesh);
        this.sprite3D.addChild(layaMonkey);
        layaMonkey.transform.localScale = new Laya.Vector3(4, 4, 4);
        layaMonkey.transform.rotation = new Laya.Quaternion(0.7071068, 0, 0, -0.7071067);
        layaMonkey.transform.translate(new Laya.Vector3(5, 3, 13));

        //使用精灵
        var sp = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
        var layaMonkey2 = this._scene.addChild(sp) as Laya.MeshSprite3D;
        layaMonkey2.transform.localScale = new Laya.Vector3(4, 4, 4);
        layaMonkey2.transform.translate(new Laya.Vector3(-10, 13, 0));
        //使用精灵
        this.pangzi = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/PangZiNoAni.lh");
        this._scene.addChild(this.pangzi);
        this.pangzi.transform.localScale = new Laya.Vector3(4, 4, 4);
        this.pangzi.transform.translate(new Laya.Vector3(-20, 13, 0));
        //获取动画组件
        this.pangziAnimator = this.pangzi.getChildAt(0).getComponent(Laya.Animator) as Laya.Animator;

        var pangAni = Laya.Loader.getRes(GlobalConfig.ResPath+"res/threeDimen/skinModel/BoneLinkScene/Assets/Model3D/PangZi-Take 001.lani") as Laya.AnimationClip;
        //创建动作状态
        var state1 = new Laya.AnimatorState();
        //动作名称
        state1.name = "hello";
        //动作播放起始时间
        state1.clipStart = 0 / 581;
        //动作播放结束时间
        state1.clipEnd = 581 / 581;
        //设置动作
        state1.clip = pangAni;
        //设置动作循环
        state1.clip.islooping = true;
        //为动画组件添加一个动作状态
        this.pangziAnimator.addState(state1);
        //播放动作
        this.pangziAnimator.play("hello");
    }
}