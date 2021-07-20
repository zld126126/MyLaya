import SingletonScene from "../SingletonScene";
import { J8_MatCap } from "../Lib/J8_MatCap";
import { J8_MatCapAudi } from "../Lib/J8_MatCapAudi";
import { J3_DiffusePixe } from "../Lib/J3_DiffusePixe";
import { J4_DiffuseTexture } from "../Lib/J4_DiffuseTexture";

export class J8_MatCap_Scene extends SingletonScene {
    constructor() {
        super();

        this.init();
    }
    init() {

        //初始化Shader
        J8_MatCap.initShader();
        J8_MatCapAudi.initShader();
        J3_DiffusePixe.initShader();
        J4_DiffuseTexture.initShader();

        //添加场景
        /*Laya.Scene3D.load("res/models/lightMap/lightMap.ls", Laya.Handler.create(this, function(scene) {
            Laya.stage.addChild(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var material = new J8_MatCap();
            scene.getChildAt(1).getChildAt(0).meshRenderer.material = material; 
            scene.getChildAt(1).getChildAt(1).meshRenderer.material = material; 
            scene.getChildAt(2).meshRenderer.material = material; 
            Laya.Texture2D.load("res/textures/matcap017.jpg", Laya.Handler.create(this, function(tex) {
                material.MatCapTexture = tex;
                console.log(tex);
            }));
            material.TilingOffset = new Laya.Vector4(2.0, 2.0, 0.0, 0.0);
            Laya.timer.frameLoop(1, this, function() {scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.005, 0), false);});
        }));*/

        //添加场景
        Laya.Scene3D.load("res/models/Audi_A4/audiA4.ls", Laya.Handler.create(this, function (scene) {
            this.AutoSetScene3d(scene);
            scene.ambientColor = new Laya.Vector3(0.0, 0.0, 0.0);
            console.log(scene);

            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(1.0, 1.0, 1.0);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(-2, -2, 0));

            var bodyMaterial = new J8_MatCapAudi();
            var CarBase = new J3_DiffusePixe();
            var CarFaceMat = new J8_MatCapAudi();
            var CarLineMat = new J8_MatCapAudi();
            var CarGlassMat = new J8_MatCapAudi();
            var CarLunGuMat = new J8_MatCapAudi();
            var CarLunTaiMat = new J8_MatCapAudi();
            var CarTaillight = new J8_MatCapAudi();
            var ZhongKuMat = new J4_DiffuseTexture();
            var DiZuoMat = new J4_DiffuseTexture();
            var groundMat = new J4_DiffuseTexture();
            var windowMat = new J8_MatCapAudi();


            scene.getChildAt(1).getChildAt(0).meshRenderer.material = groundMat;
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/ground_shadow.jpg", Laya.Handler.create(this, function (tex) { groundMat.DiffuseTexture = tex; }));

            scene.getChildAt(1).getChildAt(1).meshRenderer.material = bodyMaterial;
            Laya.Texture2D.load("res/textures/MatCap/matcap029_B.jpg", Laya.Handler.create(this, function (tex) { bodyMaterial.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/CarBody.png", Laya.Handler.create(this, function (tex) { bodyMaterial.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(2).meshRenderer.material = CarFaceMat;
            CarFaceMat.MainColor = new Laya.Vector3(0.1, 0.1, 0.1);
            Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarFaceMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/carFace.jpg", Laya.Handler.create(this, function (tex) { CarFaceMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(3).meshRenderer.material = CarLineMat;
            scene.getChildAt(1).getChildAt(4).meshRenderer.material = CarLineMat;
            scene.getChildAt(1).getChildAt(5).meshRenderer.material = CarLineMat;
            CarLineMat.MainColor = new Laya.Vector3(0.15, 0.15, 0.15);
            Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarLineMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/carline.jpg", Laya.Handler.create(this, function (tex) { CarLineMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(6).meshRenderer.material = DiZuoMat;
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/diZuo.png", Laya.Handler.create(this, function (tex) { DiZuoMat.DiffuseTexture = tex; }));

            scene.getChildAt(1).getChildAt(7).meshRenderer.material = CarGlassMat;
            CarGlassMat.MainColor = new Laya.Vector3(0.0, 0.0, 0.0);
            Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarGlassMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { CarGlassMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(8).meshRenderer.material = CarLunGuMat;
            scene.getChildAt(1).getChildAt(9).meshRenderer.material = CarLunGuMat;
            scene.getChildAt(1).getChildAt(10).meshRenderer.material = CarLunGuMat;
            scene.getChildAt(1).getChildAt(11).meshRenderer.material = CarLunGuMat;
            CarLunGuMat.MainColor = new Laya.Vector3(0.15, 0.15, 0.15);
            Laya.Texture2D.load("res/textures/MatCap/matcap018.jpg", Laya.Handler.create(this, function (tex) { CarLunGuMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/lungu.png", Laya.Handler.create(this, function (tex) { CarLunGuMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(12).meshRenderer.material = CarLunTaiMat;
            CarLunTaiMat.MainColor = new Laya.Vector3(0.1, 0.1, 0.1);
            Laya.Texture2D.load("res/textures/MatCap/matcap020.jpg", Laya.Handler.create(this, function (tex) { CarLunTaiMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/lunTai.png", Laya.Handler.create(this, function (tex) { CarLunTaiMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(13).meshRenderer.material = CarTaillight;
            CarTaillight.MainColor = new Laya.Vector3(0.6, 0.1, 0.1);
            Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { CarTaillight.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { CarTaillight.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(14).meshRenderer.material = windowMat;
            windowMat.MainColor = new Laya.Vector3(0.0, 0.0, 0.0);
            Laya.Texture2D.load("res/textures/MatCap/matcap019.jpg", Laya.Handler.create(this, function (tex) { windowMat.MatCapTexture = tex; }));
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/write.jpg", Laya.Handler.create(this, function (tex) { windowMat.OccMap = tex; }));

            scene.getChildAt(1).getChildAt(15).meshRenderer.material = ZhongKuMat;
            Laya.Texture2D.load("res/models/Audi_A4/Assets/audi_a4/CarID.jpg", Laya.Handler.create(this, function (tex) { ZhongKuMat.DiffuseTexture = tex; }));

            Laya.timer.frameLoop(1, this, function () { scene.getChildAt(1).transform.rotate(new Laya.Vector3(0, 0.002, 0), false); });

        }));
    }
}