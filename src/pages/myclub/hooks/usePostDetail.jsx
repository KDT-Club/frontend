import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://zmffjq.store',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

function usePostDetail(boardId) {
    const { clubId, postId } = useParams();
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);
    const [post, setPost] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    useEffect(() => {
        fetchPost();
        fetchComments();
        fetchUserId();
    }, [clubId, postId]);

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", { withCredentials: true });
            setMemberId(response.data.message);
        } catch (error) {
            console.error('유저 아이디를 불러오는 중 에러 발생:', error);
            alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
        }
    };

    const fetchPost = async () => {
        try {
            const response = await apiClient.get(`/clubs/${clubId}/board/${boardId}/posts/${postId}`);
            setPost(response.data.post);
            setAttachmentNames(response.data.attachmentNames || []);
        } catch (error) {
            console.error('게시글 조회 에러 발생:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await apiClient.get(`/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글 조회 에러 발생:', error);
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/${boardId === '2' ? 'noticelist' : 'freeboardlist'}`);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() && memberId) {
            try {
                const response = await apiClient.post(`/posts/${postId}/comments`, {
                    memberId: memberId,
                    content: newComment
                });
                if (response.data.message === '성공') {
                    await fetchComments();
                    setNewComment('');
                }
            } catch (error) {
                console.error('댓글 작성 중 에러 발생', error);
                alert('댓글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleCommentEdit = async (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };

    const handleSaveEditedComment = async () => {
        if (editingCommentId && editedCommentContent.trim() && memberId) {
            try {
                const response = await apiClient.put(`/posts/${postId}/${editingCommentId}`, {
                    content: editedCommentContent
                });
                if (response.status === 200) {
                    setComments(prevComments =>
                        prevComments.map(comment =>
                            comment.commentId === editingCommentId ? { ...comment, content: editedCommentContent } : comment
                        )
                    );
                    setEditingCommentId(null);
                    setEditedCommentContent('');
                }
            } catch (error) {
                console.error('댓글 수정 중 에러 발생', error);
                alert('댓글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await apiClient.delete(`/posts/${postId}/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.commentId !== commentId));
        } catch (error) {
            console.error('댓글 삭제 중 에러 발생', error);
            alert('댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return {
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
    };
}

export default usePostDetail;