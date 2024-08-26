import React, {useEffect, useState} from "react";
import axios from "axios";
import './written_post.css'
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft, FaRegThumbsUp} from "react-icons/fa6";
import styled from "styled-components";

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

const CreatedAt = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 15px;
    color: #666;
    text-align: left;
    margin: 5px 10px 0 8px;
`;

const Separator = styled.span`
    color: darkgray; 
`;

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function Written_post() {
    const navigate = useNavigate();
    const { memberId } = useParams();

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const [list, setList] = useState([]);

    // 작성한 글 목록을 가져오는 API
    useEffect(() => {
      // 작성한 글 목록을 조회
        apiClient.get(`/posts/${memberId}`)
             .then(response => {
                 setList(response.data);
             })
             .catch(error => {
                 console.error('작성한 글 목록 조회 중 오류 발생:', error);
             });
    }, [memberId]);

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={() => navigate(`/members/${memberId}`)}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", textAlign: "left", marginRight: "110px"}}>작성한 글 보기</div>
            </HeaderContainer>
            <ScrollContainer>
                <PostListContainer>
                    {list.length > 0 ? (
                        list.map((post, index) => (
                            <Post key={index}>
                                <Link to={`/posts/${memberId}/${post.id}`}>
                                    <Title>{post.title}</Title>
                                    <Content>{post.content}</Content>
                                    <CreatedAt>
                                        <FaRegThumbsUp style={{marginTop: "2px", marginRight: "2px" }}/>
                                        <p>16</p>
                                        &nbsp;<Separator>|</Separator>&nbsp;{formatDate(post.createdAt)}
                                    </CreatedAt>
                                </Link>
                            </Post>
                        ))
                    ) : (
                        <EmptyMessageContainer>
                            <EmptyMessage>
                                {'작성된 글이 없습니다.'}
                            </EmptyMessage>
                        </EmptyMessageContainer>
                    )}
                </PostListContainer>
            </ScrollContainer>
        </Whole>
    )
}

export default Written_post;