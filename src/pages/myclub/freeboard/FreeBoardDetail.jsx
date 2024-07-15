//내 동아리 자유게시판 - 글 상세
import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import postData from "../data/postData.jsx";
import memberInfo from "../data/memberInfo.jsx";
import commentData from '../data/commentData.jsx';
import {FaArrowLeft} from 'react-icons/fa6';
import { FiMoreVertical, FiSend } from "react-icons/fi";
import axios from "axios";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function getMemberName(memberId) { //로컬 멤버ID 조회 -> 나중에 지움!
    const member = memberInfo.find(member => member.memberId === memberId);
    return member ? member.name : 'Unknown';
}

function FreeBoardDetail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();

    const post = postData.find(post => post.postId === parseInt(postId) && post.boardId === 4); //로컬 게시글 조회
    const comments = commentData.filter(comment => comment.postId === parseInt(postId));//로컬 댓글 조회

    const [showPostModal, setShowPostModal] = useState(false);  // 글 수정or삭제 모달창 띄우기
    const [showCommentModal, setShowCommentModal] = useState(false);  // 댓글 수정or삭제 모달창 띄우기
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/freeboardlist`);
    };

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    const handleCommentDotClick = (e) => {
        // 모달 위치 설정: 클릭한 위치 + 10px 여백
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
    }

    const handleEditClick = () => {
        navigate(`/clubs/${clubId}/board/4/posts/${postId}/edit`);
    };

    //게시글, 댓글 API 조회-----------------------------------------------------------------------------
    //const [post, setPost] = useState('');
    //const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(''); //댓글 입력
    const [memberId, setMemberId] = useState(null);

    useEffect(() => {
        const fetchClubInfo = async () => {
            try {
                const userResponse = await axios.get(''); //로그인 정보 받을 수 있는 url
                const memberId = userResponse.data.memberId;
                setMemberId(memberId);
            } catch (error) {
                console.error('회원 정보 가져오는 중 오류 발생:', error);
                alert('회원 정보를 불러오는 데 실패했습니다.');
            }
        };

        const fetchPost = async () => {
            try {
                const response = await axios.get(`/clubs/${clubId}/board/4/posts/${postId}`);
                //setPost(response.data);
            } catch (error) {
                console.error('게시글 조회 에러 발생:', error);
                if (error.response) {
                    console.error('게시글 조회 실패', error.response.status);
                }
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get(`/posts/${postId}/comments`);
                //setComments(response.data);
            } catch (error) {
                console.error('댓글 조회 에러 발생:', error);
                if (error.response) {
                    console.error('댓글 조회 실패', error.response.status);
                }
            }
        };
        fetchPost();
        fetchComments();
        fetchClubInfo();
    }, [memberId, clubId, postId]);

    //댓글 POST
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() && memberId) { // memberId가 존재하는지 확인
            try {
                const response = await axios.post(`/posts/${postId}/comment`, {
                    memberId: memberId,
                    content: newComment
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (response.status === 200) {
                    const newCommentData = response.data;
                    // 서버로부터 받은 새로운 댓글 상태 업데이트
                    //setComments([...comments, newCommentData]);
                    setNewComment('');
                } else {
                    console.error("댓글 작성 실패", response.status);
                }
            } catch (error) {
                console.error('댓글 작성 중 에러 발생', error);
                alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>자유게시판</div>
                <FiMoreVertical
                    style={{fontSize: '26px', cursor: 'pointer'}}
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
                >{getMemberName(post.memberId)} | {formatDate(post.createdAt)}</p>
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
                                    {getMemberName(comment.memberId)} | {formatDate(comment.createdAt)}
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
            <form onSubmit={handleCommentSubmit} style={{marginTop: '15px', display: 'flex', alignItems: 'center'}}>
                <div className="submit-comment-container">
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글을 입력하세요."
                    />
                    <button type="submit">
                        <FiSend style={{textAlign: "center", fontSize: "27px"}}/></button>
                </div>
            </form>
            {showPostModal && <Modal_post onClose={closeModal} onEdit={handleEditClick}/>}
            {showCommentModal && <Modal_comment onClose={closeModal} position={modalPosition} />}
        </div>
    );
}

export default FreeBoardDetail;