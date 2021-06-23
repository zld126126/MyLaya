# MyLaya
## 初学laya，LAYAAir + FGUI入门项目
## 补充:部分ts/js互相调用

## 项目结构:
### 整个是一个laya空项目结构
#### src/UI      --> fairygui 生成的代码
#### UIProject   --> fairygui 原始项目

## 已做部分：
### 页面适配和点击显示

## 启动项目:
### 方式1:
#### 用layaide打开.laya文件 ==> 直接运行
### 方式2:
#### vscode:
#### 需要配置launch.json ==> "runtimeExecutable": "D://Program Files//Chrome//Chrome.exe",
#### npm install
#### ctrl+F5

### 如果想在vscode中编译laya：
#### 请打开tools文件夹
#### 最后在vscode中ctrl+shift+b ==> build 任务运行 ==> F5运行即可
#### tasks.json ==> 方法1 需要配合tools文件夹操作
#### tasks.json ==> 默认方法 方法2 需要配合下文[特殊说明]操作

### 特殊说明:
#### http://ask.layabox.com/article/8
#### https://www.npmjs.com/package/layaair2-cmd
#### 根据官网方案 layaair2-cmd 需要 node v10.0*版本
#### 执行如下:
#### npm install layaair2-cmd -g 
#### npm install gulp -g

