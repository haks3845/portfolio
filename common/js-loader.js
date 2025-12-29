/**
 * 단수, 복수의 js 파일을 로드 할 수 있도록 관리한다.
 */

var JSLoader = new (function () {
    var p = this;  
    /*
    HTML head에 특정 js파일을 추가한 후 레퍼런스 생성 후에 head에서는 제거합니다.
    레퍼런스를 사용할 수 있는 시점은 funcCompleteLoad 함수로 알 수 있습니다.
    */

    var nRetry = 0;
    function loadRetry (strPath, funcCompleteLoad){        
        if(++nRetry>=3) {
            console.error( '로드 파일 실패 : ' + strPath );
            return;
        }
        load(strPath, funcCompleteLoad);
    }

    p.load = function (strPath, funcCompleteLoad) {
        //console.log(strPath);
        nRetry = 0;
        load(strPath,funcCompleteLoad);
    }

    p.loadArr = function(arr,funcCompleteLoad) {
        //console.log("loadArr " + JSON.stringify(arr));
        if( arr.length == 0 ) {
            if(funcCompleteLoad)funcCompleteLoad();
            return;
        }
        
        var nCnt = 0;
        var len = arr.length;
        function _check(){
            nCnt++;
            if(nCnt>= arr.length) {
                if(funcCompleteLoad)funcCompleteLoad();
            }
        }
        
        for (var i = 0;i<len;++i) {
            var strPath = arr[i];
            load(strPath,_check);
        }
    }

    function load(strPath, funcCompleteLoad) {
        //console.log("load "+strPath);
        //console.log( '로드 시작 : ' + strPath );
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.crossorigin="anonymous";
        script.async = false;  
        var ext = strPath.substr(strPath.length - 3);
        if(ext.toLowerCase() != ".js") {
            strPath += ".js";
        }
        script.src = strPath;
        document.head.appendChild(script);
        if (script.readyState) {  //IE
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    setTimeout(funcCompleteLoad);
                    document.head.removeChild(script);
                }
            };
        } else {  //Others
            script.onload = function () {                
                setTimeout(funcCompleteLoad);
                document.head.removeChild(script);
				//console.log( '로드 파일 완료 : ' + strPath );
            };

            script.onerror = function(){                                
                console.warn( '로드 파일 실패  후 재시도: ' + strPath  );
                document.head.removeChild(script);
                setTimeout(function(){loadRetry(strPath,funcCompleteLoad);});
                
            }
        }
    }
})();

