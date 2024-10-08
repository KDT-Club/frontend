import React, {useCallback, useEffect, useState} from "react";
import './member_request_detail.css';
import {FaArrowLeft} from "react-icons/fa6";
import Modal_ok from "../../../../../components/modal/Modal_ok.jsx";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

function Member_request_detail() {
    const navigate = useNavigate();
    const { id, requestId } = useParams();
    const [memberId, setMemberId] = useState('');
    const [member, setMember] = useState('');
    const [requestMember, setRequestMember] = useState('')
    const [memberDetail, setMemberDetail] = useState('');
    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47.5px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 0px;
`;

    const apiClient = axios.create({
        baseURL: '/api',
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
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    };

    useEffect(() => {
        fetchUserId();
        fetchJoinRequests();
    }, []);

    useEffect(() => {
        if (memberId) {
            apiClient.get(`/members/${memberDetail.memberId}`)
                .then(response => {
                    setMember(response.data);
                })
                .catch(error => {
                    console.error('Error fetching member data:', error);
                });
        }
    }, [memberId]);

    const handleAcceptRequest = () => {
        apiClient.post(`clubs/${id}/joinRequest/${requestId}/approveRequest`)
            .then(response => {
                handleOpenOkModal("승인이 완료되었습니다.", () => navigate(-1));
            })
            .catch(error => {
                console.error('회원 승인 중 오류 발생:', error);
                handleOpenOkModal("승인에 실패했습니다. 다시 시도해주세요.", () => {});
            });
    };

    const handleDenyRequest = () => {
        apiClient.post(`clubs/${id}/joinRequest/${requestId}/denyRequest`)
            .then(response => {
                handleOpenOkModal("거절이 완료되었습니다.", () => navigate(-1));
            })
            .catch(error => {
                console.error('회원 거절 중 오류 발생:', error);
                handleOpenOkModal("거절에 실패했습니다. 다시 시도해주세요.", () => {});
            });
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);

    return (
        <div className="Member_request_detail">
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={() => navigate(`/clubs/${id}/joinRequest`)}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", textAlign: "left", marginRight: "110px"}}>가입 신청 현황</div>
            </HeaderContainer>
            <div className="member_request_info">
                <img src={memberDetail.memberImageURL} alt="Profile"/>
                <div className="info_detail">
                    <p className="name">{memberDetail.name}</p>
                    <p className="other_info">{memberDetail.department} {memberDetail.studentId}</p>
                </div>
            </div>
            <div className="apply_content">
                <p>지원 동기</p>
                <div className="reason">{memberDetail.introduction}</div>
            </div>
            <div className="buttons">
                <button className="refuse" onClick={handleDenyRequest}>거절</button>
                <button className="accept" onClick={handleAcceptRequest}>수락</button>
            </div>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

export default Member_request_detail;