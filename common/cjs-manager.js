var cjsManager = new (function () {
    var cm = this;
    var mapAudios = {};

    // adobe AnimateCC에서 프레임 사운드를 표현하는 방식입니다. 삭제 금지.
    window.playSound = function (id, loop) {
        // howler 추가문
        let snd = audioManager.get(mapAudios[id].src);
        let b = Boolean(loop);
        // console.warn("window.playSound " + id + " " + b);
        snd.loop = b;
        return snd.playOnce();

        // var snd = audioManager.get();
        // return snd.play(mapAudios[id].src);
    }

    /*
    Lib파일과 관련 페이지를 같이 로딩
    funcComplete에 인자로 전달되는 lib 레퍼런스와 페이지 레퍼런스를 이용할 수 있습니다.
    */
    cm.loadPage = function (strLibPath, strSrcPath, funcComplete, funcProgress) {
        cm.loadAnimate(strLibPath, function (lib) {
            cm.loadJS(strSrcPath, function () {
                funcComplete(lib);
            });
        }, onProgress);

        function onProgress(nPerc) {
            if (funcProgress) funcProgress(nPerc)
        }
    }

    /*
    특정 JS파일을 로딩하는 명령입니다. JSLoader.load 를 이용하셔도 됩니다.
    */
    cm.loadJS = function (strPath, funcCompleteLoad) {
        JSLoader.load(strPath, funcCompleteLoad);
    }

    cm.adddAudio = function (manifest) {
        mapAudios[manifest.id] = manifest;
        // howler 추가문
        audioManager.load(manifest.src);
    }
    /*
    AnimateCC에서 만들어낸 js파일과 관련 스프라이트,사운드들을 로딩합니다.
    funcComplete에 인자로 전달되는 lib 레퍼런스를 이용합니다.
    */
    cm.loadAnimate = function (strPath, funcComplete, funcProgress) {
        cm.loadJS(strPath, function () {
            var key = Object.keys(AdobeAn.compositions)[0];
            var comp = AdobeAn.getComposition(key);

            var loader = new createjs.LoadQueue(false);

            loader.addEventListener("fileload", function (evt) {
                onFileLoad(evt, comp)
            })

            loader.addEventListener("complete", function (evt) {
                onCJSLoadComplete(evt, comp, funcComplete, strPath)
            });

            loader.addEventListener("progress", function (evt) {
                onCJSProgress(evt, funcProgress);
            });

            var lib = comp.getLibrary();

            var directory = strPath.substr(0, strPath.lastIndexOf("/"));
            if (directory.length != 0) {
                directory += "/";
            }

            for (var i = 0; i < lib.properties.manifest.length; ++i) {
                lib.properties.manifest[i].src = directory + lib.properties.manifest[i].src;
            }

            loader.loadManifest(lib.properties.manifest);

            AdobeAn = null;
        });
    }

    /**
         * loadCJSObject Progress 이벤트 핸들러
         * @param e 			이벤트
         * @param funcProgress	프로그래스 이벤트 콜백
         */
    function onCJSProgress(e, funcProgress) {
        if (funcProgress != null) funcProgress(e.progress);
    }

    /**
     * manifest에 있는 객체 로드 관리
     */
    function onFileLoad(evt, comp) {
        var images = comp.getImages();
        if (evt && (evt.item.type == "image")) {
            images[evt.item.id] = evt.result;
        } else if (evt && (evt.item.type == "sound")) {
            // var strFileId = evt.item.id;
            // var strFilePath = evt.item.src.split("?")[0];
            // externalManager.createSound( strFileId, strFilePath );
        }
    }

    /**
     * 모든 객체가 로드 완료 되었을 때 호출
     */
    function onCJSLoadComplete(evt, comp, funcComplete, strPath) {
        var lib = comp.getLibrary();
        var ss = comp.getSpriteSheet();
        var queue = evt.target;
        var ssMetadata = lib.ssMetadata;

        for (var i = 0; i < ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new createjs.SpriteSheet({
                "images": [queue.getResult(ssMetadata[i].name)],
                "frames": ssMetadata[i].frames
            })
        }

        setRegisterSound(lib);
        if (funcComplete) funcComplete(lib);
    }


    /**
     * 사운드 등록
     * @param {*} lib
     */
    var currentLib = null;
    function setRegisterSound(lib) {
        currentLib = lib;
        m_setPlayingSoundIds = new Set();

        var strFilePath, strFileId, strType;

        for (var i = 0; i < lib.properties.manifest.length; i++) {
            strType = lib.properties.manifest[i].type;

            if (strType != "sound") continue;

            let manifest = lib.properties.manifest[i];
            strFilePath = lib.properties.manifest[i].src.split(
                "?")[0];

            mapAudios[manifest.id] = manifest;
            audioManager.load(manifest.src);
        }
    };

    /*
    AnimateCC에서 만들어낸 js파일을 로딩합니다.
    funcComplete에 인자로 전달되는 lib 레퍼런스를 이용합니다.
    */
    cm.loadAnimateJSOnly = function (strPath, funcComplete) {
        cm.loadJS(strPath, function () {
            var key = Object.keys(AdobeAn.compositions)[0];
            var comp = AdobeAn.getComposition(key);
            var lib = comp.getLibrary();
            AdobeAn = null;
            funcComplete(lib);
        });
    }

})();

