import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class PhysicsWorld_Kinematic extends SingletonScene{
    private s_scene: Laya.Scene3D;
    private camera: Laya.Camera;
    private kinematicSphere: Laya.Sprite3D;

    private translateW: Laya.Vector3 = new Laya.Vector3(0, 0, -0.2);
    private translateS: Laya.Vector3 = new Laya.Vector3(0, 0, 0.2);
    private translateA: Laya.Vector3 = new Laya.Vector3(-0.2, 0, 0);
    private translateD: Laya.Vector3 = new Laya.Vector3(0.2, 0, 0);
    private translateQ: Laya.Vector3 = new Laya.Vector3(-0.01, 0, 0);
    private translateE: Laya.Vector3 = new Laya.Vector3(0.01, 0, 0);
    private tmpVector: Laya.Vector3 = new Laya.Vector3(0, 0, 0);

    private mat1: Laya.BlinnPhongMaterial;
    private mat3: Laya.BlinnPhongMaterial;

    constructor() {
        // Laya3D.init(0, 0, null);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();
        this.s_scene = new Laya.Scene3D();

        this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 8, 20));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        //this.camera.clearColor = null;

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;

        //加载资源
        this.mat1 = new Laya.BlinnPhongMaterial();
        this.mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            this.mat1.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.mat3.albedoTexture = tex;
        }));
        var plane: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
        var planeMat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;

        var rigidBody: Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
        rigidBody.colliderShape = boxShape;

        for (var i: number = 0; i < 60; i++) {
            this.addBox();
            this.addCapsule();
        }

        this.addKinematicSphere();
    }
    public addKinematicSphere(): void {
        var mat2: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex: Laya.Texture2D): void {
            mat2.albedoTexture = tex;
        }));
        mat2.albedoColor = new Laya.Vector4(1.0, 0.0, 0.0, 1.0);

        var radius: number = 0.8;
        var sphere: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        sphere.transform.position = new Laya.Vector3(0, 0.8, 0);

        var rigidBody: Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 60;
        rigidBody.isKinematic = true;


        this.kinematicSphere = sphere;
        Laya.timer.frameLoop(1, this, this.onKeyDown);
    }

    private onKeyDown(): void {
        Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);//W
        Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);//S
        Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);//D
        Laya.KeyBoardManager.hasKeyDown(81) && this.kinematicSphere.transform.translate(this.translateQ);//Q
        Laya.KeyBoardManager.hasKeyDown(69) && this.kinematicSphere.transform.translate(this.translateE);//E
    }

    public addBox(): void {
        var sX: number = Math.random() * 0.75 + 0.25;
        var sY: number = Math.random() * 0.75 + 0.25;
        var sZ: number = Math.random() * 0.75 + 0.25;
        var box: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        box.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }

    public addCapsule(): void {
        var raidius: number = Math.random() * 0.2 + 0.2;
        var height: number = Math.random() * 0.5 + 0.8;
        var capsule: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = this.mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
}