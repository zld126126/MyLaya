import { CameraMoveScript } from "../common/CameraMoveScript";
import { GlobalConfig } from "../GlobalConfig";
import SingletonScene from "../SingletonScene";
import MeshTerrainSprite3D = Laya.MeshTerrainSprite3D;
import Sprite3D = Laya.Sprite3D;
import Vector3 = Laya.Vector3;
import Scene3D = Laya.Scene3D;
import Texture2D = Laya.Texture2D;
import Loader = Laya.Loader;
import MeshSprite3D = Laya.MeshSprite3D;
import Mesh = Laya.Mesh;
import Animator = Laya.Animator;
import AnimatorState = Laya.AnimatorState;
import BlinnPhongMaterial = Laya.BlinnPhongMaterial;
import Camera = Laya.Camera;
import SkinnedMeshSprite3D = Laya.SkinnedMeshSprite3D;
import Tween = Laya.Tween;
import Event = Laya.Event;
import Handler = Laya.Handler;
/**
 * 本实例使用的A星算法，来源于开源A星算法:https://github.com/bgrins/javascript-astar
 */
export class AStarFindPath extends SingletonScene{

    private terrainSprite: MeshTerrainSprite3D;
    private layaMonkey: Sprite3D;
    private path: Vector3[];
    private _everyPath: any[];
    private _position: Vector3 = new Vector3(0, 0, 0);
    private _upVector3: Vector3 = new Vector3(0, 1, 0);
    private _tarPosition: Vector3 = new Vector3(0, 0, 0);
    private _finalPosition: Vector3 = new Vector3(0, 0, 0);
    private _rotation: Vector3 = new Vector3(-45, 180, 0);
    private _rotation2: Vector3 = new Vector3(0, 180, 0);
    private index: number = 0;
    private curPathIndex: number = 0;
    private nextPathIndex: number = 1;
    private moveSprite3D: Sprite3D;
    private pointCount: number = 10;
    private s_scene: Scene3D;

