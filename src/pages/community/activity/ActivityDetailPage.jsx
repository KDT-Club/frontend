import React from 'react';
import './activity.css'
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import dm from "../../../images/DM.png";

function ActivityDetailPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/community')
    }

    return(
        <div>
            <div className="header">
                <FaArrowLeft onClick={handleBack}/>
                <h2>활동내용</h2>
            </div>
            <div className="detail-info">
                <img src={dm} alt="dm" className="clubs-logo"/>
                <h2 style={{
                    fontSize: "20px",
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    marginTop: '10px'
                }}>보드게임 동아리 곰돌이</h2>
            </div>
        </div>
    )
}

export default ActivityDetailPage;