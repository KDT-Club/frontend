import React from "react";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function Member_request() {
    const navigate = useNavigate();

    return (
        <div className="Member_request">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>가입 신청 현황</p>
            </div>
            <div className="request_member_list">
                // 가입 신청 멤버 리스트
            </div>
        </div>
    )
}

export default Member_request;