/**
 * external 소통을 위한 매니저
 */
externalManager = new (function () {
    var p = this;

    /**
     * (공통) 문항 풀이 결과 저장
     * @param {*} qCode 문제코드
     * @param {*} nWrongcnt 오답 횟수
     * @param {*} strSdate 풀이 시작시간
     * @param {*} strEdate 풀이 종료시간
     */
    p.getQuizUserData = function (qCode, nWrongcnt, strSdate, strEdate) {
        // http://test-iapp.milkt.co.kr/wsc_LcmsIF.asmx/SaveQuizHistory

        let inDevice = function () {
            let isPlatform = "win16|win32|win64|mac|macintel";
            let isDevice = null;
            if (navigator.platform) {
                if (isPlatform.indexOf(navigator.platform.toLowerCase()) < 0) {
                    isDevice = true; // Moblie
                } else {
                    isDevice = false; // PC
                }
            }
            return isDevice;
        };

        let inAPI = external.API_ROOT;
        let inUserData = {
            "UserId": external.USERID,
            "PlayNo": external.USERID,
            "ApiKey": external.API_KEY,
            "LectureCode": external.LECTURE_CODE,
            "QuizHistoryInfos": [{
                "UnitCode": external.UNIT_CODE,
                "QuizCode": qCode,
                "QuizResult": String(nWrongcnt),
                "QuizSDate": strSdate,
                "QuizEDate": strEdate
            }]
        }

        setTimeout(function () {
            if (inDevice() == true) {
                fetch(inAPI + "wsc_LcmsIF.asmx/SaveQuizHistory", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify(inUserData),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("#Quiz Success:", data);
                    })
                    .catch((error) => {
                        console.error("#Quiz Error:", error);
                    });
            }
            else {
                let jsonStr = JSON.stringify(inUserData);
                console.log(jsonStr);
            }
        }, 100);
    };

    let funcCallback;
    p.portfolioCapture = function (funcCallback) {
        external.onImageSaved = p.onImageSaved;

        funcCallback = funcCallback;
        external.capture("portfolio.png", { x: 0, y: 0, width: 1280, height: 800 }, false, true);
    };

    p.onImageSaved = function (strPath) {
        funcCallback(strPath);
    };

})();