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
                const data = await response.json();
                setClubs(data);
            } catch (error) {
                console.error("Error fetching clubs:", error);
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
            <Footer/>
        </div>
    );
}

export default MyclubMain;