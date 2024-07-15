import React, {useState} from "react";
import './member_request_detail.css';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate, useParams} from "react-router-dom";
import member_info_data from "../../../../data/member_info_data.jsx";

function Member_request_detail() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));

    return (
        <div className="Member_request_detail">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>가입 신청 현황</p>
            </div>
            <div className="member_request_info">
                <img src={member.img}/>
                <div className="info_detail">
                    <p className="name">{member.name}</p>
                    <p className="other_info">{member.major} {member.studentNum}</p>
                </div>
            </div>
            <div className="apply_content">
                <p>지원 동기</p>
                <div className="reason">{member.content}</div>
            </div>
            <div className="buttons">
                <button className="refuse">거절</button>
                <button className="accept">수락</button>
            </div>
        </div>
    )
}

export default Member_request_detail;