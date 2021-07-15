import { BlurEffect } from "../common/BlurEffect";
import { BlurMaterial } from "../common/BlurMaterial";
import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import CommandBuffer = Laya.CommandBuffer;
import CameraEventFlags = Laya.CameraEventFlags;
import Camera = Laya.Camera;
import UnlitMaterial = Laya.UnlitMaterial;
import Vector4 = Laya.Vector4;
import ShurikenParticleMaterial = Laya.ShurikenParticleMaterial;
import Shader3D = Laya.Shader3D;
import Scene3D = Laya.Scene3D;
import BaseRender = Laya.BaseRender;
import Material = Laya.Material;
import MeshSprite3D = Laya.MeshSprite3D;
import ShuriKenParticle3D = Laya.ShuriKenParticle3D;
import SkinnedMeshSprite3D = Laya.SkinnedMeshSprite3D;
import Viewport = Laya.Viewport;
import RenderTextureFormat = Laya.RenderTextureFormat;
import RenderTextureDepthFormat = Laya.RenderTextureDepthFormat;
import RenderTexture = Laya.RenderTexture;
import FilterMode = Laya.FilterMode;
import Button = Laya.Button;
import Browser = Laya.Browser;
import Event = Laya.Event;
import Handler = Laya.Handler;

export class CommandBuffer_Outline extends SingletonScene {
    private commandBuffer: CommandBuffer;
    private cameraEventFlag: CameraEventFlags = CameraEventFlags.BeforeImageEffect;
    private camera: Camera;
    private enableCommandBuffer: boolean = false;
    private btn: Laya.Button;
    constructor() {
        super();
        //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        BlurEffect.init();
        var unlitMaterial = new UnlitMaterial();
        unlitMaterial.albedoColor = new Vector4(255, 0, 0, 255);
        var shurikenMaterial: ShurikenParticleMaterial = new ShurikenParticleMaterial();
        shurikenMaterial.color = new Vector4(255, 0, 0, 255);

        Shader3D.debugMode = true;
        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/OutlineEdgeScene/Conventional/OutlineEdgeScene.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);
            //获取场景中的相机
            this.camera = (<Camera>scene.getChildByName("Main Camera"));

            // //加入摄像机移动控制脚本
            this.camera.addComponent(CameraMoveScript);

            var renders: BaseRender[] = [];
            var materials: Material[] = [];
            renders.push((scene.getChildByName("Cube") as MeshSprite3D).meshRenderer);
            materials.push(unlitMaterial);
            renders.push((scene.getChildByName("Particle") as ShuriKenParticle3D).particleRenderer);
            materials.push(shurikenMaterial);
            renders.push((scene.getChildByName("LayaMonkey").getChildByName("LayaMonkey") as SkinnedMeshSprite3D).skinnedMeshRenderer);
            materials.push(unlitMaterial);

            //创建commandBuffer
            this.commandBuffer = this.createDrawMeshCommandBuffer(this.camera, renders, materials);
            //将commandBuffer加入渲染流程
            this.camera.addCommandBuffer(this.cameraEventFlag, this.commandBuffer);

