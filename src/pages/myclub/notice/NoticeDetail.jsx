//동아리 공지사항 -  글 상세
import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import postData from '../data/postData.jsx';
import memberInfo from '../data/memberInfo.jsx';
import commentData from '../data/commentData.jsx';
import {FaArrowLeft} from 'react-icons/fa6';
import { FiMoreVertical, FiSend } from "react-icons/fi";

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

function NoticeDetail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();

    const post = postData.find(post => post.postId === parseInt(postId) && post.boardId === 2); //로컬 게시글 조회
    const comments = commentData.filter(comment => comment.postId === parseInt(postId)); //로컬 댓글 조회

    //API 게시글, 댓글 조회
    // const [post, setPost] = useState(null);
    // const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(''); //댓글 입력

    // useEffect(() => {
    //     const fetchPost = async () => {
    //         try {
    //             const response = await fetch(`/clubs/${clubId}/board/2/posts/${postId}`);
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setPost(data);
    //             } else {
    //                 console.error("게시글 조회 실패", response.status);
    //             }
    //         } catch (error) {
    //             console.error('게시글 조회 에러 발생', error);
    //         }
    //     };
    //     const fetchComments = async () => {
    //         try {
    //             const response = await fetch(`/posts/${postId}/comments`);
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setComments(data);
    //             } else {
    //                 console.error("댓글 조회 실패", response.status);
    //             }
    //         } catch (error) {
    //             console.error('댓글 조회 에러 발생', error);
    //         }
    //     };
    //     if (clubId && postId) {
    //         fetchPost();
    //         fetchComments();
    //     }
    // }, [clubId, postId]);

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/noticelist`);
    };

    const handleDotClick = () => {
        //동아리 회장에게만 글수정or글삭제 팝업이 뜨도록.
    }

    //댓글 POST
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            try {
                const response = await fetch(`/posts/${postId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        memberId: 1, // 로그인한 사용자 ID로 대체
                        content: newComment
                    })
                });
                if (response.ok) {
                    const newCommentData = await response.json();
                    //서버로부터 받은 새로운 댓글 상태 업데이트
                    //setComments([...comments, newCommentData]);
                    setNewComment('');
                } else {
                    console.error("댓글 작성 실패", response.status);
                }
            } catch (error) {
                console.error('댓글 작성 중 에러 발생', error);
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
                <div style={{fontSize: '22px', fontWeight: "bold"}}>공지사항</div>
                <FiMoreVertical
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleDotClick}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: "35px",
                    marginLeft: "20px",
                    marginRight: "10px"
                }}
            >
                <p
                    style={{
                        fontSize: "20px",
                        color: "gray",
                        fontWeight: "bold",
                        marginBottom: "5px"
                    }}
                >{getMemberName(post.memberId)} | {formatDate(post.createdAt)}</p>
                <p
                    style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        paddingBottom: "12px",
                        textAlign: "start",
                        width: "100%"
                    }}
                >{post.title}</p>
                <p
                    style={{
                        fontSize: "21px",
                        marginTop: "20px",
                        textAlign: "start"
                    }}
                >{post.content}</p>
            </div>
            <div style={{borderBottom: '1.5px solid dimgrey', marginTop: '40px'}}></div>
            <div className="comment-container">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.commentId} className="comment-oneline">
                            <p style={{fontSize: '19px', color: 'gray', marginLeft: "30px", marginBottom: "5px"}}>
                                {getMemberName(comment.memberId)} | {formatDate(comment.createdAt)}
                            </p>
                            <p style={{
                                fontSize: '21px',
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
                        <FiSend style={{textAlign: "center", fontSize: "27px"}} /></button>
                </div>
            </form>
        </div>
    );
}

export default NoticeDetail;