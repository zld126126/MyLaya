# protobuffer-laya
- [protobuffer-laya](#protobuffer-laya)
    - [安装环境pb-egret](#安装环境pb-egret)
    - [配置pb-egret](#配置pb-egret)
    - [参考文档:](#参考文档)

### 安装环境pb-egret
>npm install protobufjs@6.8.4 -g
>
>npm install @egret/protobuf -g

### 配置pb-egret
> 1. 运行pb-egret add 禁止运行
> 
> 2. PowerShell 运行:Set-ExecutionPolicy Unrestricted -> Y
>
> 3. PowerShell 项目目录运行: pb-egret add
> 
> 4. 写一个测试用.proto文件，放在protobuf/protofile文件夹下
> 
> 5. 项目中运行:pb-egret generate
>
> 6. 修改项目protobuf文件夹下的pbconfig.json

> 7. 复制js
> 
>       复制protobuf/library下的protobuf-library.min.js到项目bin/libs下
>
>       复制protobuf/library下的protobuf-library.d.ts到项目libs下
>
>       复制protobuf/bundles下的protobuf-bundles.min.js到项目bin/libs下
>
>       复制protobuf/bundles下的protobuf-bundles.d.ts到项目libs下

> 8. 更改index.js

### 参考文档:
>https://www.cnblogs.com/gamedaybyday/p/12716984.html

