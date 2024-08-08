import React, { useState, useEffect } from 'react';
import { formatDate } from '../component/Date';
import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://zmffjq.store',
    headers: {
        'Content-Type': 'application/json',
    },
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
    overflow: hidden;
`;

const PostListContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: darkgray white;
`;

const Content = styled.p`
    font-size: 16px;
    color: #666;
    text-align: left;
    margin: 5px 10px 5px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2; // 표시할 줄 수
    -webkit-box-orient: vertical;
`;

const Post = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    padding: 15px 20px;
    
    a {
        text-decoration: none;
        color: inherit;
        width: 100%;
    }
`;

const Title = styled.p`
    font-weight: bold;
    font-size: 18.6px;
    text-align: left;
    margin: 0px 10px 10px 8px;
`;

const CreatedAt = styled.p`
    margin-top: 5px;
    margin-bottom: 0;
    font-size: 16px;
    color: gray;
    text-align: left;
    margin-left: 8px;
    margin-right: 10px;
`;

const PostList = ({ boardType, boardId, title }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [memberId, setMemberId] = useState(null);

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get('/getUserId', { withCredentials: true });
            setMemberId(response.data.message);
        } catch (error) {
            console.error('유저 아이디를 불러오는 중 에러 발생:', error);
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get(`/clubs/${id}/board/${boardId}/posts`);
                if (response.status === 200) {
                    const postsWithAuthors = await Promise.all(
                        response.data.map(async (post) => {
                            try {
                                const detailResponse = await apiClient.get(`/clubs/${id}/board/${boardId}/posts/${post.postId}`);
                                if (detailResponse.status === 200) {
                                    const detailData = detailResponse.data.post;
                                    return {
                                        ...post,
                                        authorName: detailData.member.name,
                                    };
                                }
                            } catch (error) {
                                console.error(`게시글 ${post.postId}의 상세 정보 조회 중 에러 발생`, error);
                            }
                            return post;
                        })
                    );
                    const sortedPosts = postsWithAuthors.sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setList(sortedPosts);
                }
            } catch (error) {
                console.error(`${boardType} 리스트 가져오는 중 에러 발생`, error);
            }
        };
        fetchPosts();
        fetchUserId();
    }, [id, boardId, boardType]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/${boardType}list/${boardType}write`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/myclub`);
    };

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>{title}</div>
                <FiEdit
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleWriteClick}
                />
            </HeaderContainer>
            <ScrollContainer>
                <PostListContainer>
                    {list.length > 0 ? (
                        list.map((post, index) => (
                            <Post key={index}>
                                <Link to={`/clubs/${id}/board/${boardId}/posts/${post.postId}?memberId=${memberId}`}>
                                    <Title>{post.title}</Title>
                                    <Content>{post.content}</Content>
                                    <CreatedAt>{post.authorName} | {formatDate(post.createdAt)}</CreatedAt>
                                </Link>
                            </Post>
                        ))
                    ) : (
                        <p>작성된 글이 없습니다.</p>
                    )}
                </PostListContainer>
            </ScrollContainer>
        </Whole>
    );
};

export default PostList;