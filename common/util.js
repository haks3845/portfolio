var util = new (function () {
    var p = this;

    /**
     * @method Util.addFuncAtFrame
     * @description 인자로 전달한 무비클립의 특정 프레임에 콜백을 삽입
     * @param {MovieClip} target    무비클립
     * @param {Number} frame        콜백 호출 프레임
     * @param {Function} func       콜백
     */
    p.addFuncAtFrame = function (target, frame, func) {
        if (!target) return;
        if (!func) return;
        if (frame < 0) {
            frame = 0;
        }
        if (frame >= target.totalFrames) {
            frame = target.totalFrames - 1;
        }

        if (target.tarFunc != null) {
            target.timeline.removeTween(target.tarFunc);
        }

        target.tarFunc = target.timeline.addTween(createjs.Tween.get(target).wait(frame).call(func, [target]));
    };

    /**
     * @method Util.setClipCompleteCallback
     * @description 전달한 무비클립의 재생이 완료되면 콜백을 호출한다.
     * @param {MovieClip} mc            실행 할 무비클립
     * @param {Function} funcCallback   실행이 끝난 후 콜백
     */
    p.setClipCompleteCallback = function (mc, funcCallback) {
        mc.gotoAndPlay(1);
        p.addFuncAtFrame(mc, mc.totalFrames, funcCallback);
    };

    /**
     * 배열에 있는 숫자를 섞을 때 호출
     * @param {Array} arrTarget 변경할 배열
     */
    p.shuffle = function (arrTarget) {
        if (!arrTarget) return arrTarget;
        for (var j, x, i = arrTarget.length; i; j = Math.floor(Math.random() * i), x = arrTarget[--i], arrTarget[i] = arrTarget[j], arrTarget[j] = x);
        return arrTarget;
    };

    /**
     * 0,1,2... > 01, 02... 의 문자열로 변경하여 리턴
     * @param {Number} n 변경할 숫자
     */
    p.addZero = function (n) {
        if (n < 10) {
            return "0" + String(n);
        } else {
            return String(n);
        }
    }

    // 
    p.videoData = { userId: undefined, seting: null, playing: false, target: null, user: [], item: [] }; //(추가) 240619
    // 엔딩 콜백
    //(공통) 대파티클 엔딩 :: 완료 callback
    p.onEndingParticleComplete;
    /**
    * (공통) 대파티클 :: 1~5번 랜덤 애니메이션
    */
    p.onEndingParticle = function () {
        let inVideo = null;
        let inRoot = "common/video/"
        let inName = "ending_particle";
        let inPos = { min: 1, max: 6 };
        let inRandom = Math.floor(Math.random() * (inPos.max - inPos.min) + inPos.min);
        let inContent = document.querySelector("#ending_particle");
        inContent.style.display = "block";
        let inEndingBg = document.querySelector("#ending_particle #ending_bg");
        // inRandom = 1;
        let inPath = inRoot + "vd_particle" + inRandom + ".mp4";

        let endingNavigatorDevice = function () {
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
        let endingNavigatorDeviceId = endingNavigatorDevice();

        if (endingNavigatorDeviceId === true) {
            console.log("@ video nodePlayer: ending particle");
            inContent.classList.remove("hidden");
            inEndingBg.classList.add("endingFadeOut");

            inVideo = external.createMoviePlayer(0, 0, 1280, 768);
            inVideo.loadMp4(inPath);
            inVideo.setZIndex(200);
            inVideo.addEventListener("onInit", onInitEndingParticle);
            function onInitEndingParticle() {
                // cv.videoData.item.push(inVideo);
                // cv.videoData.target = inVideo;
            }
            // cv.videoData.item.push(inVideo);
            inVideo.addEventListener("onEnded", onEndedParticle);
            function onEndedParticle() {
                p.onEndingParticleComplete();
            }
        }
        else {
            console.log("@ video pc: ending particle");
            if (p.videoData !== undefined && p.videoData.item.length > 0) {
                p.videoData.item.forEach(function (obj, i) {
                    obj.classList.add("hidden");
                });
            }

            inVideo = document.createElement("video");
            inVideo.style.position = "absolute";
            inVideo.style.pointerEvents = "none";
            inVideo.style.zIndex = 200;
            inVideo.width = 1280;
            inVideo.height = 768;
            inVideo.id = inName;
            inVideo.src = inPath;
            inVideo.className = "hidden";
            inVideo.load();
            inContent.appendChild(inVideo);

            inContent.classList.remove("hidden");
            inEndingBg.classList.add("endingFadeOut");
            setTimeout(function () {
                inVideo.play();
                setTimeout(function () {
                    inVideo.classList.remove("hidden");
                }, 200);
                _endingVideoBegin();
                function _endingVideoBegin() {
                    let inRequestId = null;
                    let inRender = function () {
                        inRequestId = window.requestAnimationFrame(inRender);
                        if (inVideo.currentTime >= (inVideo.duration - 3)) {
                            inVideo.pause();
                            window.cancelAnimationFrame(inRequestId);
                            _endingVideoEnd(inVideo);
                            inRequestId = null;
                            inVideo = null;
                        }
                    }
                    inRequestId = window.requestAnimationFrame(inRender);
                }
                function _endingVideoEnd(video) {
                    p.onEndingParticleComplete();
                }
            }, 500);
        }
    };

})();
