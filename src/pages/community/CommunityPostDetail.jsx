import React, {useCallback, useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import axios from "axios";
import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";
import { FiMoreVertical, FiSend } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegThumbsUp } from "react-icons/fa6";
import { formatDate } from "../../pages/myclub/component/Date";
import Modal_delete from '../../components/modal/Modal_delete.jsx';
import Modal_post from '../../components/modal/Modal_post.jsx';
import Modal_post_complain from '../../components/modal/Modal_post_complain.jsx';
import Modal_comment from '../../components/modal/Modal_comment.jsx';
import Modal_ok from "../../components/modal/Modal_ok.jsx";

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

function CommunityPostDetail() {
    const { clubId, postId } = useParams();
    const navigate = useNavigate();
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showComplainModal, setShowComplainModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedCommentContent, setSelectedCommentContent] = useState('');
    const [commentInputValue, setCommentInputValue] = useState("");
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [likes, setLikes] = useState(0);
    const [showOkModal, setShowOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    useEffect(() => {
        fetchPost();
        fetchLikes();
        fetchComments();
        fetchUserId();
    }, [clubId, postId]);

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId");
            setMemberId(response.data.message);
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }
    };

    const fetchPost = async () => {
        try {
            const response = await apiClient.get(`/board/1/posts/${postId}`);
            setPost(response.data.post);
            setAttachmentNames(response.data.attachmentNames || []);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const fetchLikes = async () => {
        try {
            const response = await apiClient.get(`/posts/${postId}/likes`);
            setLikes(response.data);
        } catch (error) {
            console.log('좋아요 수 조회 중 에러 발생:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await apiClient.get(`/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModal(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModal(false);

    const handleLikeClick = async () => {
        try {
            const response = await apiClient.post(`/posts/${postId}/like`);
            if (response.status === 200) {
                setLikes(prevLikes => prevLikes + 1);
                console.log(response.data)
            } else {
                console.error('좋아요 추가 실패:', response.status);
            }
        } catch (error) {
            handleOpenOkModal(error.response.data, () => {})
            console.error(error.response.data);
        }
    };

    const handleBack = () => {
        navigate('/community');
    };

    const handlePostDotClick = () => {
        if (parseInt(post.member.id) === parseInt(memberId)) {
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
        setSelectedCommentId(commentId);
        setSelectedCommentContent(content);
    };

    const handleCommentEdit = (commentId, content) => {
        setEditingCommentId(commentId);
        setCommentInputValue(content);
        setShowCommentModal(false);
    };

    const handleSaveEditedComment = async (e) => {
        e.preventDefault();
        if (editingCommentId && commentInputValue.trim()) {
            try {
                const response = await apiClient.put(`/posts/${postId}/${editingCommentId}`, {
                    content: commentInputValue
                });
                if (response.status === 200) {
                    await fetchComments();
                    setEditingCommentId(null);
                    setCommentInputValue("");
                }
            } catch (error) {
                console.error('Error saving edited comment:', error);
                handleOpenOkModal("댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.", () => {});
            }
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (editingCommentId) {
            await handleSaveEditedComment(e);
        } else if (commentInputValue.trim() && memberId) {
            try {
                const response = await apiClient.post(`/posts/${postId}/comments`, {
                    memberId: memberId,
                    content: commentInputValue
                });
                if (response.data.message === '성공') {
                    await fetchComments();
                    setCommentInputValue('');
                }
            } catch (error) {
                console.error('Error submitting comment:', error);
                handleOpenOkModal("댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.", () => {});
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await apiClient.delete(`/posts/${postId}/${commentId}`);
            await fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
            handleOpenOkModal("댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.", () => {});
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setCommentInputValue("");
    };

    const handleEditPost = () => {
        navigate(`/board/1/posts/${postId}/edit`);
    };

    if (!post) {
        return <div>로딩 중...</div>;
    }

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft style={{fontSize: '24px', cursor: 'pointer'}} onClick={handleBack}/>
                <Title>자유게시판</Title>
                <FiMoreVertical style={{fontSize: '24px', cursor: 'pointer'}} onClick={handlePostDotClick}/>
            </HeaderContainer>
            <ScrollContainer>
                <PostContainer>
                    <PostAuthorContainer>
                        <ProfileImage src={post.member.memberImageURL || "/default-profile.png"} alt="" />
                        <PostAuthorDate>{post.member.name} | {formatDate(post.createdAt)}</PostAuthorDate>
                    </PostAuthorContainer>
                    <PostTitle>{post.title}</PostTitle>
                    <PostContent>{post.content}</PostContent>
                    <ImageContainer>
                        {attachmentNames.map((url, index) => (
                            <StyledImage
                                key={index}
                                src={url}
                                alt={`첨부 이미지 ${index + 1}`}
                                onError={(e) => {
                                    console.error(`이미지 로딩 오류 ${index}:`, e);
                                    e.target.style.display = 'none';
                                }}
                            />
                        ))}
                    </ImageContainer>
                    <HeartContainer onClick={handleLikeClick}>
                        <FaRegThumbsUp/>
                        &nbsp;
                        <p>{likes}</p>
                    </HeartContainer>
                </PostContainer>
                <Divider />
                <CommentContainer>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <CommentLine key={comment.commentId}>
                                <CommentHeader>
                                    <CommentAuthorDate>{comment.memberName} | {new Date(comment.createdAt).toLocaleDateString()}</CommentAuthorDate>
                                    <FiMoreVertical
                                        style={{fontSize: '20px', cursor: 'pointer', marginRight: '20px'}}
                                        onClick={(e) => handleCommentDotClick(e, comment.commentId, comment.content)}
                                    />
                                </CommentHeader>
                                <CommentContent>{comment.content}</CommentContent>
                                <CommentDivider />
                            </CommentLine>
                        ))
                    ) : (
                        <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                    )}
                </CommentContainer>
                <Form onSubmit={handleCommentSubmit}>
                    <SubmitCommentContainer>
                        <CommentInput
                            type="text"
                            value={commentInputValue}
                            onChange={(e) => setCommentInputValue(e.target.value)}
                            placeholder={editingCommentId ? "댓글을 수정하세요" : "댓글을 입력하세요"}
                        />
                        <SubmitButton type="submit">
                            <FiSend style={{textAlign: "center", fontSize: "27px"}}/>
                        </SubmitButton>
                        {editingCommentId && (
                            <MdOutlineCancel
                                style={{fontSize: "27px", marginLeft: '5px', marginRight: "10px", color: "#5c5c5c", cursor: 'pointer'}}
                                onClick={handleCancelEdit}
                            />
                        )}
                    </SubmitCommentContainer>
                </Form>
            </ScrollContainer>

            {showDeleteCommentModal && (
                <Modal_delete
                    onClose={() => setShowDeleteCommentModal(false)}
                    onConfirm={() => {
                        handleDeleteComment(deleteCommentId);
                        setShowDeleteCommentModal(false);
                    }}
                />
            )}
            {showPostModal && (
                <Modal_post
                    onClose={() => setShowPostModal(false)}
                    onEdit={handleEditPost}
                    onDelete={() => {/* Handle delete post */}}
                />
            )}
            {showComplainModal && (
                <Modal_post_complain onClose={() => setShowComplainModal(false)} postId={postId} memberId={memberId}/>
            )}
            {showCommentModal && (
                <Modal_comment
                    onClose={() => setShowCommentModal(false)}
                    position={modalPosition}
                    onEdit={() => handleCommentEdit(selectedCommentId, selectedCommentContent)}
                    postId={postId}
                    commentId={selectedCommentId}
                    onDelete={() => {
                        setDeleteCommentId(selectedCommentId);
                        setShowDeleteCommentModal(true);
                        setShowCommentModal(false);
                    }}
                    content={selectedCommentContent}
                />
            )}
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </Whole>
    );
}

const Whole = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47.5px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 0px;
`;

const ScrollContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: darkgray white;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 10px;
`;

const PostAuthorContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const ProfileImage = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
`;

const PostAuthorDate = styled.p`
    font-size: 16.6px;
    color: gray;
    font-weight: bold;
    margin: 0;
`;

const PostTitle = styled.p`
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 12px;
    text-align: start;
    width: 100%;
    margin-top: 8px;
    margin-left: 10px;
    padding-right: 10px;
`;

const PostContent = styled.p`
    font-size: 17.8px;
    margin-top: 5px;
    margin-left: 10px;
    text-align: start;
`;

const ImageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;
`;

const StyledImage = styled.img`
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
`;

const CommentContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    padding-bottom: 60px;
`;

const CommentLine = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 10px;
`;

const CommentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const CommentAuthorDate = styled.p`
    font-size: 16.5px;
    color: gray;
    margin-left: 30px;
    margin-bottom: 2px;
`;

const CommentContent = styled.p`
    font-size: 17px;
    margin-left: 30px;
    margin-bottom: 12px;
`;

const CommentDivider = styled.div`
    border-bottom: 1px solid gray;
    width: 100%;
`;

const Form = styled.form`
    margin-top: 15px;
    display: flex;
    align-items: center;
`;

const SubmitCommentContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    background-color: white;
    box-sizing: border-box;
`;

const CommentInput = styled.input`
    width: calc(100% - 50px);
    flex: 1;
    font-size: 16.5px;
    text-align: center;
    border-radius: 7px;
    border: 1.5px solid darkgray;
    height: 47px;
    padding: 0 15px;
    margin-right: 2px;
    &:focus {
        outline: none;
        border: 1.5px solid #597CA5;
    }
`;

const SubmitButton = styled.button`
    width: 2%;
    text-align: center;
    cursor: pointer;
    color: #5c5c5c;
    margin-right: 15px;
    margin-left: 0px;
`;

const HeartContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    color: #555;
    cursor: pointer;
    font-size: 17.3px;
`

const Divider = styled.div`
    border-bottom: 1.5px solid dimgrey;
    margin-top: 10px;
`;

export default CommunityPostDetail;