import React, {useEffect, useState} from "react";
import './member_request_detail.css';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate, useParams} from "react-router-dom";
import member_info_data from "../../../../data/member_info_data.jsx";
import axios from "axios";

function Member_request_detail() {
    const navigate = useNavigate();
    const { id, requestId } = useParams();
    console.log(id, requestId)
    const [memberId, setMemberId] = useState('');
    const [memberDetail, setMemberDetail] = useState(null);

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", {
                withCredentials: true
            });
            setMemberId(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    const fetchJoinRequests = async () => {
        try {
            const response = await apiClient.get(`/clubs/${id}/joinRequest/${requestId}`);
            setMemberDetail(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    };

    useEffect(() => {
        fetchUserId();
        fetchJoinRequests();
    }, []);

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
                <img />
                <div className="info_detail">
                    <p className="name">{}</p>
                    <p className="other_info">{/*이름 */} {/* 학번 */}</p>
                </div>
            </div>
            <div className="apply_content">
                <p>지원 동기</p>
                <div className="reason">{/* 지원 동기 */}</div>
            </div>
            <div className="buttons">
                <button className="refuse">거절</button>
                <button className="accept">수락</button>
            </div>
        </div>
    )
}

export default Member_request_detail;