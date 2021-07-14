import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class PhysicsWorld_MeshCollider extends SingletonScene {
    private s_scene: Laya.Scene3D;
    private tmpVector: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private mat1: Laya.BlinnPhongMaterial;
    private mat2: Laya.BlinnPhongMaterial;
    private mat3: Laya.BlinnPhongMaterial;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode =  Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

        this.s_scene = new Laya.Scene3D();

        //初始化照相机
        var camera: Laya.Camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.addComponent(CameraMoveScript);

        //方向光
        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(0.0, -0.8, -1.0));
        directionLight.transform.worldMatrix = mat;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        //资源加载
        this.mat1 = new Laya.BlinnPhongMaterial();
        this.mat2 = new Laya.BlinnPhongMaterial();
        this.mat3 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            this.mat1.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.mat2.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.mat3.albedoTexture = tex;
        }));

        Laya.loader.create([GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm", GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png", "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png"], Laya.Handler.create(this, this.complete));
    }

    public complete(): void {
        var mesh: Laya.Mesh = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard-lizard_geo.lm");
        var albedo: Laya.Texture2D = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_diff.png");
        var normal: Laya.Texture2D = Laya.Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/staticModel/lizard/Assets/Lizard/lizard_norm.png");
        var mat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        mat.specularColor = new Laya.Vector4(0.5, 0.5, 0.5, 0.5);
        mat.albedoTexture = albedo;
        mat.normalTexture = normal;

        var lizard: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
        lizard.transform.localPosition = new Laya.Vector3(-2, 0, 0);
        lizard.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard.meshRenderer.material = mat;
        var lizardCollider: Laya.PhysicsCollider = lizard.addComponent(Laya.PhysicsCollider);
        var meshShape: Laya.MeshColliderShape = new Laya.MeshColliderShape();
        meshShape.mesh = mesh;
        lizardCollider.colliderShape = meshShape;
        lizardCollider.friction = 2;
        lizardCollider.restitution = 0.3;

        var lizard1: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(mesh)) as Laya.MeshSprite3D;
        lizard1.transform.localPosition = new Laya.Vector3(3, 0, 0);
        lizard1.transform.localRotationEuler = new Laya.Vector3(0, 80, 0);
        lizard1.transform.localScale = new Laya.Vector3(0.01, 0.01, 0.01);
        lizard1.meshRenderer.material = mat;
        var lizardCollider1: Laya.PhysicsCollider = lizard1.addComponent(Laya.PhysicsCollider);
        var meshShape1: Laya.MeshColliderShape = new Laya.MeshColliderShape();
        meshShape1.mesh = mesh;
        lizardCollider1.colliderShape = meshShape1;
        lizardCollider1.friction = 2;
        lizardCollider1.restitution = 0.3;

        this.randomAddPhysicsSprite();
    }

    public randomAddPhysicsSprite(): void {
        Laya.timer.loop(1000, this, function (): void {
            var random: number = Math.floor(Math.random() * 3) % 3;
            switch (random) {
                case 0:
                    this.addBox();
                    break;
                case 1:
                    this.addSphere();
                    break;
                case 2:
                    this.addCapsule();
                    break;
                default:
                    break;
            }
        });
    }

    public addBox(): void {
        var sX: number = Math.random() * 0.75 + 0.25;
        var sY: number = Math.random() * 0.75 + 0.25;
        var sZ: number = Math.random() * 0.75 + 0.25;
        var box: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        box.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        box.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
    }

    public addSphere(): void {
        var radius: number = Math.random() * 0.2 + 0.2;
        var sphere: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = this.mat2;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }

    public addCapsule(): void {
        var raidius: number = Math.random() * 0.2 + 0.2;
        var height: number = Math.random() * 0.5 + 0.8;
        var capsule: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = this.mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }


}