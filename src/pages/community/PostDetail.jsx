import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./community_styles/post_detail.css";
import { FaArrowLeft } from "react-icons/fa6";

function Modal({ onClose, onConfirm }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p style={{ marginBottom: '5px', padding: '3px' }}>댓글을 삭제하시겠습니까?</p>
                    <hr style={{ marginTop: '10px', marginLeft: '-20px', width: '250px' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-5px' }}>
                        <button onClick={onConfirm} style={{ padding: '3px', borderRight: '1px solid #ccc', height: '58px' }}>네</button>
                        <button onClick={onClose} style={{ padding: '3px' }}>아니오</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WriteModal({ onClose, onEdit, onDelete }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <p style={{ marginBottom: '5px', padding: '3px' }}>게시글</p>
                    <hr style={{ marginTop: '10px', marginLeft: '-20px', width: '250px' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-5px' }}>
                        <button onClick={onEdit} style={{ padding: '3px', borderRight: '1px solid #ccc', height: '58px' }}>수정</button>
                        <button onClick={onDelete} style={{ padding: '3px' }}>삭제</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PostDetail() {
    const { postId: urlPostId } = useParams();
    const postId = String(urlPostId);
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [post, setPost] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        console.log("Stored Posts:", storedPosts);
        console.log("Post ID:", postId);
        console.log("Post ID type:", typeof postId);

        console.log("All stored post IDs:", storedPosts.map(p => p.postId));

        const matchingPosts = storedPosts.filter(p => {
            // TODO: 이 판단이 필요한 이유 확인하기
            // 데이터 처리 자체는 typeCasting 이 제일 안전
            // 캐스팅 후 비교하는 - 연산으로 하면 좋음
            console.log("Comparing:", p.postId, postId, p.postId == postId, p.postId === postId);
            return p.postId == postId;
        });

        console.log("Matching Posts:", matchingPosts);

        if (matchingPosts.length > 0) {
            setPost(matchingPosts[0]);
        }
    }, [postId]);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedTitle(post.title);
        setEditedContent(post.content);
        setShowWriteModal(false);
    };

    const handleSaveEdit = () => {
        const updatedPost = { ...post, title: editedTitle, content: editedContent };
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const updatedPosts = storedPosts.map(p => p.postId === post.postId ? updatedPost : p);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        setPost(updatedPost);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleBack = () => {
        navigate('/community');
    };

    const handleDeleteCommentModalOpen = (e, index) => {
        e.preventDefault();
        setDeleteIndex(index);
        setShowDeleteCommentModal(true);
    };

    const handleDeleteCommentModalClose = () => {
        setDeleteIndex(null);
        setShowDeleteCommentModal(false);
    };

    const handleDeleteCommentConfirm = () => {
        if (deleteIndex !== null) {
            const newComments = post.comments.filter((_, index) => index !== deleteIndex);
            const updatedPost = { ...post, comments: newComments };
            const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
            const updatedPosts = storedPosts.map(p => p.postId === post.postId ? updatedPost : p);
            localStorage.setItem("posts", JSON.stringify(updatedPosts));
            setPost(updatedPost);
            handleDeleteCommentModalClose();
        }
    };

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

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
        const updatedPost = { ...post, comments: [...post.comments, newCommentObject] };
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const updatedPosts = storedPosts.map(p => p.postId === post.postId ? updatedPost : p);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        setPost(updatedPost);
        setNewComment("");
    };

    const handleWriteModalOpen = () => {
        setShowWriteModal(true);
    };

    const handleWriteModalClose = () => {
        setShowWriteModal(false);
    };

    const handleDeletePost = () => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        const updatedPosts = storedPosts.filter(p => p.postId !== post.postId);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
        navigate('/community');
    };

    if (!post) {
        return <div>Post not found</div>;
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
                <h2 style={{ fontWeight: 'bold', fontSize: '20px', marginLeft: '10px' }}>동아리 가입 신청</h2>
                <button style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'right' }} onClick={handleWriteModalOpen}>:
                </button>
                {showWriteModal && (
                    <WriteModal onClose={handleWriteModalClose} onEdit={handleEdit} onDelete={handleDeletePost}/>
                )}
            </header>
            <hr style={{ marginTop: '-30px' }}/>
            <div className="post-content">
                <p style={{ textAlign: 'left', marginLeft: '20px', marginTop: '20px', fontSize: '18px', color: 'gray' }}>{post.author} | {post.date}</p>
                <h3 style={{ textAlign: 'left', fontSize: '20px', marginLeft: '20px', marginBottom: '10px', fontWeight: 'bold' }}>{post.title}</h3>
                <p style={{ textAlign: 'left', marginLeft: '20px' }}>{post.content}</p>
            </div>
            <div className="comments-section">
                {post.comments.map((comment, index) => (
                    <div key={index} className="comment" style={{ textAlign: 'left', marginLeft: '20px' }}>
                        <p style={{ color: 'gray', fontWeight: 'bold' }}>{comment.author} | {comment.date}</p>
                        <p>{comment.content}</p>
                        <button className="delete-button" style={{ textAlign: 'right', marginRight: '10px' }} onClick={(e) => handleDeleteCommentModalOpen(e, index)}>🗑️</button>
                        <hr style={{ marginTop: '10px', marginLeft: '-20px', width: '1000px' }}/>
                    </div>
                ))}
                <form className="comment-input" onSubmit={handleAddComment} style={{ marginTop: '20px', marginLeft: '20px' }}>
                    <input
                        type="text"
                        placeholder="댓글"
                        value={newComment}
                        onChange={handleCommentChange}
                        style={{ marginRight: '10px', padding: '10px' }}
                    />
                    <button type="submit" style={{ position: 'relative', border: '1px solid rgb(204, 204, 204, 0.7)', width: '20%', marginRight : '10px' }}>작성</button>
                </form>
            </div>
            {showDeleteCommentModal && (
                <Modal onClose={handleDeleteCommentModalClose} onConfirm={handleDeleteCommentConfirm}/>
            )}
        </div>
    );
}

function getUserName() {
    // 나중에 사용자 아이디 가져올게용
    return "사용자";
}

export default PostDetail;
