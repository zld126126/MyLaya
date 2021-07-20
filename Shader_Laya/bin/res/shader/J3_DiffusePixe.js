class J3_DiffusePixe extends Laya.Material {

    constructor() 
    { 
        super(); 
        this.setShaderName("J3_DiffusePixeShader");
    }

    /*static __init__(){
        Laya.Scene3D.LIGHTDIRECTION = Laya.Shader3D.propertyNameToID("u_DirectionLight.direction");
        Laya.Scene3D.LIGHTDIRCOLOR = Laya.Shader3D.propertyNameToID("u_DirectionLight.color");
    }*/

    //初始化我们的自定义shader
    static initShader() {

        //J3_DiffusePixe.__init__();

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,            //顶点法线属性
        };
        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,          //世界矩阵  
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,

        };

        let VS = `

            attribute vec4 a_Position;
            attribute vec3 a_Normal;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;

            varying vec3 v_Normal;

            void main()
            {
                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = normalize(worldMat*a_Normal);

                gl_Position = u_MvpMatrix * a_Position;
            } `;

        let FS = `
            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif

            //加载lighting库
            #include "Lighting.glsl";

            varying vec3 v_Normal;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                float ln = max (0.0, dot (-lightVec,v_Normal));  //兰伯特
                ln = ln*0.5 + 0.5; //半兰伯特

                vec3 diffuseColor = vec3(0.5, 0.5, 0.5);

                vec3 Color = diffuseColor * lightColor * ln;

                gl_FragColor = vec4(Color,1.0);

            }`;

        var customShader = Laya.Shader3D.add("J3_DiffusePixeShader");

        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        customShader.addSubShader(subShader);

        subShader.addShaderPass(VS, FS);
    }
}
