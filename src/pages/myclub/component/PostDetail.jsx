import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { MdOutlineCancel } from "react-icons/md";
import { FiMoreVertical, FiSend } from "react-icons/fi";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";
import { formatDate } from "../component/Date.jsx";
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
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
    margin-right: 10px;`;

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
`;

const PostContent = styled.p`
    font-size: 17.8px;
    margin-top: 5px;
    text-align: start;
`;

const ImageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    img {
        width: 100%;
        max-width: 200px;
        min-width: 200px;
        height: auto;
        border-radius: 8px;
        margin-bottom: 10px;
    }
`;

const Divider = styled.div`
    border-bottom: 1.5px solid dimgrey;
    margin-top: 10px;
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
    width: calc(100% - 50px);  // 전송 버튼 공간 확보
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

function PostDetail({
                        title,
                        post,
                        comments,
                        attachmentNames,
                        onBackClick,
                        onPostDotClick,
                        onCommentSubmit,
                        onCommentEdit,
                        onSaveEditedComment,
                        onCommentDelete,
                        newComment,
                        setNewComment
                    }) {
    const [showPostModal, setShowPostModal] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedCommentContent, setSelectedCommentContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    const handleCommentDotClick = (e, commentId, content) => {
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
        setSelectedCommentId(commentId);
        setSelectedCommentContent(content);
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
    };

    const handleEditComment = () => {
        setIsEditing(true);
        setEditedCommentContent(selectedCommentContent);
        closeModal();
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedCommentContent('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            onSaveEditedComment(selectedCommentId, editedCommentContent);
            setIsEditing(false);
            setSelectedCommentId(null);
            setEditedCommentContent('');
        } else {
            onCommentSubmit(e);
        }
    };

    const handleDeleteComment = () => {
        onCommentDelete(selectedCommentId);
        closeModal();
    };

    return (
        <Container>
            <HeaderContainer>
                <FaArrowLeft style={{fontSize: '24px', cursor: 'pointer'}} onClick={onBackClick}/>
                <Title>{title}</Title>
                <FiMoreVertical style={{fontSize: '24px', cursor: 'pointer'}} onClick={handlePostDotClick}/>
            </HeaderContainer>
            {post && (
                <PostContainer>
                    <PostAuthorContainer>
                        <ProfileImage src={post.member.memberImageURL} alt="" />
                        <PostAuthorDate>{post.member.name} | {formatDate(post.createdAt)}</PostAuthorDate>
                    </PostAuthorContainer>
                    <PostTitle>{post.title}</PostTitle>
                    <PostContent>{post.content}</PostContent>
                    <ImageContainer>
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
                    </ImageContainer>
                </PostContainer>
            )}
            <Divider />
            <CommentContainer>
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentLine key={comment.commentId}>
                            <CommentHeader>
                                <CommentAuthorDate>{comment.memberName} | {formatDate(comment.createdAt)}</CommentAuthorDate>
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
            <Form onSubmit={handleSubmit}>
                <SubmitCommentContainer>
                    <CommentInput
                        type="text"
                        value={isEditing ? editedCommentContent : newComment}
                        onChange={(e) => isEditing ? setEditedCommentContent(e.target.value) : setNewComment(e.target.value)}
                        placeholder={isEditing ? "댓글을 수정하세요." : "댓글을 입력하세요."}
                    />
                    <SubmitButton type="submit">
                        <FiSend style={{textAlign: "center", fontSize: "27px"}}/>
                    </SubmitButton>
                    {isEditing && (
                        <MdOutlineCancel style={{fontSize: "27px", marginLeft: '5px', marginRight: "10px", color: "#5c5c5c"}} onClick={handleCancelEdit}></MdOutlineCancel>
                    )}
                </SubmitCommentContainer>
            </Form>
            {showPostModal && <Modal_post onClose={closeModal} onEdit={onPostDotClick}/>}
            {showCommentModal && <Modal_comment
                onClose={closeModal}
                position={modalPosition}
                onEdit={handleEditComment}
                postId={post.postId}
                commentId={selectedCommentId}
                onDelete={handleDeleteComment}
                content={selectedCommentContent}
            />}
        </Container>
    );
}

export default PostDetail;