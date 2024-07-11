import React, { useEffect, useState } from 'react';
import "./myclubdetail.css";
import Footer from '../../components/footer/Footer.jsx';
import { useParams, useNavigate } from "react-router-dom";
import MyclubHeader from "./DetailHeader/MyclubHeader.jsx";
import postData from "./data/postData.jsx";
import clubData from "./data/clubData.jsx";

function MyclubDetail({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();

    //공지사항,자유게시판 글 API 조회
    // const [noticePosts, setNoticePosts] = useState([]);
    // const [freeboardPosts, setFreeboardPosts] = useState([]);

    const boardType = {
        "notice": 2,
        "internal": 4
    } //boardId 타입 지정 -> 하드코딩해놓음

    // 이후 boardType 구현용 예제
    // const boardType = useEffect(
    //   -> 백엔드에서 게시판 종류와 번호를 반환해주는 API 호출
    // )

    // useEffect(() => {
    //     // 공지사항 게시글 가져오기
    //     fetch(`/clubs/${id}/board/${boardType['notice']}/posts`)
    //         .then(response => response.json())
    //         .then(data => setNoticePosts(data))
    //         .catch(error => console.error(error));
    //
    //     // 자유게시판 게시글 가져오기
    //     fetch(`/clubs/${id}/board/${boardType['internal']}/posts`)
    //         .then(response => response.json())
    //         .then(data => setFreeboardPosts(data))
    //         .catch(error => console.error(error));
    // }, [id]);

    const handleNoticeClick = () => {
        navigate(`/clubs/${id}/noticelist`);
    };

    const handleFreeboardClick = () => {
        navigate(`/clubs/${id}/freeboardlist`);
    };

    const currentClub = clubData.find(club => club.clubId === parseInt(id));
    const currentClubName = currentClub? currentClub.name : ""; //현재 동아리의 이름 get
    
    //UI보기용 post 불러오기 -> 나중에 삭제
    const noticePosts = postData.filter(post =>
        post.boardId === 2 && post.clubName === currentClubName
    );
    const freeboardPosts = postData.filter(post =>
        post.boardId === 4 && post.clubName === currentClubName
    );

    const etc1handleMoreClick = () => {
        navigate(`/clubs/etc1`);
    }; //출석 화면으로 이동

    const etc2handleMoreClick = () => {
        navigate(`/clubs/etc2`);
    }; //정산 화면으로 이동

    const etc3handleMoreClick = () => {
        navigate(`/clubs/etc3`);
    }; //투표 화면으로 이동

    return (
        <div className="myclub-detail-container">
            <MyclubHeader clubs={clubs}/>
            <div className="scroll-container">
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>공지사항</h2>
                        <p onClick={() => handleNoticeClick()}>더보기</p>
                    </div>
                    <section className="box-section">
                        {noticePosts.map((item, index) => (
                            <div className="box-item" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>자유게시판</h2>
                        <p onClick={() => handleFreeboardClick()}>더보기</p>
                    </div>
                    <section className="box-section">
                        {freeboardPosts.map((item, index) => (
                            <div className="box-item" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>출석</h2>
                        <p onClick={etc1handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/30 (일)<br/>연합 경기</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/07/19 (금)<br/>회식</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/10 (월)<br/>MT</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/06/03 (월)<br/>정기 모임</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >2024/05/21 (화)<br/>오리엔테이션</p>
                        </div>
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>정산</h2>
                        <p onClick={etc2handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >7월 19일 회식</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >유니폼 구입</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >MT 참가비</p>
                        </div>
                    </section>
                </div>
                <div className="item-container">
                    <div className="headerrcontainer">
                        <h2>투표</h2>
                        <p onClick={etc3handleMoreClick}>더보기</p>
                    </div>
                    <section className="box-section">
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >7월 19일 회식 장소</p>
                        </div>
                        <div className="box-item"
                             style={{minWidth: "190px", border: "1.5px solid black"}}
                        >
                            <p
                                style={{fontSize: "15px"}}
                            >MT 날짜</p>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default MyclubDetail;