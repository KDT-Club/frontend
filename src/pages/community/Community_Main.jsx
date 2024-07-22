import React, { useEffect, useState } from 'react';
import Header_center from "../../components/header/Header_center.jsx";
import Footer from "../../components/footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./community_styles/community.css";
import Calendar from "./Calendar/Calendar.jsx";
import ActivityPage from './activity/ActivityPage.jsx'
import axios from "axios";
import WritePostModal from "./WritePostModal.jsx";

function CommunityMain() {
    const [activeIndex, setActiveIndex] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [posts, setPosts] = useState([]);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const navigate = useNavigate();

    // const posts = [
    //     { id: 1, title: "소수정예 전략 보드게임 동아리", content: "5기 곰돌이가 서울에 상륙하였습니다! 많은 분들의 참여를 바랍니다. 저희는 다양한 보드게임을 통해 전략적 사고와 팀워크를 기르기 위해 노력하고 있습니다. 자세한 내용은 홈페이지를 참조해주세요. 궁금한 사항은 언제든지 문의 바랍니다.", date: "07/22"},
    //     { id: 2, title: "보드게임 동아리 활동", content: "보드게임 동아리는 언제 활동을 하나요? 저희는 매주 금요일 저녁에 모여서 다양한 보드게임을 즐기고 있습니다. 많은 관심 부탁드립니다.", date: "07/21" },
    //     { id: 3, title: "주식 동아리 활동", content: "주식 동아리는 무슨 활동을 하나요? 저희는 매주 수요일 저녁에 모여 주식 투자에 대한 정보를 공유하고 있습니다. 많은 관심 부탁드립니다.", date: "07/20" },
    //     { id: 4, title: "치어리더 동아리", content: "재미있나요? 저희는 매주 월요일과 수요일 저녁에 모여 치어리딩 연습을 하고 있습니다. 많은 관심 부탁드립니다.", date: "07/19" },
    //     { id: 5, title: "주식 동아리", content: "하시는분? 저희는 매주 수요일 저녁에 모여 주식 투자에 대한 정보를 공유하고 있습니다. 많은 관심 부탁드립니다.", date: "07/18" }
    // ];

    useEffect(() => {
        const fetchData = async () => {
            await fetchPosts();
        };
        fetchData();
    }, []);

    const fetchPosts = async () => {
        try {
            // API 통합 시에 수정.
            // const response = await axios.get('/board/1/posts');
            // setPosts(response.data);

            // LocalStorage 사용
            const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
            setPosts(Array.isArray(storedPosts) ? storedPosts : []);
        } catch (error) {
            console.log('에러 내용:', error);
        }
    };

    const handleWritePost = async (newPost) => {
        try {
            // API 연결할 때 바꿀게요
            // const response = await axios.post('/board/1/posts', newPost);
            // if(response.status === 200) {
            // fetchPosts();
            //}

            // LocalStorage 사용
            const newPostId = Date.now().toString();
            console.log("New Post ID:", newPostId);
            const updatedPost = {
                postId: newPostId,
                title: newPost.title,
                content: newPost.content,
                createdAt: new Date().toISOString(),
                memberId: "1", // 임시 회원 ID 입니다!
                author: "작성자", // 임시 작성자 이름!
                date: new Date().toLocaleDateString(),
                comments: [] // 빈 댓글 배열 추가
            };
            const updatedPosts = [updatedPost, ...(Array.isArray(posts) ? posts : [])];
            setPosts(updatedPosts);
            localStorage.setItem("posts", JSON.stringify(updatedPosts));
            console.log("Updated localStorage:", JSON.parse(localStorage.getItem("posts")));
            setIsWriteModalOpen(false);
        } catch (error) {
            console.log("에러 내용:", error);
        }
        setIsWriteModalOpen(false);
    };

    const handleMenuClick = (index) => {
        setActiveIndex(index);
    };

    const maxContentLength = 30;

    const toggleContent = (postId) => {
        setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const renderContent = () => {
        const validPosts = Array.isArray(posts) ? posts : []; // Ensure posts is an array

        switch (activeIndex) {
            case 0:
                return (
                    <div className="posts-container">
                        {validPosts.map((post) => {
                            const isLongContent = post.content.length > maxContentLength;
                            const showFullContent = expandedPosts[post.id];

                            return (
                                <div key={post.postId.toString()} className="post-item" onClick={() => navigate(`/post/${post.postId.toString()}`)}>
                                    <h3 style={{
                                        textAlign: "left",
                                        marginLeft: "10px",
                                        marginBottom: "-5px",
                                        fontWeight: "bold",
                                        fontSize: "20px"
                                    }}>{post.title}</h3>
                                    <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
                                        <p style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: showFullContent ? "normal" : "nowrap",
                                            maxWidth: showFullContent ? "none" : "450px"
                                        }}>
                                            {post.content}
                                        </p>
                                        {isLongContent && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleContent(post.id);
                                                }}
                                                style={{
                                                    color: "gray",
                                                    cursor: "pointer",
                                                    border: "none",
                                                    background: "none",
                                                    marginLeft: "-20px",
                                                    padding: "0",
                                                }}
                                            >
                                                {showFullContent ? "간략히" : "더 보기"}
                                            </button>
                                        )}
                                    </div>
                                    <p style={{
                                        textAlign: "left",
                                        marginLeft: "10px",
                                        marginTop: "-5px",
                                        color: "gray",
                                    }}>{post.date}</p>
                                </div>
                            );
                        })}
                        <div>
                            <button onClick={() => setIsWriteModalOpen(true)}
                            style={{
                                backgroundColor: "#7995b6",
                                width: '150px',
                                borderRadius: '20px',
                                marginTop: '20px',
                                color: 'white'
                            }}>글쓰기</button>
                        </div>
                    </div>
                );
            case 1:
                return <Calendar />
            case 2:
                return <ActivityPage />
            default:
                return null;
        }
    };

    return (
        <div>
            <Header_center />
            <div className="menu-container">
                <div className="menu-scroll">
                    {['자유게시판', '캘린더', '활동내용'].map((item, index) => (
                        <div
                            key={index}
                            className={`menu-all ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => handleMenuClick(index)}
                            style={{border: activeIndex === index ? '2px solid black' : '2px solid lightgray'
                            ,  color: activeIndex === index ? 'black' : 'lightgray',
                            fontWeight: activeIndex === index ? '700' : '500',
                            width: '114px', marginTop:'20px'}}>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
            {renderContent()}
            <WritePostModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                onSubmit={handleWritePost}
            />
            <Footer />
        </div>
    );
}

export default CommunityMain;
