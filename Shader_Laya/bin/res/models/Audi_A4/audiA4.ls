{
	"version":"LAYASCENE3D:02",
	"data":{
		"type":"Scene3D",
		"props":{
			"name":"audiA4",
			"ambientColor":[
				1,
				1,
				1
			],
			"lightmaps":[],
			"enableFog":false,
			"fogStart":0,
			"fogRange":300,
			"fogColor":[
				0.5,
				0.5,
				0.5
			]
		},
		"child":[
			{
				"type":"Camera",
				"instanceID":0,
				"props":{
					"name":"Main Camera",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						4.65,
						0.94,
						6.34
					],
					"rotation":[
						0,
						0.3283806,
						0,
						0.9445456
					],
					"scale":[
						1,
						1,
						1
					],
					"clearFlag":0,
					"orthographic":false,
					"orthographicVerticalSize":10,
					"fieldOfView":50,
					"enableHDR":true,
					"nearPlane":0.3,
					"farPlane":1000,
					"viewport":[
						0,
						0,
						1,
						1
					],
					"clearColor":[
						0.2509804,
						0.2509804,
						0.2509804,
						0
					]
				},
				"components":[],
				"child":[]
			},
			{
				"type":"Sprite3D",
				"instanceID":1,
				"props":{
					"name":"audi_a4_mo",
					"active":true,
					"isStatic":false,
					"layer":0,
					"position":[
						0,
						0,
						0
					],
					"rotation":[
						0,
						0,
						0,
						-1
					],
					"scale":[
						1,
						1,
						1
					]
				},
				"components":[],
				"child":[
					{
						"type":"MeshSprite3D",
						"instanceID":2,
						"props":{
							"name":"Car_Base",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-Car_Base.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/ground.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":3,
						"props":{
							"name":"carbody",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.7303442,
								0.2746696,
								1.25128
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-carbody.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carBody_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":4,
						"props":{
							"name":"carFACE",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-carFACE.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carFace_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":5,
						"props":{
							"name":"CarLine01",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-CarLine01.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carline_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":6,
						"props":{
							"name":"CarLine02",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-CarLine02.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carline_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":7,
						"props":{
							"name":"CarLine03",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-CarLine03.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carline_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":8,
						"props":{
							"name":"DiZuo",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-DiZuo.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/dizuo_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":9,
						"props":{
							"name":"glasslamps",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.5436201,
								0.5674719,
								1.837416
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-glasslamps.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/glasslamps_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":10,
						"props":{
							"name":"LunGu01",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-LunGu01.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/lunGu_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":11,
						"props":{
							"name":"LunGu02",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-LunGu02.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/lunGu_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":12,
						"props":{
							"name":"LunGu03",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-LunGu03.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/lunGu_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":13,
						"props":{
							"name":"LunGu04",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-LunGu04.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/lunGu_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":14,
						"props":{
							"name":"LunTai",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-LunTai.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/LunTai_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":15,
						"props":{
							"name":"taillights",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0.7303447,
								0.2746699,
								1.25128
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-taillights.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/taillights_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":16,
						"props":{
							"name":"windows",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								-0.8443144,
								0.2746696,
								1.25128
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-windows.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/carGlass_sh.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					},
					{
						"type":"MeshSprite3D",
						"instanceID":17,
						"props":{
							"name":"zhongKong1",
							"active":true,
							"isStatic":false,
							"layer":0,
							"position":[
								0,
								0,
								0
							],
							"rotation":[
								0,
								0,
								0,
								-1
							],
							"scale":[
								1,
								1,
								1
							],
							"meshPath":"Assets/audi_a4/audi_a4_mo-zhongKong1.lm",
							"enableRender":true,
							"materials":[
								{
									"type":"Laya.BlinnPhongMaterial",
									"path":"Assets/audi_a4/Materials/CarID.lmat"
								}
							]
						},
						"components":[],
						"child":[]
					}
				]
			}
		]
	}
}