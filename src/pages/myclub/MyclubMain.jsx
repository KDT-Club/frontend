import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Header_left from "../../components/header/Header_left.jsx";
import Footer from '../../components/footer/Footer.jsx';
import axios from "axios";
// import clubData from "./data/clubData.jsx";

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    //memberId에 따른 동아리 목록 API 조회
    // const { memberId } = useParams();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const memberId = queryParams.get('memberId');

        if (!memberId) {
            // memberId가 없으면 로그인 페이지로 리다이렉트
            navigate('/login');
            return;
        }

    const fetchClubs = async () => {
        try {
            const response = await axios.get(`http://3.36.56.20:8080/clubs?memberId=${memberId}`, {
                params: { memberId }
            });
            setClubs(response.data);

            if (Array.isArray(response.data)) {
                setClubs(response.data);
            } else {
                setClubs([response.data]);
            }

        } catch (error) {
            console.error('동아리 목록을 가져오는 중 에러 발생', error);
            console.log(clubs);
        }
    };
    fetchClubs();
    }, [location, navigate]);

    // useEffect(() => { //이건 UI전용이라 API 연동하면 지워도 됨
    //     setClubs(clubData);
    // }, []);

    const handleClubClick = (clubId) => {
        const club = clubs.find(club => club.clubId === clubId);
        navigate(`/clubs/${clubId}`, { state: { clubName: club.clubName } });
    };

    return (
        <div className="myclub-detail-container">
            <Header_left/>
            <div className="myclub-main-container">
                <div className="club-list">
                    {clubs.length > 0 && clubs.map(club => (
                        <li key={club.clubId} className="club-item"
                            onClick={() => handleClubClick(club.clubId)}>
                            <div className="club-image">
                                <img src={club.clubImgUrl} alt={club.clubName}/>
                            </div>
                            <span className="club-name">{club.clubName}</span>
                        </li>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default MyclubMain;