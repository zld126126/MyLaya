import { CameraMoveScript } from "../common/CameraMoveScript";
import { ChinarMirrorPlane } from "../common/ChinarMirrorPlane";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import MeshSprite3D = Laya.MeshSprite3D;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import HtmlVideo = Laya.HtmlVideo;
import VideoTexture = Laya.VideoTexture;
import UnlitMaterial = Laya.UnlitMaterial;
import Handler = Laya.Handler;

export class VideoPlayIn3DWorld extends SingletonScene {
    private static video: any;
    private static videoPlane: MeshSprite3D;
    constructor() {
        super();
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Stat.show();
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;

        //加载场景
        Scene3D.load(GlobalConfig.ResPath + "res/threeDimen/moveClipSample/moveclip/Conventional/moveclip.ls", Handler.create(this, function (scene: Scene3D): void {
            this.AutoSetScene3d(scene);

            //获取场景中的相机
            var camera: Camera = (<Camera>scene.getChildByName("Main Camera"));
            camera.addComponent(CameraMoveScript);
            var mirrorFloor: ChinarMirrorPlane = camera.addComponent(ChinarMirrorPlane) as ChinarMirrorPlane;
            mirrorFloor.onlyMainCamera = camera;
            mirrorFloor.mirrorPlane = scene.getChildByName("reflectionPlan") as MeshSprite3D;
            //camera.active = false;    

            //增加视频
            VideoPlayIn3DWorld.videoPlane = scene.getChildByName("moveclip") as MeshSprite3D;
            this.createVideo(GlobalConfig.ResPath + "res/av/mov_bbb.mp4");
        }));

    }
    private createVideo(url: string): void {
        var htmlVideo: HtmlVideo = new HtmlVideo();
        htmlVideo.setSource(url, 1);
        VideoPlayIn3DWorld.video = htmlVideo.video;
        htmlVideo.video.addEventListener('loadedmetadata', this.onVideoReady, true);
    }
    private onVideoReady() {
        VideoPlayIn3DWorld.video.playsInline = true;
        VideoPlayIn3DWorld.video.muted = true;
        VideoPlayIn3DWorld.video.loop = true;
        VideoPlayIn3DWorld.video.play();
        var videoTexture: VideoTexture = new VideoTexture();
        videoTexture.video = VideoPlayIn3DWorld.video;
        videoTexture.videoPlay();
        VideoPlayIn3DWorld.videoPlane.meshRenderer.sharedMaterial = new UnlitMaterial();
        (VideoPlayIn3DWorld.videoPlane.meshRenderer.sharedMaterial as UnlitMaterial).albedoTexture = videoTexture;
    }
}