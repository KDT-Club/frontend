import React from 'react';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import "./clubinfoedit.css";
import { RiImageCircleLine } from "react-icons/ri";


function ClubInfoEdit() {
    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackClick = () => {
        navigate(`/clubs/${id}`, { state: { isMenuOpen: location.state?.isMenuOpen } }); // 햄버거탭 오픈 상태 전달
    };

    return (
        <div className="whole">
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>동아리 정보 수정</div>
                <div></div>
            </div>
            <div className="clubinfo-edit-container">
                <div className="edit-container">
                    <RiImageCircleLine style={{fontSize: '55px', cursor: 'pointer', marginBottom: "10px"}}/>
                    <div style={{fontSize: "16.5px"}}>변경할 대표 이미지를 선택하세요.</div>
                </div>
                <div className="edit-container-left">
                    <div className="edit-container-left-in">
                        <div className="edit-title">동아리 이름</div>
                        <input type="text" className="edit-input-box"
                               style={{width: "35%", height: "35px", textAlign: "center"}}/>
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">슬로건</div>
                        <textarea className="edit-input-box" style={{width: "60%", height: "70px"}}/>
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">설명</div>
                        <textarea className="edit-input-box" style={{width: "60%", height: "250px"}}></textarea>
                    </div>
                </div>
                <button className="att-complete-button" style={{marginBottom: "20px"}}>완료</button>
            </div>
        </div>
    );
}

export default ClubInfoEdit;