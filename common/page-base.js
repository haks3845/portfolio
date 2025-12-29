/**
 * 전체 콘텐츠 공통 기능을 관리
 */
pageBase = new ( function() {   
    var p = this;

    var m_lib, m_mcPage;

    var m_bCompleteUnit = false;

    /**
     * 페이지 기본 객체 ( animateCC 그래픽 객체와 class를 등록 )
     * @param {animateCC library } lib animateCC 라이브러리 객체
     * @param {String} strClassPage animateCC 라이브러리 root class
     */
    p.init = function( lib, strClassPage  ) {
        m_lib = lib;
        m_mcPage = new lib[ strClassPage ]();
        uiManager.getStage( "contents" ).addChild( m_mcPage );

        p.stopRecursion1frameClip( m_mcPage );

        var strScriptFunction = strClassPage.split( "_contents" ).join( "" );

        window[ strScriptFunction ].init();

        external.onForeGround = onForeGroundPlayer;
        external.onBackGround = onBackGroundPlayer;
    }

    /**
     * 현재 로드 된 페이지 클립을 리턴
     */
    p.getPageClip = function() {    return m_mcPage;    }

    /**
     * 현재 로드 된 페이지의 라이브러리 객체를 리턴
     */
    p.getPageLib = function() {     return m_lib;        }

    /**
     * 유닛 완료를 플레이어에 전달한다.
     * 중복 호출을 막기 위해 재호출 시 리턴처리
     */
    p.completeUnit = function( bNext ) {
        if( m_bCompleteUnit ) return;

        m_bCompleteUnit = true;
        external.completeUnit( bNext );
    }

    /**
     * 지정된 무비클립의 자식들을 확인하여 1프레임 클릭을 모두 정지시킨다. ( createjs 라이브러리 오류 처리 )
     * @param mcTarget  대상 무비클립
     */
    p.stopRecursion1frameClip = function( mcTarget ){
        var b = ( mcTarget instanceof createjs.MovieClip );
        if( b ) {
            if( mcTarget.totalFrames == 1) mcTarget.gotoAndStop( 0 );
            for ( var i = 0; i<mcTarget.numChildren; ++i ) {
                var t = mcTarget.getChildAt( i );
                p.stopRecursion1frameClip( t );
            }
        }
    }
    
    /**
     * 일정 시간동안 특별한 호출이 없을 경우 지정된 가이드를 실행한다.
     * 플레이어 화면 보호기 외에 사용되는 가이드 클립
     * @param {MovieClip} mcGuide 가이드 무비클립
     * @param {Number} nTime 가이드 채크 시간 ( milliSec / -1:초기화 )
     */
    p.startGuideByTimer = function( mcGuide, nTime ) {
        mcGuide.visible = false;
        mcGuide.gotoAndStop( 0 );
        
        if( nTime == -1 ) return;

        mcGuide.interval = setTimeout( onTimeout, nTime );

        function onTimeout() {
            mcGuide.visible = true;
            mcGuide.gotoAndPlay( 1 );

            mcGuide.parent.addChild( mcGuide );
        }
    }

    /**
     * 지정된 가이드 클립에 걸려있는 가이드 타이머를 정지한다.
     * @param {MovieClip} mcGuide 
     */
    p.stopGuideByTimer = function( mcGuide ) {
        mcGuide.visible = false;
        mcGuide.gotoAndStop( 0 );

        clearInterval( mcGuide.interval );
    }

    // 플레이어가 활성화 되었을 때 호출
    function onForeGroundPlayer() { 
        console.log( "onForeGroundPlayer" );
        audioManager.resume();
    }

    // 플레이어가 비활성화 되었을 때 호출
    function onBackGroundPlayer() {
        console.log( "onBackGroundPlayer" );
        audioManager.pause();
    }

})();