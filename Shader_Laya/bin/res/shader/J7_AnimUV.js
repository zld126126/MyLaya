class J7_AnimUV extends Laya.Material {

    get DiffuseTexture() {return this._shaderValues.getTexture(J7_AnimUV.DiffuseTexture);}
    set DiffuseTexture(value) {this._shaderValues.setTexture(J7_AnimUV.DiffuseTexture, value);}

    get TilingOffset() {return this._shaderValues.getVector(J7_AnimUV.TilingOffset);}
    set TilingOffset(value) {this._shaderValues.setVector(J7_AnimUV.TilingOffset, value);}

    constructor() 
    { 
        super(); 
        //设置本材质使用的shader名字
        this.setShaderName("J7_AnimUVShader");
        this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
    }

    //初始化我们的自定义shader
    static initShader() {

        //所有的attributeMap属性
        var attributeMap = 
        {
            'a_Position': Laya.VertexMesh.MESH_POSITION0, 
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
        };

        //所有的uniform属性
        var uniformMap = 
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,     //相机位置

            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性
            'u_Time': Laya.Shader3D.PERIOD_SCENE,            //时间变量

            'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,     //视图矩阵x投影矩阵

        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;
            attribute vec4 a_MvpMatrix;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;
            uniform float u_Time;
            uniform mat4 u_ViewProjection;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;
            varying float v_Frequency;

            void main()
            {
                //Frequency频率
                v_Frequency = (u_Time * 0.05);
                v_Texcoord0 = a_Texcoord0;

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec4 Position = a_Position;

                //Magnitude 振幅
                float _Magnitude = 0.00051;

                //WaveLen 波长
                float _WaveLen = 300.0;

                Position.y += sin(u_Time*2.0 + Position.x*_WaveLen + Position.y*_WaveLen)*_Magnitude;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * Position;

            } `;

        let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec2 v_Texcoord0;
            varying float v_Frequency;
            
            uniform sampler2D u_DiffuseTexture;

            void main()
            {
                vec3 diffuseColor = vec3(0.4, 0.4, 0.6);
                vec3 diffuseColor2 = vec3(0.4, 0.6, 0.4);

                vec2 Tiling = v_Texcoord0 * 2.0;

                //UV纹理动画
                //vec3 diffuse = texture2D(u_DiffuseTexture, Tiling + v_Frequency).rgb;

                vec2 rimPanningU = (Tiling + v_Frequency * vec2(1.1,0));
                vec2 rimPanningV = (Tiling + v_Frequency * vec2(0,0.8));

                float rimTexRU = texture2D(u_DiffuseTexture, rimPanningU).r;
                float rimTexRV = texture2D(u_DiffuseTexture, rimPanningV).r;

                float rimTexBU = texture2D(u_DiffuseTexture, rimPanningU).g;
                float rimTexBV = texture2D(u_DiffuseTexture, rimPanningV).g;

                float rimTexR = 1.0 - (rimTexRU - rimTexRV); 
                float rimTexB = 1.0 - (rimTexBU - rimTexBV); 

                vec3 diffuse = diffuseColor * rimTexR*0.5 + diffuseColor2 * rimTexB*0.5;
        
                gl_FragColor = vec4(diffuse, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J7_AnimUVShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

}

J7_AnimUV.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
J7_AnimUV.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
