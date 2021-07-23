### Laya Stat
Laya的Stat类是一个性能统计面板，用于查看实时更新的性能参数。<br/>
Laya开启性能统计面板，参与统计的性能参数大约1秒更新一次。<br/>
- [Laya Stat](#laya-stat)
  - [FPS](#fps)
  - [Sprite](#sprite)
    - [位图缓存](#位图缓存)
    - [renderTarge缓存](#rendertarge缓存)
    - [命令缓存](#命令缓存)
  - [DrawCall](#drawcall)
  - [DrawCall优化措施](#drawcall优化措施)
  - [RenderBatch](#renderbatch)
  - [SavedRenderBatches](#savedrenderbatches)
  - [CurMem](#curmem)
  - [CPUMemory](#cpumemory)
  - [GPUMemory](#gpumemory)
  - [Shader](#shader)
  - [Canvas](#canvas)

#### FPS
FPS表示每秒传输帧数（Frames Per Second），比如游戏帧率为60FPS表示游戏运行时每个画面执行时间为1/60秒。因此帧率越高视觉上越流程。<br/>

```
Laya.stage.frameRate = Laya.Stage.FRAME_FAST 	60FPS 	高速模式
Laya.stage.frameRate = Laya.Stage.FRAME_SLOW 	30FPS 	低速模式
Laya.stage.frameRate = Laya.Stage.FRAME_MOUSE 	30FPS 	自动模式
Laya.stage.frameRate = Laya.Stage.FRAME_SLEEP 	1FPS 	休眠模式
```

当下PC与手持设备满帧是60FPS，当对画质流畅度要求不高时可采用Laya引擎的帧速限制Laya.stage.frameRate，将FPS帧率限制为Laya.Stage.FRAME_SLOW慢速30帧。<br/>

```
FPS(WebGL) 60 16
```
> 60 	表示当前FPS帧率，值越高越好。<br/>
> 16 	表示每帧渲染所需消耗的毫秒时长，值越小越好。<br/>

#### Sprite
Sprite精灵指的是所有渲染节点包括容器的数量，Sprite值的大小会影响引擎节点遍历、数据组织、渲染效率。因此Sprite统计项的值越小，游戏运行效率越高。因此，在项目设计时，应尽可能减少渲染节点。<br/>

Sprite优化措施
> 尽量减少不必要的层次嵌套以减少Sprite的数量<br/>
> 非可见区域的对象尽量从显示列表中移除或设置visible = true<br/>
> 容器内有大量内容或不经常变化的内容时可以对整个容器设置cacheAs属性以减少Sprite的数量<br/>
> 容量内有动态内容时尽量和静态内容分开，以便只缓存静态内容。<br/>
> 在Panel组件内会针对面板区域外的直接子对象进行不渲染处理，超出面板区域的子对象时不会产生消耗的。<br/>

Laya的Sprite显示对象类的cacheAs存取器用于指定显示对象是否缓存为静态图像<br/>

>cacheAs主要通过两个方面提升性能<br/>
>    减少节点遍历和顶点计算<br/>
>    减少drawCall<br/>

对于一些大型游戏节点数量超过50的UI，采用cacheAs缓存技术后渲染性能会提高很多倍。

当显示对象设置了cacheAs时，子对象如果发生变化则会自动进行重新缓存，也可以设置 staticCache = true 以阻止自动更新缓存，同时也可以手动调用reCache()方法更新缓存。
> 存取器 	描述<br/>
>cacheAs 	指定显示对象是否缓存为静态图像，cacheAs时，子对象发生变化，会自动重新缓存，同时也可以手动调用reCache方法更新缓存。<br/>
>staticCache 	设置cacheAs为非空时此值才有效，staticCache=true时，子对象变化时不会自动更新缓存，只能通过调用reCache方法手动刷新。<br/>

>方法 	描述<br/>
>reCache():void 	在设置cacheAs的情况下，调用reCache()方法会重新刷新缓存。<br/>

建议可以将不经常变化的复杂内容缓存为静态图像，这样能极大地提高渲染性能，cacheAs有none、normal、bitmap三个值可选。如何选择cacheAs的缓存模式，需要对内存的增加与CPU的消耗作为重点考量因素。<br/>
>    取值 	        Canvas模式 	            WebGL模式<br/>
> cacheAs=“none” 	不做任何缓存（默认值） 	 不做任何缓存（默认值）<br/>
> cacheAs=“normal” 	进行画布缓存 	        进行命令缓存<br/>
> cacheAs=“bitmap” 	进行画布缓存 	        使用renderTarget缓存<br/>

##### 位图缓存
当使用bitmap位图缓存模式后，CurMem内存数值有所增加，因为缓存位图时会消耗部分内存，但只要UI的宽高尺寸不是很大，增加的内存也不会很大。最需要注意的实际上是UI是否会频繁地刷新，如果很频繁CPU的损耗就会很大，因为缓存位图时子对象一旦发生改变，引擎会自动重新缓存位图，而缓存位图的过程都会消耗CPU。<br/>

##### renderTarge缓存
WebGL下使用renderTarge缓存相当于缓存成静态位图后提交显卡渲染，WebGL下renderTarget缓存模式有2048大小限制，超出2048会额外增加内存开销。另外，不断重绘时的开销也比较大，但是会减少drawCall，因此渲染性能最高。<br/>

WebGL模式下renderTarge缓存模式缺点在于会额外创建renderTarge渲染目标对象，增加内存开销，而缓存面积有最大2048的限制，因此不断重绘时会增加CPU开销。优点在于可以大幅减少drawcall，因此渲染性能最高。<br/>

##### 命令缓存
WebGL模式下命令缓存模式的缺点在于只会减少节点遍历即命令组织，不会减少drawcall数量，性能中等。优点是没有额外的内存开销，而且无需renderTarge的支持。<br/>

#### DrawCall
DrawCall图像绘制次数是决定性能的重要指标，其值越小游戏运行效率越高，开发建议尽量限制在100以下。<br/>

> Canvas模式下表示每秒图像绘制次数，包括图片、文字、矢量图。<br/>
> WebGL模式下表示每秒渲染提交批次，即每次准备数据并通知GPU渲染绘制的过程称为1次DrawCall。在每次DrawCall中除了在通知GPU的渲染上比较耗时之外，切换材质与shader也是非常耗时的操作。<br/>

在2D引擎中，DrawCall数量过多必然会引起性能下降，LayaAir引擎在图片渲染上做了很多优化，比如相邻的相同图集渲染时会自动合并一起渲染以减少DrawCall数量。如果UI使用时将不同图集或文本穿插，必然会打断图集的合并渲染，造成因开发者使用不当而产生不必要性能开销，导致可能出现性能上的卡顿。<br/>

#### DrawCall优化措施
对复杂的静态内容设置cacheAs属性能大量减少DrawCall<br/>
尽量保证同图集的图片渲染顺序时紧挨着的，如果不同图集交叉渲染会增加DrawCall的数量。<br/>
尽量保证同一个面板中的所有资源使用一个图集以减少提交批次<br/>

#### RenderBatch
Canvas图像绘图次数，WebGL渲染提交批次。<br/>

2D性能通常看drawCall数量，也就时一个drawCall是一个批次。3D性能看drawCall就不准确了，因为3D引擎会进行渲染批次的合并处理，看callDraw数量就很难判断性能问题。因此LayaAir2.0开始推出了一个新的参数 RenderBatch 渲染批次。RenderBatch就是实际渲染的提交批次，数值在满足有误需求的情况下越低越好。<br/>

#### SavedRenderBatches
查看节省的批次数量<br/>

#### CurMem
CurMem当前内存占用，在Canvas模式下表示内存占用大小，值越小越好，过高会导致游戏闪退。WebGL模式下表示内存与显存的占用，值越小越好。<br/>

#### CPUMemory
CPU的内存统计，内存占用。<br/>

在完成图片或图集加载之后，引擎会开始处理图片资源。如果加载的是一张图集，则会处理每张子图片。如果一次性处理大量的图片，则这个过程可能会造成长时间的卡顿。在游戏的资源加载中，可以将资源按照关卡、场景等分类加载。在同一时间处理的图片越好，当时游戏的响应速度也会更快。在资源使用完成后，也可以予以卸载释放内存。<br/>

#### GPUMemory
GPU的内存统计，显存占用。<br/>

#### Shader
Shader表示每秒Shader提交次数，是WebGL模式下独有的性能指标，值越小越好。<br/>

#### Canvas
在Canvas画布模式下尽量减少旋转roration、缩放scale、alpha透明度等属性的使用，这些属性会对性能产生消耗。如需使用，建议在WebGL模式下使用。<br/>

Canvas画布由三个数值组成，只有设置CacheAs后才会有值，默认为0/0/0，从左到右一次表示：<br/>

    每帧重绘的画布数量
    缓存类型为normal类型的画布数量
    缓存类型为bitmap类型的画布数量
在对Canvas画布优化时需要注意的是<br/>

    当对象非常简单，比如一个字或一个图片时，设置cacheAs="bitmap"不但不能提高性能，返回会损失性能。
    当容器内有经常变化的内容时，比如容量内有一个动画或倒计时，对容器设置cacheAs="bitmap"会损失性能。

Laya.Stat
```
静态属性				    类型				默认值				描述
FPS 					    number				0 				每秒帧数
canvasBitmap 			    number 				0 				Canvas画布使用位图渲染的次数
cpuMemory 				    number 				0
frustumCulling 			    number 				0 				视锥剔除次数
gpuMemory 				    number 								字眼管理器所管理资源的累计字节内存数
loopCount 				    number 				0 				舞台渲染次数计数器
octreeNodeCulling 		    number 				0 				八叉树节点剔除次数
renderBatches 			    number 				0 				渲染批次
renderSlow 				    boolean 			false 			表示当前使用的是否为慢速渲染模式
savedRenderBatches 		    number 				0 				节省的渲染批次
shaderCall 				    number 				0 				着色器请求次数
spriteCount 			    number				0 				精灵数量
spriteRenderUseCacheCount 	number				0 				精灵渲染使用缓存Sprite的数量
trianglesFaces 				number 				0 				三角形面数


存取器                          描述
onclick                         点击性能统计显示区域的处理函数


静态方法                        描述
enable():void                   激活性能统计
hide():void 				    隐藏性能统计面板
show():void 				    显示性能统计面板
```