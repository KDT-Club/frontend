import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Footer from '../../components/footer/Footer.jsx';
import axios from "axios";
import Header_center from "../../components/header/Header_center.jsx";
import styled from 'styled-components';

const NoClubMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #666;
`;

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        let memberId = queryParams.get('memberId') || localStorage.getItem('memberId');
        if (!memberId) {
            navigate('/login');
            return;
        } else {
            localStorage.setItem('memberId', memberId);
        }

        const fetchClubs = async () => {
            try {
                const response = await axios.get(`https://zmffjq.store/clubs?memberId=${memberId}`, {
                params: { memberId }
                });
                // 응답이 배열이고 유효한 클럽 데이터를 포함하고 있는지 확인
                if (Array.isArray(response.data) && response.data.some(club => club.clubId)) {
                    setClubs(response.data);
                } else {
                    setClubs([]); // 유효한 클럽 데이터가 없으면 빈 배열로 설정
                }
        } catch (error) {
            console.error('동아리 목록을 가져오는 중 에러 발생', error);
            setClubs([]); //추가
        }
    };
    fetchClubs();
}, [location, navigate]);

    const handleClubClick = (clubId) => {
        const club = clubs.find(club => club.clubId === clubId);
        const queryParams = new URLSearchParams(location.search);
        const memberId = queryParams.get('memberId') || localStorage.getItem('memberId');
        navigate(`/clubs/${clubId}/myclub`, { state: { clubName: club.clubName, memberId } });
    };

    return (
        <div className="myclub-detail-container">
            <Header_center/>
            {clubs.length > 0 && clubs.some(club => club.clubId) ? (
                <div className="myclub-main-container">
                    <div className="club-list">
                        {clubs.map(club => (
                            club.clubId && (
                                <li key={club.clubId} className="club-item" onClick={() => handleClubClick(club.clubId)}>
                                    <div className="club-image">
                                        <img src={club.clubImgUrl} alt={club.clubName}/>
                                    </div>
                                    <span className="club-name">{club.clubName}</span>
                                </li>
                            )
                        ))}
                    </div>
                </div>
            ) : (
                <NoClubMessage>가입한 동아리가 없습니다</NoClubMessage>
            )}
            <Footer />
        </div>
    );
}

export default MyclubMain;