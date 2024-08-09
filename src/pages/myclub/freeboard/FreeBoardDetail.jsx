import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostDetail from '../component/PostDetail.jsx';
import usePostDetail from '../hooks/usePostDetail';

function FreeBoardDetail() {
    const navigate = useNavigate();
    const {
        post,
        postAuthor,
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
        handleDeleteComment,
        memberId
    } = usePostDetail('4');

    const handleEditClick = () => {
        navigate(`/clubs/${post.clubId}/board/4/posts/${post.postId}/edit`);
    };

    // 현재 사용자가 게시글 작성자인지 확인
    const isAuthor = postAuthor && memberId && parseInt(postAuthor) === parseInt(memberId);

    if (!post) {
        return <div>로딩중...</div>;
    }

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
            showEditButton={isAuthor}
            memberId={memberId}
        />
    );
}

export default FreeBoardDetail;