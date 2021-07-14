import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import DirectionLight = Laya.DirectionLight;
import Matrix4x4 = Laya.Matrix4x4;
import MeshSprite3D = Laya.MeshSprite3D;
import PrimitiveMesh = Laya.PrimitiveMesh;
import Transform3D = Laya.Transform3D;
import Rigidbody3D = Laya.Rigidbody3D;
import BoxColliderShape = Laya.BoxColliderShape;
import Texture2D = Laya.Texture2D;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import FixedConstraint = Laya.FixedConstraint;
import Script3D = Laya.Script3D;
import Handler = Laya.Handler;

export class PhysicsWorld_ConstraintFixedJoint extends SingletonScene {
    private s_scene: Scene3D;
    private camera: Camera;
    constructor() {
        super();
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // Stat.show();
        this.s_scene = new Scene3D();
        this.camera = (<Camera>this.s_scene.addChild(new Camera(0, 0.1, 100)));
        this.camera.transform.translate(new Vector3(0, 3, 10));
        this.camera.clearColor = null;
        var directionLight: DirectionLight = (<DirectionLight>this.s_scene.addChild(new DirectionLight()));
        directionLight.color = new Vector3(1, 1, 1);
        //directionLight.transform.worldMatrix.setForward(new Vector3(1.0, -0.5, 0.5));
        //设置平行光的方向
        var mat: Matrix4x4 = directionLight.transform.worldMatrix;
        mat.setForward(new Vector3(-1.0, -1.0, -1.0));
        directionLight.transform.worldMatrix = mat;
        this.addbox();
    }

    addbox() {

        //创建盒型MeshSprite3D
        var box: MeshSprite3D = (<MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1))));
        //设置材质
        var transform: Transform3D = box.transform;
        var pos: Vector3 = transform.position;
        pos.setValue(0, 5, 0);
        transform.position = pos;

        //创建刚体碰撞器
        var rigidBody: Rigidbody3D = box.addComponent(Rigidbody3D);
        //创建盒子形状碰撞器
        var boxShape: BoxColliderShape = new BoxColliderShape(1, 1, 1);
        //设置盒子的碰撞形状
        rigidBody.colliderShape = boxShape;

        //设置刚体的质量
        rigidBody.mass = 10;
        rigidBody.isKinematic = true;

        //创建盒型MeshSprite3D
        var box2: MeshSprite3D = (<MeshSprite3D>this.s_scene.addChild(new MeshSprite3D(PrimitiveMesh.createBox(1, 1, 1))));
        //设置材质
        var transform2: Transform3D = box2.transform;
        var pos2: Vector3 = transform2.position;
        pos2.setValue(0, 3, 0);
        transform2.position = pos2;
        //创建刚体碰撞器
        var rigidBody2: Rigidbody3D = box2.addComponent(Rigidbody3D);
        //创建盒子形状碰撞器
        var boxShape2: BoxColliderShape = new BoxColliderShape(1, 1, 1);
        //设置盒子的碰撞形状
        rigidBody2.colliderShape = boxShape2;
        //设置刚体的质量
        rigidBody2.mass = 10;

        //漫反射贴图
        Texture2D.load(GlobalConfig.ResPath + "res/threeDimen/texture/layabox.png", Handler.create(this, function (texture: Texture2D): void {
            this.AutoSetScene3d(this.s_scene);
            var blinnMat: BlinnPhongMaterial = new BlinnPhongMaterial();
            blinnMat.albedoTexture = texture;
            box.meshRenderer.material = blinnMat;
            box2.meshRenderer.material = blinnMat;
        }));

        var fixedConstraint: FixedConstraint = box.addComponent(FixedConstraint);
        fixedConstraint.anchor = new Vector3(0, 0, 0);
        fixedConstraint.connectAnchor = new Vector3(0, 2, 0);
        box.addComponent(FixedEventTest);
        fixedConstraint.setConnectRigidBody(rigidBody, rigidBody2);

    }

}

export class FixedEventTest extends Script3D {
    private fixedConstraint: FixedConstraint;

    onStart() {
        this.fixedConstraint = this.owner.getComponent(FixedConstraint);
        this.fixedConstraint.breakForce = 1000;
    }

    onUpdate() {
        if (this.fixedConstraint) {
            if (this.fixedConstraint.connectedBody){
                var mass = this.fixedConstraint.connectedBody.mass;
                this.fixedConstraint.connectedBody.mass = mass + 1;
            }
        }
    }

    onJointBreak() {
        console.log("break");
    }
}