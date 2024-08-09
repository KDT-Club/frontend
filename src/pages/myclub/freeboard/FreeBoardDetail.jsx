import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostDetail from '../component/PostDetail.jsx';
import usePostDetail from '../hooks/usePostDetail';

function FreeBoardDetail() {
    const navigate = useNavigate();
    const {
        post,
        attachmentNames,
        comments,
        newComment,
        setNewComment,
        editingCommentId,
        editedCommentContent,
        setEditedCommentContent,
        handleBackClick,
        handleCommentSubmit,
        handleCommentEdit,
        handleSaveEditedComment,
        handleDeleteComment
    } = usePostDetail('4');

    console.log('handleSaveEditedComment:', handleSaveEditedComment);

    const handleEditClick = () => {
        navigate(`/clubs/${post.clubId}/board/4/posts/${post.postId}/edit`);
    };

    return (
        <PostDetail
            title="자유게시판"
            post={post}
            comments={comments}
            attachmentNames={attachmentNames}
            onBackClick={handleBackClick}
            onPostDotClick={handleEditClick}
            onCommentSubmit={handleCommentSubmit}
            onCommentEdit={handleCommentEdit}
            onSaveEditedComment={handleSaveEditedComment}
            onCommentDelete={handleDeleteComment}
            newComment={newComment}
            setNewComment={setNewComment}
            editingCommentId={editingCommentId}
            editedCommentContent={editedCommentContent}
            setEditedCommentContent={setEditedCommentContent}
        />
    );
}

export default FreeBoardDetail;