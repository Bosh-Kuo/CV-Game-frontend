import React, { useState } from 'react'
import AppStreamCam from '../../components/rock-paper-scissors/WebcamStream';
import Layout from "../../components/Layout/Layout";
import Instruction from './Instruction';

const GamePage_RPS = () => {

    const [isInstruction, setIsInstruction] = useState(true);

    return (
        <Layout>
        {(isInstruction) ?
            <Instruction setIsInstruction={setIsInstruction}/>:
            <AppStreamCam setIsInstruction={setIsInstruction}/>}
        </Layout>
    )
}
export default GamePage_RPS