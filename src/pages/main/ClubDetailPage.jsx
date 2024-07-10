import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import '../../styles/App.css';
import './main_styles/main.css';
import './main_styles/club_detail.css';
import dm from '../../images/DM.png'
import uno from '../../images/uno.png'
import profile from '../../images/profile.jpeg'

const ClubDetailPage = () => {
    const { clubId } = useParams();
    const [club, setClub] = useState(null);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 임시 데이터 설정
        setClub({
            name: "소수정에 전략 보드게임 동아리",
            description: "5기 곰돌이가 서울에 상륙하였습니다!",
            location: "😺서울과 전략/두뇌파트의 성지(聖地)",
            activities: [
                "😈지니어스/전략/두뇌 등을 만나기 위해 곰돌이가 서울에 상륙하였습니다!👻",
                "😈기성 동아리가 대부분 달무티/덱빌딩/스플렌더/클루/아발론 등 입문용 게임만 간단히 즐기고 뒷풀이 하러가 아쉬웠던 점이 많았습니다.",
                "😈테라포밍마스/윙스팬/갈라리스트/아크노바 등 완벽한 테마성으로 색다른경험의 보드게임이 많은데 모르시는듯 하여 소개해 드리고 싶은 생각에 창립하게 되었습니다.",
                "😈지니어스/전략/두뇌 등을 만나기 위해 곰돌이가 서울에 상륙하였습니다!👻",
                "😈기성 동아리가 대부분 달무티/덱빌딩/스플렌더/클루/아발론 등 입문용 게임만 간단히 즐기고 뒷풀이 하러가 아쉬웠던 점이 많았습니다.",
                "😈테라포밍마스/윙스팬/갈라리스트/아크노바 등 완벽한 테마성으로 색다른경험의 보드게임이 많은데 모르시는듯 하여 소개해 드리고 싶은 생각에 창립하게 되었습니다."
            ],
            lastActivity: {
                type: "UNO",
                date: "2024.06.20 회화역에서 UNO 게임~"
            },
            leader: {
                name: "이름",
                phone: "010-0000-0000"
            }
        });
    }, [clubId]);

    const handleBackClick = () => {
        navigate('/main');
    }

    const handleJoinClick = () => {
        setShowJoinForm(true);
    }

    if (!club) {
        return <div>Loading...</div>;
    }

    if (showJoinForm) {
        return (
            <div className="join-form">
                <div className="header">
                    <FaArrowLeft onClick={() => setShowJoinForm(false)} />
                    <h2>동아리 가입 신청</h2>
                </div>
                <div className="user-info">
                    <img src={profile} alt="profile" />
                    <div className="profile-info">
                        <p style={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                            marginLeft: '-60px'
                        }}>이정훈</p>
                        <p style={{
                            marginLeft: '15px',
                            color: 'gray'
                        }}>학번: 2020101460</p>
                    </div>
                </div>
                <div className="reason-input">
                    <p>지원동기</p>
                    <textarea placeholder="지원 동기를 작성해주세요."></textarea>
                </div>
                <button className="submit-button">가입 신청</button>
            </div>
        );
    }

    return (
        <div className="club-detail-page">
            <div className="header">
                <FaArrowLeft onClick={handleBackClick} />
                <h2>동아리 소개</h2>
            </div>
            <hr/>
            <div className="club-info">
                <img src={dm} alt="dm" />
                <div className="club-info-text">
                    <h3>{club.name}</h3>
                    <p className="info-des">{club.description}</p>
                    <div className="club-info-center">
                        <p>{club.location}</p>
                        {club.activities.map((activity, index) => (
                            <p key={index}>{activity}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="last-activity">
                <h4>최근 활동(가로 스크롤)</h4>
                <div className="last-activity-text">
                    <div className="uno-cards">
                        <img src={uno} alt="uno"/>
                    </div>
                    <p>{club.lastActivity.date}</p>
                </div>
            </div>
            <div className="leader-info">
                <h4>동아리 회장 연락처</h4>
                <div className="leader-info-text">
                    <img src={dm} alt="dm"/>
                    <div className="leader-info-name">
                        <p style={{
                            fontSize: "20px"
                        }}>회장</p>
                        <p style={{
                            color: "gray",
                        }
                        }>{club.leader.name}</p>
                    </div>
                    <div className="leader-info-phone">
                        <p>{club.leader.phone}</p>
                    </div>
                </div>
            </div>
            <button className="join-button" onClick={handleJoinClick}>함께하기!</button>
        </div>
    );
};

export default ClubDetailPage;