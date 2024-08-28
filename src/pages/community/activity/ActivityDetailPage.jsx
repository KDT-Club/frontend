import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './activity.css';
import {FaArrowLeft, FaRegThumbsUp} from "react-icons/fa6";
import styled from "styled-components";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

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
    margin-right: 120px;
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
    margin-top: 15px;
    padding: 10px;
    box-sizing: border-box;
    
    img {
        width: 100%;
        max-width: 300px;
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
`;

const Divider = styled.div`
    border-bottom: 1.5px solid dimgrey;
    margin-top: 10px;
`;

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function ActivityDetailPage() {
    const navigate = useNavigate();
    const { clubId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [clubImgUrl, setClubImgUrl] = useState(null);
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [likes, setLikes] = useState(0);
    const [showOkModal, setShowOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postResponse, clubsResponse] = await Promise.all([
                    axios.get(`/api/board/3/clubs/${clubId}/posts/${postId}`),
                    axios.get('/api/clubs')
                ]);

                const postData = postResponse.data;
                const attachmentNames = postData.attachmentNames || [];

                setPost({ ...postData.post });
                setAttachmentNames(attachmentNames)

                const clubs = clubsResponse.data;
                const currentClub = clubs.find(club => club.clubId === parseInt(clubId));
                if (currentClub) {
                    setClubImgUrl(currentClub.clubImgUrl);
                }
            } catch (error) {
                console.error('Error fetching post detail or club info:', error);
            }
        };

        const fetchLikes = async () => {
            try {
                const response = await apiClient.get(`/posts/${postId}/likes`);
                setLikes(response.data);
            } catch (error) {
                console.error('좋아요 수 조회 중 에러 발생:', error);
            };

            fetchLikes();
        };

        fetchData();
        fetchLikes();
    }, [clubId, postId]);

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
        navigate(`/community`);
    };

    if (!post || !clubImgUrl) {
        return <div>Loading...</div>;
    }

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft style={{ fontSize: '24px', cursor: 'pointer' }} onClick={handleBackClick} />
                <Title>활동 게시판</Title>
            </HeaderContainer>
            <ScrollContainer>
                {post && (
                    <PostContainer>
                        <PostAuthorContainer>
                            <ProfileImage src={clubImgUrl} alt="" />
                            <PostAuthorDate>{post.clubName} | {formatDate(post.createdAt)}</PostAuthorDate>
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
                {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
                </ScrollContainer>
        </Whole>
    );
}

export default ActivityDetailPage;