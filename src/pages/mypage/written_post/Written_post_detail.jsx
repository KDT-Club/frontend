import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import Modal_post from '../../../components/modal/Modal_post.jsx';
import Modal_comment from '../../../components/modal/Modal_comment.jsx';

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function Written_post_detail() {
    const { memberId, postId } = useParams();
    const navigate = useNavigate();

    const apiClient = axios.create({
        baseURL: 'http://3.36.56.20:8080', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);  // 글 수정or삭제 모달창 띄우기
    const [showCommentModal, setShowCommentModal] = useState(false);  // 댓글 수정or삭제 모달창 띄우기
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });
    const [memberName, setMemberName] = useState('');

    useEffect(() => {
        apiClient.get(`/posts/${memberId}`)
            .then(response => {
                const allPosts = response.data;
                const currentPost = allPosts.find(post => post.id === parseInt(postId));

                if (currentPost) {
                    setPost(currentPost);
                    return apiClient.get(`/members/${currentPost.member.id}`);   // 멤버 이름을 찾기 위함
                } else {
                    throw new Error('해당 글을 찾을 수 없습니다.');
                }
            })
            .then(response => {
                setMemberName(response.data.name);  // 멤버 이름 설정
                return apiClient.get(`/posts/${postId}/comments`);  // 댓글 목록 조회
            })
            .then(response => {
                setComments(response.data);  // 댓글 목록 설정
            })
            .catch(error => {
                console.error('작성한 글 또는 댓글 조회 중 오류 발생:', error);
            });
    }, [memberId, postId]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    const handleCommentDotClick = (e) => {
        // 모달 위치 설정: 클릭한 위치 + 3px 여백
        setModalPosition({
            top: e.clientY + 3 + 'px',
            left: e.clientX + 3 + 'px'
        });
        setShowCommentModal(true);
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
    };

    const handleEditClick = () => {
        navigate(`/posts_edit/${postId}`);
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{ fontSize: '26px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '22px', fontWeight: "bold" }}>작성한 글 보기</div>
                <FiMoreVertical
                    style={{ fontSize: '26px', cursor: 'pointer' }}
                    onClick={handlePostDotClick}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "10px"
                }}
            >
                <p
                    style={{
                        fontSize: "18px",
                        color: "gray",
                        fontWeight: "bold",
                        marginBottom: "5px"
                    }}
                >{memberName} | {formatDate(post.createdAt)}</p>
                <p
                    style={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        paddingBottom: "12px",
                        textAlign: "start",
                        width: "100%"
                    }}
                >{post.title}</p>
                <p
                    style={{
                        fontSize: "20px",
                        marginTop: "10px",
                        textAlign: "start"
                    }}
                >{post.content}</p>
            </div>
            <div style={{ borderBottom: '1.5px solid dimgrey', marginTop: '24px' }}></div>
            <div className="comment-container">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.commentId} className="comment-oneline">
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <p style={{fontSize: '17px', color: 'gray', marginLeft: "30px", marginBottom: "2px"}}>
                                    {memberName} | {formatDate(comment.createdAt)}
                                </p>
                                <FiMoreVertical
                                    style={{fontSize: '20px', cursor: 'pointer', marginRight: '20px'}}
                                    onClick={handleCommentDotClick}
                                />
                            </div>
                            <p style={{
                                fontSize: '19px',
                                marginLeft: "30px",
                                marginBottom: "16px"
                            }}>{comment.content}</p>
                            <div style={{borderBottom: '1px solid gray', width: '100%'}}></div>
                        </div>
                    ))
                ) : (
                    <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                )}
            </div>
            {showPostModal && <Modal_post onClose={closeModal} onEdit={handleEditClick} />}
            {showCommentModal && <Modal_comment onClose={closeModal} position={modalPosition} />}
        </div>
    );
}

export default Written_post_detail;