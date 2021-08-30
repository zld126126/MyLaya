# nginx + tomcat + laya 联合部署

## 运行前准备
### 1.nginx 安装和启动(示例:nginx1.21)
    https://www.runoob.com/linux/nginx-install-setup.html

### 2.tomcat 安装和启动(示例:tomcat9)
    需要jdk1.8
    https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html

    完整步骤:
    https://www.cnblogs.com/achengmu/p/7642232.html

### 3.需要一个laya/egret等打包的web项目(Laya空项目)
    https://www.egret.com/
    或者
    https://www.layabox.com/

## 配置和启动
    详情见nginx_tomcat_laya 图文说明.docx文件

    windows-核心启动nginx命令:
    nginx.exe -c conf/nginx.conf

    windows-核心关闭nginx命令:
    taskkill /f /t /im nginx.exe