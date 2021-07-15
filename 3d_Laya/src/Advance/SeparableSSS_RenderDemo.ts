import { CameraMoveScript } from "../common/CameraMoveScript";
import { SeparableSSSRenderMaterial } from "../common/SeparableSSSRenderMaterial";
import { SeparableSSS_BlitMaterial } from "../common/SeparableSSS_BlitMaterial";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import MeshSprite3D = Laya.MeshSprite3D;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import PBRStandardMaterial = Laya.PBRStandardMaterial;
import UnlitMaterial = Laya.UnlitMaterial;
import Shader3D = Laya.Shader3D;
import Loader = Laya.Loader;
import CameraEventFlags = Laya.CameraEventFlags;
import Mesh = Laya.Mesh;
import CommandBuffer = Laya.CommandBuffer;
import Viewport = Laya.Viewport;
import RenderTexture = Laya.RenderTexture;
import RenderTextureFormat = Laya.RenderTextureFormat;
import Vector4 = Laya.Vector4;
import FilterMode = Laya.FilterMode;
import Browser = Laya.Browser;
import Button = Laya.Button;
import Event = Laya.Event;
import Vector2 = Laya.Vector2;
import RenderTextureDepthFormat = Laya.RenderTextureDepthFormat;
import Handler = Laya.Handler;

export class SeparableSSS_RenderDemo extends SingletonScene {
    s_scene: Scene3D;
    changeActionButton: Laya.Button;
    mainCamera: Camera;
    blinnphongCharacter: MeshSprite3D;
    SSSSSCharacter: MeshSprite3D;
    characterBlinnphongMaterial: BlinnPhongMaterial;
    pbrCharacter: MeshSprite3D;
    pbrMaterial: PBRStandardMaterial;
    //testPlane
    planeMat: UnlitMaterial;
    sssssBlitMaterail: SeparableSSS_BlitMaterial;
    sssssRenderMaterial: SeparableSSSRenderMaterial;

    //reference:https://github.com/iryoku/separable-sss 
    //流程：分别渲染皮肤Mesh的漫反射部分以及渲染皮肤Mesh的高光部分,分别存储在不同的FrameBuffer中
    //进行两次根据kenerl的高斯采样模拟多极子光照模型
    //再将高光部分与模糊好的地方重新相加
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        super();

        Shader3D.debugMode = true;
        SeparableSSS_BlitMaterial.init();
        SeparableSSSRenderMaterial.init();

