//내 동아리 자유게시판 - 글 목록
import React, {useState, useEffect} from 'react';
import '../DetailHeader/myclubheader.css'
import '../notice/notice.css';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import {Link, useNavigate, useParams} from "react-router-dom";

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

    //자유게시판 리스트 API 조회
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`https://zmffjq.store/clubs/${id}/board/4/posts`);
                if (response.ok) {
                    const data = await response.json();

                    // 작성자 정보 가져옴
                    const postsWithAuthors = await Promise.all(
                        data.map(async (freeboard) => {
                            // 각 postId를 사용하여 상세 정보 API를 호출
                            const detailResponse = await fetch(`https://zmffjq.store/clubs/${id}/board/4/posts/${freeboard.postId}`);
                            if (detailResponse.ok) {
                                const detailData = await detailResponse.json();
                                return {
                                    ...freeboard,
                                    authorName: detailData.member.name, // 작성자 이름 추가
                                    authorId: detailData.member.id // 작성자 ID 추가
                                };
                            } else {
                                console.error(`게시글 ${freeboard.postId}의 상세 정보 조회 실패`, detailResponse.status);
                                return freeboard; // 실패 시 기존 데이터 유지
                            }
                        })
                    );
                    setList(postsWithAuthors);
                } else {
                    console.error("공지사항 리스트 조회 실패", response.status);
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
                                <Link to={`/clubs/${id}/board/4/posts/${post.postId}?memberId=${post.authorId}`}>
                                    <p className="title">{post.title}</p>
                                    <p className="content">{post.content}</p>
                                    <p className="createdAt">{post.authorName} | {formatDate(post.createdAt)}</p>
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
