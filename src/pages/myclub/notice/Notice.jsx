//동아리 공지사항 - 글 목록
import React, {useState} from 'react';
import '../DetailHeader/myclubheader.css'
import './notice.css';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import {Link, useNavigate, useParams} from "react-router-dom";
import clubData from '../data/clubData.jsx';
//import noticeListData from "../data/noticeListData.jsx";
//ㄴnoticeListData에서 말고 postData에서 글 필터링해서 가져오도록 수정함
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

function Notice({ clubs }){
    let { id } = useParams();
    const club = clubs.find(club => club.clubId === parseInt(id));
    const navigate = useNavigate();
    const [list] = useState(
        postData.filter((post) => post.boardId === 2)
    );

    //공지사항 글쓰기 회장 권한 받는 건 추후에 수정!!!
    const handleWriteClick = () => {
        if (isClubPresident(club.memberId, id)) {
            navigate(`/clubs/${id}/board/2/noticewrite`);
        } else {
            alert('권한이 없습니다.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div className="whole">
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={()=>handleBackClick(club.clubId)}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>공지사항</div>
                <FiEdit
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </div>
            <div className="scroll-container">
                <div className="notice_list">
                    {
                        list.map((a, i) => {
                            return (
                                <List key={i} title={a.title} content={a.content} createdAt={a.createdAt} link={`/clubs/${id}/board/2/posts/${a.postId}`} />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

function List({title, content, createdAt, link}) {
    const formattedDate = formatDate(createdAt);
    return (
        <div className="post">
            <Link to={link}>
                <p className="title">{title}</p>
                <p className="content">{content}</p>
                <p className="createdAt">{formattedDate}</p>
            </Link>
        </div>
    )
}

export default Notice;
