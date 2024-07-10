import React from 'react';
import {useNavigate} from 'react-router-dom';
import './activity.css'
import board from '../../../images/boardgame.png'
import game from '../../../images/game.jpg'
import dm from "../../../images/DM.png";

function ActivityPage() {
    const navigate = useNavigate();

    const handleInActivity = () => {
        navigate('/activity_detail')
    }
    return(
        <div>
            <div className="activity-container">
                <div className="activity-img">
                    <img src={board} alt="board image"/>
                    <img src={game} alt="game image"/>
                    <img src={game} alt="game image"/>
                </div>
            </div>
            <div onClick={handleInActivity}
                 style={{
                     cursor: 'pointer',
                 }} className="activity-info">
                <img src={dm} alt="dm" className="clubs-logo"/>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: 'bold',
                    }}>보드게임 동아리 곰돌이</h2>
                    <span style={{
                        marginLeft: '10px',
                    }}>24.06.25 보드게임 활동입니다.</span>
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default ActivityPage;