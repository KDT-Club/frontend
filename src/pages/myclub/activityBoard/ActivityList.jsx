import React, { useState, useEffect } from 'react';
import { formatDate } from '../component/Date.jsx';
import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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

const EmptyMessageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const EmptyMessage = styled.p`
    font-size: 18px;
    color: gray;
    text-align: center;
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
    padding: 11px 20px;

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
    margin: 0px 10px 6px 8px;
`;

const CreatedAt = styled.p`
    font-size: 16px;
    color: gray;
    text-align: left;
    margin: 5px 10px 0 8px;
`;

const ActivityList = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`https://zmffjq.store/board/3/clubs/${id}/posts`);
                if (response.status === 200) {
                    const sortedActivities = response.data.sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setList(sortedActivities);
                }
            } catch (error) {
                console.error('활동내용 리스트 가져오는 중 에러 발생', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, [id]);

    const handleWriteClick = () => {
        navigate(`/clubs/${id}/activitywrite`);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/myclub`);
    };

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>활동내용</div>
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
                                <Link to={`/clubs/${id}/activity/${post.postId}`}>
                                    <Title>{post.title}</Title>
                                    <Content>{post.content}</Content>
                                    <CreatedAt>{formatDate(post.createdAt)}</CreatedAt>
                                </Link>
                            </Post>
                        ))
                    ) : (
                        <EmptyMessageContainer>
                            <EmptyMessage>작성된 활동내용이 없습니다.</EmptyMessage>
                        </EmptyMessageContainer>
                    )}
                </PostListContainer>
            </ScrollContainer>
        </Whole>
    );
};

export default ActivityList;