    //寻路使用的变量
    private aStarMap: any;
    private graph: any;
    private opts: any;
    private resPath: any;
    constructor() {
        // //初始化引擎
        // Laya3D.init(0, 0);
        // Laya.stage.scaleMode = Stage.SCALE_FULL;
        // Laya.stage.screenMode = Stage.SCREEN_NONE;
        // //显示性能面板
        // Stat.show();
        super();

        this.path = [];

        //预加载所有资源
        var resource = [{ url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/XunLongShi.ls", clas: Scene3D, priority: 1 },
        { url: GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh", clas: Sprite3D, priority: 1 },
        { url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png", clas: Texture2D, priority: 1, constructParams: [1024, 1024, 1, false, true] },
        { url: GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png", clas: Texture2D, priority: 1, constructParams: [64, 64, 1, false, true] }];

        Laya.loader.create(resource, Handler.create(this, this.onLoadFinish));
    }

    private onLoadFinish(): void {
        //初始化3D场景
        this.s_scene = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/XunLongShi.ls");
        
        //根据场景中方块生成路径点
        this.initPath(this.s_scene);

        this.AutoSetScene3d(this.s_scene);

        //获取可行走区域模型
        var meshSprite3D: MeshSprite3D = (<MeshSprite3D>this.s_scene.getChildByName('Scenes').getChildByName('HeightMap'));
        //使可行走区域模型隐藏
        meshSprite3D.active = false;
        var heightMap: Texture2D = (<Texture2D>Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/HeightMap.png"));
        //初始化MeshTerrainSprite3D
        this.terrainSprite = MeshTerrainSprite3D.createFromMeshAndHeightMap((<Mesh>meshSprite3D.meshFilter.sharedMesh), heightMap, 6.574996471405029, 10.000000953674316);
        //更新terrainSprite世界矩阵(为可行走区域世界矩阵)
        this.terrainSprite.transform.worldMatrix = meshSprite3D.transform.worldMatrix;

        //读取墙壁的数据
        this.aStarMap = Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/scene/TerrainScene/Assets/AStarMap.png");

        //使用astar组织数据
        var aStarArr = this.createGridFromAStarMap(this.aStarMap);
        this.graph = new (window as any).Graph(aStarArr);
        this.opts = [];
        this.opts.closest = true;
        this.opts.heuristic = (window as any).astar.heuristics.diagonal;

        //初始化移动单元
        this.moveSprite3D = (<Sprite3D>this.s_scene.addChild(new Sprite3D()));
        this.moveSprite3D.transform.position = this.path[0];


        //初始化小猴子
        this.layaMonkey = (<Sprite3D>this.moveSprite3D.addChild(Loader.getRes(GlobalConfig.ResPath + "res/threeDimen/skinModel/LayaMonkey/LayaMonkey.lh")));

        var tmpLocalScale: Vector3 = this.layaMonkey.transform.localScale;
        tmpLocalScale.setValue(0.5, 0.5, 0.5);
        var aniSprite3d: Sprite3D = (<Sprite3D>this.layaMonkey.getChildAt(0));

        //获取动画组件
        var animator: Animator = (<Animator>aniSprite3d.getComponent(Animator));
        //创建动作状态
        var state: AnimatorState = new AnimatorState();
        //动作名称
        state.name = "run";
        //动作播放起始时间
        state.clipStart = 40 / 150;
        //动作播放结束时间
        state.clipEnd = 70 / 150;
        //设置动作
        state.clip = animator.getDefaultState().clip;
        //为动画组件添加一个动作状态
        animator.addState(state);
        //播放动画
        animator.play("run");

        //创建BlinnPhong材质
        var mat: BlinnPhongMaterial = (<BlinnPhongMaterial>((<SkinnedMeshSprite3D>this.layaMonkey.getChildAt(0).getChildAt(0))).skinnedMeshRenderer.sharedMaterial);
        //设置反照率强度
        mat.albedoIntensity = 8;
        //设置猴子精灵的位置
        this.layaMonkey.transform.position.cloneTo(this._finalPosition);

        //初始化相机
        var moveCamera: Camera = (<Camera>this.moveSprite3D.addChild(new Camera()));
        var tmpLocalPosition: Vector3 = moveCamera.transform.localPosition;
        tmpLocalPosition.setValue(-1.912066, 10.07926, -10.11014);
        moveCamera.transform.localPosition = tmpLocalPosition;
        moveCamera.transform.rotate(this._rotation, true, false);
        moveCamera.addComponent(CameraMoveScript);

        //设置鼠标弹起事件响应
        Laya.stage.on(Event.MOUSE_UP, this, function (): void {
            this.index = 0;
            //获取每次生成路径
            var startPoint = this.getGridIndex(this.path[this.curPathIndex % this.pointCount].x, this.path[this.curPathIndex++ % this.pointCount].z);
            var endPoint = this.getGridIndex(this.path[this.nextPathIndex % this.pointCount].x, this.path[this.nextPathIndex++ % this.pointCount].z);
            var start = this.graph.grid[startPoint.x][startPoint.z];
            var end = this.graph.grid[endPoint.x][endPoint.z];

            this._everyPath = (window as any).astar.search(this.graph, start, end, {
                closest: this.opts.closest
            });
            if (this._everyPath && this._everyPath.length > 0) {
                this.resPath = this.getRealPosition(start, this._everyPath);
            }
        });
        //开启定时重复执行
        Laya.timer.loop(40, this, this.loopfun);
    }

    private loopfun(): void {
        if (this.resPath && this.index < this.resPath.length) {
            //AStar寻路位置
            this._position.x = this.resPath[this.index].x;
            this._position.z = this.resPath[this.index++].z;
            //HeightMap获取高度数据
            this._position.y = this.terrainSprite.getHeight(this._position.x, this._position.z);
            if (isNaN(this._position.y)) {
                this._position.y = this.moveSprite3D.transform.position.y;
            }

            //在出发前进行姿态的调整
            if (this.index === 1) {
                //调整方向
                this._tarPosition.x = this.resPath[this.resPath.length - 1].x;
                this._tarPosition.z = this.resPath[this.resPath.length - 1].z;
                this._tarPosition.y = this.moveSprite3D.transform.position.y;
                this.layaMonkey.transform.lookAt(this._tarPosition, this._upVector3, false);
                //因为资源规格,这里需要旋转180度
                this.layaMonkey.transform.rotate(this._rotation2, false, false);
            }
            //调整位置
            Tween.to(this._finalPosition, { x: this._position.x, y: this._position.y, z: this._position.z }, 40);
            this.moveSprite3D.transform.position = this._finalPosition;
        }
    }

    private initPath(scene: Scene3D): void {
        for (var i: number = 0; i < this.pointCount; i++) {
            var str: string = "path" + i;
            this.path.push(((<MeshSprite3D>scene.getChildByName('Scenes').getChildByName('Area').getChildByName(str))).transform.localPosition);
        }
    }

    /**
    * 得到整数的网格索引
    */
    private getGridIndex(x, z): any {
        var minX = this.terrainSprite.minX;
        var minZ = this.terrainSprite.minZ;
        var cellX = this.terrainSprite.width / this.aStarMap.width;
        var cellZ = this.terrainSprite.depth / this.aStarMap.height;
        var gridX = Math.floor((x - minX) / cellX);
        var gridZ = Math.floor((z - minZ) / cellZ);
        var boundWidth = this.aStarMap.width - 1;
        var boundHeight = this.aStarMap.height - 1;
        (gridX > boundWidth) && (gridX = boundWidth);
        (gridZ > boundHeight) && (gridZ = boundHeight);
        (gridX < 0) && (gridX = 0);
        (gridZ < 0) && (gridZ = 0);
        var res: any = [];
        res.x = gridX;
        res.z = gridZ;
        return res;
    }

    /**
     * 得到世界坐标系下的真实坐标
     */
    private getRealPosition(start, path): any {
        var resPath = [];
        var minX = this.terrainSprite.minX;
        var minZ = this.terrainSprite.minZ;
        var cellX = this.terrainSprite.width / this.aStarMap.width;
        var cellZ = this.terrainSprite.depth / this.aStarMap.height;
        var halfCellX = cellX / 2;
        var halfCellZ = cellZ / 2;
        resPath[0] = [];
        resPath[0].x = start.x * cellX + halfCellX + minX;
        resPath[0].z = start.y * cellZ + halfCellZ + minZ;
        for (var i = 1; i < path.length; i++) {
            var gridPos = path[i];
            resPath[i] = [];
            resPath[i].x = gridPos.x * cellX + halfCellX + minX;
            resPath[i].z = gridPos.y * cellZ + halfCellZ + minZ;
        }
        return resPath;
    }

    /**
     * 通过图片数据计算得到AStart网格
     */
    private createGridFromAStarMap(texture): any {
        var textureWidth = texture.width;
        var textureHeight = texture.height;
        var pixelsInfo = texture.getPixels();
        var aStarArr = [];
        var index = 0;
        for (var w = 0; w < textureWidth; w++) {
            var colaStarArr = aStarArr[w] = [];
            for (var h = 0; h < textureHeight; h++) {
                var r = pixelsInfo[index++];
                var g = pixelsInfo[index++];
                var b = pixelsInfo[index++];
                var a = pixelsInfo[index++];
                if (r == 255 && g == 255 && b == 255 && a == 255)
                    colaStarArr[h] = 1;
                else {
                    colaStarArr[h] = 0;
                }
            }
        };
        return aStarArr;
    }
}