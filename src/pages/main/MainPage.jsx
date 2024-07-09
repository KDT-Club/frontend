import React, { useState } from 'react';
import Header_center from "../../components/Header_center.jsx";
import Footer from "../../components/Footer.jsx";
import '../../styles/App.css';
import './main_styles/main.css';
import Search from "../../images/search.png";
import dm from "../../images/DM.png"
import axios from 'axios';
import {useNavigate} from "react-router-dom";

function MainPage() {
    const [findClub, setFindClub] = useState('');
    const [clubs, setClubs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    // 나중에 API 전체 불러오는거 연결할 때 쓸게요!
    // const fetchAllClubs = async () => {
    //     try {
    //         const response = await axios.get("/getClub");
    //         setClubs(response.data);
    //     } catch (error) {
    //         console.error("에러발생:", error);
    //     }
    // }
    //
    // const fetchClubsByNames = async (clubName) => {
    //     try {
    //         const response = await axios.get("/getClubByName/{clubName}");
    //         setClubs(response.data);
    //     } catch (error) {
    //         console.error("에러발생:", error);
    //     }
    // }

    //
    // useEffect(() => {
    //     fetchAllClubs();
    // }, [])

    const handleMenuClick = (index, clubName) => {
        setActiveIndex(index);
    //     if(clubName === '전체'){
    //         fetchAllClubs();
    //     } else {
    //         fetchClubsByNames(clubName);
    //     }
    };

    const handleClubClick = (clubId) => {
        navigate(`/club/${clubId}`);
    }

    // 위 코드 나중에 아래 코드로 수정

    // const handleClubClick = (clubName) => {
    //     setSelectedClubName(clubName);
    //     fetchClubsByNames(clubName); // 선택한 동아리 이름으로 데이터 불러오기
    // };
    //

    return (
        <div>
            <Header_center/>
            <div className="find-club-container">
                <div className="find-club">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="원하시는 동아리를 찾아보세요!"
                            value={findClub}
                            onChange={(e) => setFindClub(e.target.value)}
                        />
                        <img src={Search} alt="search" className="search-icon"/>
                    </div>
                </div>
            </div>
            <div className="menu-container">
                <div className="menu-scroll">
                    {['전체', '체육', '학술', '음악'].map((item, index) => (
                        <div
                            key={index}
                            className={`menu-all ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleMenuClick(index)}
                            style={{border: activeIndex === index ? '2px solid black' : '0.5px solid gray'}}
                        >
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="clubs-container">
                <div className="clubs-pt" onClick={() => handleClubClick(1)}>
                <img src={dm} alt="dm" className="clubs-logo"/>
                    <div className="clubs-it">
                        <p className="clubs-title">D.M</p>
                        <p className="clubs-sm">삼육대학교 중앙 댄스 동아리 D.M입니다.</p>
                    </div>
                </div>
            </div>
            {/*이 부분도 나중에 불러오면 이걸로 수정할게요*/}
            {/*<div className="clubs-container">*/}
            {/*    {clubs.map((club) => (*/}
            {/*        <div key={club.clubId} className="club-card">*/}
            {/*            <img src={club.clubImgUrl} alt={club.name}/>*/}
            {/*            <h3>{club.name}</h3>*/}
            {/*            <p>{club.description}</p>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <Footer/>
        </div>
    );
}

export default MainPage;
