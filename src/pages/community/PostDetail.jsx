import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./community_styles/post_detail.css";
import '../../styles/App.css';
import { FaArrowLeft } from "react-icons/fa6";
import Modal_delete from '../../components/modal/Modal_delete.jsx';
import axios from "axios";

function WriteModal({ onClose, onEdit, onDelete }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p style={{ marginBottom: '5px', padding: '3px' }}>게시글</p>
                    <hr style={{ marginLeft: '-20px', width: '120%' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-5px' }}>
                        <button onClick={onEdit} style={{ padding: '3px', borderRight: '1px solid #ccc', height: '50px' }}>수정</button>
                        <button onClick={onDelete} style={{ padding: '3px' }}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostDetail() {
    const { postId } = useParams();
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState("");
    const [memberId, setMemberId] = useState(null);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        withCredentials: true
    });

    const fetchUserId = async () => {
        try {
            const response = await axiosInstance.get("https://zmffjq.store/getUserId", {
                withCredentials: true
            });
            console.log(response.data);
            setMemberId(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            try {
                const postResponse = await axiosInstance.get(`https://zmffjq.store/board/1/posts/${postId}`);
                console.log("전체 게시글 데이터:", postResponse.data);

                // attachmentNames가 있으면 그대로 사용, 없으면 빈 배열로 초기화
                const attachmentNames = postResponse.data.attachmentNames || [];
                console.log("첨부 파일 이름들:", attachmentNames);
                if (postResponse.data && postResponse.data.post) {
                    setPost({
                        ...postResponse.data,
                        attachmentNames: attachmentNames,
                    });
                    setEditedTitle(postResponse.data.title);
                    setEditedContent(postResponse.data.content);
                } else{
                    console.error("에러", postResponse.data)
                }

                const commentsResponse = await axiosInstance.get(`https://zmffjq.store/posts/${postId}/comments`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchPostAndComments();
    }, [postId]);

    const handleEdit = () => {
        setIsEditing(true);
        setShowWriteModal(false);
    };

    const handleSaveEdit = async () => {
        try {
            await axiosInstance.put(`https://zmffjq.store/posts/${postId}`, {
                title: editedTitle,
                content: editedContent
            });
            setPost({ ...post, title: editedTitle, content: editedContent });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating post:", error);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate('/community');
    };

    const handleDeleteCommentModalOpen = (commentId) => {
        setDeleteCommentId(commentId);
        setShowDeleteCommentModal(true);
    };

    const handleDeleteCommentModalClose = () => {
        setDeleteCommentId(null);
        setShowDeleteCommentModal(false);
    };

    const handleDeleteCommentConfirm = async () => {
        if (deleteCommentId) {
            try {
                await axiosInstance.delete(`https://zmffjq.store/posts/${postId}/${deleteCommentId}`);
                setComments(comments.filter(comment => comment.commentId !== deleteCommentId));
                handleDeleteCommentModalClose();
            } catch (error) {
                console.error("Error deleting comment:", error);
            }
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        try {
            const response = await axiosInstance.post(`https://zmffjq.store/posts/${postId}/comments`, {
                memberId: memberId,
                content: newComment
            });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };

    const handleSaveCommentEdit = async (commentId) => {
        try {
            await axiosInstance.put(`https://zmffjq.store/posts/${postId}/${commentId}`, {
                content: editedCommentContent
            });
            setComments(comments.map(comment =>
                comment.commentId === commentId
                    ? { ...comment, content: editedCommentContent }
                    : comment
            ));
            setEditingCommentId(null);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleWriteModalOpen = () => {
        setShowWriteModal(true);
    };

    const handleWriteModalClose = () => {
        setShowWriteModal(false);
    };

    const handleDeletePost = async () => {
        try {
            await axiosInstance.delete(`https://zmffjq.store/posts/${postId}`);
            navigate('/community');
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    if (isEditing) {
        return (
            <div className="post-edit">
                <header className="edit-header">
                    <span onClick={handleCancelEdit} className="edit-cancel">X</span>
                    <h2 className="edit-title">글 수정하기</h2>
                    <span onClick={handleSaveEdit} className="edit-save">✓</span>
                </header>
                <hr style={{ marginTop: '-30px' }}/>
                <div className="edit-form">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', height: '200px', padding: '5px' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="post-detail">
            <header>
                <FaArrowLeft onClick={handleBack} style={{ cursor: 'pointer', marginLeft: '10px' }}/>
                <h2 style={{ width: '70%', fontWeight: 'bold', fontSize: '20px', marginLeft: '10px' }}>게시물 내용</h2>
                <button style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'right' }} onClick={handleWriteModalOpen}>:
                </button>
                {showWriteModal && (
                    <WriteModal
                        onClose={handleWriteModalClose}
                        onEdit={handleEdit}
                        onDelete={handleDeletePost}
                    />
                )}
            </header>
            <hr style={{marginTop: '-30px'}}/>
            <div className="post-content">
                <p style={{textAlign: 'left', marginLeft: '20px', marginTop: '20px', fontSize: '18px', color: 'gray'}}>
                    {post.member.name} | {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <h3 style={{
                    textAlign: 'left',
                    fontSize: '20px',
                    marginLeft: '20px',
                    marginBottom: '10px',
                    fontWeight: 'bold'
                }}>{post.title}</h3>
                <p style={{textAlign: 'left', marginLeft: '20px'}}>{post.content}</p>
                <div className="post-photos" style={{marginLeft: '20px', marginTop: '20px'}}>
                    {post.attachmentNames && post.attachmentNames.length > 0 ? (
                        post.attachmentNames.map((photoName, index) => {
                            // 이미지 파일만 렌더링합니다.
                            const isImage = /\.(jpg|jpeg|png|gif)$/i.test(photoName);

                            return isImage ? (
                                <img
                                    key={index}
                                    src={photoName}
                                    alt={`Post photo ${index + 1}`}
                                    style={{width: '100%', maxWidth: '500px', height: 'auto', marginBottom: '10px'}}
                                    onError={(e) => {
                                        console.error(`이미지 로딩 오류 ${index}:`, e);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <p key={index}>첨부된 파일: {photoName}</p>
                            );
                        })
                    ) : (
                        <p>첨부된 파일이 없습니다.</p>
                    )}
                </div>

            </div>
            <hr/>
            <div className="comments-section">
                <form onSubmit={handleAddComment}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="댓글을 입력하세요"
                        style={{width: '80%', marginRight: '10px'}}
                    />
                    <button type="submit">댓글 달기</button>
                </form>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.commentId}>
                            <div>
                                <strong>{comment.member.name}</strong>
                                {editingCommentId === comment.commentId ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={editedCommentContent}
                                            onChange={(e) => setEditedCommentContent(e.target.value)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        <button onClick={() => handleSaveCommentEdit(comment.commentId)}>저장</button>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                            </div>
                            <div>
                                {editingCommentId !== comment.commentId && (
                                    <>
                                        <button onClick={() => handleEditComment(comment.commentId, comment.content)}>수정</button>
                                        <button onClick={() => handleDeleteCommentModalOpen(comment.commentId)}>삭제</button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showDeleteCommentModal && (
                <Modal_delete
                    onClose={handleDeleteCommentModalClose}
                    onConfirm={handleDeleteCommentConfirm}
                />
            )}
        </div>
    );
}

export default PostDetail;
