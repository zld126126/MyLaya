class J3_DiffuseVertex extends Laya.Material {
    
    constructor() 
    { 
        super(); 
        this.setShaderName("J3_DiffuseVertexShader");
    }

    //初始化我们的自定义shader
    static initShader() {

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0             //顶点法线属性
        };
        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,          //世界矩阵  
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,

        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;

            //声明传递给片元着色器的变量
            varying vec3 v_VertexColor;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                mat3 worldMat = mat3(u_WorldMat);       //转成三维矩阵

                vec3 normal = normalize(worldMat*a_Normal);  //物体空间法线转化成世界空间，且归一化


                //漫反射计算公式
                float ln = max (0.0, dot (-lightVec,normal));

                v_VertexColor = lightColor * ln;

                gl_Position = u_MvpMatrix * a_Position;

            } `;

        let FS = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            //接收顶点着色器的变量
            varying vec3 v_VertexColor;

            void main()
            {                    
                gl_FragColor = vec4(v_VertexColor,1.0);
            }`;

        var customShader = Laya.Shader3D.add("J3_DiffuseVertexShader");

        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        customShader.addSubShader(subShader);

        subShader.addShaderPass(VS, FS);
    }
}
