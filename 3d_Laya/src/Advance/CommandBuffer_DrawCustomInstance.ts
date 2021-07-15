import { CameraMoveScript } from "../common/CameraMoveScript";
import { CustomInstanceMaterial } from "../common/CustomInstanceMaterial";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Shader3D = Laya.Shader3D;
import DrawMeshInstancedCMD = Laya.DrawMeshInstancedCMD;
import MaterialInstancePropertyBlock = Laya.MaterialInstancePropertyBlock;
import Matrix4x4 = Laya.Matrix4x4;
import Vector4 = Laya.Vector4;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Quaternion = Laya.Quaternion;
import DirectionLight = Laya.DirectionLight;
import CommandBuffer = Laya.CommandBuffer;
import PrimitiveMesh = Laya.PrimitiveMesh;
import CameraEventFlags = Laya.CameraEventFlags;
import InstanceLocation = Laya.InstanceLocation;
import Button = Laya.Button;
import Browser = Laya.Browser;
import Event = Laya.Event;
import Handler = Laya.Handler;

export class CommandBuffer_DrawCustomInstance extends SingletonScene {
    private changeActionButton: Laya.Button;
    private s_scene: Laya.Scene3D;
    mat: CustomInstanceMaterial;
    instanceCMD: DrawMeshInstancedCMD;
    materialBlock: MaterialInstancePropertyBlock;
    matrixs: Matrix4x4[] = [];
    matrixs1: Matrix4x4[] = [];
    colors: Vector4[] = [];
    colors1: Vector4[] = [];
    currentColor: Vector4[] = [];
    currentMatrix: Matrix4x4[] = [];

    constructor() {
        // Laya3D.init(0,0);
        // Stat.show();

        // //初始化引擎
        // Laya3D.init(100, 100);
        // Stat.show();
        super();
        Shader3D.debugMode = true;
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        //材质初始化
        CustomInstanceMaterial.init();
        this.s_scene = new Scene3D();

        let camera: Camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 100)));
        camera.transform.position = new Vector3(14.85, 17.08, 35.89);
        camera.transform.rotation = new Quaternion(0, 0, 0, 1);
        camera.addComponent(CameraMoveScript);
        camera.clearColor = new Vector4(0.8, 0.4, 0.2, 1.0);
        this.mat = new CustomInstanceMaterial();
        //camera.enableHDR = true;
        //创建方向光
        let directionLight: DirectionLight = (<DirectionLight>this.s_scene.addChild(new DirectionLight()));
        //方向光的颜色
        directionLight.color.setValue(1, 1, 1);
        //设置平行光的方向
        let mat: Matrix4x4 = directionLight.transform.worldMatrix;
        mat.setForward(new Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        //创建CommandBuffer命令流
        this.createCommandBuffer(camera);
        //UI
        this.loadUI();

        this.AutoSetScene3d(this.s_scene);

        //初始化动作
        Laya.timer.frameLoop(1, this, this.changetwoon);
    }

    /**
     * 创建CommandBuffer命令缓存流
     * @param camera 
     */
    createCommandBuffer(camera: Camera) {
        //创建渲染命令流
        let buf: CommandBuffer = new CommandBuffer();
        //初始化数矩阵数组和颜色数组
        this.createMatrixArray();
        //创建材质instance属性块
        this.materialBlock = new MaterialInstancePropertyBlock();
        //设置属性
        this.materialBlock.setVectorArray("a_InstanceColor", this.colors1, InstanceLocation.CUSTOME0);
        //创建渲染命令  渲染900个小球
        this.instanceCMD = buf.drawMeshInstance(PrimitiveMesh.createSphere(0.5), 0, this.matrixs1, this.mat, 0, this.materialBlock, 900);
        camera.addCommandBuffer(CameraEventFlags.BeforeTransparent, buf);
        return;
    }

    createMatrixArray(): void {
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 30; j++) {
                let ind = j * 30 + i;
                if (ind > 1023) break;
                this.matrixs[ind] = new Matrix4x4();
                this.matrixs1[ind] = new Matrix4x4();
                this.currentMatrix[ind] = new Matrix4x4();
                Matrix4x4.createTranslate(new Vector3(i, j, 0), this.matrixs[ind]);
                Matrix4x4.createTranslate(new Vector3(ind % 10 + 10, Math.floor(ind / 100) + 10, Math.floor(ind / 10) % 10 - 5), this.matrixs1[ind]);
                this.colors[ind] = new Vector4(1 - i / 30.0, 1 - j / 30.0, 1.0, 1.0);
                this.colors1[ind] = new Vector4(1 - i / 30.0, 1 - j / 30.0, 0.0, 1.0);
                this.currentColor[ind] = new Vector4();
            }
        }
        return null;
    }


    changePositionColor(sourceColor: Vector4[], sourceMatrix: Matrix4x4[], destColor: Vector4[], destMatrix: Matrix4x4[], lerp: number) {
        //根据lerp插值颜色和矩阵
        var lep = lerp;
        var invert = 1 - lerp;
        for (let i = 0; i < 30; i++) {
            for (let j = 0; j < 30; j++) {
                let ind = j * 30 + i;
                this.currentColor[ind].setValue(sourceColor[ind].x * lep + destColor[ind].x * invert, sourceColor[ind].y * lep + destColor[ind].y * invert, sourceColor[ind].z * lep + destColor[ind].z * invert, 1.0)
                var mat = this.currentMatrix[ind].elements;
                var sourcemat = sourceMatrix[ind].elements;
                var destmat = destMatrix[ind].elements;
                mat[12] = sourcemat[12] * lep + destmat[12] * invert;
                mat[13] = sourcemat[13] * lep + destmat[13] * invert;
                mat[14] = sourcemat[14] * lep + destmat[14] * invert;
            }
        }
    }


    private timer = 0;
    private delta = 0.01;
    changetwoon() {
        if (!this.isShow) {
            return;
        }
        //修改渲染属性
        this.timer += this.delta;
        if (this.timer < 0 || this.timer > 1) {
            this.timer = Math.round(this.timer);
            return;
        }

        this.changePositionColor(this.colors, this.matrixs, this.colors1, this.matrixs1, this.timer);
        //改变900小球的矩阵
        this.instanceCMD.setWorldMatrix(this.currentMatrix);
        //改变900小球的颜色
        this.materialBlock.setVectorArray("a_InstanceColor", this.currentColor, InstanceLocation.CUSTOME0);
    }

    private curStateIndex: number = 0;
    private loadUI(): void {

        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {

            this.changeActionButton = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "切换颜色位置1")));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
            this.changeActionButton.on(Event.CLICK, this, function (): void {
                if (++this.curStateIndex % 2 == 1) {
                    this.changeActionButton.label = "颜色位置1";
                    this.delta = -0.01;
                } else {
                    this.changeActionButton.label = "颜色位置2";
                    this.delta = 0.01;
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.changeActionButton) {
            this.changeActionButton.visible = true;
        }
    }

    public Hide() {
        super.Show();
        if (this.changeActionButton) {
            this.changeActionButton.visible = false;
            this.materialBlock = new MaterialInstancePropertyBlock();
        }
    }
}