            //加载UI
            this.loadUI();
        }));
    }

    createDrawMeshCommandBuffer(camera: Camera, renders: BaseRender[], materials: Material[]): CommandBuffer {
        var buf: CommandBuffer = new CommandBuffer();
        //当需要在流程中拿摄像机渲染效果的时候 设置true
        camera.enableBuiltInRenderTexture = true;
        //创建和屏幕一样大的Rendertexture
        var viewPort: Viewport = camera.viewport;
        var renderTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8A8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //将RenderTexture设置为渲染目标
        buf.setRenderTarget(renderTexture);
        //清楚渲染目标的颜色为黑色，不清理深度
        buf.clearRenderTarget(true, false, new Vector4(0, 0, 0, 0));

        //将传入的Render渲染到纹理上
        for (var i = 0, n = renders.length; i < n; i++) {
            buf.drawRender(renders[i], materials[i], 0);
        }
        //创建新的RenderTexture
        var subRendertexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8A8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //将renderTexture的结果复制到subRenderTexture
        buf.blitScreenQuad(renderTexture, subRendertexture);
        //设置模糊的参数
        var downSampleFactor: number = 2;
        var downSampleWidth: number = viewPort.width / downSampleFactor;
        var downSampleheigh: number = viewPort.height / downSampleFactor;
        var texSize: Vector4 = new Vector4(1.0 / viewPort.width, 1.0 / viewPort.height, viewPort.width, downSampleheigh);
        //创建模糊材质
        var blurMaterial: BlurMaterial = new BlurMaterial(texSize, 1);

        //创建降采样RenderTexture1
        var downRenderTexture = RenderTexture.createFromPool(downSampleWidth, downSampleheigh, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //降采样  使用blurMaterial材质的0SubShader将Rendertexture渲染到DownRendertexture
        buf.blitScreenQuadByMaterial(renderTexture, downRenderTexture, null, blurMaterial, 0);

        //创建降采样RenderTexture2
        var blurTexture: RenderTexture = RenderTexture.createFromPool(downSampleWidth, downSampleheigh, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        blurTexture.filterMode = FilterMode.Bilinear;

        //Horizontal blur 使用blurMaterial材质的1SubShader
        buf.blitScreenQuadByMaterial(downRenderTexture, blurTexture, null, blurMaterial, 1);
        //vertical blur	使用blurMaterial材质的2SubShader
        buf.blitScreenQuadByMaterial(blurTexture, downRenderTexture, null, blurMaterial, 2);
        //Horizontal blur 使用blurMaterial材质的1SubShader
        buf.blitScreenQuadByMaterial(downRenderTexture, blurTexture, null, blurMaterial, 1);
        //vertical blur   使用blurMaterial材质的2SubShader
        buf.blitScreenQuadByMaterial(blurTexture, downRenderTexture, null, blurMaterial, 2);
        //在命令流里面插入设置图片命令流，在调用的时候会设置blurMaterial的图片数据
        buf.setShaderDataTexture(blurMaterial._shaderValues, BlurMaterial.SHADERVALUE_SOURCETEXTURE0, downRenderTexture);
        buf.setShaderDataTexture(blurMaterial._shaderValues, BlurMaterial.ShADERVALUE_SOURCETEXTURE1, subRendertexture);
        //caculate edge计算边缘图片
        buf.blitScreenQuadByMaterial(blurTexture, renderTexture, null, blurMaterial, 3);
        //重新传入图片
        buf.setShaderDataTexture(blurMaterial._shaderValues, BlurMaterial.SHADERVALUE_SOURCETEXTURE0, renderTexture);
        //将camera渲染结果复制到subRendertexture，使用blurMaterial的4通道shader
        buf.blitScreenQuadByMaterial(null, subRendertexture, null, blurMaterial, 4);
        //将subRenderTexture重新赋值到camera的渲染结果上面
        buf.blitScreenQuadByMaterial(subRendertexture, null);
        return buf;
    }

    /**
     *@private
    */
    loadUI(): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.btn = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "关闭描边")));
            this.btn.size(200, 40);
            this.btn.labelBold = true;
            this.btn.labelSize = 30;
            this.btn.sizeGrid = "4,4,4,4";
            this.btn.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.btn.pos(Laya.stage.width / 2 - this.btn.width * Browser.pixelRatio / 2, Laya.stage.height - 60 * Browser.pixelRatio);
            this.btn.on(Event.CLICK, this, function (): void {
                this.enableCommandBuffer = !this.enableCommandBuffer;
                if (this.enableCommandBuffer) {
                    this.btn.label = "开启描边";
                    this.camera.removeCommandBuffer(this.cameraEventFlag, this.commandBuffer);
                }
                else {
                    this.btn.label = "关闭描边";
                    this.camera.addCommandBuffer(this.cameraEventFlag, this.commandBuffer);
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.btn) {
            this.btn.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.btn) {
            this.btn.visible = false;
        }
    }
}