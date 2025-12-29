KO_L3_093_03_01 = new (function () {
    var m_this = this;

    var m_mcThis;

    var m_arrModuleSet = [];

    // 초기화
    m_this.init = function () {
        m_mcThis = pageBase.getPageClip();

        var arrFiles = ["script/CJPuppyhouse.js", "script/quizcode.js"];
        JSLoader.loadArr(arrFiles, onCompelteScripts);

        function onCompelteScripts() {
            init();
        }
    }

    // 초기화
    function init() {
        CJPuppyhouse.init(m_mcThis, completeModule);
        startModule();
    }

    // 모듈을 시작한다.
    function startModule() {
        CJPuppyhouse.start();
    }

    // 모듈을 완료하고 다음 모듈을 시작한다.
    function completeModule() {
        audioManager.stopBGM();

        util.onEndingParticleComplete = function () { pageBase.completeUnit(); };
        util.onEndingParticle();
    }

})();