//동아리 공지사항 - 글 목록
import React, {useState, useEffect} from 'react';
import '../DetailHeader/myclubheader.css'
import './notice.css';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import {Link, useNavigate, useParams} from "react-router-dom";
import clubData from '../data/clubData.jsx';
import postData from "../data/postData.jsx";

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

// 클럽 회장인지 확인
function isClubPresident(memberId, clubId) {
    const club = clubData.find(club => club.clubId === parseInt(clubId));
    return club && club.memberId === memberId;
}

function NoticeList(){
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => { //UI전용, API 구현 시 지워도 됨
        const clubId = parseInt(id);
        const club = clubData.find(c => c.clubId === clubId);
        if(club) {
            const filteredPosts = postData.filter(
                post => post.boardId === 2 && post.clubName === club.name
            );
            setList(filteredPosts);
        }
    }, [id]);

    //공지사항 리스트 API 조회
    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await fetch(`/clubs/${id}/board/2/posts`);
                if (response.ok) {
                    const data = await response.json();
                    setList(data);
                } else {
                    console.error("공지사항 리스트 조회 실패", response.status);
                }
            } catch (error) {
                console.error('공지사항 리스트 가져오는 중 에러 발생', error);
            }
        };
        fetchNotices();
    }, [id]);

    //공지사항 글쓰기 회장 권한 받는 건 추후에 수정!!!
    const handleWriteClick = () => {
        const club = clubData.find(c => c.clubId === parseInt(id));
        if (club && isClubPresident(club.memberId, id)) {
            navigate(`/clubs/${id}/board/2/noticewrite`);
        } else {
            alert('권한이 없습니다.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>공지사항</div>
                <FiEdit
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </div>
            <div className="scroll-container">
                <div className="notice_list">
                    {list.length > 0 ? (
                        list.map((notice, index) => (
                            <div key={index} className="post">
                                <Link to={`/clubs/${id}/board/2/posts/${notice.postId}`}>
                                    <p className="title">{notice.title}</p>
                                    <p className="content">{notice.content}</p>
                                    <p className="createdAt">{formatDate(notice.createdAt)}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>작성된 공지사항이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

// function List({title, content, createdAt, link}) {
//     const formattedDate = formatDate(createdAt);
//     return (
//         <div className="post">
//             <Link to={link}>
//                 <p className="title">{title}</p>
//                 <p className="content">{content}</p>
//                 <p className="createdAt">{formattedDate}</p>
//             </Link>
//         </div>
//     )
// }

export default NoticeList;
