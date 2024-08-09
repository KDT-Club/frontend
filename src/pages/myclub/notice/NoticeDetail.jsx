import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostDetail from '../component/PostDetail';
import usePostDetail from '../hooks/usePostDetail';

function NoticeDetail() {
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
    } = usePostDetail('2');

    const handleEditClick = () => {
        navigate(`/clubs/${post.clubId}/board/2/posts/${post.postId}/edit`);
    };

    return (
        <PostDetail
            title="공지사항"
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

export default NoticeDetail;