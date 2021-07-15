import { BlurEffect } from "../common/BlurEffect";
import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlassWithoutGrabMaterail } from "../common/GlassWithoutGrabMaterail";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import RenderTexture = Laya.RenderTexture;
import Shader3D = Laya.Shader3D;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import MeshSprite3D = Laya.MeshSprite3D;
import PBRStandardMaterial = Laya.PBRStandardMaterial;
import CommandBuffer = Laya.CommandBuffer;
import RenderTextureFormat = Laya.RenderTextureFormat;
import RenderTextureDepthFormat = Laya.RenderTextureDepthFormat;
import ShaderData = Laya.ShaderData;
import Vector4 = Laya.Vector4;
import FilterMode = Laya.FilterMode;
import CameraEventFlags = Laya.CameraEventFlags;
import Viewport = Laya.Viewport;
import Handler = Laya.Handler;

export class CommandBuffer_BlurryGlass extends SingletonScene {
    mat: GlassWithoutGrabMaterail;
    texture: RenderTexture;
    constructor() {
        Shader3D.debugMode = true;
        super();
        //初始化引擎
        // Laya3D.init(100, 100);
        // Stat.show();
        // Shader3D.debugMode = true;
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        //材质初始化
        BlurEffect.init();
        GlassWithoutGrabMaterail.init();


        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/BlurryRefraction/Conventional/BlurryGlass.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);
            //获取场景中的相机
            var camera: Camera = (<Camera>scene.getChildByName("Main Camera"));
            //增加移动脚本
            camera.addComponent(CameraMoveScript);

            var glass01: MeshSprite3D = scene.getChildByName("glass01") as MeshSprite3D;
            var glass02: MeshSprite3D = scene.getChildByName("glass02") as MeshSprite3D;
            //在这里切换了材质
            var pbrStandard: PBRStandardMaterial = glass01.meshRenderer.sharedMaterial as PBRStandardMaterial;
            //将图片设置到玻璃材质
            var glassMaterial: GlassWithoutGrabMaterail = new GlassWithoutGrabMaterail(pbrStandard.albedoTexture);

            //给模型赋毛玻璃材质
            glass01.meshRenderer.sharedMaterial = glassMaterial;
            glass02.meshRenderer.sharedMaterial = glassMaterial;
            this.mat = glassMaterial;
            //创建使用CommandBuffer
            this.createCommandBuffer(camera);
        }));
    }

    /**
     * 创建CommandBuffer命令缓存流
     * @param camera 
     */
    createCommandBuffer(camera: Camera) {
        //当需要在流程中拿摄像机渲染效果的时候 设置true
        camera.enableBuiltInRenderTexture = true;
        //创建渲染命令流
        var buf: CommandBuffer = new CommandBuffer();
        //创建需要模糊使用的屏幕RenderTexture
        var viewPort: Viewport = camera.viewport;
        var renderTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //将当前渲染的结果拷贝到创建好的RenderTexture
        this.texture = renderTexture;
        buf.blitScreenTriangle(null, renderTexture);
        //获得shader
        var shader: Shader3D = Shader3D.find("blurEffect");
        var shaderValue: ShaderData = new ShaderData();
        //down Sample level设置降采样等级
        var downSampleFactor: number = 4;
        var downSampleWidth: number = viewPort.width / downSampleFactor;
        var downSampleheigh: number = viewPort.height / downSampleFactor;
        //设置模糊材质参数
        var texSize: Vector4 = new Vector4(1.0 / viewPort.width, 1.0 / viewPort.height, viewPort.width, downSampleheigh);
        shaderValue.setNumber(BlurEffect.SHADERVALUE_DOWNSAMPLEVALUE, 1);
        shaderValue.setVector(BlurEffect.SHADERVALUE_TEXELSIZE, texSize);
        //创建降采样RenderTexture1
        var downRenderTexture = RenderTexture.createFromPool(downSampleWidth, downSampleheigh, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        //降采样命令流
        buf.blitScreenTriangle(renderTexture, downRenderTexture, null, shader, shaderValue, 0);
        //创建降采样RenderTexture2
        var blurTexture: RenderTexture = RenderTexture.createFromPool(downSampleWidth, downSampleheigh, RenderTextureFormat.R8G8B8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        blurTexture.filterMode = FilterMode.Bilinear;
        //Horizontal blur
        buf.blitScreenTriangle(downRenderTexture, blurTexture, null, shader, shaderValue, 1);
        //vertical blur
        buf.blitScreenTriangle(blurTexture, downRenderTexture, null, shader, shaderValue, 2);
        //Horizontal blur
        buf.blitScreenTriangle(downRenderTexture, blurTexture, null, shader, shaderValue, 1);
        //vertical blur
        buf.blitScreenTriangle(blurTexture, downRenderTexture, null, shader, shaderValue, 2);

        //设置全局uniform变量  
        var globalUniformNameID: number = Shader3D.propertyNameToID("u_screenTexture");
        buf.setGlobalTexture(globalUniformNameID, downRenderTexture);
        //将commandBuffer加入渲染流程
        camera.addCommandBuffer(CameraEventFlags.BeforeTransparent, buf);
        //回收用过的RenderTexture
        RenderTexture.recoverToPool(downRenderTexture);
        RenderTexture.recoverToPool(blurTexture);
        return;
    }

}