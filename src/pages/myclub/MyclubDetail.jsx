import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../../components/footer/Footer.jsx';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Slide from "./headerHamburger/Slide.jsx"
import styled from 'styled-components';

function MyclubDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [clubName, setClubName] = useState(''); //헤더에 이름 띄우기
    //공지사항,자유게시판,활동게시판 글 API 조회
    const [noticePosts, setNoticePosts] = useState([]);
    const [freeboardPosts, setFreeboardPosts] = useState([]);
    const [activityPosts, setActivityPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedClubName = localStorage.getItem(`clubName_${id}`);

        if (storedClubName) {
            setClubName(storedClubName);
        } else if (location.state?.clubName) {
            setClubName(location.state.clubName);
            localStorage.setItem(`clubName_${id}`, location.state.clubName);
        }

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const [noticeResponse, freeboardResponse,activityResponse] = await Promise.all([
                    axios.get(`/api/clubs/${id}/board/2/posts`),
                    axios.get(`/api/clubs/${id}/board/4/posts`),
                    axios.get(`/api/board/3/clubs/${id}/posts`)
                ]);

                // 공지사항
                const sortedNoticePosts = Array.isArray(noticeResponse.data)
                    ? noticeResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    : [noticeResponse.data];
                setNoticePosts(sortedNoticePosts);

                // 자유게시판
                const sortedFreeboardPosts = Array.isArray(freeboardResponse.data)
                    ? freeboardResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    : [freeboardResponse.data];
                setFreeboardPosts(sortedFreeboardPosts);

                // 활동내용
                const sortedActivityPosts = Array.isArray(activityResponse.data)
                    ? await Promise.all(
                        activityResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(async (post) => {
                                try {
                                    const imgResponse = await axios.get(`/api/board/3/clubs/${id}/posts/${post.postId}`);
                                    const attachmentNames = imgResponse.data.attachmentNames || [];
                                    return {
                                        ...post,
                                        imageUrl: attachmentNames[0] || null,
                                        content: attachmentNames.length > 0 ? null : post.content // 이미지가 없으면 content를 설정
                                    };
                                } catch (err) {
                                    console.error('활동 게시글 조회 중 에러 발생:', err);
                                    return {
                                        ...post,
                                        imageUrl: null,
                                        content: post.content
                                    };
                                }
                            })
                    )
                    : [activityResponse.data];
                setActivityPosts(sortedActivityPosts);

            } catch (error) {
                console.error('API 호출 중 오류 발생:', error.response || error);
                setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [id, location.state]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    const handleNoticeClick = () => {
        navigate(`/clubs/${id}/noticelist`);
    };

    const handleFreeboardClick = () => {
        navigate(`/clubs/${id}/freeboardlist`);
    };

    const handleActivityClick = () => {
        navigate(`/clubs/${id}/activityList`);
    };

    const etc1handleMoreClick = () => {
        navigate(`/clubs/etc1`);
    }; //출석 화면으로 이동

    return (
        <MyclubDetailContainer>
            <Slide clubName={clubName} />
            <ScrollContainer>
                <ItemContainer>
                    <HeaderContainer>
                        <h2>공지사항</h2>
                        <p onClick={() => handleNoticeClick()}>더보기</p>
                    </HeaderContainer>
                    <BoxSection>
                        {noticePosts.length > 0 ? (
                            noticePosts.map((item, index) => (
                                <BoxItem key={index}>
                                    <h3>{item.title}</h3>
                                    <p>{item.content}</p>
                                </BoxItem>
                            ))
                        ) : (
                            <p className="no-posts-message">작성된 글이 없습니다.</p>
                        )}
                    </BoxSection>
                </ItemContainer>
                <ItemContainer>
                    <HeaderContainer>
                        <h2>자유게시판</h2>
                        <p onClick={() => handleFreeboardClick()}>더보기</p>
                    </HeaderContainer>
                    <BoxSection>
                        {freeboardPosts.length > 0 ? (
                            freeboardPosts.map((item, index) => (
                                <BoxItem key={index}>
                                    <h3>{item.title}</h3>
                                    <p>{item.content}</p>
                                </BoxItem>
                            ))
                        ) : (
                            <p className="no-posts-message">작성된 글이 없습니다.</p>
                        )}
                    </BoxSection>
                </ItemContainer>
                <ItemContainer>
                    <HeaderContainer>
                        <h2>동아리 활동</h2>
                        <p onClick={handleActivityClick}>더보기</p>
                    </HeaderContainer>
                    <ActivityBoxSection>
                        {activityPosts.length > 0 ? (
                            activityPosts.map((item, index) => (
                                <ActivityBoxItem key={index}>
                                    <h3>{item.title}</h3>
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt="첨부 이미지"/>
                                    ) : (
                                        <p>{item.content}</p>
                                    )}
                                </ActivityBoxItem>
                            ))
                        ) : (
                            <p className="no-posts-message">작성된 글이 없습니다.</p>
                        )}
                    </ActivityBoxSection>
                </ItemContainer>
                <ItemContainer>
                    <HeaderContainer>
                        <h2>출석</h2>
                        <p onClick={etc1handleMoreClick}>더보기</p>
                    </HeaderContainer>
                    <BoxSection>
                        <AtdBoxItem>
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/30 (일)<br/>정기 모임</p>
                        </AtdBoxItem>
                        <AtdBoxItem>
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/19 (금)<br/>회식</p>
                        </AtdBoxItem>
                        <AtdBoxItem>
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/10 (월)<br/>MT</p>
                        </AtdBoxItem>
                        <AtdBoxItem>
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/03 (월)<br/>정기 모임</p>
                        </AtdBoxItem>
                        <AtdBoxItem>
                            <p
                                style={{fontSize: "15px"}}
                            >2024/05/21 (화)<br/>오리엔테이션</p>
                        </AtdBoxItem>
                    </BoxSection>
                </ItemContainer>
            </ScrollContainer>
            <Footer style={{height: "72.5px", marginTop: "0"}}/>
        </MyclubDetailContainer>
    );
}

