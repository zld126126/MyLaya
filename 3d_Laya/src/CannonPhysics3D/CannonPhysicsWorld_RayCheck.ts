import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import Camera = Laya.Camera;
import Vector2 = Laya.Vector2;
import Ray = Laya.Ray;
import Vector3 = Laya.Vector3;
import Vector4 = Laya.Vector4;
import MeshSprite3D = Laya.MeshSprite3D;
import DirectionLight = Laya.DirectionLight;
import Matrix4x4 = Laya.Matrix4x4;
import Texture2D = Laya.Texture2D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import CannonPhysicsCollider = Laya.CannonPhysicsCollider;
import CannonBoxColliderShape = Laya.CannonBoxColliderShape;
import Transform3D = Laya.Transform3D;
import Event = Laya.Event;
import CannonRigidbody3D = Laya.CannonRigidbody3D;
import CannonSphereColliderShape = Laya.CannonSphereColliderShape;
import CannonCompoundColliderShape = Laya.CannonCompoundColliderShape;
import MouseManager = Laya.MouseManager;
import CannonHitResult = Laya.CannonHitResult;
import Handler = Laya.Handler;

/**
 * 射线示例测试   点击左键 选中的物体会变红
 */
export class CannonPhysicsWorld_RayCheck extends SingletonScene {
    private s_scene: Scene3D;
    private mat1: BlinnPhongMaterial;
    private mat2: BlinnPhongMaterial;
    private mat3: BlinnPhongMaterial;
    private camera: Camera;
    private point: Vector2 = new Vector2();
    private ray: Ray = new Ray(new Vector3(), new Vector3());
    private colorRed: Vector4 = new Vector4(1, 0, 0, 1);
    private colorWrite: Vector4 = new Vector4(1, 1, 1, 1);
    private oldSelectMesh: MeshSprite3D;
    constructor() {
        super();
        Laya3D.init(0, 0, null, Handler.create(this, () => {
            Config3D.useCannonPhysics = true;
            // Laya.stage.scaleMode = Stage.SCALE_FULL;
            // Laya.stage.screenMode = Stage.SCREEN_NONE;
            // //显示性能面板
            // Stat.show();

            this.s_scene = new Scene3D();

            //初始化照相机
            this.camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 100)));
            this.camera.transform.translate(new Vector3(0, 6, 9.5));
            this.camera.transform.rotate(new Vector3(-15, 0, 0), true, false);
            this.camera.addComponent(CameraMoveScript);
            this.camera.clearColor = null;

            //方向光
            var directionLight: DirectionLight = (<DirectionLight>this.s_scene.addChild(new DirectionLight()));
            directionLight.color = new Vector3(0.6, 0.6, 0.6);
            //设置平行光的方向
            var mat: Matrix4x4 = directionLight.transform.worldMatrix;
            mat.setForward(new Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var plane: MeshSprite3D = (<MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createPlane(20, 20, 10, 10))));
            var planeMat: BlinnPhongMaterial = new BlinnPhongMaterial();
            Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/grass.png", Handler.create(this, function (tex: Texture2D): void {
                this.AutoSetScene3d(this.s_scene);
                planeMat.albedoTexture = tex;
            }));
            //设置纹理平铺和偏移
            var tilingOffset: Vector4 = planeMat.tilingOffset;
            tilingOffset.setValue(5, 5, 0, 0);
            planeMat.tilingOffset = tilingOffset;
            //设置材质
            plane.meshRenderer.material = planeMat;
            var planeCollider: CannonPhysicsCollider = plane.addComponent(CannonPhysicsCollider);
            var planeShape: CannonBoxColliderShape = new CannonBoxColliderShape(20, 0.01, 20);
            planeCollider.colliderShape = planeShape;
            planeCollider.friction = 2;
            planeCollider.restitution = 0.3;
            this.mat1 = new BlinnPhongMaterial();
            this.mat2 = new BlinnPhongMaterial();
            this.mat3 = new BlinnPhongMaterial();
            Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/rocks.jpg", Handler.create(this, function (tex: Texture2D): void {
                this.mat1.albedoTexture = tex;
            }));

            Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/plywood.jpg", Handler.create(this, function (tex: Texture2D): void {
                this.mat2.albedoTexture = tex;
            }));

            Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/Physics/wood.jpg", Handler.create(this, function (tex: Texture2D): void {
                this.mat3.albedoTexture = tex;
            }));

            this.addBox();
            this.addSphere();
            this.addCompoundColliderShape();
            Laya.stage.on(Event.MOUSE_DOWN, this, this.mouseDown);
        }));
    }
    addBox() {
        var sX: number = 1;
        var sY: number = 1;
        var sZ: number = 1;
        //创建盒型MeshSprite3D
        var box: MeshSprite3D = (<MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))));
        box.name = "box";
        //设置材质
        box.meshRenderer.material = this.mat1;
        var transform: Transform3D = box.transform;
        var pos: Vector3 = transform.position;
        pos.setValue(-5, 5, 0);
        transform.position = pos;
        //创建刚体碰撞器
        var rigidBody: CannonRigidbody3D = box.addComponent(CannonRigidbody3D);
        //创建盒子形状碰撞器
        var boxShape: CannonBoxColliderShape = new CannonBoxColliderShape(sX, sY, sZ);
        //设置盒子的碰撞形状
        rigidBody.colliderShape = boxShape;
        //设置刚体的质量
        rigidBody.mass = 10;
    }
    addSphere() {
        var radius: number = 1;
        var sphere: MeshSprite3D = <MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createSphere(1)));
        sphere.name = "sphere";
        sphere.meshRenderer.material = this.mat2;
        var sphereTransform: Transform3D = sphere.transform;
        var pos: Vector3 = sphereTransform.position;
        pos.setValue(0, 5, 0);

        sphereTransform.position = pos;
        //创建刚体碰撞器
        var rigidBody: CannonRigidbody3D = sphere.addComponent(CannonRigidbody3D);
        //创建盒子形状碰撞器
        var sphereShape: CannonSphereColliderShape = new CannonSphereColliderShape(radius);
        //设置盒子的碰撞形状
        rigidBody.colliderShape = sphereShape;
        //设置刚体的质量
        rigidBody.mass = 10;
    }
    addCompoundColliderShape() {
        var mesh: MeshSprite3D = this.addMeshBox(5, 5, 0);
        mesh.name = "compound"
        var scale: Vector3 = mesh.transform.getWorldLossyScale();
        //测试Scale
        scale.setValue(0.5, 0.5, 0.5);
        mesh.transform.setWorldLossyScale(scale);
        this.s_scene.addChild(mesh);
        //创建刚体碰撞器
        var rigidBody: CannonRigidbody3D = mesh.addComponent(CannonRigidbody3D);
        //创建盒子形状碰撞器
        var boxShape0: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
        var boxShape1: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
        var boxShape2: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);
        var boxShape3: CannonBoxColliderShape = new CannonBoxColliderShape(1, 1, 1);

        var boxCompoundShape: CannonCompoundColliderShape = new CannonCompoundColliderShape();
        (<any>boxCompoundShape).addChildShape(boxShape0, new Vector3(0.5, 0.5, 0));
        (<any>boxCompoundShape).addChildShape(boxShape1, new Vector3(0.5, -0.5, 0));
        (<any>boxCompoundShape).addChildShape(boxShape2, new Vector3(-0.5, 0.5, 0));
        (<any>boxCompoundShape).addChildShape(boxShape3, new Vector3(-0.5, -0.5));
        //设置盒子的碰撞形状
        rigidBody.colliderShape = boxCompoundShape;
        //设置刚体的质量
        rigidBody.mass = 10;
    }
    addMeshBox(x: number, y: number, z: number): MeshSprite3D {
        var sX: number = 2;
        var sY: number = 2;
        var sZ: number = 1;
        //创建盒型MeshSprite3D
        var box: MeshSprite3D = (<MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(sX, sY, sZ))));
        //设置材质
        box.meshRenderer.material = this.mat3;
        var transform: Transform3D = box.transform;
        var pos: Vector3 = transform.position;
        pos.setValue(x, y, z);
        transform.position = pos;
        return box;
    }

    mouseDown() {
        this.point.x = MouseManager.instance.mouseX;
        this.point.y = MouseManager.instance.mouseY;
        //产生射线
        this.camera.viewportPointToRay(this.point, this.ray);
        var out: CannonHitResult = new CannonHitResult();
        this.s_scene.cannonPhysicsSimulation.rayCast(this.ray, out);
        if (out.succeeded) {

            var selectSprite3D: MeshSprite3D = <MeshSprite3D>out.collider.owner;
            (<BlinnPhongMaterial>selectSprite3D.meshRenderer.sharedMaterial).albedoColor = this.colorRed;
            if (this.oldSelectMesh)
                if (selectSprite3D != this.oldSelectMesh)
                    (<BlinnPhongMaterial>this.oldSelectMesh.meshRenderer.sharedMaterial).albedoColor = this.colorWrite;
            this.oldSelectMesh = selectSprite3D;
        }

    }
}