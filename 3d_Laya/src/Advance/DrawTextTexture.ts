import { CameraMoveScript } from "../common/CameraMoveScript";
import SingletonScene from "../SingletonScene";
import MeshSprite3D = Laya.MeshSprite3D;
import UnlitMaterial = Laya.UnlitMaterial;
import Texture2D = Laya.Texture2D;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Browser = Laya.Browser;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import RenderState = Laya.RenderState;

export class DrawTextTexture extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private cav: any;
    private plane: MeshSprite3D;
    private mat: UnlitMaterial;
    private texture2D: Texture2D;
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        super();

        this.s_scene = new Scene3D();
        var camera: Camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 100)));
        camera.transform.translate(new Vector3(0, 0, 15));
        camera.transform.rotate(new Vector3(0, 0, 0), true, false);
        camera.clearColor = new Vector4(0.2, 0.2, 0.2, 1.0);
        camera.addComponent(CameraMoveScript);
        this.AutoSetScene3d(this.s_scene);

        //设置一个面板用来渲染
        this.plane = new MeshSprite3D(PrimitiveMesh.createPlane(10, 10));
        this.plane.transform.rotate(new Vector3(90, 0, 0), true, false);
        this.s_scene.addChild(this.plane);
        //材质
        this.mat = new UnlitMaterial();
        this.plane.meshRenderer.sharedMaterial = this.mat;

        //画布cavans
        this.cav = Browser.createElement("canvas");
        var cxt = this.cav.getContext("2d");
        this.cav.width = 256;
        this.cav.height = 256;
        cxt.fillStyle = 'rgb(' + '132' + ',' + '240' + ',109)';
        cxt.font = "bold 50px 宋体";
        cxt.textAlign = "center";//文本的对齐方式
        cxt.textBaseline = "center";//文本相对于起点的位置
        //设置文字,位置
        cxt.fillText("LayaAir", 100, 50, 200);//有填充cxt.font="bold 60px 宋体";

        cxt.strokeStyle = 'rgb(' + '200' + ',' + '125' + ',0)';
        cxt.font = "bold 40px 黑体";
        cxt.strokeText("runtime", 100, 100, 200);//只有边框

        //文字边框结合
        cxt.strokeStyle = 'rgb(' + '255' + ',' + '240' + ',109)';
        cxt.font = "bold 30px 黑体";
        cxt.fillText("LayaBox", 100, 150, 200);

        cxt.strokeStyle = "yellow";
        cxt.font = "bold 30px 黑体";
        cxt.strokeText("LayaBox", 100, 150, 200);//只有边框
        this.texture2D = new Texture2D(256, 256);
        this.texture2D.loadImageSource(this.cav);
        this.mat.renderMode = UnlitMaterial.RENDERMODE_TRANSPARENT;

        //给材质贴图
        this.mat.albedoTexture = this.texture2D;
        (<BlinnPhongMaterial>this.plane.meshRenderer.sharedMaterial).cull = RenderState.CULL_NONE;
        var rotate: Vector3 = new Vector3(0, 0, 1);

        Laya.timer.frameLoop(1, this, function (): void {
            if (!this.isShow) {
                return;
            }
            this.plane.transform.rotate(rotate, true, false);
        });
    }

}