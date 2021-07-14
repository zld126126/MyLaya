import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";

export class PhysicsWorld_CollisionFiflter extends SingletonScene {
    private plane: Laya.MeshSprite3D;
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
    private mat2: Laya.BlinnPhongMaterial;
    private mat3: Laya.BlinnPhongMaterial;
    private mat4: Laya.BlinnPhongMaterial;
    private mat5: Laya.BlinnPhongMaterial;


    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Laya.Stage.SCALE_FULL;
        // Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
        // Laya.Stat.show();

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

        //资源加载
        this.mat1 = new Laya.BlinnPhongMaterial();
        this.mat2 = new Laya.BlinnPhongMaterial();
        this.mat3 = new Laya.BlinnPhongMaterial();
        this.mat4 = new Laya.BlinnPhongMaterial();
        this.mat5 = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            this.mat1.albedoTexture = tex;
        }));
        this.mat1.albedoColor = new Laya.Vector4(1.0, 1.0, 1.0, 1.0);
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
            this.mat3.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Laya.Handler.create(this, function (tex) {
            this.mat2.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel2.jpg", Laya.Handler.create(this, function (tex) {
            this.mat4.albedoTexture = tex;
        }));
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/steel.jpg", Laya.Handler.create(this, function (tex) {
            this.mat5.albedoTexture = tex;
        }));


        this.plane = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(20, 20, 10, 10))) as Laya.MeshSprite3D;
        var planeMat: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Laya.Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Laya.Handler.create(null, function (tex: Laya.Texture2D): void {
            planeMat.albedoTexture = tex;
        }));
        planeMat.tilingOffset = new Laya.Vector4(2, 2, 0, 0);
        this.plane.meshRenderer.material = planeMat;

        var staticCollider: Laya.PhysicsCollider = this.plane.addComponent(Laya.PhysicsCollider) as Laya.PhysicsCollider;
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(20, 0, 20);
        staticCollider.colliderShape = boxShape;

        this.addKinematicSphere();
        for (var i: number = 0; i < 30; i++) {
            this.addBox();
            this.addCapsule();
            this.addCone();
            this.addCylinder();
            this.addSphere();
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
        rigidBody.canCollideWith = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//只与自定义组1碰撞(如果多组采用位操作）

        this.kinematicSphere = sphere;
        Laya.timer.frameLoop(1, this, this.onKeyDown);
    }

    private onKeyDown(): void {
        Laya.KeyBoardManager.hasKeyDown(87) && this.kinematicSphere.transform.translate(this.translateW);//W
        Laya.KeyBoardManager.hasKeyDown(83) && this.kinematicSphere.transform.translate(this.translateS);//S
        Laya.KeyBoardManager.hasKeyDown(65) && this.kinematicSphere.transform.translate(this.translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && this.kinematicSphere.transform.translate(this.translateD);//D
        Laya.KeyBoardManager.hasKeyDown(81) && this.plane.transform.translate(this.translateQ);//Q
        Laya.KeyBoardManager.hasKeyDown(69) && this.plane.transform.translate(this.translateE);//E
    }

    public addBox(): void {
        var sX: number = Math.random() * 0.75 + 0.25;
        var sY: number = Math.random() * 0.75 + 0.25;
        var sZ: number = Math.random() * 0.75 + 0.25;
        var box: Laya.MeshSprite3D = this.s_scene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(sX, sY, sZ))) as Laya.MeshSprite3D;
        box.meshRenderer.material = this.mat1;
        this.tmpVector.setValue(Math.random() * 16 - 8, sY / 2, Math.random() * 16 - 8);
        box.transform.position = this.tmpVector;
        this.tmpVector.setValue(0, Math.random() * 360, 0);
        box.transform.rotationEuler = this.tmpVector;

        var rigidBody: Laya.Rigidbody3D = box.addComponent(Laya.Rigidbody3D);
        var boxShape: Laya.BoxColliderShape = new Laya.BoxColliderShape(sX, sY, sZ);
        rigidBody.colliderShape = boxShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER1;//自定义组1
    }

    public addCapsule(): void {
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

        var rigidBody: Laya.Rigidbody3D = capsule.addComponent(Laya.Rigidbody3D);
        var sphereShape: Laya.CapsuleColliderShape = new Laya.CapsuleColliderShape(raidius, height);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER2;//自定义组2,会跳过碰撞

    }
    //添加球体
    private addSphere(): void {
        let radius = Math.random() * 0.2 + 0.2;
        let sphere: Laya.MeshSprite3D = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createSphere(radius));
        this.s_scene.addChild(sphere);
        sphere.meshRenderer.material = this.mat2;
        let pos = sphere.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        sphere.transform.position = pos;
        let rigidBody = sphere.addComponent(Laya.Rigidbody3D);
        let sphereShape = new Laya.SphereColliderShape(radius);
        rigidBody.colliderShape = sphereShape;
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER3;//自定义组3
    }
    //添加圆锥
    private addCone(): void {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cone = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCone(raidius, height));
        this.s_scene.addChild(cone);
        //设置材质
        cone.meshRenderer.material = this.mat4;
        //设置位置
        let pos = cone.transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        cone.transform.position = pos;
        //创建刚体碰撞器
        let rigidBody = cone.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let coneShape = new Laya.ConeColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = coneShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER4;//自定义组4
    }
    //添加圆柱
    private addCylinder(): void {
        let raidius = Math.random() * 0.2 + 0.2;
        let height = Math.random() * 0.5 + 0.8;
        //创建圆锥MeshSprite3D
        let cylinder = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createCylinder(raidius, height));
        this.s_scene.addChild(cylinder);
        //设置材质
        cylinder.meshRenderer.material = this.mat5;

        let transform = cylinder.transform;
        let pos = transform.position;
        pos.setValue(Math.random() * 4 - 2, 10, Math.random() * 4 - 2);
        transform.position = pos;
        let rotationEuler = transform.rotationEuler;
        rotationEuler.setValue(Math.random() * 360, Math.random() * 360, Math.random() * 360);
        transform.rotationEuler = rotationEuler;

        //创建刚体碰撞器
        let rigidBody = cylinder.addComponent(Laya.Rigidbody3D);
        //创建球型碰撞器
        let cylinderShape = new Laya.CylinderColliderShape(raidius, height);
        //设置刚体碰撞器的形状
        rigidBody.colliderShape = cylinderShape;
        //设置刚体碰撞器的质量
        rigidBody.mass = 10;
        rigidBody.collisionGroup = Laya.Physics3DUtils.COLLISIONFILTERGROUP_CUSTOMFILTER5;//自定义组5
    }
}