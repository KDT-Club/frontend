//글 상세보기 페이지의 데이터 관리, 비즈니스 로직 담당
import {useState, useEffect, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

function usePostDetail() {
    const { clubId, boardId,postId } = useParams();
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);
    const [post, setPost] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');
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
            setPostAuthor(response.data.post.member.id);
            setAttachmentNames(response.data.attachmentNames || []);
        } catch (error) {
            console.error('게시글 조회 에러 발생:', error);
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
            //setCommentCount(response.data.length);
        } catch (error) {
            console.error('댓글 조회 에러 발생:', error);
        }
    };

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

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModal(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModal(false);

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

    //댓글 수정
    const handleCommentEdit = async (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };

    //수정된 댓글 저장
    const handleSaveEditedComment = async (commentId, content) => {
        if (commentId && content.trim()) {
            try {
                const response = await apiClient.put(`/posts/${postId}/${commentId}`, {
                    content: content
                });
                if (response.status === 200) {
                    await fetchComments();
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
            await fetchComments();
        } catch (error) {
            console.error('댓글 삭제 중 에러 발생', error);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            alert('댓글 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return {
        post,
        postAuthor,
        likes,
        attachmentNames,
        comments,
        newComment,
        setNewComment,
        editingCommentId,
        editedCommentContent,
        setEditedCommentContent,
        handleLikeClick,
        showOkModal,
        modalMessage,
        onConfirm,
        handleCloseOkModal,
        handleBackClick,
        handleCommentSubmit,
        handleCommentEdit,
        handleSaveEditedComment,
        handleDeleteComment,
        memberId,
    };
}

export default usePostDetail;