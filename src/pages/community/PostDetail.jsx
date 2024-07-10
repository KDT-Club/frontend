import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./community_styles/post_detail.css";
import { FaArrowLeft } from "react-icons/fa6";

function Modal({ onClose, onConfirm }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p style={{
                        marginBottom: '5px',
                        padding: '3px'
                    }}>댓글을 삭제하시겠습니까?</p>
                    <hr style={{
                        marginTop: '10px',
                        marginLeft: '-20px',
                        width: '250px'
                    }}/>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '-5px'
                    }}>
                        <button onClick={onConfirm} style={{
                            padding: '3px',
                            borderRight: '1px solid #ccc',
                            height: '58px'
                        }}>네</button>
                        <div style={{
                            height: '70px'
                        }}></div>
                        <button onClick={onClose} style={{
                            padding: '3px'
                        }}>아니오</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostDetail() {
    const { postId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [post, setPost] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/community');
    }

    const handleModalOpen = (e, index) => {
        e.preventDefault();
        setDeleteIndex(index);
        setShowModal(true);
    }

    const handleModalClose = () => {
        setDeleteIndex(null);
        setShowModal(false);
    }

    const handleDeleteConfirm = () => {
        if (deleteIndex !== null) {
            const newComments = post.comments.filter((_, index) => index !== deleteIndex);
            setPost({
                ...post,
                comments: newComments
            });
            handleModalClose();
        }
    }

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === "") {
            return;
        }
        const date = new Date();
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        const newCommentObject = {
            author: getUserName(),
            date: formattedDate,
            content: newComment
        };
        setPost({
            ...post,
            comments: [...post.comments, newCommentObject]
        });
        setNewComment("");
    }

    useEffect(() => {
        const posts = [
            {
                id: 1,
                author: '징징이',
                title: "소수정예 전략 보드게임 동아리",
                content: "5기 곰돌이가 서울에 상륙하였습니다! 많은 분들의 참여를 바랍니다. 저희는 다양한 보드게임을 통해 전략적 사고와 팀워크를 기르기 위해 노력하고 있습니다. 자세한 내용은 홈페이지를 참조해주세요. 궁금한 사항은 언제든지 문의 바랍니다.",
                date: "07/22",
                comments: [
                    { author: "동동이", date: "07/23", content: "매주 토요일" },
                    { author: "집집징", date: "07/25", content: "오후 7시" },
                ]
            }
        ];

        const post = posts.find(p => p.id === parseInt(postId));
        if (post) {
            setPost(post);
        }
    }, [postId]);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="post-detail">
            <header>
                <FaArrowLeft onClick={handleBack} style={{
                    cursor: 'pointer',
                    marginLeft: '10px'
                }}/>
                <h2 style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    marginLeft: '10px'
                }}>동아리 가입 신청</h2>
                <button style={{
                    fontWeight: 'bold',
                    fontSize: '20px',
                    textAlign: 'right'
                }}>:
                </button>
            </header>
            <hr style={{
                marginTop: '-30px',
            }}/>
            <div className="post-content">
                <p style={{
                    textAlign: 'left',
                    marginLeft: '20px',
                    marginTop: '20px',
                    fontSize: '18px',
                    color: 'gray'
                }}>{post.author} | {post.date}</p>
                <h3 style={{
                    textAlign: 'left',
                    fontSize: '20px',
                    marginLeft: '20px',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                }}>{post.title}</h3>
                <p style={{
                    textAlign: 'left',
                    marginLeft: '20px',
                }}>{post.content}</p>
            </div>
            <div className="comments-section">
                {post.comments.map((comment, index) => (
                    <div key={index} className="comment"
                         style={{
                             textAlign: 'left',
                             marginLeft: '20px',
                         }}>
                        <p style={{
                            color: 'gray',
                            fontWeight: 'bold'
                        }}>{comment.author} | {comment.date}</p>
                        <p>{comment.content}</p>
                        <hr style={{
                            marginTop: '10px',
                            marginLeft: '-20px',
                            width: '1000px',
                        }}/>
                        <button className="delete-button" style={{
                            textAlign: 'right',
                            marginRight: '10px'
                        }} onClick={(e) => handleModalOpen(e, index)}>🗑️</button>
                        {showModal && (
                            <Modal onClose={handleModalClose} onConfirm={handleDeleteConfirm}/>
                        )}
                    </div>
                ))}
                <form className="comment-input" onSubmit={handleAddComment} style={{ marginTop: '20px', marginLeft: '20px' }}>
                    <input
                        type="text"
                        placeholder="댓글"
                        value={newComment}
                        onChange={handleCommentChange}
                        style={{
                            marginRight: '10px',
                            padding: '10px'
                        }}
                    />
                    <button type="submit" style={{
                        position: 'relative',
                        border: '1px solid rgb(204, 204, 204, 0.7)',
                        width: '20%',
                        marginRight : '10px'
                    }}>작성</button>
                </form>
            </div>
        </div>
    );
}

function getUserName() {
    // 나중에 사용자 아이디 가져올게용
    return "사용자";
}

export default PostDetail;