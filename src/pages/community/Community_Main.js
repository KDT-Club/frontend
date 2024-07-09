import React, { useState } from 'react';
import Header_center from "../../components/Header_center.jsx";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./community_styles/community.css";

function CommunityMain() {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    const handleMenuClick = (index) => {
        setActiveIndex(index);
    };

    const posts = [
        { id: 1, title: "소수정예 전략 보드게임 동아리", content: "5기 곰돌이가 서울에 상륙하였습니다! 많은 분들의 참여를 바랍니다. 저희는 다양한 보드게임을 통해 전략적 사고와 팀워크를 기르기 위해 노력하고 있습니다. 자세한 내용은 홈페이지를 참조해주세요. 궁금한 사항은 언제든지 문의 바랍니다.", date: "07/22"},
        { id: 2, title: "보드게임 동아리 활동", content: "보드게임 동아리는 언제 활동을 하나요? 저희는 매주 금요일 저녁에 모여서 다양한 보드게임을 즐기고 있습니다. 많은 관심 부탁드립니다.", date: "07/21" },
        { id: 3, title: "주식 동아리 활동", content: "주식 동아리는 무슨 활동을 하나요? 저희는 매주 수요일 저녁에 모여 주식 투자에 대한 정보를 공유하고 있습니다. 많은 관심 부탁드립니다.", date: "07/20" },
        { id: 4, title: "치어리더 동아리", content: "재미있나요? 저희는 매주 월요일과 수요일 저녁에 모여 치어리딩 연습을 하고 있습니다. 많은 관심 부탁드립니다.", date: "07/19" },
        { id: 5, title: "주식 동아리", content: "하시는분? 저희는 매주 수요일 저녁에 모여 주식 투자에 대한 정보를 공유하고 있습니다. 많은 관심 부탁드립니다.", date: "07/18" }
    ];

    const maxContentLength = 30;

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
                            style={{border: activeIndex === index ? '2px solid black' : '0.5px solid gray'}}
                        >
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="posts-container">
                {posts.map((post) => {
                    const isLongContent = post.content.length > maxContentLength;
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [showFullContent, setShowFullContent] = useState(false);

                    return (
                        <div key={post.id} className="post-item" onClick={() => navigate(`/post/${post.id}`)}>
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
                                            setShowFullContent(!showFullContent);
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
            </div>
            <Footer />
        </div>
    );
}

export default CommunityMain;
