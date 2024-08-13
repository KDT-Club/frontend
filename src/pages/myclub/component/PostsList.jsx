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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
`;

const Content = styled.p`
    font-size: 16px;
    color: #666;
    text-align: left;
    margin: 5px 10px 5px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
`;

const CreatedAt = styled.p`
    font-size: 16px;
    color: gray;
    text-align: left;
    margin: 5px 10px 0 8px;
`;

const PostsList = ({ boardType, boardId, title }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [isPresident, setIsPresident] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [studentId, setStudentId] = useState(null);

    const fetchUserDataAndCheckStatus = async () => {
        try {
            const userResponse = await apiClient.get('/getUserId', { withCredentials: true });
            const userMemberId = userResponse.data.message;
            setMemberId(userMemberId);

            const memberResponse = await apiClient.get(`/members/${userMemberId}`);
            setStudentId(memberResponse.data.studentId);

            const membersResponse = await apiClient.get(`/clubs/${id}/clubMember`);
            if (membersResponse.status === 200) {
                const members = membersResponse.data;
                const loggedInMember = members.find(member => member.studentId === memberResponse.data.studentId);
                setIsPresident(loggedInMember?.status === "CLUB_PRESIDENT");
            }
        } catch (error) {
            console.error('회원정보 가져오는 중 에러 발생:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response;
                if (boardType === 'activity') {
                    response = await apiClient.get(`/board/3/clubs/${id}/posts`);
                } else {
                    response = await apiClient.get(`/clubs/${id}/board/${boardId}/posts`);
                }

                if (response.status === 200) {
                    let postsWithAuthors = await Promise.all(
                        response.data.map(async (post) => {
                            try {
                                let authorName;
                                if (boardType === 'activity') {
                                    // activity 게시판의 경우 memberId를 사용하여 작성자 정보 가져오기
                                    const memberResponse = await apiClient.get(`/members/${post.memberId}`);
                                    authorName = memberResponse.data.name;
                                } else {
                                    // 기존 다른 게시판 타입의 경우
                                    const detailResponse = await apiClient.get(`/clubs/${id}/board/${boardId}/posts/${post.postId}`);
                                    authorName = detailResponse.data.post.member.name;
                                }
                                return {
                                    ...post,
                                    authorName: authorName,
                                };
                            } catch (error) {
                                console.error(`게시글 ${post.postId}의 작성자 정보 조회 중 에러 발생`, error);
                                return post;
                            }
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
        fetchUserDataAndCheckStatus();
    }, [id, boardId, boardType]);

    const handleWriteClick = () => {
        if (boardType === 'activity') {
            navigate(`/clubs/${id}/activitywrite`);
        } else {
            navigate(`/clubs/${id}/${boardType}list/${boardType}write`);
        }
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
                <div style={{fontSize: '20px', fontWeight: "bold"}}>{title}</div>
                {(boardType !== 'notice' || isPresident) && (
                    <FiEdit
                        style={{fontSize: '24px', cursor: 'pointer'}}
                        onClick={handleWriteClick}
                    />
                )}
                {(boardType === 'notice' && !isPresident) && <div style={{width: '24px'}}></div>}
            </HeaderContainer>
            <ScrollContainer>
                <PostListContainer>
                    {list.length > 0 ? (
                        list.map((post, index) => (
                            <Post key={index}>
                                <Link to={boardType === 'activity'
                                    ? `/clubs/${id}/activity/${post.postId}`
                                    : `/clubs/${id}/board/${boardId}/posts/${post.postId}?memberId=${memberId}`
                                }>
                                    <Title>{post.title}</Title>
                                    <Content>{post.content}</Content>
                                    <CreatedAt>
                                        {/*{boardType !== 'activity' && `${post.authorName} | `}*/}
                                        {/*{formatDate(post.createdAt)}*/}
                                        {post.authorName} | {formatDate(post.createdAt)}
                                    </CreatedAt>
                                </Link>
                            </Post>
                        ))
                    ) : (
                        <EmptyMessageContainer>
                            <EmptyMessage>
                                {boardType === 'activity' ? '작성된 활동내용이 없습니다.' : '작성된 글이 없습니다.'}
                            </EmptyMessage>
                        </EmptyMessageContainer>
                    )}
                </PostListContainer>
            </ScrollContainer>
        </Whole>
    );
};

export default PostsList;