const MyclubDetailContainer = styled.div`
  position: fixed;
  width: calc(var(--vw, 1vw) * 100);
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  padding-bottom: 10px;
`;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-left: 10px;
  scrollbar-width: thin;
  scrollbar-color: darkgray white;
  padding-bottom: 110px;
`;

const ItemContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 20px 0 10px;
  border-bottom: 1px solid grey;

  h2 {
    font-size: 21.3px;
    font-weight: bold;
    margin-left: 3px;
  }

  p {
    font-size: 17px;
    cursor: pointer;
    line-height: 35px;
    margin-right: 5px;
    color: gray;
    font-weight: bold;
  }
`;

const BoxSection = styled.section`
  display: flex;
  width: calc(100vw - 30px);
  overflow-x: auto;
  padding: 10px;
  gap: 10px;
  margin-bottom: 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const BoxItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  max-width: 190px;
  padding: 15px;
  border: 1.5px solid #597CA5;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  p {
    font-size: 13.8px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
`;

const ActivityBoxSection = styled.section`
  display: flex;
  width: calc(100vw - 30px);
  overflow-x: auto;
  padding: 10px;
  gap: 10px;
  margin-bottom: 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActivityBoxItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 190px;
  max-width: 190px;
  height: 215px;
  padding: 15px;
  border: 1.5px solid #597CA5;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;

  h3 {
    font-size: 14.5px;
    font-weight: bold;
    margin: 0 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  img {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  p {
    font-size: 12.5px;
    margin: 10px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    width: 100%;
  }
`;

const AtdBoxItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  max-width: 190px;
  padding: 15px;
  border: 1.5px solid darkgrey;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `;

export default MyclubDetail;