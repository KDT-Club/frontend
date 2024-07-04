import React from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams} from "react-router-dom";

function MyclubHeader({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find(club => club.id === parseInt(id));

    const handleBackClick = () => {
        navigate('/myclub');
    };


    return (
        <div className="header_container">
            <FaArrowLeft
                style={{ fontSize: '27px', strokeWidth: '0.1', cursor: 'pointer' }}
                onClick={handleBackClick}
            />
            <div style={{fontSize: '24px', fontWeight: "bold"}}>{club.name}</div>
            <RxHamburgerMenu style={{fontSize: '27px', strokeWidth: '0.3'}}/>
        </div>
    );
}

export default MyclubHeader;