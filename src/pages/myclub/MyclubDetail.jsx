import React from 'react';
import "./myclubdetail.css";
import Footer from '../../components/Footer.jsx';
import { useParams, useNavigate } from "react-router-dom";
import MyclubHeader from "./DetailHeader/MyclubHeader.jsx";
import noticeListData from './data/noticeListData.jsx';
import freeboardListData from "./data/freeboardListData.jsx";

function MyclubDetail({clubs}) {
    let { id } = useParams();
    const club = clubs.find(club => club.clubId === parseInt(id));
    const navigate = useNavigate();

    if (!club) {
        return <div>클럽을 찾을 수 없습니다.</div>;
    }

    const NoticehandleMoreClick = () => {
        navigate(`/clubs/${id}/board/2`);
    }; //공지사항 목록 화면으로 이동

    const BoardhandleMoreClick = () => {
        navigate(`/clubs/${id}/board/4`);
    }; //자유게시판 목록 화면으로 이동

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
                    <div className="header-container">
                        <h2>공지사항</h2>
                        <p onClick={() => NoticehandleMoreClick(club.id)}>더보기</p>
                    </div>
                    <section className="box-section">
                        {noticeListData.map((item, index) => (
                            <div className="box-item" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="item-container">
                    <div className="header-container">
                        <h2>자유게시판</h2>
                        <p onClick={() => BoardhandleMoreClick(club.id)}>더보기</p>
                    </div>
                    <section className="box-section">
                        {freeboardListData.map((item, index) => (
                            <div className="box-item" key={index}>
                                <h3>{item.title}</h3>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className="item-container">
                    <div className="header-container">
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
                    <div className="header-container">
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
                    <div className="header-container">
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
            <Footer/>
        </div>
    );
}

export default MyclubDetail;