import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import '../../styles/App.css';
import './main_styles/main.css';
import './main_styles/club_detail.css';
import dm from '../../images/DM.png';
import uno from '../../images/uno.png';
import profile from '../../images/profile.jpeg';
import axios from 'axios';
import Modal_ok from "../../components/modal/Modal_ok.jsx";

const ClubDetailPage = () => {
    const { clubName } = useParams();
    const [club, setClub] = useState(null);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', username: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await fetch(`https://zmffjq.store/clubs/${clubName}`);
                if (response.ok) {
                    const data = await response.json();
                    setClub(data);
                } else {
                    console.error('Failed to fetch club details');
                }
            } catch (error) {
                console.error('Error fetching club details:', error);
            }
        };

        fetchClubDetails();

        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, [clubName]);


    const handleBackClick = () => {
        navigate('/main');
    };

    const handleJoinClick = () => {
        setShowJoinForm(true);
    };

    const handleJoinSubmit = async () => {
        try {
            const config = {
                withCredentials: true // Axios에 withCredentials 옵션 추가
            };

            const response = await axios.post(`https://zmffjq.store/clubs/${clubName}/applications`, {
                motivation
            }, config);

            if (response.status === 200) {
                alert('가입 신청이 성공적으로 제출되었습니다.');
                setShowJoinForm(false);
            }
        } catch (error) {
            console.error('Error submitting join application:', error);
            alert('가입 신청 중 오류가 발생했습니다.');
        }
    };

    if (!club) {
        return <div>Loading...</div>;
    }

    const activities = club.activities || [];
    const lastActivity = club.lastActivity || {};
    const leader = club.leader || {};

    if (showJoinForm) {
        return (
            <div className="join-form">
                <div className="header">
                    <FaArrowLeft
                        style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                        onClick={() => setShowJoinForm(false)}/>
                    <p>동아리 가입 신청</p>
                </div>
                <div className="user-info">
                    <img src={profile} alt="profile" />
                    <div className="profile-info">
                        <p style={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                            marginLeft: '10px',
                        }}>{userInfo.name}</p>
                        <p style={{
                            marginLeft: '10px',
                            color: 'gray'
                        }}>학번: {userInfo.id}</p>
                    </div>
                </div>
                <div className="reason-input">
                    <p>지원동기</p>
                    <textarea
                        placeholder="지원 동기를 작성해주세요."
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                    ></textarea>
                </div>
                <button className="submit-button" onClick={handleJoinSubmit}>가입 신청</button>
            </div>
        );
    }

    return (
         <div className="club-detail-page">
             <div className="header">
                 <FaArrowLeft
                     style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                     onClick={handleBackClick}/>
                 <p>동아리 소개</p>
             </div>
            <hr/>
            <div className="club-info">
                <img src={club.clubImgUrl} alt="dm" />
                <div className="club-info-text">
                    <h3 style={{textAlign:"left", marginLeft:'20px'}}>{club.clubName}</h3>
                    <p className="info-des">{club.clubSlogan}</p>
                    <div className="club-info-center">
                        <p>{club.description}</p>
                        {activities.map((activity, index) => (
                            <p key={index}>{activity}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="last-activity">
                <h4>최근 활동</h4>
                <div className="last-activity-text">
                    <div className="uno-cards">
                        <img src={club.clubImgUrl} alt="uno"/>
                    </div>
                    <p>{lastActivity.date}</p>
                </div>
            </div>
            <div className="leader-info">
                <h4>동아리 회장 연락처</h4>
                <div className="leader-info-text">
                    <img src={club.clubImgUrl} alt="dm"/>
                    <div className="leader-info-name">
                        <p style={{
                            fontSize: "20px"
                        }}>회장</p>
                        <p style={{
                            color: "gray",
                        }
                        }>{club.member.id}</p>
                    </div>
                    <div className="leader-info-phone">
                        <p>{club.member.phone}</p>
                    </div>
                </div>
            </div>
            <button className="join-button" onClick={handleJoinClick}>함께하기!</button>
        </div>
    );
};

export default ClubDetailPage;
