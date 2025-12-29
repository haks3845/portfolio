/* 
UI 관련 설정
프로그램에서 사용할 모든 UI를 관리
UI의 특성에 맞추어 canvas를 분리하여 사용 가능하도록 처리
Z depth 관리를 용이하도록 함
createjs 기본 세팅
*/   

var uiManager = new ( function () {
    var p = this;

    var m_arrLayers = [ "contents" ];
    var m_nScreenWidth      = 1280;
    var m_nScreenHeight     = 768;

    var m_mcModalPop;

    var m_div;

    var m_objUI = {};

    window.onresize = onResizeWindow;

    // 기본 UI가 자리잡을 canvas를 설정한다.
    p.setUI = function( funcCompelteMaked ) {
        m_div = document.createElement('div');         
        m_div.id = "container";

        m_div.style = "position: absolute;  display: block; left:0px; top:0px; transform-origin: top left;";

        document.body.appendChild( m_div );	

        for( var i=0; i<m_arrLayers.length; ++i ) {
            makeElements( m_arrLayers[ i ], m_nScreenWidth, m_nScreenHeight, i, onCompleteMakeZim );
        }
        
        var nCountComplete = 0;
        function onCompleteMakeZim() {
            nCountComplete++;
            if( nCountComplete == m_arrLayers.length ) {
                setNextStage();
                funcCompelteMaked();
            }
        }

        onResizeWindow( null );
    }

    // createjs 에 사용될 canvas를 생성하고 저장한다.
    function makeElements( strId, nWidth, nHeight, nZindex, funcComplete ) {
        var can = document.createElement('canvas');
        can.id = strId;
        
        can.width = nWidth;
        can.height = nHeight;
        can.style = "position: absolute; display: block;";        
        can.style.zIndex = nZindex;     
        
        var ctx = can.getContext('2d');
        ctx.miterLimit = 2;
        ctx.alpha = false;

        m_div.appendChild(can);
        var stage = new createjs.Stage(can);
        createjs.Touch.enable(stage);
        stage.enableMouseOver();

        createjs.Ticker.framerate = 30;
        createjs.Ticker.addEventListener("tick", stage); 
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;

        m_objUI[ strId ] = new Object();
        m_objUI[ strId ].canvas = can;
        m_objUI[ strId ].stage = stage;
        m_objUI[ strId ].frame = {width:nWidth,height:nHeight};

        setTimeout(funcComplete);
    }

    // 하위 캔버스 이벤트 전달을 위한 Next Stage 세팅
    function setNextStage() {
        if( m_arrLayers.length == 1 ) return;

        for( var i=1; i<m_arrLayers.length; ++i ) {
            p.getStage( m_arrLayers[ i ] ).nextStage = p.getStage( m_arrLayers[ i - 1 ] );
        }
    }

    // 지정된 ID 값의 stage를 리턴한다.
    p.getStage = function ( strID ) {
        return m_objUI[ strID ].stage;
    }

    // 지정한 아이디의 캔버스를 리턴한다.
    p.getCanvas = function( strID ) {
        return m_objUI[ strID ].canvas;
    }

    // 팝업 캔버스의 모달창을 보여준다.
    p.showPopModal = function( bShow ) {
        m_mcModalPop.visible = bShow;
    }

    // 창 사이즈 변경 이벤트 핸들러
    function onResizeWindow( e ) {
        var w = window.innerWidth;
        var h = window.innerHeight;        

        var scaleX = w/m_nScreenWidth;
        var scaleY = h/m_nScreenHeight;        
        var scale = (scaleX<scaleY)?scaleX:scaleY;
        
        m_div.style.width = m_nScreenWidth+"px";
        m_div.style.height = m_nScreenHeight+"px";        
        m_div.style.transform = "scale("+scale+")";
    }

})();
