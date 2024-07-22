import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMoreVertical } from 'react-icons/fi';
import Modal_post from '../../../components/modal/Modal_post.jsx';

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
        baseURL: 'http://3.36.56.20:8080',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [memberName, setMemberName] = useState('');

    useEffect(() => {
        apiClient.get(`/postdetail/${postId}`)
            .then(response => {
                const currentPost = response.data.post;
                const attachmentNames = currentPost.attachment_flag === 'Y' ? (currentPost.attachment_names || []) : [];
                if (currentPost) {
                    setPost({
                        ...currentPost,
                        attachmentNames: attachmentNames
                    });
                    return apiClient.get(`/members/${currentPost.member.id}`);
                } else {
                    throw new Error('해당 글을 찾을 수 없습니다.');
                }
            })
            .then(response => {
                setMemberName(response.data.name);
                return apiClient.get(`/posts/${postId}/comments`);
            })
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('작성한 글 또는 댓글 조회 중 오류 발생:', error);
            });
    }, [postId]);

    const handleBackClick = () => navigate(`/post_list/${memberId}`);
    const handlePostDotClick = () => setShowPostModal(true);
    const closeModal = () => setShowPostModal(false);
    const handleEditClick = () => navigate(`/posts_edit/${postId}`);

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
                {post.attachmentNames && post.attachmentNames.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        {post.attachmentNames.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`image-${index}`}
                                style={{ width: '100%', maxHeight: '400px', marginBottom: '10px', objectFit: 'cover' }}
                            />
                        ))}
                    </div>
                )}
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
        </div>
    );
}

export default Written_post_detail;
