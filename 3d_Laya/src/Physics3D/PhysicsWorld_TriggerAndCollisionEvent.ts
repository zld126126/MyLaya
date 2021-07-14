import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class TriggerCollisionScript extends Laya.Script3D {
    public kinematicSprite: Laya.Sprite3D;

    constructor() {
        super();
    }

    public onTriggerEnter(other: Laya.PhysicsComponent): void {
        (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRenderer).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.0, 1.0, 0.0, 1.0);
    }

    public onTriggerStay(other: Laya.PhysicsComponent): void {

    }

    public onTriggerExit(other: Laya.PhysicsComponent): void {
        (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRenderer).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
    }

    public onCollisionEnter(collision: Laya.Collision): void {
        if (collision.other.owner === this.kinematicSprite)
            (((this.owner as Laya.MeshSprite3D).meshRenderer as Laya.MeshRenderer).sharedMaterial as Laya.BlinnPhongMaterial).albedoColor = new Laya.Vector4(0.0, 0.0, 0.0, 1.0);
    }

    public onCollisionStay(collision: Laya.Collision): void {
    }

    public onCollisionExit(collision: Laya.Collision): void {
    }

}

export class PhysicsWorld_TriggerAndCollisionEvent extends SingletonScene{
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
    constructor() {
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();
        super();

        this.s_scene = new Laya.Scene3D();

        this.camera = this.s_scene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
        this.camera.transform.translate(new Laya.Vector3(0, 8, 18));
        this.camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);
        //this.camera.clearColor = null;

        var directionLight: Laya.DirectionLight = this.s_scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(1, 1, 1);
        var mat = directionLight.transform.worldMatrix;
        mat.setForward(new Laya.Vector3(-1.0, -1.0, 1.0));
        directionLight.transform.worldMatrix = mat;

        var plane: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
        var planeMat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        plane.meshRenderer.material = planeMat;

        var staticCollider: Laya.PhysicsCollider = plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
        staticCollider.colliderShape = boxShape;

        this.addKinematicSphere();
        for (var i: number = 0; i < 30; i++) {
            this.addBoxAndTrigger();
            this.addCapsuleCollision();
        }
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

    public addBoxAndTrigger(): void {
        var mat1: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(null, function (tex: Laya.Texture2D): void {
            mat1.albedoTexture = tex;
        }));
        mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);

        var sX: number = Math.random() * 0.75 + 0.25;
        var sY: number = Math.random() * 0.75 + 0.25;
        var sZ: number = Math.random() * 0.75 + 0.25;
        var box: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = mat1;
        box.transform.position = new Laya.Vector3(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        box.transform.rotationEuler = new Laya.Vector3(0, Math.random() * 360, 0);

        var staticCollider: Laya.PhysicsCollider = box.addComponent(Laya.PhysicsCollider);//StaticCollider可与非Kinematic类型RigidBody3D产生碰撞
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        staticCollider.colliderShape = boxShape;
        staticCollider.isTrigger = true;//标记为触发器,取消物理反馈
        var script: TriggerCollisionScript = box.addComponent(TriggerCollisionScript);
        script.kinematicSprite = this.kinematicSphere;
    }

    public addCapsuleCollision(): void {
        var mat3: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex: Laya.Texture2D): void {
            mat3.albedoTexture = tex;
        }));

        var raidius: number = Math.random() * 0.2 + 0.2;
        var height: number = Math.random() * 0.5 + 0.8;
        var capsule: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCapsule(raidius, height))) as Laya.MeshSprite3D;
        capsule.meshRenderer.material = mat3;
        this.tmpVector.setValue(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        capsule.transform.position = this.tmpVector;
        this.tmpVector.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        capsule.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);//Rigidbody3D可与StaticCollider和RigidBody3D产生碰撞
        var sphereShape: Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        var script: TriggerCollisionScript = capsule.addComponent(TriggerCollisionScript);
        script.kinematicSprite = this.kinematicSphere;

    }

    public addSphere(): void {
        var mat2: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(null, function (tex: Laya.Texture2D): void {
            mat2.albedoTexture = tex;
        }));

        var radius: number = Math.random() * 0.2 + 0.2;
        var sphere: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius))) as Laya.MeshSprite3D;
        sphere.meshRenderer.material = mat2;
        this.tmpVector.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = sphere.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.SphereColliderShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
    }
}