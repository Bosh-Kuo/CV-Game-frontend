import '@tensorflow/tfjs-backend-webgl';
import React from 'react';
import Prediction from './Prediction';
import { useEffect, useRef, useState, useContext } from 'react';
import { UPDATE_MUTATION } from "../../graphql/index";
import { useMutation } from "@apollo/react-hooks";
import { UserContext } from "../../containers/App";
import { useNavigate } from "react-router-dom";
import { FINGER_MORA } from '../../constants';
import './WebcamStream.css';

const Correct_Time = 10;
let IDs = [];
let stream;

const check_objective_is_same = (new_rps, new_obj, old_rps, old_obj) => {
    if (
        (((old_rps === 0 && old_obj === 2) || (old_rps === 1 && old_obj === 1) || (old_rps === 2 && old_obj === 0)) &&
        ((new_rps === 0 && new_obj === 2) || (new_rps === 1 && new_obj === 1) || (new_rps === 2 && new_obj === 0))) ||
        (((old_rps === 0 && old_obj === 0) || (old_rps === 1 && old_obj === 2) || (old_rps === 2 && old_obj === 1)) &&
        ((new_rps === 0 && new_obj === 0) || (new_rps === 1 && new_obj === 2) || (new_rps === 2 && new_obj === 1))) ||
        (((old_rps === 0 && old_obj === 1) || (old_rps === 1 && old_obj === 0) || (old_rps === 2 && old_obj === 2)) &&
        ((new_rps === 0 && new_obj === 1) || (new_rps === 1 && new_obj === 0) || (new_rps === 2 && new_obj === 2)))
        ) {
            return true;
    } else {
        return false;
    }
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

function AppStreamCam({ setIsInstruction }) {

    const [gestureName, setGestureName] = useState('none');
    const [gestureScore, setGestureScore] = useState('0');
    const [isInit, setIsInit] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCountDowning, setIsCountDowning] = useState(false);
    const [rps, setRps] = useState(3);
    const [obj, setObj] = useState(3);
    const [correctNum, setCorrectNum] = useState(Correct_Time);
    const [countDown, setCountDown] = useState('Get ready');
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(0);

    const { UserData, setUserData } = useContext(UserContext);
    const [UpdateMutation] = useMutation(UPDATE_MUTATION);
    const navigate = useNavigate();

    async function onInit() {
        await Prediction.init();
        return true;
    }

    const getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    }

    const randomRPS = () => {
        let k = getRandomInt(3);
        let kk = getRandomInt(3);
        while (check_objective_is_same(k, kk, rps, obj)) {
            k = getRandomInt(3);
            kk = getRandomInt(3);
        }
        setRps(k);
        setObj(kk);
    }

    const handlePictureChange = () => {
        randomRPS();
    }

    const handleStart = () => {
        console.log('start!!!');
        setIsCountDowning(true);
        setCorrectNum(Correct_Time);
        IDs.push(setTimeout(() => {
            handlePictureChange();
            setStartTime(Date.now());
        }, 4000));
        IDs.push(setTimeout(() => {
            setCountDown('start in 3');
        }, 1000));
        IDs.push(setTimeout(() => {
            setCountDown('start in 2');
        }, 2000));
        IDs.push(setTimeout(() => {
            setCountDown('start in 1');
        }, 3000));
        IDs.push(setTimeout(() => {
            setCountDown('(Stay Focus)');
            setIsCountDowning(false);
        }, 4000));
    }

    const handleStop = () => {
        setIsPlaying(false);
        IDs.map((id) => {
            clearTimeout(id);
        })
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
        Prediction.stop();
        setGestureName('none');
        setGestureScore(0);
        setCountDown('Get ready');
        setCorrectNum(Correct_Time);
        console.log('game stops');
    }

    const streamCamVideo = async () => {
        if (!isPlaying) {
            setIsInit(true);
            await onInit();
            var constraints = { audio: false, video: { width: 600, height: 450 } };
            navigator.mediaDevices
                .getUserMedia(constraints)
                .then(function(mediaStream) {
                    var video = document.querySelector("video");
                    stream = mediaStream;
                    video.srcObject = mediaStream;
                    video.onloadedmetadata = function(e) {
                        video.play();
                    };
                    setIsInit(false);
                    setIsPlaying(true);
                    Prediction.main(setGestureName, setGestureScore);
                    handleStart();
                })
                .catch(function(err) {
                    console.log(err.name + ": " + err.message);
                });
        }
    }

    const score2Time = (score) => {
        let minute;
        if (Math.floor(score/60000) < 10) {
            minute = '0' + Math.floor(score/60000).toString();
        } else {
            minute = Math.floor(score/60000).toString();
        }
        let second;
        if (Math.floor((score%60000)/1000) < 10) {
            second = '0' + Math.floor((score%60000)/1000).toString();
        } else {
            second = Math.floor((score%60000)/1000).toString();
        }
        let msecond;
        if ((score%1000) < 10) {
            msecond = '00';
        } else if ((score%1000) < 100) {
            msecond = '0' + (score%1000).toString().substring(0, 1);
        } else {
            msecond = (score%1000).toString().substring(0, 2);
        }

        return minute + ':' + second + ':' + msecond;
    }

    //rock     => rps = 0
    //paper    => rps = 1
    //scissors => rps = 2

    useInterval(() => {
        // console.log('in useInterval', rps, obj);
        if (
            (gestureName === 'rock') && ((rps === 0 && obj === 2) || (rps === 1 && obj === 1) || (rps === 2 && obj === 0)) ||
            (gestureName === 'paper') && ((rps === 0 && obj === 0) || (rps === 1 && obj === 2) || (rps === 2 && obj === 1)) ||
            (gestureName === 'scissors') && ((rps === 0 && obj === 1) || (rps === 1 && obj === 0) || (rps === 2 && obj === 2))
            ) {
                setCorrectNum(correctNum - 1);
                if (correctNum !== 1) {
                    handlePictureChange();
                } else {
                    setScore(Date.now() - startTime);
                    handleStop();
                }
            }
    }, 500);

    useEffect(() => {
        if (score !== 0) {
            if (UserData.scores.hasOwnProperty(FINGER_MORA)) {  //玩過 Rock-Paper-Scissors
                if (score < UserData.scores[FINGER_MORA]) {
                    setUserData({ ...UserData, scores: { ...UserData.scores, FINGER_MORA: score } })
                    UpdateMutation({
                        variables: {
                            data: {
                                name: UserData.username,
                                game: FINGER_MORA,
                                score: Math.floor(score/10) * 10,  //去除小數點後第三位
                            }
                        },
                    });
                }
            } else {
                setUserData({ ...UserData, scores: { ...UserData.scores, FINGER_MORA: score } })
                UpdateMutation({
                    variables: {
                        data: {
                            name: UserData.username,
                            game: FINGER_MORA,
                            score: Math.floor(score/10) * 10,  //去除小數點後第三位
                        }
                    },
                });
            }
        }
    }, [isPlaying])

    return (
        <div className='background'>
            <h3 className="loading-status">{countDown}{(!isCountDowning && isPlaying) ? ('   ' + correctNum.toString() + ' left'): ''}</h3>
            <h3 className="loading-status">{
                (isInit) ?
                    "The game is laoding... please wait...it will take some time...": 
                    (isPlaying) ? 
                        (isCountDowning) ? 
                            "look here --> The game will soon be started <-- look here":
                            (obj === 0) ?
                                "請贏它":
                                (obj === 1) ?
                                    "請輸給它":
                                    (obj === 2) ?
                                        "請平手":
                                        "error!!!":
                        "Press start button to start"
            }</h3>
            <br />
            <div className="game-container">
                <div className="videoWrapper">
                    <video autoPlay={true} className="RPSvideo" controls></video>
                </div>
                <div className="imageWrapper">
                    <img className="RPSimage" src={
                        (rps === 3) ? 
                            require("../../img/sample.png"):
                            (rps === 2) ? 
                                require("../../img/sample_scissor.jpg"):
                                (rps === 1) ? 
                                    require("../../img/sample_paper.jpg"):
                                    require("../../img/sample_rock.jpg")
                    }></img>
                </div>
            </div>
            <div className="btn-container-RPS">
                <button className="btn" onClick={() => { 
                    handleStop();
                    setIsInstruction(true);
                }}>Go Back</button>
                <button className="btn" onClick={streamCamVideo}>Start / Restart</button>
                <button className="btn" onClick={handleStop}>Stop</button>
            </div>
            <br />
            {/* <h3 className="gesture-score">{gestureName}, {gestureScore}</h3> */}
            <h3 className="gesture-score">{'your time: ' + score2Time(score)}</h3>
        </div>
    );
}

export default AppStreamCam;
