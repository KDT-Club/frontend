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

function FreeBoardList(){
    let { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);

    useEffect(() => { //UI전용, API 구현 시 지워도 됨
        const clubId = parseInt(id);
        const club = clubData.find(c => c.clubId === clubId);
        if(club) {
            const filteredPosts = postData.filter(
                post => post.boardId === 4 && post.clubName === club.name
            );
            setList(filteredPosts);
        }
    }, [id]);

    //자유게시판 리스트 API 조회
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/clubs/${id}/board/4/posts`);
                if (response.ok) {
                    const data = await response.json();
                    setList(data);
                } else {
                    console.error("자유게시판 리스트 조회 실패", response.status);
                }
            } catch (error) {
                console.error('자유게시판 리스트 가져오는 중 에러 발생', error);
            }
        };
        fetchPosts();
    }, [id]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/freeboardlist/freeboardwrite`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}`);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>자유게시판</div>
                <FiEdit
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </div>
            <div className="scroll-container">
                <div className="notice_list">
                    {list.length > 0 ? (
                        list.map((post, index) => (
                            <div key={index} className="post">
                                <Link to={`/clubs/${id}/board/4/posts/${post.postId}`}>
                                    <p className="title">{post.title}</p>
                                    <p className="content">{post.content}</p>
                                    <p className="createdAt">{formatDate(post.createdAt)}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>작성된 글이 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FreeBoardList;
