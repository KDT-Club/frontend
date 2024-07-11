import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import '../../styles/App.css'
import './myclubmain.css';
import Header_left from "../../components/header/header_left.css";
import Footer from '../../components/footer/Footer.jsx';
import MyclubDetail from "./MyclubDetail.jsx";
import NoticeList from "./notice/NoticeList.jsx";
import NoticeWrite from './notice/WriteAndEdit/NoticeWrite.jsx'
import FreeBoardList from "./freeboard/FreeBoardList.jsx";
import BoardWrite from "./freeboard/WriteAndEdit/BoardWrite.jsx";
import NoticeDetail from "./notice/NoticeDetail.jsx";
import FreeBoardDetail from "./freeboard/FreeBoardDetail.jsx";
import clubData from "./data/clubData.jsx";
import postData from "./data/postData.jsx";
import Etc1 from "./etc/Etc1.jsx";
import Atd from "./etc/Atd.jsx";
import Etc2 from "./etc/Etc2.jsx";
import Etc3 from "./etc/Etc3.jsx";
import ClubInfoEdit from "./DetailHeader/club_manage/ClubInfoEdit.jsx";

const MyclubMain = () => {
    const [clubs, setClubs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setClubs(clubData);
    }, []);

    const handleClubClick = (id) => {
        navigate(`/clubs/${id}`);
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

            <Route path="/clubs/:id/board/:boardId" element={<BoardList clubs={clubs} />} />
            <Route path="/clubs/:clubId/board/:boardId/posts/:postId" element={<BoardDetail clubs={clubs} posts={postData} />} />

            //글쓰기 화면 라우팅; 수정 필요.
            <Route path="/clubs/:id/board/2/noticewrite" element={<NoticeWrite clubs={clubs}/>}/>
            <Route path="/clubs/:id/board/4/freeboardwrite" element={<BoardWrite clubs={clubs}/>}/>

            <Route path="/clubs/etc1" element={<Etc1 />} />
            <Route path="/atd" element={<Atd />} />
            <Route path="/clubs/etc2" element={<Etc2 />} />
            <Route path="/clubs/etc3" element={<Etc3 />} />

            //햄버거탭-동아리 관리
            <Route path="/clubs/:id/changeClubInfo" element={<ClubInfoEdit clubs={clubs}/>}/>
        </Routes>
    );
}

const BoardList = ({ clubs }) => {
    const { boardId, id} = useParams();
    const club = clubs.find(club => club.clubId === parseInt(id));

    if (!club) {
        return <div>Club not found</div>;
    }

    if (boardId === '2') {
        return <NoticeList club={club} />;
    } else if (boardId === '4') {
        return <FreeBoardList club={club} />;
    } else {
        return <div>Board not found</div>;
    }
}

const BoardDetail = ({ clubs, posts }) => {
    const { boardId, clubId, postId } = useParams();
    const club = clubs.find(club => club.clubId === parseInt(clubId));
    const post = posts.find(post => post.postId === parseInt(postId) && post.boardId === parseInt(boardId));

    if (!club) {
        return <div>Club not found</div>;
    }

    if (!post) {
        return <div>Post not found</div>;
    }

    if (boardId === '2') {
        return <NoticeDetail club={club} post={post} />;
    } else if (boardId === '4') {
        return <FreeBoardDetail club={club} post={post} />;
    } else {
        return <div>Board not found</div>;
    }
}

export default MyclubMain;
