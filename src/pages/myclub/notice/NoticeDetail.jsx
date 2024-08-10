// import React from 'react';
// import {useNavigate, useParams} from 'react-router-dom';
// import PostDetail from '../component/PostDetail.jsx';
// import usePostDetail from '../hooks/usePostDetail';
//
// function NoticeDetail() {
//     const navigate = useNavigate();
//     const {clubId, postId} = useParams()
//
//     const {
//         post,
//         postAuthor,
//         attachmentNames,
//         comments,
//         newComment,
//         setNewComment,
//         editingCommentId,
//         editedCommentContent,
//         setEditedCommentContent,
//         handleBackClick,
//         handleCommentSubmit,
//         handleCommentEdit,
//         handleSaveEditedComment,
//         handleDeleteComment,
//         memberId,
//     } = usePostDetail('2');
//
//     const handleEditClick = () => {
//         navigate(`/clubs/${post.clubId}/board/2/posts/${post.postId}/edit`);
//     };
//
//     // 현재 사용자가 게시글 작성자인지 확인
//     const isAuthor = postAuthor && memberId && parseInt(postAuthor) === parseInt(memberId);
//
//     if (!post) {
//         return <div>로딩중...</div>;
//     }
//
//     return (
//         <PostDetail
//             title="공지사항"
//             post={post}
//             comments={comments}
//             attachmentNames={attachmentNames}
//             onBackClick={handleBackClick}
//             onPostDotClick={handleEditClick}
//             onCommentSubmit={handleCommentSubmit}
//             onCommentEdit={handleCommentEdit}
//             onSaveEditedComment={handleSaveEditedComment}
//             onCommentDelete={handleDeleteComment}
//             newComment={newComment}
//             setNewComment={setNewComment}
//             editingCommentId={editingCommentId}
//             editedCommentContent={editedCommentContent}
//             setEditedCommentContent={setEditedCommentContent}
//             showEditButton={isAuthor}
//             memberId={memberId}
//         />
//     );
// }
//
// export default NoticeDetail;