class J6_shadow extends Laya.Material {

    constructor() 
    { 
        super(); 
        //设置本材质使用的shader名字
        this.setShaderName("J6_shadowShader");
        //J6_shadow.TilingOffset = new Laya.Vector4(1.0, 1.0, 0.0, 0.0);
    }

    static __init__(){
        J6_shadow.DiffuseTexture = Laya.Shader3D.propertyNameToID("u_DiffuseTexture");
        //J6_shadow.TilingOffset = Laya.Shader3D.propertyNameToID("u_TilingOffset");
    }

    get DiffuseTexture() {return this._shaderValues.getTexture(J6_shadow.DiffuseTexture);}
    set DiffuseTexture(value) {this._shaderValues.setTexture(J6_shadow.DiffuseTexture, value);}

    //初始化我们的自定义shader
    static initShader() {

        J6_shadow.__init__();

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
            'u_DirectionLight.direction': Laya.Shader3D.PERIOD_SCENE,
            'u_DirectionLight.color': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,      //环境光
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL, //漫反射贴图
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,   //UV坐标属性

            'u_shadowMap1': Laya.Shader3D.PERIOD_SCENE,
            'u_shadowMap2': Laya.Shader3D.PERIOD_SCENE,
            'u_shadowMap3': Laya.Shader3D.PERIOD_SCENE,
            'u_shadowPSSMDistance': Laya.Shader3D.PERIOD_SCENE,
            'u_lightShadowVP': Laya.Shader3D.PERIOD_SCENE,
            'u_shadowPCFoffset': Laya.Shader3D.PERIOD_SCENE,
        };

        var custom = Laya.Shader3D.add("J6_shadowShader");
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        custom.addSubShader(subShader);

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

            varying vec3 v_PositionWorld;

            varying float v_posViewZ;
            #ifdef RECEIVESHADOW
                #ifdef SHADOWMAP_PSSM1 
                    varying vec4 v_lightMVPPos;
                    uniform mat4 u_lightShadowVP[4];
                #endif
            #endif

            void main()
            {
                v_Texcoord0 = a_Texcoord0;
                gl_Position = u_MvpMatrix * a_Position;
                v_posViewZ = gl_Position.z;

                v_Normal = a_Normal;

                v_PositionWorld=(u_WorldMat*a_Position).xyz;
                #ifdef RECEIVESHADOW
                    v_posViewZ = gl_Position.w;
                    #ifdef SHADOWMAP_PSSM1 
                        v_lightMVPPos = u_lightShadowVP[0] * vec4(v_PositionWorld,1.0);
                    #endif
                #endif
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

            uniform DirectionLight u_DirectionLight;
            uniform vec3 u_AmbientColor;   //环境光

            uniform sampler2D u_DiffuseTexture;

            varying vec3 v_PositionWorld;

            #include "ShadowHelper.glsl"
            varying float v_posViewZ;
            #ifdef RECEIVESHADOW
                #if defined(SHADOWMAP_PSSM2)||defined(SHADOWMAP_PSSM3)
                    uniform mat4 u_lightShadowVP[4];
                #endif
                #ifdef SHADOWMAP_PSSM1 
                    varying vec4 v_lightMVPPos;
                #endif
            #endif

            void main()
            {   
                #ifdef CASTSHADOW
                    gl_FragColor=packDepth(v_posViewZ);
                #else
                    vec3 lightVec = vec3(-1.0, -2.0, -2.0);
                    vec3 lightColor = vec3(1.0, 1.0, 1.0);
                    
                    //vec3 lightVec = normalize(u_DirectionLight.direction);
                    //vec3 lightColor = u_DirectionLight.color;
                    vec3 normal = normalize(v_Normal);

                    float ln = dot (-lightVec,normal);  
                    ln = ln*0.5 + 0.5; 

                    vec3 diffuse = texture2D(u_DiffuseTexture, v_Texcoord0).rgb * ln;

                    #ifdef RECEIVESHADOW
                        float shadowValue = 1.0;
                        #ifdef SHADOWMAP_PSSM3
                            shadowValue = getShadowPSSM3(u_shadowMap1,u_shadowMap2,u_shadowMap3,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);
                        #endif
                        #ifdef SHADOWMAP_PSSM2
                            shadowValue = getShadowPSSM2(u_shadowMap1,u_shadowMap2,u_lightShadowVP,u_shadowPSSMDistance,u_shadowPCFoffset,v_PositionWorld,v_posViewZ,0.001);
                        #endif 
                        #ifdef SHADOWMAP_PSSM1
                            shadowValue = getShadowPSSM1(u_shadowMap1,v_lightMVPPos,u_shadowPSSMDistance,u_shadowPCFoffset,v_posViewZ,0.001);
                        #endif
                        vec3 color1 = vec3(0.5,0.0,0.0);
                        gl_FragColor =vec4(diffuse * shadowValue, 1.0);
                        //gl_FragColor =vec4(color1, 1.0);
                    #else
                        vec3 color2 = vec3(0.0,0.0,0.5);
                        gl_FragColor =vec4(diffuse, 1.0);
                        //gl_FragColor =vec4(color2, 1.0);

                    #endif
                #endif  

            }`;

        //往新创建的subShader中添加shaderPass
        var ShaderPass = subShader.addShaderPass(VS, FS);

    }
}


function NewJ6_shadow(){
    console.log("NewJ6_shadow");
    return new J6_shadow();
}

function J6_shadow_initShader(){
    console.log("J6_shadow_initShader");
    J6_shadow.initShader();
}

