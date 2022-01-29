import React, { useState } from 'react'
import Game from './Game';
import Instruction from './Instruction';
import Layout from "../../components/Layout/Layout";

const GamePage = () => {
    const [prepare, setPrePare] = useState(false)
    return (
        <Layout>
            {(!prepare )? <Instruction setPrePare={setPrePare} /> : <Game setPrePare={setPrePare} />}
        </Layout>
    )
}
export default GamePage