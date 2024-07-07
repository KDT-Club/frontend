import React from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams} from "react-router-dom";

function MyclubHeader({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find(club => club.clubId === parseInt(id));

    const handleBackClick = () => {
        navigate('/clubs');
    };

    return (
        <div className="header_container">
            <FaArrowLeft
                style={{ fontSize: '26px', cursor: 'pointer' }}
                onClick={handleBackClick}
            />
            <div style={{fontSize: '26px', fontWeight: "bold"}}>{club.name}</div>
            <RxHamburgerMenu style={{fontSize: '27px', strokeWidth: '0.3'}}/>
        </div>
    );
}

export default MyclubHeader;