import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from 'styled-components';
import Header_center from "../../components/header/Header_center.jsx";
import Footer from "../../components/footer/Footer.jsx";
import Calendar from "./Calendar/Calendar.jsx";
import ActivityPage from './activity/ActivityPage.jsx';
import WritePostModal from "./WritePostModal.jsx";
import {formatDate} from "../myclub/component/Date.jsx";
import { FaRegThumbsUp } from "react-icons/fa6";

const Whole = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
`;

const MenuScroll = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    scrollbar-width: none;
    &::-webkit-scrollbar {
        display: none;
    }
`;

const MenuItem = styled.div`
    flex: 0 0 auto;
    border: 2px solid ${props => props.active ? 'black' : 'lightgray'};
    border-radius: 20px;
    width: 30%;
    padding: 5px;
    margin: 5px;
    margin-bottom: 10px;
    color: ${props => props.active ? 'black' : 'lightgray'};
    font-weight: ${props => props.active ? '700' : '500'};
    cursor: pointer;
    text-align: center;
`;

const ContentContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-bottom: 60px; // Footer 높이만큼 여백 추가
    scrollbar-width: thin;
    scrollbar-color: darkgray white;

`;

const PostListContainer = styled.div`
    padding-bottom: 20px;
`;

const Post = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    padding: 9.5px 20px;
    cursor: pointer;
`;

const Title = styled.p`
    font-weight: bold;
    font-size: 18.6px;
    text-align: left;
    margin: 0px 10px 2px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
`;

const Content = styled.p`
    font-size: 16.3px;
    color: #333;
    text-align: left;
    margin: 2px 10px 2px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
`;

const CreatedAt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 15px;
    color: #666;
    text-align: left;
    margin: 2px 10px 0 8px;
`;

const WriteButton = styled.button`
    background-color: #7995b6;
    width: 90px;
    border-radius: 100px;
    color: white;
    font-weight: bold;
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 1000;
    border: none;
    padding: 10px;
    cursor: pointer;
    margin-bottom: 15px;
`;

const Separator = styled.span`
    color: darkgray; 
`;

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

function CommunityMain() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [posts, setPosts] = useState([]);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const navigate = useNavigate();
    const clubId = 1;

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await apiClient.get(`/board/${clubId}/posts`);
            if (response.status === 200) {
                const postsWithAuthors = await Promise.all(
                    response.data.map(async (post) => {
                        try {
                            const memberResponse = await apiClient.get(`/members/${post.memberId}`);
                            return {
                                ...post,
                                authorName: memberResponse.data.name,
                            };
                        } catch (error) {
                            console.error(`Error fetching author info for post ${post.postId}:`, error);
                            return {
                                ...post,
                                authorName: '알 수 없음',
                            };
                        }
                    })
                );
                const sortedPosts = postsWithAuthors.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setPosts(sortedPosts);
            }
        } catch (error) {
            console.error(`Error fetching posts:`, error);
            alert('게시글 정보를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handlePostCreated = () => {
        fetchPosts(); // Fetch posts after a new post is created
        setIsWriteModalOpen(false);
    };

    /*
    const handleWritePost = async (newPost) => {
        try {
            const response = await apiClient.post(`/board/${clubId}/posts`, newPost);
            if(response.status === 200) {
                fetchPosts();
            }
            setIsWriteModalOpen(false);
        } catch (error) {
            console.log("게시글 작성 중 에러 발생:", error);
            alert('게시글 작성에 실패했습니다. 다시 시도해 주세요.');
        }
    };*/

    const handleMenuClick = (index) => {
        setActiveIndex(index);
    };

    const renderContent = () => {
        switch (activeIndex) {
            case 0:
                return (
                    <PostListContainer>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <Post key={post.postId.toString()} onClick={() => navigate(`/board/${clubId}/posts/${post.postId.toString()}`)}>
                                    <Title>{post.title}</Title>
                                    <Content>{post.content}</Content>
                                    <CreatedAt>
                                        <FaRegThumbsUp style={{marginTop: "2px", marginRight: "2px" }}/>
                                        <p>16</p>
                                        &nbsp;<Separator>|</Separator>&nbsp;{post.authorName}&nbsp;<Separator>|</Separator>&nbsp;{formatDate(post.createdAt)}
                                    </CreatedAt>
                                </Post>
                            ))
                        ) : (
                            <p>게시글이 없습니다.</p>
                        )}
                    </PostListContainer>
                );
            case 1:
                return <Calendar />;
            case 2:
                return <ActivityPage clubId={clubId} />;
            default:
                return null;
        }
    };

    return (
        <Whole>
            <Header_center />
            <MenuContainer>
                <MenuScroll>
                    {['자유게시판', '캘린더', '활동내용'].map((item, index) => (
                        <MenuItem
                            key={index}
                            active={activeIndex === index}
                            onClick={() => handleMenuClick(index)}
                        >
                            <p>{item}</p>
                        </MenuItem>
                    ))}
                </MenuScroll>
            </MenuContainer>
            <ContentContainer>
                {renderContent()}
            </ContentContainer>
            {activeIndex === 0 && (
                <WriteButton onClick={() => setIsWriteModalOpen(true)}>
                    글쓰기
                </WriteButton>
            )}
            {activeIndex === 0 && (
                <WritePostModal
                    isOpen={isWriteModalOpen}
                    onClose={() => setIsWriteModalOpen(false)}
                    onSubmit={handlePostCreated}
                />
            )}
            <Footer />
        </Whole>
    );
}

export default CommunityMain;