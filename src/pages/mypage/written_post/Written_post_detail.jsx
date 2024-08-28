import React, {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaRegThumbsUp} from 'react-icons/fa6';
import {FiMoreVertical} from "react-icons/fi";
import axios from "axios";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import styled from "styled-components";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
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

const HeartContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    color: #555;
    cursor: pointer;
    font-size: 17.3px;
`

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
    const [showPostModal, setShowPostModal] = useState(false);  // 글 수정 or 삭제 모달창 띄우기
    const [showOkModal, setShowOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const [post, setPost] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080', // API URL
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

    // 게시글, 좋아요 수 API 조회-----------------------------------------------------------------------------
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

        const fetchLikes = async () => {
            try {
                const response = await apiClient.get(`/posts/${postId}/likes`);
                setLikes(response.data);
            } catch (error) {
                console.error('좋아요 수 조회 중 에러 발생:', error);
            }
        };

        fetchPost();
        fetchComments();
        fetchLikes();
        fetchUserId();
    }, [clubId, postId]);

    // 댓글 API 조회
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
        navigate(`/post_list/${memberId}`);
    };

    const handlePostDotClick = () => {
        setShowPostModal(true);
    };

    const closeModal = () => {
        setShowPostModal(false);
    }

    const handleEditClick = () => { //글 수정
        navigate(`/posts_edit/${postId}`);
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
                            {attachmentNames && attachmentNames.length > 0 ? (
                                attachmentNames.map((attachment, index) => (
                                    <img
                                        key={index}
                                        src={attachment.attachmentName}
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
                        <HeartContainer onClick={handleLikeClick}>
                            <FaRegThumbsUp/>
                            &nbsp;
                            <p>{likes}</p>
                        </HeartContainer>
                    </PostContainer>
                )}
                <Divider />
                <CommentContainer>
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <CommentLine key={comment.commentId}>
                                <CommentHeader>
                                    <CommentAuthorDate>{comment.memberName} | {formatDate(comment.createdAt)}</CommentAuthorDate>
                                </CommentHeader>
                                <CommentContent>{comment.content}</CommentContent>
                                <CommentDivider />
                            </CommentLine>
                        ))
                    ) : (
                        <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                    )}
                </CommentContainer>
                {showPostModal && <Modal_post onClose={closeModal} onEdit={handleEditClick} />}
                {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
            </ScrollContainer>
        </Whole>
    );
}

export default Written_post_detail;