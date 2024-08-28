//게시글 타입 처리 코드 (자유 or 공지)
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostDetail from '../component/PostDetail.jsx';
import usePostDetail from '../hooks/usePostDetail';

function BoardDetail() {
    const navigate = useNavigate();
    const { clubId, boardId, postId } = useParams();
    const boardType = boardId === '2' ? 'noticeBoard' : 'freeBoard';
    const title = boardType === 'noticeBoard' ? '공지사항' : '자유게시판';

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
        memberId,
        //commentCount
    } = usePostDetail();

    const handleEditClick = () => {
        navigate(`/clubs/${clubId}/board/${boardId}/posts/${postId}/edit`);
    };

    // 현재 사용자가 게시글 작성자인지 확인
    const isAuthor = postAuthor && memberId && parseInt(postAuthor) === parseInt(memberId);

    if (!post) {
        return <div>로딩 중...</div>;
    }

    return (
        <PostDetail
            title={title}
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
            onEditClick={handleEditClick}
        />
    );
}

export default BoardDetail;