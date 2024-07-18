import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Header_left from "../../components/header/Header_left.jsx";
import Footer from '../../components/footer/Footer.jsx';
import clubData from "./data/clubData.jsx";

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    //memberId에 따른 동아리 목록 API 조회
    const { memberId } = useParams();
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch(`/clubs?memberId=${memberId}`);
                // const response = await fetch(`http://3.36.56.20:8080/clubs`);
                if (!response.ok) {
                    throw new Error('동아리 목록 조회 실패');
                }
                const data = await response.json();
                setClubs(data);
            } catch (error) {
                console.error('동아리 목록을 가져오는 중 에러 발생', error);
            }
        };
        fetchClubs();
    }, [memberId]);

    useEffect(() => { //이건 UI전용이라 API 연동하면 지워도 됨
        setClubs(clubData);
    }, []);

    const handleClubClick = (id) => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div className="myclub-detail-container">
            <Header_left/>
            <div className="myclub-main-container">
                <div className="club-list">
                    {clubs.map(club => (
                        <li key={club.clubId} className="club-item"
                            onClick={() => handleClubClick(club.clubId)}>
                            <div className="club-image">
                                <img src={club.clubImgUrl} alt={club.name}/>
                            </div>
                            <span className="club-name">{club.name}</span>
                        </li>
                    ))}
                </div>
            </div>
            <Footer memberId={memberId} />
        </div>
    );
}

export default MyclubMain;