        this.sssssBlitMaterail = new SeparableSSS_BlitMaterial();
        this.sssssRenderMaterial = new SeparableSSSRenderMaterial();
        this.PreloadingRes();
    }

    //批量预加载方式
    PreloadingRes() {
        //预加载所有资源
        let resource: any[] = [
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_separable-sss/Conventional/separable-sss.ls",
            GlobalConfig.ResPath + "res/threeDimen/LayaScene_separable-sss/Conventional/HeadBlinnphong.lh"
        ];
        Laya.loader.create(resource, Handler.create(this, this.onPreLoadFinish));
    }

    onPreLoadFinish() {
        this.s_scene = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_separable-sss/Conventional/separable-sss.ls");
        this.AutoSetScene3d(this.s_scene);
        //获取场景中的相机
        this.mainCamera = (<Camera>this.s_scene.getChildByName("Main Camera"));
        this.mainCamera.addComponent(CameraMoveScript);


        //打开depthTexture
        this.blinnphongCharacter = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/LayaScene_separable-sss/Conventional/HeadBlinnphong.lh");
        this.characterBlinnphongMaterial = <BlinnPhongMaterial>this.blinnphongCharacter.meshRenderer.sharedMaterial.clone();
        //增加Mesh节点
        let buf = this.createCommandBuffer(this.mainCamera, this.blinnphongCharacter.meshFilter.sharedMesh);
        this.mainCamera.addCommandBuffer(CameraEventFlags.BeforeForwardOpaque, buf);
        this.sssssBlitMaterail.cameraFiledOfView = this.mainCamera.fieldOfView;

        //增加节点
        this.SSSSSCharacter = <MeshSprite3D>this.blinnphongCharacter.clone();
        this.SSSSSCharacter.meshRenderer.sharedMaterial = this.sssssRenderMaterial;
        this.s_scene.addChild(this.SSSSSCharacter);
        this.s_scene.addChild(this.blinnphongCharacter);
        this.blinnphongCharacter.active = false;

        this.loadUI();
    }

    createCommandBuffer(camera: Camera, character: Mesh): CommandBuffer {
        //记录一下最开始的漫反射颜色和高光颜色
        let oriColor = this.characterBlinnphongMaterial.albedoColor;
        let oriSpec = this.characterBlinnphongMaterial.specularColor;

        let buf: CommandBuffer = new CommandBuffer();
        let viewPort: Viewport = camera.viewport;

        //在延迟渲染管线中  可以一下把三张图直接搞出来
        //在我们前向渲染管线中  多浪费了几次drawMesh的性能
        //深度贴图
        debugger;
        let depthTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.Depth);
        buf.setRenderTarget(depthTexture);
        buf.clearRenderTarget(true, true, new Vector4(0.5, 0.5, 0.5, 1.0));
        buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
        //将漫反射和高光分别画到两个RenderTexture
        //漫反射颜色
        let diffuseRenderTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8A8, RenderTextureDepthFormat.DEPTH_16);
        buf.setRenderTarget(diffuseRenderTexture);
        buf.clearRenderTarget(true, true, new Vector4(0.5, 0.5, 0.5, 1.0));
        //@ts-ignore
        buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, BlinnPhongMaterial.ALBEDOCOLOR, oriColor);
        //@ts-ignore
        buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, BlinnPhongMaterial.MATERIALSPECULAR, new Vector4(0.0, 0.0, 0.0, 0.0));
        buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
        // //高光颜色
        let specRrenderTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8A8, RenderTextureDepthFormat.DEPTH_16);
        buf.setRenderTarget(specRrenderTexture);
        buf.clearRenderTarget(true, true, new Vector4(1.0, 0.0, 0.0, 0.0));
        //@ts-ignore
        buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, BlinnPhongMaterial.MATERIALSPECULAR, oriSpec);
        //@ts-ignore
        buf.setShaderDataVector(this.characterBlinnphongMaterial.shaderData, BlinnPhongMaterial.ALBEDOCOLOR, new Vector4(0.0, 0.0, 0.0, 0.0));
        buf.drawMesh(character, this.blinnphongCharacter.transform.worldMatrix, this.characterBlinnphongMaterial, 0, 0);
        //buf.blitScreenQuad(specRrenderTexture,null);

        //拿到三张图片后，对diffuse贴图进行高斯核模糊
        buf.setShaderDataTexture(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_DEPTHTEX, depthTexture);
        let blurRenderTexture = RenderTexture.createFromPool(viewPort.width, viewPort.height, RenderTextureFormat.R8G8B8A8, RenderTextureDepthFormat.DEPTHSTENCIL_NONE);
        buf.setShaderDataVector2(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR, new Vector2(10.0, 0.0));
        buf.blitScreenQuadByMaterial(diffuseRenderTexture, blurRenderTexture, new Vector4(0, 0, 1.0, 1.0), this.sssssBlitMaterail, 0);
        buf.setShaderDataVector2(this.sssssBlitMaterail.shaderData, SeparableSSS_BlitMaterial.SHADERVALUE_BLURDIR, new Vector2(0.0, 10.0));
        buf.blitScreenQuadByMaterial(blurRenderTexture, diffuseRenderTexture, new Vector4(0.0, 0.0, 0.0, 0.0), this.sssssBlitMaterail, 0);


        buf.setGlobalTexture(Shader3D.propertyNameToID("sssssDiffuseTexture"), diffuseRenderTexture);
        this.sssssRenderMaterial.shaderData.setTexture(Shader3D.propertyNameToID("sssssSpecularTexture"), specRrenderTexture);
        diffuseRenderTexture.filterMode = FilterMode.Point;
        specRrenderTexture.filterMode = FilterMode.Point;


        return buf;
    }


    curStateIndex: number = 0;
    //按钮
    private loadUI(): void {

        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {

            this.changeActionButton = (<Button>Laya.stage.addChild(new Button(GlobalConfig.ResPath + "res/threeDimen/ui/button.png", "次表面散射模式")));
            this.changeActionButton.size(160, 40);
            this.changeActionButton.labelBold = true;
            this.changeActionButton.labelSize = 30;
            this.changeActionButton.sizeGrid = "4,4,4,4";
            this.changeActionButton.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.changeActionButton.pos(Laya.stage.width / 2 - this.changeActionButton.width * Browser.pixelRatio / 2, Laya.stage.height - 100 * Browser.pixelRatio);
            this.changeActionButton.on(Event.CLICK, this, function (): void {
                if (++this.curStateIndex % 2 == 1) {
                    this.blinnphongCharacter.active = true;
                    this.SSSSSCharacter.active = false;
                    this.changeActionButton.label = "正常模式";
                } else {
                    this.blinnphongCharacter.active = false;
                    this.SSSSSCharacter.active = true;
                    this.changeActionButton.label = "次表面散射模式";
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
        super.Hide();
        if (this.changeActionButton) {
            this.changeActionButton.visible = false;
        }
    }
}