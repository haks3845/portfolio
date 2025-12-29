/**
 * 각 콘텐츠를 로드하기 전 처리 되어야 할 기본 기능 처리 객체
 * UI 세팅, 공용 js 파일 로드 등 기본으로 처리해야 할 기능들을 순차적으로 관리한다.
 */
startManager = new (function () {
    var p = this;

    loadDefaultJS(init);

    // common js file load
    function loadDefaultJS(funcComplete) {
        var arrFiles = ["common/howler.min.js", "common/c_audio-item.howler.js", "common/c_audio-manager.howler.js",
            "common/cjs-manager.js", "common/createjs.min.js",
            "common/ui-manager.js", "common/page-base.js",
            "common/util.js", "common/external.js", "common/external-manager.js"];
        JSLoader.loadArr(arrFiles, funcComplete);
    }

    // 초기화
    function init() {
        uiManager.setUI(loadContentsFile);
    }

    /*
    현재 html 파일명을 기준으로 그래픽 소스 ( animateCC의 콘텐츠 파일 - 파일명_contents.js )와
    콘텐츠를 제어할 스크립트 파일 ( script 폴더 내 파일명.js )을 로딩한다.
    로딩 후 pageBase 클래스에 관련 정보를 입력한다.
    */
    function loadContentsFile(funcComplete) {
        var arrTemp = location.href.split("/");
        // var strFileName = arrTemp[arrTemp.length - 1].split(".")[0];
        var strFileName = "KO_L3_093_03_01";

        var strContentsPath = strFileName + "_contents.js";
        var strScriptPath = "script/" + strFileName + ".js";

        cjsManager.loadPage(strContentsPath, strScriptPath, onCompleteLoaded, onProgress);

        function onCompleteLoaded(lib) {
            pageBase.init(lib, strContentsPath.split(".")[0]);
        }

        function onProgress(nPerc) {
            if (nPerc == 1) {
                if (external.hideLoading) external.hideLoading("화면을 준비 중입니다.");
                return;
            }

            if (external.showLoading) external.showLoading("잠시만 기다려 주세요.", nPerc)
        }
    }


})();
