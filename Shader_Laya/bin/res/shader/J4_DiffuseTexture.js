class J4_DiffuseTexture extends Laya.Material {

    constructor() 
    { 
        super(); 
        //设置本材质使用的shader名字
        this.setShaderName("J4_DiffuseTextureShader");
        this.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
    }
    static __init__(){
        //使用 Shader3D 中的 propertyNameToID 方法关联 材质的 _shaderValues 与 shader uniform
        J4_DiffuseTexture.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
        J4_DiffuseTexture.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }
    static __initDefine__(){
        //注册宏定义
        J4_DiffuseTexture.SHADERDEFINE_LEGACYSINGALLIGHTING = Laya.Shader3D.getDefineByName("LEGACYSINGLELIGHTING");
        J4_DiffuseTexture.SHADERDEFINE_MAINTEXTURE = Laya.Shader3D.getDefineByName("MAINTEXTURE");
        J4_DiffuseTexture.SHADERDEFINE_TILINGOFFSET = Laya.Shader3D.getDefineByName("TILINGOFFSET");
        J4_DiffuseTexture.SHADERDEFINE_ADDTIVEFOG = Laya.Shader3D.getDefineByName("ADDTIVEFOG");
    }
    
    //封装 _shaderValues 实现修改材质属性
    get DiffuseTexture() {return this._shaderValues.getTexture(J4_DiffuseTexture.DiffuseTexture);}
    set DiffuseTexture(value) {this._shaderValues.setTexture(J4_DiffuseTexture.DiffuseTexture, value);}

    get TilingOffset() {return this._shaderValues.getVector(J4_DiffuseTexture.TilingOffset);}
    set TilingOffset(value) {this._shaderValues.setVector(J4_DiffuseTexture.TilingOffset, value);}

    //初始化我们的自定义shader
    static initShader() {

        J4_DiffuseTexture.__init__();
        J4_DiffuseTexture.__initDefine__();

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
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性
        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec3 u_CameraPos;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            void main()
            {
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                gl_Position = u_MvpMatrix * a_Position;

            } `;

        let FS = `

            #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
            
            #include "Lighting.glsl";

            varying vec3 v_Normal;
            varying vec3 v_ViewDir;
            varying vec2 v_Texcoord0;

            uniform vec3 u_AmbientColor;   //环境光
            uniform sampler2D u_DiffuseTexture;
            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 ViewDir = normalize(v_ViewDir);
                vec3 Normal = normalize(v_Normal);

                float ln = max (0.0, dot (-lightVec,Normal));  
                ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_DiffuseTexture, v_Texcoord0);
                vec3 diffuse = difTex.rgb * diffuseColor * lightColor * ln;
        
                vec3 specColor = vec3(1.0, 1.0, 1.0);
                float specularIntensity = 1.0;
                float gloss = 1.0;

                //BlinnPhone计算公式
                vec3 h = normalize(ViewDir - lightVec);
                float nh = max (0.0, dot (h,Normal));
                vec3 specular = specColor * lightColor * pow (nh, specularIntensity*128.0) * gloss;

                gl_FragColor = vec4(u_AmbientColor + specular + diffuse, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J4_DiffuseTextureShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

}

