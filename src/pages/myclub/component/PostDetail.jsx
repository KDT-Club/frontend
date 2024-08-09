import React, {useEffect, useState} from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMoreVertical, FiSend } from "react-icons/fi";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";
import { formatDate } from "../component/Date.jsx";
import "../notice/notice.css";
import axios from "axios";
import Modal_post_complain from "../../../components/modal/Modal_post_complain.jsx";

function PostDetail({
                        title,
                        post,
                        comments,
                        attachmentNames,
                        onBackClick,
                        onPostDotClick,
                        onCommentSubmit,
                        onCommentEdit,
                        onCommentDelete,
                        newComment,
                        setNewComment,
                        editingCommentId,
                        editedCommentContent,
                        setEditedCommentContent,
                    }) {
    const [memberId, setMemberId] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [showComplainModal, setShowComplainModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });
    const [selectedCommentContent, setSelectedCommentContent] = useState('');

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("https://zmffjq.store/getUserId", {
                    withCredentials: true
                });
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

        fetchUserId();
    }, []);

    const handlePostDotClick = () => {
        if (String(post.member.id) === String(memberId)) { // 사용자가 작성자와 동일한지 확인
            setShowPostModal(true);
        } else {
            setShowComplainModal(true);
        }
    };

    const handleCommentDotClick = (e, commentId, content) => {
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
        setSelectedCommentContent(content);
        onCommentEdit(commentId, content);
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
        setShowComplainModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCommentId) {
            onCommentEdit(editingCommentId, editedCommentContent);
        } else {
            onCommentSubmit(e);
        }
    };

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={onBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>{title}</div>
                <FiMoreVertical
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handlePostDotClick}
                />
            </div>
            {post && (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "10px"
                }}>
                    <p style={{
                        fontSize: "16.6px",
                        color: "gray",
                        fontWeight: "bold",
                        marginBottom: "5px"
                    }}>{post.member.name} | {formatDate(post.createdAt)}</p>
                    <p style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        paddingBottom: "12px",
                        textAlign: "start",
                        width: "100%"
                    }}>{post.title}</p>
                    <p style={{
                        fontSize: "17.8px",
                        marginTop: "10px",
                        textAlign: "start"
                    }}>{post.content}</p>
                    <div className="image-container">
                        {attachmentNames.length > 0 ? (
                            attachmentNames.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`첨부 이미지 ${index + 1}`}
                                    onError={(e) => {
                                        console.error(`이미지 로딩 오류 ${index}:`, e);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ))
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div>
            )}
            <div style={{borderBottom: '1.5px solid dimgrey', marginTop: '10px'}}></div>
            <div className="comment-container">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.commentId} className="comment-oneline">
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                                <p style={{fontSize: '16.5px', color: 'gray', marginLeft: "30px", marginBottom: "2px"}}>
                                    {comment.memberName} | {formatDate(comment.createdAt)}
                                </p>
                                <FiMoreVertical
                                    style={{fontSize: '20px', cursor: 'pointer', marginRight: '20px'}}
                                    onClick={(e) => handleCommentDotClick(e, comment.commentId, comment.content)}
                                />
                            </div>
                            <p style={{
                                fontSize: '17px',
                                marginLeft: "30px",
                                marginBottom: "12px"
                            }}>{comment.content}</p>
                            <div style={{borderBottom: '1px solid gray', width: '100%'}}></div>
                        </div>
                    ))
                ) : (
                    <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                )}
            </div>
            <form onSubmit={handleSubmit} style={{marginTop: '15px', display: 'flex', alignItems: 'center'}}>
                <div className="submit-comment-container">
                    <input
                        type="text"
                        value={editingCommentId ? editedCommentContent : newComment}
                        onChange={(e) => editingCommentId ? setEditedCommentContent(e.target.value) : setNewComment(e.target.value)}
                        placeholder="댓글을 입력하세요."
                    />
                    <button type="submit">
                        <FiSend style={{textAlign: "center", fontSize: "27px"}}/>
                    </button>
                </div>
            </form>
            {showPostModal && <Modal_post onClose={closeModal} onEdit={onPostDotClick}/>}
            {showCommentModal && <Modal_comment
                onClose={closeModal}
                position={modalPosition}
                onEdit={() => onCommentEdit(editingCommentId, selectedCommentContent)}
                postId={post.postId}
                commentId={editingCommentId}
                onDelete={onCommentDelete}
                content={selectedCommentContent}
            />}
            {showComplainModal && <Modal_post_complain onClose={closeModal} />}
        </div>
    );
}

export default PostDetail;