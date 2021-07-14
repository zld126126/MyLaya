import { CameraMoveScript } from "../common/CameraMoveScript";
import { EdgeEffect, EdgeMode } from "../common/EdgeEffect";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Shader3D = Laya.Shader3D;
import Vector3 = Laya.Vector3;
import Quaternion = Laya.Quaternion;
import MeshSprite3D = Laya.MeshSprite3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import DepthTextureMode = Laya.DepthTextureMode;
import Sprite3D = Laya.Sprite3D;
import Loader = Laya.Loader;
import PostProcess = Laya.PostProcess;
import DirectionLight = Laya.DirectionLight;
import HSlider = Laya.HSlider;
import Browser = Laya.Browser;
import Slider = Laya.Slider;
import Button = Laya.Button;
import Event = Laya.Event;
import Handler = Laya.Handler;


export class PostProcess_Edge extends SingletonScene {
    private btns: Laya.Button[] = [];
    private sliders: Laya.Slider[] = [];
    s_scene: Scene3D;
    camera: Camera;

    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        // Stat.show();

        Shader3D.debugMode = true;

        this.s_scene = new Scene3D();
        this.camera = <Camera>this.s_scene.addChild(new Camera(0, 0.2, 50));
        this.camera.addComponent(CameraMoveScript);
        this.camera.transform.position = new Vector3(0, 4, 10);
        this.camera.transform.rotation = new Quaternion(-0.2, 0, 0, 0.97);

        this.addLight();

        let res: string[] = [
            GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh",
        ];

        Laya.loader.create(res, Handler.create(this, this.onResComplate));

    }

    onResComplate(): void {
        this.AutoSetScene3d(this.s_scene);
        let sphere: MeshSprite3D = new MeshSprite3D(PrimitiveMesh.createSphere(1), "Sphere");
        this.s_scene.addChild(sphere);
        sphere.transform.position = new Vector3(0, 1, 0);

        let plane: MeshSprite3D = new MeshSprite3D(PrimitiveMesh.createPlane(), "Plane");
        this.s_scene.addChild(plane);
        plane.transform.position = new Vector3(0, -0.5, 0);

        let cube: MeshSprite3D = new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1), "Cube");
        this.s_scene.addChild(cube);
        cube.transform.position = new Vector3(0, 3, 0);

        this.camera.depthTextureMode |= DepthTextureMode.DepthNormals;

        let dude: Sprite3D = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/dude/dude.lh");
        this.s_scene.addChild(dude);
        dude.transform.position = new Vector3(1.5, 0, 0);
        dude.transform.rotationEuler = new Vector3(0, 180, 0);

        let postProcess: PostProcess = new PostProcess();
        this.camera.postProcess = postProcess;

        let edgeEffect: EdgeEffect = new EdgeEffect();
        postProcess.addEffect(edgeEffect);

        this.addUI(edgeEffect);
    }

    addLight(): void {

        let dirLightDirections: Vector3[] = [new Vector3(-1, -1, -1), new Vector3(1, -1, -1)]
        let lightColor: Vector3 = new Vector3(0.6, 0.6, 0.6);
        for (let index = 0; index < dirLightDirections.length; index++) {
            let dir: Vector3 = dirLightDirections[index];
            Vector3.normalize(dir, dirLightDirections[index]);
            let dirLight: DirectionLight = new DirectionLight();
            this.s_scene.addChild(dirLight);
            dirLight.transform.worldMatrix.setForward(dirLightDirections[index]);
            dirLight.color = lightColor;
        }

    }

    addUI(edgeEffect: EdgeEffect): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/ui/hslider.png", GlobalConfig.ResPath + "res/threeDimen/ui/button.png",
        GlobalConfig.ResPath + "res/ui/hslider$bar.png", GlobalConfig.ResPath + "res/ui/colorPicker.png"], Handler.create(this, function () {

            let colorButton: Button = this.addButton(100, 250, 160, 30, "color edge", 20, function () {
                edgeEffect.edgeMode = EdgeMode.ColorEdge;
                colorSlider.visible = true;
                normalSlider.visible = false;
                depthSlider.visible = false;
            });

            let colorSlider: HSlider = this.addSlider(100, 290, 300, 0.01, 1, 0.7, 0.01, function (value: number) {
                edgeEffect.colorHold = value;
            });

            let normalFunc: Function = function () {
                edgeEffect.edgeMode = EdgeMode.NormalEdge;
                colorSlider.visible = false;
                normalSlider.visible = true;
                depthSlider.visible = false;
            };
            let normalButton: Button = this.addButton(100, 330, 160, 30, "normal edge", 20, normalFunc);

            let normalSlider: HSlider = this.addSlider(100, 370, 300, 0.01, 1, 0.7, 0.01, function (value: number) {
                edgeEffect.normalHold = value;
            });

            let depthButton: Button = this.addButton(100, 410, 160, 30, "depth edge", 20, function () {
                edgeEffect.edgeMode = EdgeMode.DepthEdge;
                colorSlider.visible = false;
                normalSlider.visible = false;
                depthSlider.visible = true;
            });

            let depthSlider: HSlider = this.addSlider(100, 450, 300, 0.01, 1, 0.7, 0.01, function (value: number) {
                edgeEffect.depthHold = value;
            });

            let source: Button = this.addButton(100, 490, 160, 30, "show source", 20, function () {
                edgeEffect.showSource = !edgeEffect.showSource;
            });

            normalFunc();

        }));
    }

    addBtn(x: number, y: number, width: number, height: number, text: string, size: number, clickFunc: Function) {
        let button: Button = <Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", text));
        button.size(width, height);
        button.labelBold = true;
        button.labelSize = size;
        button.sizeGrid = "4,4,4,4";
        button.scale(Browser.pixelRatio, Browser.pixelRatio);
        button.pos(x, y);
        button.on(Event.CLICK, this, clickFunc);
        this.btns.push(button);
        return button;
    }

    addSlider(x: number, y: number, width: number, min: number, max: number, value: number, tick: number, changeFunc: Function) {
        let slider: HSlider = <HSlider>Laya.stage.addChild(new Slider(GlobalConfig.ResPath + "res/ui/hslider.png"));
        slider.width = width;
        slider.pos(x, y);
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.tick = tick;
        slider.changeHandler = Handler.create(this, changeFunc, [], false);

        slider.visible = false;
        this.sliders.push(slider);
        return slider;
    }

    public Show() {
        super.Show();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = true;
        }
        for (var i = 0; i < this.sliders.length; i++) {
            this.sliders[i].visible = true;
        }
    }

    public Hide() {
        super.Hide();
        for (var i = 0; i < this.btns.length; i++) {
            this.btns[i].visible = false;
        }
        for (var i = 0; i < this.sliders.length; i++) {
            this.sliders[i].visible = false;
        }
    }

}
