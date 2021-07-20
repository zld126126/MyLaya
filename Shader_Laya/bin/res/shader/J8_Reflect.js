class J8_Reflect extends Laya.Material {

    constructor() 
    { 
        super(); 
        //设置本材质使用的shader名字
        this.setShaderName("J8_ReflectShader");
        this.TilingOffset = new Laya.Vector4(3.0, 3.0, 0.0, 0.0);
    }

    static __init__(){

        J8_Reflect.ReflectTexture = Laya.Shader3D.propertyNameToID("u_ReflectTexture");
        J8_Reflect.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
        J8_Reflect.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }

    get DiffuseTexture() {return this._shaderValues.getTexture(J8_Reflect.DiffuseTexture);}
    set DiffuseTexture(value) {this._shaderValues.setTexture(J8_Reflect.DiffuseTexture, value);}

    get ReflectTexture() {return this._shaderValues.getTexture(J8_Reflect.ReflectTexture);}
    set ReflectTexture(value) {this._shaderValues.setTexture(J8_Reflect.ReflectTexture, value);}

    get TilingOffset() {return this._shaderValues.getVector(J8_Reflect.TilingOffset);}
    set TilingOffset(value) {this._shaderValues.setVector(J8_Reflect.TilingOffset, value);}

    //初始化我们的自定义shader
    static initShader() {

        J8_Reflect.__init__();

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
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图

            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_ReflectTexture': Laya.Shader3D.PERIOD_SCENE, //漫反射贴图
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
            varying vec3 v_TexcoordCube;

            void main()
            {
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                mat3 worldMat = mat3(u_WorldMat);
                v_Normal = worldMat * a_Normal;

                vec3 WorldPosition = (worldMat * a_Position.xyz).xyz;   //物体空间转到世界空间
                v_ViewDir = u_CameraPos - WorldPosition;    //相机视角

                v_TexcoordCube = vec3(-a_Position.x,a_Position.yz);//转换坐标系 

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
            varying vec3 v_TexcoordCube;

            uniform vec3 u_AmbientColor;   //环境光
            uniform sampler2D u_DiffuseTexture;

            uniform sampler2D u_ReflectTexture;

            void main()
            {   
                //vec3 lightVec = normalize(u_DirectionLight.Direction);
                //vec3 lightColor = u_DirectionLight.Color;
                vec3 ViewDir = normalize(v_ViewDir);
                vec3 normal = normalize(v_Normal);

                //float ln = max (0.0, dot (-lightVec,v_Normal));  
                //ln = ln*0.5 + 0.5; 
                vec3 diffuseColor = vec3(1.0, 1.0, 1.0);

                vec4 difTex = texture2D(u_ReflectTexture, v_Texcoord0);

                vec3 diffuse = difTex.rgb * diffuseColor;
        
                vec3 incident = -ViewDir;
                vec3 reflectionVector = reflect(incident, normal);

                vec3 reflectionColor = textureCube(u_ReflectTexture, vec3(-reflectionVector.x, reflectionVector.yz)).rgb;

                //vec3 reflectionColor = texture2D(u_DiffuseTexture, vec2(reflectionVector.xy)).rgb;

                gl_FragColor = vec4(reflectionColor, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J8_ReflectShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

}


