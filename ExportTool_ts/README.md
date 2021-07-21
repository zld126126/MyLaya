# 导表工具
## 工具目录必须在ChatWith\tools\export_tools
## 包含功能:ts导表工具 xlsx转csv csv转json 二进制zlib压缩等

## 改造GUI可视化
### cmd和gui都可以实现功能
## gui 安装类库
### go get github.com/andlabs/libui
### go get github.com/andlabs/ui
## gcc 安装类库
### https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win32/Personal%20Builds/mingw-builds/installer/mingw-w64-install.exe

## windows 运行 不显示cmd窗口
### go build  -ldflags="-H windowsgui"

## 导表工具操作目录
### \config

## 导表工具输出目录
### \result

## 用法
### 直接运行 export_tool*.exe即可 gui版本和cmd版本都行

## 编译流程:
### 本项目提供源代码,方便其他后来人维护调整
### 在export_tool目录,cmd 运行 go build,export_tool.exe会重新生成

## 其他
### 本工具用golang1.16编译
### 例子可见config目录 result目录
### 导出格式 json/二进制.bin文件
### 本工具中xlsx说明:
### [n] 数字
### [s] 字符串
### [na] 数字数组
### [sa] 字符串数组
### [b] 布尔
### [key] 代表主键

## 作者
### dongbao github.com/zld126126
