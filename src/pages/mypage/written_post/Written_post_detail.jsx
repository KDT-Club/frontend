import React, { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft} from 'react-icons/fa6';
import {FiMoreVertical, FiSend} from "react-icons/fi";
import axios from "axios";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_comment from "../../../components/modal/Modal_comment.jsx";
import styled from "styled-components";
import {MdOutlineCancel} from "react-icons/md";
axios.defaults.withCredentials = true;

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

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function Written_post_detail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();

    const [memberId, setMemberId] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);  // 글 수정or삭제 모달창 띄우기
    const [showCommentModal, setShowCommentModal] = useState(false);  // 댓글 수정or삭제 모달창 띄우기
    const [modalPosition, setModalPosition] = useState({ top: '0px', left: '0px' }); // 모달창 위치 설정

    const [post, setPost] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    //댓글 수정 상태 변수
    const [selectedCommentContent, setSelectedCommentContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 로그인한 memberId
    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", {
                withCredentials: true
            });
            console.log(response.data);
            setMemberId(response.data.message); // memberId 상태 업데이트
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    const handleBackClick = () => {
        navigate(`/post_list/${memberId}`);
    };

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    //댓글 더보기 아이콘 클릭 -> 수정 or 삭제 모달
    const handleCommentDotClick = (e, commentId, content) => {
        // 모달 위치 설정: 클릭한 위치 + 10px 여백
        setModalPosition({
            top: e.clientY + 3 + 'px'
        });
        setShowCommentModal(true);
        setEditingCommentId(commentId);
        setSelectedCommentContent(content);  // 선택된 댓글 내용 저장
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowCommentModal(false);
    }

    const handleEditClick = () => { //글 수정
        navigate(`/posts_edit/${postId}`);
    };

    //게시글, 댓글 API 조회-----------------------------------------------------------------------------
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await apiClient.get(`/postdetail/${postId}`);
                setPost(response.data.post);
                setAttachmentNames(response.data.attachmentNames || []);
                console.log(response.data.attachmentNames)
            } catch (error) {
                console.error('게시글 조회 에러 발생:', error);
                if (error.response) {
                    console.error('게시글 조회 실패', error.response.status);
                }
            }
        };
        fetchPost();
        fetchComments();
        fetchUserId();
    }, [clubId, postId]);

    const fetchComments = async () => {
        try {
            const response = await apiClient.get(`/posts/${postId}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('댓글 조회 에러 발생:', error);
            if (error.response) {
                console.error('댓글 조회 실패', error.response.status);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSaveEditedComment(editingCommentId, editedCommentContent);
    };

    //댓글 수정 상태 관리 함수
    const handleCommentEdit = async (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };

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

    const handleCancelEdit = () => {
        handleCommentEdit(null, '');
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

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleBackClick} />
                <Title>작성한 글 보기</Title>
                <FiMoreVertical style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handlePostDotClick} />
            </HeaderContainer>
            <ScrollContainer>
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
                {showPostModal && <Modal_post onClose={closeModal} onEdit={handleEditClick} />}
                {showCommentModal && (
                    <Modal_comment
                        onClose={closeModal}
                        position={modalPosition}
                        onEdit={handleCommentEdit}
                        postId={postId}
                        commentId={editingCommentId}
                        onDelete={handleDeleteComment}
                        content={selectedCommentContent}
                    />
                )}
            </ScrollContainer>
        </Whole>
    );
}

export default Written_post_detail;