import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Handler = Laya.Handler;
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import DirectionLight = Laya.DirectionLight;
import Sprite3D = Laya.Sprite3D;
import SkinnedMeshSprite3D = Laya.SkinnedMeshSprite3D;
import MeshSprite3D = Laya.MeshSprite3D;
import Loader = Laya.Loader;
import PBRStandardMaterial = Laya.PBRStandardMaterial;
import Mesh = Laya.Mesh;
import Script3D = Laya.Script3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Transform3D = Laya.Transform3D;
import Button = Laya.Button;
import Browser = Laya.Browser;
import Event = Laya.Event;

/**
 * Light rotation script.
 */
class RotationScript extends Script3D {
    /** Roation speed. */
    autoRotateSpeed: Vector3 = new Vector3(0, 0.05, 0);
    /** If roation. */
    rotation: boolean = true;

    onUpdate(): void {
        if (this.rotation)
            (<DirectionLight>this.owner).transform.rotate(this.autoRotateSpeed, false);
    }
}



/**
 * Realtime shadow sample. 
 */
export class RealTimeShadow extends SingletonScene {
    rotationButton: Button;
    constructor() {
        super();
        // //Init engine.
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // //show stat.
        // Stat.show();

        Laya.loader.create([
            GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh",
            GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"
        ], Handler.create(this, this.onComplete));
    }

    private onComplete(): void {
        var scene: Scene3D = <Scene3D>Laya.stage.addChild(new Scene3D());

        var camera: Camera = <Camera>(scene.addChild(new Camera(0, 0.1, 100)));
        camera.transform.translate(new Vector3(0, 1.2, 1.6));
        camera.transform.rotate(new Vector3(-35, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        var directionLight: DirectionLight = (<DirectionLight>scene.addChild(new DirectionLight()));
        directionLight.color = new Vector3(0.85, 0.85, 0.8);
        directionLight.transform.rotate(new Vector3(-Math.PI / 3, 0, 0));

        // Use soft shadow.
        // directionLight.shadowMode = ShadowMode.SoftLow;
        // Set shadow max distance from camera.
        directionLight.shadowDistance = 3;
        // Set shadow resolution.
        directionLight.shadowResolution = 1024;
        // Set shadow cascade mode.
        // directionLight.shadowCascadesMode = ShadowCascadesMode.NoCascades;

        // Add rotation script to light.
        var rotationScript: RotationScript = directionLight.addComponent(RotationScript);

        // A plane receive shadow.
        var grid: Sprite3D = <Sprite3D>scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/grid/plane.lh"));
        (<MeshSprite3D>grid.getChildAt(0)).meshRenderer.receiveShadow = true;

        // A monkey cast shadow.
        var layaMonkey: Sprite3D = <Sprite3D>scene.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh"));
        layaMonkey.transform.localScale = new Vector3(0.3, 0.3, 0.3);
        (<SkinnedMeshSprite3D>layaMonkey.getChildAt(0).getChildAt(0)).skinnedMeshRenderer.castShadow = true;

        // A sphere cast/receive shadow.
        var sphereSprite: MeshSprite3D = this.addPBRSphere(PrimitiveMesh.createSphere(0.1), new Vector3(0, 0.2, 0.5), scene);
        sphereSprite.meshRenderer.castShadow = true;
        sphereSprite.meshRenderer.receiveShadow = true;

        // Add Light controll UI.
        this.loadUI(rotationScript);
    }

    /**
     * Add one with smoothness and metallic sphere.
     */
    addPBRSphere(sphereMesh: Mesh, position: Vector3, scene: Scene3D): MeshSprite3D {
        var mat: PBRStandardMaterial = new PBRStandardMaterial();
        mat.smoothness = 0.2;

        var meshSprite: MeshSprite3D = new MeshSprite3D(sphereMesh);
        meshSprite.meshRenderer.sharedMaterial = mat;
        var transform: Transform3D = meshSprite.transform;
        transform.localPosition = position;
        scene.addChild(meshSprite);
        return meshSprite;
    }

    /**
     * Add Button control light rotation.
     */
    loadUI(rottaionScript: RotationScript): void {
        Laya.loader.load([GlobalConfig.ResPath + "res/threeDimen/ui/button.png"], Handler.create(this, function (): void {
            this.rotationButton = <Button>Laya.stage.addChild(new Button("res/threeDimen/ui/button.png", "Stop Rotation"));
            this.rotationButton.size(150, 30);
            this.rotationButton.labelSize = 20;
            this.rotationButton.sizeGrid = "4,4,4,4";
            this.rotationButton.scale(Browser.pixelRatio, Browser.pixelRatio);
            this.rotationButton.pos(Laya.stage.width / 2 - this.rotationButton.width * Browser.pixelRatio / 2, Laya.stage.height - 40 * Browser.pixelRatio);
            this.rotationButton.on(Event.CLICK, this, function (): void {
                if (rottaionScript.rotation) {
                    this.rotationButton.label = "Start Rotation";
                    rottaionScript.rotation = false;
                } else {
                    this.rotationButton.label = "Stop Rotation";
                    rottaionScript.rotation = true;
                }
            });
        }));
    }

    public Show() {
        super.Show();
        if (this.rotationButton) {
            this.rotationButton.visible = true;
        }
    }

    public Hide() {
        super.Hide();
        if (this.rotationButton) {
            this.rotationButton.visible = false;
        }
    }
}
