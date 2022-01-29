import React, {useContext} from 'react'
import { UserContext } from "../App";
import './Instruction.css';
import Flappy_Bird_icon from '../../img/Flappy_Bird_icon.png'
import pose_detect from '../../img/pose-detect.png'
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Instruction = ({ setPrePare }) => {
    const { UserData } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <div className="background-flappybird">
            <h1 className="title-flappybird"> Play Flappy Bird Game with Pose Detection ! </h1>
            <div className="container-instruction-flappybird">
                <ul className="container">
                    <li className="instruction">
                        遊戲說明:<br />
                        玩家進入FlapyBird遊戲頁面後，前置鏡頭便會偵測玩家的Pose，
                        當看到畫面中的自己身上被標上了偵測點便可以開始進行遊戲!
                    </li>
                    <li className="instruction">
                        操作說明:<br />
                        此遊戲藉由前置鏡頭偵測玩家的Pose，當玩家雙手做出揮舞動作即可控制Bird
                        向上飛。準確來說，當揮動手臂使原本高於肩膀的雙手手腕偵測點（編號9,10）低於肩膀偵測點（編號5,6）時，
                        Bird就會向上飛了!
                    </li>
                    <li className="instruction">
                        疑難排解: <br />
                        Q1: 若我的電腦沒有前置鏡頭怎麼辦？<br />
                        A1: 此遊戲也可以藉由點擊滑鼠來進行唷!<br />
                        Q2: 要如何增加操作的穩定性？ <br />
                        A2: 因為此遊戲是藉由tensorflow.js的MoveNet model來偵測玩家的身體動作，因此請離鏡頭一定距離，
                        讓上半身能完全被偵測到!
                    </li>
                    <li className="instruction">
                        是不是棒透了!
                    </li>
                </ul>
                <div className="image-container-flappybird">
                    <img className="image-flappybird" src={Flappy_Bird_icon} alt="Flappy Bird"/>
                    <img className="image-flappybird" src={pose_detect} alt="Pose Detection"/>
                </div>
            </div>
            <div className="btn-container-flappybird">
                <Button variant="contained" sx={{ mx: 3 }} onClick={() => { navigate(`/login/${UserData.username}/lobby`) }}>Go Back</Button>
                <Button variant="contained" sx={{ mx: 3 }} onClick={() => { setPrePare(true) }}>Let's Start! </Button>
            </div>
        </div>
    )
}

export default Instruction
