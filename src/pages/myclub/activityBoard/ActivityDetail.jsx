import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMoreVertical } from "react-icons/fi";
import styled from 'styled-components';
import axios from 'axios';
import { formatDate } from '../component/Date';
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_post_complain from "../../../components/modal/Modal_post_complain.jsx";
import { FaRegThumbsUp } from "react-icons/fa6";

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

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
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: darkgray white;
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
    font-size: 18px;
`

function ActivityDetail() {
    const { clubId, postId } = useParams();
    const navigate = useNavigate();
    const [memberId, setMemberId] = useState(null);
    const [post, setPost] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const [showComplainModal, setShowComplainModal] = useState(false);

    useEffect(() => {
        fetchPost();
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
            const response = await apiClient.get(`/board/3/clubs/${clubId}/posts/${postId}`);
            setPost(response.data.post);
            setPostAuthor(response.data.post.member.id);
            setAttachmentNames(response.data.attachmentNames || []);
        } catch (error) {
            console.error('게시글 조회 에러 발생:', error);
            setError('게시글을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/activityList`);
    };

    const handlePostDotClick = () => {
        if (postAuthor === parseInt(memberId)) {
            setShowPostModal(true);
        } else {
            setShowComplainModal(true);
        }
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowComplainModal(false);
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    if (!post) {
        return <div>게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft style={{fontSize: '24px', cursor: 'pointer'}} onClick={handleBackClick} />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>동아리 활동</div>
                <FiMoreVertical style={{fontSize: '24px', cursor: 'pointer'}} onClick={handlePostDotClick}/>
            </HeaderContainer>
            <ScrollContainer>
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
                    <HeartContainer>
                        <FaRegThumbsUp/>
                        &nbsp;
                        <p>16</p>
                    </HeartContainer>
                </PostContainer>
                {showPostModal && <Modal_post
                    onClose={closeModal}
                    onEdit={() => navigate(`/clubs/${clubId}/activity/${postId}/edit`)}
                />}
                {showComplainModal && <Modal_post_complain onClose={closeModal} />}
            </ScrollContainer>
        </Whole>
    );
}

export default ActivityDetail;