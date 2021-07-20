export class CustomMaterial extends Laya.Material {

    //初始化我们的自定义shader
    static initShader() {

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0
        };
        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,

        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;

            varying vec3 v_Normal;

            void main()
            {
                mat3 worldMat=mat3(u_WorldMat);
                v_Normal = worldMat*a_Normal;

                gl_Position = u_MvpMatrix * a_Position;

                gl_Position=remapGLPositionZ(gl_Position);
            } `;

        let FS = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            varying vec3 v_Normal;
            varying vec3 v_Texcoord0;

            void main()
            {    
                gl_FragColor=vec4(v_Normal,1.0);
            }`;

        //注册CustomShader 
        var customShader = Laya.Shader3D.add("CustomShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        customShader.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

    constructor() 
    { 
        
        super(); 

        //设置本材质使用的shader名字
        this.setShaderName("CustomShader");
    }
}