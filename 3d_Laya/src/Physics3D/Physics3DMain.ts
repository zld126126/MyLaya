import SingletonMainScene from "../SingletonMainScene";
import { EventManager, EventType } from "../EventManager";
import { GlobalConfig } from "../GlobalConfig";
import { PhysicsWorld_BaseCollider } from "./PhysicsWorld_BaseCollidert";
import { PhysicsWorld_BuildingBlocks } from "./PhysicsWorld_BuildingBlocks";
import { PhysicsWorld_Character } from "./PhysicsWorld_Character";
import { PhysicsWorld_CollisionFiflter } from "./PhysicsWorld_CollisionFiflter";
import { PhysicsWorld_CompoundCollider } from "./PhysicsWorld_CompoundCollider";
import { PhysicsWorld_ContinueCollisionDetection } from "./PhysicsWorld_ContinueCollisionDetection";
import { PhysicsWorld_Kinematic } from "./PhysicsWorld_Kinematic";
import { PhysicsWorld_MeshCollider } from "./PhysicsWorld_MeshCollider";
import { PhysicsWorld_TriggerAndCollisionEvent } from "./PhysicsWorld_TriggerAndCollisionEvent";
import { PhysicsWorld_RayShapeCast } from "./PhysicsWorld_RayShapeCast";
import { PhysicsWorld_ConstraintFixedJoint } from "./PhysicsWorld_ConstraintFixedJoint";
import { PhysicsWorld_ConfigurableJoint } from "./PhysicsWorld_ConfigurableJoint";

export class Physics3DMain extends SingletonMainScene {
    private btnNameArr: Array<string> = [
        "返回主页",
        "基础碰撞器", "选取物体", "角色碰撞器", "碰撞器过滤器", "碰撞器混合",
        "连续碰撞检测", "刚起碰撞", "网格碰撞器", "射线检测", "触发和碰撞事件",
        "固定关节", "可配置关节"
    ];

    constructor() {
        super();
        Laya.stage.addChild(this);
        this.LoadExamples();
    }

    // 加载例子
    LoadExamples() {
        for (let index = 0; index < this.btnNameArr.length; index++) {
            this.createButton(this.btnNameArr[index], this._onclick, index);
        }
    }

    /**
     * 
     * @param name 按钮名称
     * @param cb 绑定方法
     * @param index index游标
     * @param skin 按钮皮肤
     */
    private createButton(name: string, cb: Function, index: number, skin: string = GlobalConfig.ResPath + "res/threeDimen/ui/button.png"): Laya.Button {
        var btn: Laya.Button = new Laya.Button(skin, name);
        btn.on(Laya.Event.CLICK, this, cb, [name]);
        btn.pos(Laya.stage.width - 50, Laya.stage.height - 50);
        btn.size(50, 20);
        btn.name = name;
        btn.right = 5;
        btn.top = index * (btn.height + 5);
        this.addChild(btn);
        return btn;
    }

    // 绑定点击事件
    private _onclick(name: string) {
        switch (name) {
            case this.btnNameArr[0]:
                this.Hide();
                EventManager.DispatchEvent(EventType.BACKTOMAIN);
                break;
            case this.btnNameArr[1]:
                PhysicsWorld_BaseCollider.getInstance().Click();
                break;
            case this.btnNameArr[2]:
                PhysicsWorld_BuildingBlocks.getInstance().Click();
                break;
            case this.btnNameArr[3]:
                PhysicsWorld_Character.getInstance().Click();
                break;
            case this.btnNameArr[4]:
                PhysicsWorld_CollisionFiflter.getInstance().Click();
                break;
            case this.btnNameArr[5]:
                PhysicsWorld_CompoundCollider.getInstance().Click();
                break;
            case this.btnNameArr[6]:
                PhysicsWorld_ContinueCollisionDetection.getInstance().Click();
                break;
            case this.btnNameArr[7]:
                PhysicsWorld_Kinematic.getInstance().Click();
                break;
            case this.btnNameArr[8]:
                PhysicsWorld_MeshCollider.getInstance().Click();
                break;
            case this.btnNameArr[9]:
                PhysicsWorld_RayShapeCast.getInstance().Click();
                break;
            case this.btnNameArr[10]:
                PhysicsWorld_TriggerAndCollisionEvent.getInstance().Click();
                break;
            case this.btnNameArr[11]:
                PhysicsWorld_ConstraintFixedJoint.getInstance().Click();
                break;
            case this.btnNameArr[12]:
                PhysicsWorld_ConfigurableJoint.getInstance().Click();
                break;
        }
        console.log(name + "按钮_被点击");
    }
}