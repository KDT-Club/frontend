//댓글 작성,수정,삭제 기능 여기에 모아둠
import React, { useState } from 'react';
import styled from 'styled-components';
import { FiMoreVertical, FiSend } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";
import { formatDate } from "../component/Date.jsx";

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

function CommentSection({
                            comments,
                            postId,
                            newComment,
                            setNewComment,
                            editingCommentId,
                            editedCommentContent,
                            setEditedCommentContent,
                            onCommentSubmit,
                            onCommentEdit,
                            onSaveEditedComment,
                            onCommentDelete
                        }) {
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' });
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedCommentContent, setSelectedCommentContent] = useState('');

    const handleCommentDotClick = (e, commentId, content) => {
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
        setSelectedCommentId(commentId);
        setSelectedCommentContent(content);
    };

    const closeModal = () => {
        setShowCommentModal(false);
    };

    const handleEditComment = () => {
        onCommentEdit(selectedCommentId, selectedCommentContent);
        closeModal();
    };

    const handleCancelEdit = () => {
        onCommentEdit(null, '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCommentId) {
            onSaveEditedComment(editingCommentId, editedCommentContent);
        } else {
            onCommentSubmit(e);
        }
    };

    const handleDeleteComment = () => {
        onCommentDelete(selectedCommentId);
        closeModal();
    };

    return (
        <>
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
                        value={editingCommentId ? editedCommentContent : newComment}
                        onChange={(e) =>
                            editingCommentId
                                ? setEditedCommentContent(e.target.value)
                                : setNewComment(e.target.value)
                        }
                        placeholder="댓글을 입력하세요"
                    />
                    <SubmitButton type="submit">
                        <FiSend style={{textAlign: "center", fontSize: "27px"}}/>
                    </SubmitButton>
                    {editingCommentId && (
                        <MdOutlineCancel
                            style={{fontSize: "27px", marginLeft: '5px', marginRight: "10px", color: "#5c5c5c"}}
                            onClick={handleCancelEdit}
                        />
                    )}
                </SubmitCommentContainer>
            </Form>
            {showCommentModal && <Modal_comment
                onClose={closeModal}
                position={modalPosition}
                onEdit={handleEditComment}
                postId={postId}
                commentId={selectedCommentId}
                onDelete={handleDeleteComment}
                content={selectedCommentContent}
            />}
        </>
    );
}

export default CommentSection;
