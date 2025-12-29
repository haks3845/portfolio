let CJPuppyhouse = new (function () {
    let m_this = this;
    let m_mcThis;
    let completeModule;

    let mcCat;
    let mcPuppy;

    let mcQuesBoard;
    let mcButtonSet;
    let mcGuide;

    let arrNavi;

    let nOrder;
    let nWrongCount;
    let strSDate;
    let strEDate;

    const MAXWRONG = 2;

    let arrButtons;

    m_this.init = function (mcThis, funcComplete) {
        m_mcThis = mcThis;
        completeModule = funcComplete;

        mcCat = m_mcThis.mcNySet;
        mcPuppy = m_mcThis.mcDogSet;

        mcButtonSet = m_mcThis.mcBtnSet;

        mcGuide = m_mcThis.mcAffo1;

        nOrder = 0;

        arrNavi = [];
        let mcNavi;
        for (let i = 0; i < m_mcThis.mcIndicator.numChildren; i++) {
            mcNavi = m_mcThis.mcIndicator["mcInd" + i];
            if (!mcNavi) break;
            arrNavi.push(mcNavi);
        }

        mcCat.addEventListener("click", onClickCharacter);

        audioManager.playBGM("sounds_add/bgm.mp3", 0.2);

        setQuiz();
        setEnabled(false);
    }

    m_this.start = function () {
        // m_mcThis.mcAffo0.visible = false;
        // startQuiz();
        // return;

        util.setClipCompleteCallback(m_mcThis.mcIntro, function () {
            m_mcThis.mcIntro.stop();
            m_mcThis.mcIntro.visible = false;

            mcCat.gotoAndStop(0);
            util.setClipCompleteCallback(mcCat.getChildAt(0), function (mcPlayedClip) {
                mcPlayedClip.stop();
                mcCat.gotoAndStop(1);

                if (m_mcThis.mcNaBtn) {
                    // m_mcThis.mcNaBtn.play();

                    let mcSnd = m_mcThis["mcQuesNa" + nOrder];
                    util.setClipCompleteCallback(mcSnd, function () {
                        // m_mcThis.mcNaBtn.gotoAndStop(0);
                        startQuiz();
                    });

                    createjs.Tween.get(mcQuesBoard, { override: true })
                        .to({ scale: 1.05 }, 750, createjs.Ease.circOut)
                        .to({ scale: 1 }, 750, createjs.Ease.circOut);

                } else {
                    startQuiz();
                }
            });

            util.setClipCompleteCallback(m_mcThis.mcAffo0, function () {
                m_mcThis.mcAffo0.stop();
                m_mcThis.mcAffo0.visible = false;
            });
        });

        // test code
        // m_mcThis.mcIntro.gotoAndPlay(m_mcThis.mcIntro.totalFrames - 2);
    }

    function setEnabled(b) {
        m_mcThis.mouseEnabled = b;
    }

    // 어포던스 관리
    function setAffor() {
        createjs.Tween.removeTweens(mcGuide);
        createjs.Tween.get(mcGuide).wait(7000).call(onAfforGuide);

        function onAfforGuide() {
            if (nWrongCount == 2) return;
            mcCat.mouseEnabled = false;

            mcCat.gotoAndStop(2);
            util.setClipCompleteCallback(mcCat.getChildAt(0), function () {
                mcCat.gotoAndStop(1);
                setAffor();
                mcCat.mouseEnabled = true;
            });

            util.setClipCompleteCallback(mcGuide, function () { });

            for (let i = 0; i < arrButtons.length; i++) {
                arrButtons[i].getChildAt(0).gotoAndPlay(1);
                createjs.Tween.get(arrButtons[i], { override: true, loop: 1 })
                    .to({ scale: 1.05 }, 600, createjs.Ease.circOut)
                    .to({ scale: 1 }, 600, createjs.Ease.circOut);

                createjs.Tween.get(arrButtons[i].getChildAt(0)).wait(arrButtons[i].getChildAt(0).totalFrames * 33).call(function () { arrButtons[i].getChildAt(0).gotoAndStop(0); });

                // util.setClipCompleteCallback(arrButtons[i].getChildAt(0), function (mcPlayedClip) { mcPlayedClip.gotoAndStop(0); });
            }
        }
    }
    function resetAffor() {
        stopAffor();
        if (nWrongCount < 2) setAffor();
    }
    function stopAffor() {
        audioManager.stop();
        createjs.Tween.removeTweens(mcGuide);
        mcGuide.gotoAndStop(0);
        mcCat.gotoAndStop(1);

        let mcSnd = m_mcThis["mcQuesNa" + nOrder];
        mcSnd.gotoAndStop(0);

        for (let i = 0; i < arrButtons.length; i++) {
            createjs.Tween.removeTweens(arrButtons[i]);
            arrButtons[i].scale = 1;
            if (nWrongCount < 2) arrButtons[i].getChildAt(0).gotoAndStop(0);
        }
    }

    function startQuiz() {
        setAffor();

        setEnabled(true);
    }

    function setQuiz() {
        nWrongCount = 0;

        mcButtonSet.gotoAndStop(nOrder);
        let nRight = mcButtonSet.currentLabel.split('/')[nOrder];

        let mcCurrentBtnSet = mcButtonSet.getChildAt(0);
        arrButtons = [];
        let mcBtn;
        for (let i = 0; i < mcCurrentBtnSet.numChildren; i++) {
            mcBtn = mcCurrentBtnSet["mc" + i];
            if (!mcBtn) break;
            mcBtn.bRight = (i == nRight);
            mcBtn.nIdx = i;
            mcBtn.mcTxt = mcBtn.mcTxt;
            mcBtn.mcGuide = mcBtn.getChildAt(0);
            mcBtn.mcGuide.gotoAndStop(0);
            mcBtn.addEventListener("click", onClickButton);

            arrButtons.push(mcBtn);
        }

        m_mcThis.mcQuesSet.gotoAndStop(nOrder);
        mcQuesBoard = m_mcThis.mcQuesSet.getChildAt(1);

        mcPuppy.gotoAndStop(0);

        if (m_mcThis.mcNaBtn) {
            m_mcThis.mcNaBtn.addEventListener("click", onClickNarr);
            m_mcThis.mcNaBtn.gotoAndStop(0);
            m_mcThis.mcNaBtn.mouseEnabled = true;
        }

        const diffTime = new Date().getTimezoneOffset() * 60000;
        const today = new Date(Date.now() - diffTime);
        strSDate = today.toISOString().replace("T", " ").substring(0, 19);
        console.log("strSDate", strSDate);
    }

    function onClickButton(e) {
        setEnabled(false);
        stopAffor();
        m_mcThis.mcNaBtn.gotoAndStop(0);
        mcCat.mouseEnabled = true;
        m_mcThis.mcNaBtn.mouseEnabled = true;

        let mcTarget = e.currentTarget;

        if (mcTarget.bRight) {
            arrNavi[nOrder].gotoAndStop(1);

            mcTarget.mcGuide.gotoAndStop(0);

            mcCat.gotoAndStop(3);
            util.setClipCompleteCallback(mcCat.getChildAt(0), function () { mcCat.gotoAndStop(1); });

            mcPuppy.gotoAndStop((mcTarget.nIdx + 2));
            mcPuppy.getChildAt(0).mcTxt.gotoAndStop(nOrder);
            util.setClipCompleteCallback(mcPuppy.getChildAt(0), function (mcPlayedClip) {
                mcPlayedClip.stop();
            });

            mcQuesBoard.gotoAndPlay(1);
            util.setClipCompleteCallback(mcQuesBoard, function (mcPlayedClip) {
                mcPlayedClip.stop();
            });

            let mcNarr = m_mcThis["mcQuesNa" + nOrder];
            createjs.Tween.get(mcNarr).wait(3400).call(function () {
                util.setClipCompleteCallback(mcNarr, function (mcPlayedClip) {
                    mcPlayedClip.stop();

                    checkComplete();
                });
            });
        } else {
            // audioManager.effect("sounds_add/Fx_wrong.mp3");
            // audioManager.effect("sounds_add/False_Sfx.mp3");

            mcTarget.gotoAndStop(1);
            util.setClipCompleteCallback(mcTarget.getChildAt(0), function (mcPlayedClip) {
                mcPlayedClip.stop();
                mcTarget.gotoAndStop(0);
                mcTarget.mcGuide.gotoAndStop(0);
                util.setClipCompleteCallback(mcTarget.getChildAt(1), function () { });
            });

            mcCat.gotoAndStop(4);
            util.setClipCompleteCallback(mcCat.getChildAt(0), function () { mcCat.gotoAndStop(1); });

            mcPuppy.gotoAndStop(1);
            util.setClipCompleteCallback(mcPuppy.getChildAt(0), wrongFeed);

            function wrongFeed() {
                mcPuppy.gotoAndStop(0);

                nWrongCount++;

                if (nWrongCount == 2) {
                    for (let i = 0; i < arrButtons.length; i++) {
                        if (arrButtons[i].bRight) {
                            arrButtons[i].mcGuide.gotoAndPlay(1);
                        } else {
                            arrButtons[i].visible = false;
                            arrButtons[i].removeAllEventListeners();
                        }
                    }
                } else {
                    setAffor();
                }

                setEnabled(true);
            }
        }
    }

    function onClickCharacter(e) {
        stopAffor();

        mcCat.mouseEnabled = false;
        m_mcThis.mcNaBtn.mouseEnabled = true;
        m_mcThis.mcNaBtn.gotoAndStop(0);

        mcCat.gotoAndStop(2);
        util.setClipCompleteCallback(mcCat.getChildAt(0), function (mcPlayedClip) {
            mcPlayedClip.stop();

            mcCat.gotoAndStop(1);
            mcCat.mouseEnabled = true;

            if (nWrongCount < 2) setAffor();
        });
    }

    function onClickNarr(e) {
        stopAffor();

        let mcTarget = e.currentTarget;
        let mcSnd = m_mcThis["mcQuesNa" + nOrder];
        mcTarget.mouseEnabled = false;
        mcCat.mouseEnabled = true;

        mcTarget.play();

        util.setClipCompleteCallback(mcSnd, function () {
            mcTarget.gotoAndStop(0);
            mcTarget.mouseEnabled = true;

            if (nWrongCount < 2) setAffor();
        });
    }

    function checkComplete() {
        const diffTime = new Date().getTimezoneOffset() * 60000;
        const today = new Date(Date.now() - diffTime);
        strEDate = today.toISOString().replace("T", " ").substring(0, 19);
        console.log("strEDate", strEDate);
        externalManager.getQuizUserData(quizcode[nOrder], nWrongCount, strSDate, strEDate);

        nOrder++;

        if (nOrder == arrNavi.length) {
            completeQuiz();
        } else {
            setQuiz();

            if (m_mcThis.mcNaBtn) {
                // m_mcThis.mcNaBtn.play();

                let mcSnd = m_mcThis["mcQuesNa" + nOrder];
                util.setClipCompleteCallback(mcSnd, function () {
                    // m_mcThis.mcNaBtn.gotoAndStop(0);
                    setAffor();
                    setEnabled(true);
                });

                createjs.Tween.get(mcQuesBoard, { override: true })
                    .to({ scale: 1.05 }, 750, createjs.Ease.circOut)
                    .to({ scale: 1 }, 750, createjs.Ease.circOut);

            } else {
                setAffor();
                setEnabled(true);
            }
        }
    }

    function completeQuiz() {
        util.setClipCompleteCallback(m_mcThis.mcOutro, function (mcPlayedClip) {
            mcPlayedClip.stop();

            completeModule();
        });
    }
});

