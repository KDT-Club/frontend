//내 동아리 자유게시판 - 글 목록
import React, {useState, useEffect} from 'react';
import '../DetailHeader/myclubheader.css'
import '../notice/notice.css';
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

function FreeBoardList({ clubs }){
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => {
        const clubId = parseInt(id);
        const club = clubData.find(c => c.clubId === clubId);
        if(club) {
            const filteredPosts = postData.filter(
                post => post.boardId === 4 && post.clubName === club.name
            );
            setList(filteredPosts);
        }
    }, [id]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/board/4/freeboardwrite`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div className="whole">
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>자유게시판</div>
                <FiEdit
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </div>
            <div className="scroll-container">
                <div className="notice_list">
                    {list.length > 0 ? (
                        list.map((a,i) => (
                            <List key={i} title={a.title} content={a.content} createdAt={a.createdAt} link={`/clubs/${id}/board/4/posts/${a.postId}`} />
                        ))
                    ) : (
                        <p>작성된 글이 없습니다.</p>
                    )}
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


export default FreeBoardList;
