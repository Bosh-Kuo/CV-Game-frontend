import React, {useContext} from 'react'
import { UserContext } from "../App";
import '../flappybird/Instruction.css';
import RPS_icon from '../../img/Rock_Paper_Scissors_icon.png';
import mora_pose from '../../img/mora_pose.png';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const Instruction = ({ setIsInstruction }) => {
    const { UserData } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <div className="background-flappybird">
            <h1 className="title-flappybird"> Play Rock-Paper-Scissors with Hand Pose Detection ! </h1>
            <div className="container-instruction-flappybird">
                <ul className="container">
                    <li className="instruction">
                        遊戲說明:<br />
                        玩家進入Rock-Paper-Scissors遊戲頁面後，前置鏡頭便會偵測玩家的Hand Pose，
                        請在遊戲開始時，將"一隻"手掌放置到畫面中央，使手掌完整的出現於螢幕之中，並佔據至少1/4的螢幕大小。
                        每次遊戲將有10個要求動作，完成後將會給出計時的分數(單位:ms)
                    </li>
                    <li className="instruction">
                        操作說明:<br />
                        此遊戲藉由前置鏡頭偵測玩家的Hand Pose，請配合遊戲指示擺出剪刀、石頭或布。
                    </li>
                    <li className="instruction">
                        疑難排解: <br />
                        Q1: 若我的電腦沒有前置鏡頭怎麼辦？<br />
                        A1: 目前沒有支持其他遊戲方式QQ。<br />
                        Q2: 要如何增加操作的穩定性？ <br />
                        A2: 如上述，盡量使手掌處於明顯位置、掌心朝前，且不要太靠近其他身體部位(ex:臉)，
                            若偵測不到可以嘗試翻轉手掌。另外，此模型目前只支持一隻手掌的偵測。
                    </li>
                    <li className="instruction">
                        加油!!!
                    </li>
                </ul>
                <div className="image-container-flappybird">
                    <img className="image-flappybird" src={RPS_icon} alt="Rock-Paper-Scissors"/>
                    <img className="image-flappybird" src={mora_pose} alt="Mora Pose"/>
                </div>
            </div>
            <div className="btn-container-flappybird">
                <Button variant="contained" sx={{ mx: 3 }} onClick={() => { navigate(`/login/${UserData.username}/lobby`) }}>Go Back</Button>
                <Button variant="contained" sx={{ mx: 3 }} onClick={() => { setIsInstruction(false) }}>Let's Start! </Button>
            </div>
        </div>
    )
}

export default Instruction
