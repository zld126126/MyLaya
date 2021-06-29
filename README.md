# MyLaya
> 初学laya，LAYAAir + FGUI入门<br/>
> 项目补充:部分ts/js互相调用<br/>
- [MyLaya](#mylaya)
  - [项目结构:](#项目结构)
    - [整个是一个laya空项目结构](#整个是一个laya空项目结构)
  - [启动项目:](#启动项目)
    - [如果想在vscode中编译laya：](#如果想在vscode中编译laya)
    - [特殊说明:](#特殊说明)

## 项目结构:
### 整个是一个laya空项目结构
> src/UI      --> fairygui 生成的代码<br/>
> UIProject   --> fairygui 原始项目<br/>

## 启动项目:
> 方式1:<br/>
> 用layaide打开.laya文件 ==> 直接运行<br/>
> 方式2:<br/>
> vscode:需要配置launch.json ==> "runtimeExecutable": "D://Program Files//Chrome//Chrome.exe", <br/>
> npm install<br/>
> ctrl+F5<br/>

### 如果想在vscode中编译laya：
> 请打开tools文件夹<br/>
> 最后在vscode中ctrl+shift+b ==> build 任务运行 ==> F5运行即可<br/>
> tasks.json ==> 方法1 需要配合tools文件夹操作<br/>
> tasks.json ==> 默认方法 方法2 需要配合下文[特殊说明]操作<br/>

### 特殊说明:
> http://ask.layabox.com/article/8<br/>
> https://www.npmjs.com/package/layaair2-cmd<br/>
> 根据官网方案 layaair2-cmd 需要 node v10.0*版本<br/>
> 执行如下:<br/>
> npm install layaair2-cmd -g<br/>
> npm install gulp -g<br/>

