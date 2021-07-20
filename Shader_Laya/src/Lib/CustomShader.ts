class CustomShader extends Laya.Material {

    constructor() 
    { 
        super(); 
        this.setShaderName("CustomShaderShader"); //设置本材质使用的shader名字
    }

    //初始化我们的自定义shader
    static initShader() {
        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,  //顶点信息
        };
        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE, //Mvp矩阵
        };

        //所有的stateMap属性
        var stateMap = 
        {
            's_Cull': Laya.Shader3D.RENDER_STATE_CULL,       //裁切
            's_Blend': Laya.Shader3D.RENDER_STATE_BLEND,     //开启混合
            's_BlendSrc': Laya.Shader3D.RENDER_STATE_BLEND_SRC,    //混合模式
            's_BlendDst': Laya.Shader3D.RENDER_STATE_BLEND_DST,    //混合模式
            's_DepthTest': Laya.Shader3D.RENDER_STATE_DEPTH_TEST,  //深度测试
            's_DepthWrite': Laya.Shader3D.RENDER_STATE_DEPTH_WRITE  //深度写入
        };

        let VS = `
            #include "Lighting.glsl";    //加载lighting库
            attribute vec4 a_Position;    //声明a_Position变量
            uniform mat4 u_MvpMatrix;    //声明Mvp变量

            //主函数
            void main()
            {
                gl_Position = u_MvpMatrix * a_Position;
            } `;

        let FS = `
            //数据类型精度
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            //主函数
            void main()
            {    
                gl_FragColor = vec4(0.5,0.5,0,1.0);
            }`;

        //注册CustomShader 
        var customShader = Laya.Shader3D.add("CustomShaderShader");
        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        //我们的自定义shader customShader中添加我们新创建的subShader
        customShader.addSubShader(subShader);
        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }
}