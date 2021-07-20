class J4_RampTexture extends Laya.BaseMaterial {

    get RampTexture() {return this._shaderValues.getTexture(J4_RampTexture.RampTexture);}
    set RampTexture(value) {this._shaderValues.setTexture(J4_RampTexture.RampTexture, value);}

    get TilingOffset() {return this._shaderValues.getVector(J4_RampTexture.TilingOffset);}
    set TilingOffset(value) {this._shaderValues.setVector(J4_RampTexture.TilingOffset, value);}

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
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,

            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_RampTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性
        };

        let VS = `
            #include "Lighting.glsl";

            attribute vec4 a_Position;
            attribute vec3 a_Normal;
            attribute vec2 a_Texcoord0;

            uniform mat4 u_MvpMatrix;
            uniform mat4 u_WorldMat;
            uniform vec4 u_TilingOffset;

            varying vec3 v_Normal;
            varying vec2 v_Texcoord0;

            void main()
            {
                v_Texcoord0 = a_Texcoord0;
                //v_Texcoord0=a_Texcoord0 * vec2(2.0, 2.0);
                //v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);

                v_Normal = mat3(u_WorldMat) * a_Normal;

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
            varying vec2 v_Texcoord0;

            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_RampTexture;

            uniform sampler2D u_LightBuffer;

            void main()
            {   

                DirectionLight directionLight = getDirectionLight(u_LightBuffer,0);
                vec3 lightVec = normalize(directionLight.direction);
                vec3 lightColor = directionLight.color;

                vec3 normal = normalize(v_Normal);

                float ln = dot (lightVec,normal);  
                ln = ln*0.5 + 0.5; 

                vec4 diffuse = texture2D(u_RampTexture, vec2(ln, ln));

                gl_FragColor = vec4(diffuse.rgb, 1.0);

            }`;

        //注册CustomShader 
        var LightSh = Laya.Shader3D.add("J4_RampTextureShader");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);
    }

    constructor() 
    { 
    
        super(); 

        //设置本材质使用的shader名字
        this.setShaderName("J4_RampTextureShader");
    }
}

J4_RampTexture.RampTexture = Laya.Shader3D.propertyNameToID("u_RampTexture");
J4_RampTexture.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
