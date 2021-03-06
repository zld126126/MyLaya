(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var Stage = Laya.Stage;
    var Text = Laya.Text;
    var Geolocation = Laya.Geolocation;
    var Browser = Laya.Browser;
    var Handler = Laya.Handler;
    class InputDevice_Map {
        constructor() {
        }
        init() {
            this.BMap = Browser.window.BMap;
            this.convertor = new this.BMap.Convertor();
            Laya.init(Browser.width, 255);
            Laya.stage.scaleMode = Stage.SCALE_NOSCALE;
            this.createDom();
            this.initMap();
            this.createInfoText();
            var successHandler = new Handler(this, this.updatePosition);
            var errorHandler = new Handler(this, this.onError);
            Geolocation.enableHighAccuracy = true;
            Geolocation.watchPosition(successHandler, errorHandler);
            this.convertToBaiduCoord = this.convertToBaiduCoord.bind(this);
        }
        createDom() {
            this.mapDiv = Browser.createElement("div");
            var style = this.mapDiv.style;
            style.position = "absolute";
            style.top = Laya.stage.height / Browser.pixelRatio + "px";
            style.left = "0px";
            style.width = Browser.width / Browser.pixelRatio + "px";
            style.height = (Browser.height - Laya.stage.height) / Browser.pixelRatio + "px";
            Browser.document.body.appendChild(this.mapDiv);
        }
        initMap() {
            this.map = new this.BMap.Map(this.mapDiv);
            this.map.disableKeyboard();
            this.map.disableScrollWheelZoom();
            this.map.disableDoubleClickZoom();
            this.map.disablePinchToZoom();
            this.map.centerAndZoom(new this.BMap.Point(116.32715863448607, 39.990912172420714), 15);
            this.marker = new this.BMap.Marker(new this.BMap.Point(0, 0));
            this.map.addOverlay(this.marker);
            var label = new this.BMap.Label("????????????", { offset: new this.BMap.Size(-15, 30) });
            this.marker.setLabel(label);
        }
        createInfoText() {
            this.infoText = new Text();
            Laya.stage.addChild(this.infoText);
            this.infoText.fontSize = 20;
            this.infoText.color = "#FFFFFF";
            this.infoText.size(Laya.stage.width, Laya.stage.height);
        }
        updatePosition(p) {
            var point = new this.BMap.Point(p.longitude, p.latitude);
            this.convertor.translate([point], 1, 5, this.convertToBaiduCoord);
            this.infoText.text =
                "?????????" + p.longitude +
                    "\t?????????" + p.latitude +
                    "\t?????????" + p.accuracy +
                    "\n?????????" + p.altitude +
                    "\t???????????????" + p.altitudeAccuracy +
                    "\n??????" + p.heading +
                    "\n?????????" + p.speed +
                    "\n????????????" + p.timestamp;
        }
        convertToBaiduCoord(data) {
            if (data.status == 0) {
                var position = data.points[0];
                this.marker.setPosition(position);
                this.map.panTo(position);
                this.map.setZoom(17);
            }
        }
        onError(e) {
            if (e.code == Geolocation.TIMEOUT)
                alert("??????????????????");
            else if (e.code == Geolocation.POSITION_UNAVAILABLE)
                alert("???????????????");
            else if (e.code == Geolocation.PERMISSION_DENIED)
                alert("?????????");
        }
    }

    class Main {
        constructor() {
            var baiduMap = new InputDevice_Map();
            window['baiduMap'] = baiduMap;
            window['LoadBaiduMapScript']();
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
