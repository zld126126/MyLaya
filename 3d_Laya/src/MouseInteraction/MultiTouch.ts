import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class MultiTouch extends SingletonScene {
    private text: Laya.Text;
    private infoText: Laya.Text;
    private _upVector3: Laya.Vector3 = new Laya.Vector3(0, 1, 0);

    constructor() {
        super();
        // Laya.alertGlobalError(true);
        this._upVector3 = new Laya.Vector3(0, 1, 0);
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;

        //预加载所有资源
        var resource = [GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"];
        Laya.loader.create(resource, Laya.Handler.create(this, this.onComplete));
    }
    onComplete() {
        //创建场景
        var scene = new Laya.Scene3D();
        this.AutoSetScene3d(scene);
        //创建相机
        var camera = new Laya.Camera(0, 0.1, 100);
        scene.addChild(camera);
        //设置相机的名称
        camera.name = "camera";
        //相机平移位置
        camera.transform.translate(new Laya.Vector3(0, 0.8, 1.5));
        //旋转相机
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);

        //创建平行光
        var directionLight = new Laya.DirectionLight();
        scene.addChild(directionLight);
        //设置平行光颜色
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);

        //加载小猴子精灵
        var monkey = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh");
        //猴子精灵添加组件（脚本）
        monkey.addComponent(MonkeyScript);
        scene.addChild(monkey);
        //设置相机的观察目标为小猴子
        camera.transform.lookAt(monkey.transform.position, new Laya.Vector3(0, 1, 0));

        //设置文本显示框位置
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

        //设置操作提示框
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

    public Show() {
        super.Show();
        if (this.text) {
            this.text.visible = true;
        }

        if (this.infoText) {
            this.infoText.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.text) {
            this.text.visible = false;
        }

        if (this.infoText) {
            this.infoText.visible = false;
        }
    }
}

export class MonkeyScript extends Laya.Script3D {
    private _scene: Laya.Scene3D;
    private _text: Laya.Text;
    private _camera: Laya.Camera;
    private rotation: Laya.Vector3;
    private lastPosition: Laya.Vector2;
    private distance: number = 0.0;
    private disVector1: Laya.Vector2;
    private disVector2: Laya.Vector2;
    private isTwoTouch: boolean;
    private first: boolean;
    private twoFirst: boolean;
    private sprite3DSacle: Laya.Vector3 = new Laya.Vector3();
    constructor() {
        super();
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
        this._scene = this.owner.parent as Laya.Scene3D;
        this._text = this._scene.parent.getChildByName("ceshi") as Laya.Text;
        this._camera = this._scene.getChildByName("camera") as Laya.Camera;
    }
    onUpdate() {
        var touchCount = this._scene.input.touchCount();
        if (1 === touchCount) {
            //判断是否为两指触控，撤去一根手指后引发的touchCount===1
            if (this.isTwoTouch) {
                return;
            }
            this._text.text = "触控点为1";
            //获取当前的触控点，数量为1
            var touch = this._scene.input.getTouch(0);
            //是否为新一次触碰，并未发生移动
            if (this.first) {
                //获取触碰点的位置
                this.lastPosition.x = touch.position.x;
                this.lastPosition.y = touch.position.y;
                this.first = false;
            }
            else {
                //移动触碰点
                var deltaY = touch.position.y - this.lastPosition.y;
                var deltaX = touch.position.x - this.lastPosition.x;
                this.lastPosition.x = touch.position.x;
                this.lastPosition.y = touch.position.y;
                //根据移动的距离进行旋转
                (this.owner as Laya.Sprite3D).transform.rotate(new Laya.Vector3(1 * deltaY / 2, 1 * deltaX / 2, 0), true, false);
            }
        }
        else if (2 === touchCount) {
            this._text.text = "触控点为2";
            this.isTwoTouch = true;
            //获取两个触碰点
            var touch = this._scene.input.getTouch(0);
            var touch2 = this._scene.input.getTouch(1);
            //是否为新一次触碰，并未发生移动
            if (this.twoFirst) {
                //获取触碰点的位置
                this.disVector1.x = touch.position.x - touch2.position.x;
                this.disVector1.y = touch.position.y - touch2.position.y;
                this.distance = Laya.Vector2.scalarLength(this.disVector1);
                this.sprite3DSacle = (this.owner as Laya.Sprite3D).transform.scale;
                this.twoFirst = false;
            }
            else {
                this.disVector2.x = touch.position.x - touch2.position.x;
                this.disVector2.y = touch.position.y - touch2.position.y;
                var distance2 = Laya.Vector2.scalarLength(this.disVector2);
                //根据移动的距离进行缩放
                let factor = 0.001 * (distance2 - this.distance);
                this.sprite3DSacle.x += factor;
                this.sprite3DSacle.y += factor;
                this.sprite3DSacle.z += factor;
                (this.owner as Laya.Sprite3D).transform.scale = this.sprite3DSacle;
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