import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/App.css'
import Footer from '../../components/footer/Footer.jsx';
import axios from "axios";
import Header_center from "../../components/header/Header_center.jsx";
import styled from 'styled-components';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        let memberId = queryParams.get('memberId') || localStorage.getItem('memberId');
        localStorage.setItem('memberId', memberId);

        const fetchClubs = async () => {
            try {
                const response = await apiClient.get(`/clubs?memberId=${memberId}`, {
                    params: { memberId }
                });
                console.log("Server response:", response.data);

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
        <MyclubDetailContainer>
            <Header_center/>
            {clubs.length > 0 && clubs.some(club => club.clubId) ? (
                <MyclubMainContainer>
                    <hr style={{borderTop: "1px solid #ccc", marginTop: "15px"}}/>
                    <ClubList>
                        {clubs.map(club => (
                            club.clubId && (
                                <ClubItem key={club.clubId} onClick={() => handleClubClick(club.clubId)}>
                                    <ClubImage>
                                        <img src={club.clubImgUrl} alt={club.clubName}/>
                                    </ClubImage>
                                    <ClubName>{club.clubName}</ClubName>
                                </ClubItem>
                            )
                        ))}
                    </ClubList>
                </MyclubMainContainer>
            ) : (
                <NoClubMessage>가입한 동아리가 없습니다</NoClubMessage>
            )}
            <Footer />
        </MyclubDetailContainer>
    );
}

const MyclubDetailContainer = styled.div`
    width: calc(var(--vw, 1vw) * 100);
    height: calc(var(--vh, 1vh) * 100);
    text-align: center;
    display: flex;
    flex-direction: column;
`;

const MyclubMainContainer = styled.div`
    width: calc(var(--vw, 1vw) * 100);
    height: calc(var(--vh, 1vh) * 100);
    text-align: center;
    display: flex;
    flex-direction: column;
`;

const ClubList = styled.ul`
    width: 100%;
    list-style: none;
    padding: 0;
    margin-top: 0px;
`;

const ClubItem = styled.li`
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
`;

const ClubImage = styled.div`
    width: 50px;
    height: 50px;
    background-color: #e0e0e0;
    margin-right: 20px;
    flex-shrink: 0;
    margin-left: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
`;

const ClubName = styled.span`
    font-size: 18.5px;
    font-weight: bold;
`;

const NoClubMessage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
    color: #666;
`;

export default MyclubMain;