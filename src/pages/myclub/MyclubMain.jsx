import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Header_left from "../../components/Header_left.jsx";
import Footer from '../../components/Footer.jsx';
import MyclubDetail from "./MyclubDetail.jsx";
import Notice from "./notice/Notice.jsx";
import NoticeWrite from './notice/WriteAndEdit/NoticeWrite.jsx'
import MyclubFreeBoard from "./freeboard/MyclubFreeBoard.jsx";
import BoardWrite from "./freeboard/WriteAndEdit/BoardWrite.jsx";
import NoticeDetail from "./notice/NoticeDetail.jsx";
import BoardDetail from "./freeboard/BoardDetail.jsx";
import clubData from "./data/clubData.jsx";
import Etc1 from "./etc/Etc1.jsx";
import Etc2 from "./etc/Etc2.jsx";
import Etc3 from "./etc/Etc3.jsx";

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setClubs(clubData);
    }, []);


    const handleClubClick = (id) => {
        navigate(`/clubs/${id}`);
    };

    const handleBoardClick = (id, boardId) => {
        navigate(`/clubs/${id}/board/${boardId}`);
    };

    return (
        <Routes>
            <Route path="/clubs" element={
                <div className="App">
                    <Header_left />
                    <div className="myclub-main-container">
                        <div className="club-list">
                            {clubs.map(club => (
                                <li key={club.clubId} className="club-item"
                                    onClick={() => handleClubClick(club.clubId)}>
                                    <div className="club-image"></div>
                                    <span className="club-name">{club.name}</span>
                                </li>
                            ))}
                        </div>
                    </div>
                    <Footer />
                </div>
            }/>
            <Route path="/clubs/:id" element={<MyclubDetail clubs={clubs}/>}/>
            <Route path="/clubs/:id/board/2" element={<Notice clubs={clubs}/>}/>
            <Route path="/clubs/:clubId/board/2/posts/:postId" element={<NoticeDetail />} />
            <Route path="/clubs/:id/board/2/noticewrite" element={<NoticeWrite clubs={clubs}/>}/>
            <Route path="/clubs/:id/board/4" element={<MyclubFreeBoard clubs={clubs}/>}/>
            <Route path="/clubs/:clubId/board/4/posts/:postId" element={<BoardDetail />} />
            <Route path="/clubs/:id/board/4/freeboardwrite" element={<BoardWrite clubs={clubs}/>}/>
            <Route path="/clubs/etc1" element={<Etc1 />} />
            <Route path="/clubs/etc2" element={<Etc2 />} />
            <Route path="/clubs/etc3" element={<Etc3 />} />
        </Routes>
    );
}

export default MyclubMain;
