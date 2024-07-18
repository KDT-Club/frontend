import React, {useState, useEffect, useCallback} from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import { MdOutlineManageAccounts, MdOutlinePerson, MdOutlineSettings, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import Modal_confirm from "../../../components/modal/Modal_confirm.jsx";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import clubmemberData from '../data/clubmemberData.jsx';
import memberInfo from "../data/memberInfo.jsx";
import clubData from "../data/clubData.jsx";

function MyclubHeader({ clubName }) {
    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const memberId = location.state?.memberId || localStorage.getItem('memberId');

    const [clubMembers, setClubMembers] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(location.state?.isMenuOpen || false); //햄버거탭 슬라이드
    const [isMemberListOpen, setIsMemberListOpen] = useState(false); //회원리스트
    const [isMemberManageOpen, setIsMemberManageOpen] = useState(false); //회원관리
    const [isClubManageOpen, setIsClubManageOpen] = useState(false); //동아리 관리

    const [showDeleteModal, setShowDeleteModel] = useState(false);  // 네,아니오 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달 메세지

    //햄버거탭에서 회원리스트 조회
    // useEffect(() => {
    //     const fetchClubMembers = async () => {
    //         try {
    //             const response = await fetch(`/clubs/${id}/clubMember`);
    //             if (!response.ok) {
    //                 throw new Error('동아리 회원 리스트 조회 실패');
    //             }
    //             const data = await response.json();
    //             setClubMembers(data);
    //         } catch (error) {
    //             console.error('동아리 회원 리스트 조회 중 에러 발생', error);
    //         }
    //     };
    //     fetchClubMembers();
    // }, [id]);

    // const handleBackClick = () => {
    //     //MyclubDetail에서 컴포넌트 사용->뒤로가기 누르면 MyclubMain으로 이동하게 함.
    //     //다른곳에서 사용중이면 바꿔야됨
    //     navigate(`/clubs/${id}`);
    // };

    const handleBackClick = () => {
        navigate(`/clubs?memberId=${memberId}`);
    };

    //햄버거탭 열고 닫기 토글
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    //회원리스트 토글
    const toggleMemberList = (e) => {
        e.stopPropagation();
        setIsMemberListOpen(!isMemberListOpen);
    };

    //회원관리 토글
    const toggleMemberManage = (e) => {
        e.stopPropagation();
        setIsMemberManageOpen(!isMemberManageOpen);
    };

    //동아리관리 토글
    const toggleClubManage = (e) => {
        e.stopPropagation();
        setIsClubManageOpen(!isClubManageOpen);
    };
    const handleClubInfoEdit = () => { //동아리 정보 수정
        navigate(`/clubs/${id}/changeclubinfo`, { state: { isMenuOpen: true } }); // 햄버거탭 오픈 상태 전달;
    };

    // 네/아니오 모달창 open
    const handleOpenDeleteModal = useCallback((message) => {
        setModalMessage(message);
        setShowDeleteModel(true);
    }, []);

    // 네/아니오 모달창 close
    const handleCloseDeleteModal = () => setShowDeleteModel(false);

    return (
        <>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '24px', fontWeight: "bold"}}>{clubName}</div>
                <RxHamburgerMenu
                    style={{fontSize: '24px', strokeWidth: '0.3', cursor: 'pointer'}}
                    onClick={toggleMenu}
                />
            </div>
            {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
            <div className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="slide-menu-content">
                    <div className="member-info">
                        <h2>최자두</h2>
                        <p>2020101460</p>
                        {/*API수정 필요!*/}
                    </div>
                    <div className="menu-items">
                        <div className="li-container" onClick={toggleMemberList}>
                            <div className="li-container-left">
                                <MdOutlinePerson style={{fontSize: "27px"}}/>
                                <li>회원</li>
                            </div>
                            {isMemberListOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}} />
                            )}
                        </div>
                        {isMemberListOpen && (
                            <div className="member-list">
                                {clubMembers.map((memberName, index) => (
                                    <div key={index} className="member-item">{memberName}</div>
                                ))}
                                {/*API로부터 회원 이름, 학번 조회: 아래 코드임*/}
                                {/*{clubMembers.map((member, index) => (*/}
                                {/*    <div key={index} className="member-item">*/}
                                {/*        <div>{member.name} ({member.studentId})</div>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                            </div>
                        )}
                        <div className="li-container" onClick={toggleMemberManage}>
                            <div className="li-container-left">
                                <MdOutlineManageAccounts style={{fontSize: "27px"}}/>
                                <li>회원 관리</li>
                            </div>
                            {isMemberManageOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}} />
                            )}
                        </div>
                        {isMemberManageOpen && (
                            <div className="member-manage-list">
                                <div className="manage-item" onClick={() => navigate(`/clubs/${id}/memberInfoFixList`)}>회원 정보 수정</div>
                                <div className="manage-item">회원 출석 관리</div>
                                <div className="manage-item" onClick={() => navigate("/clubs/:id/joinRequest")}>가입 신청 현황</div>
                            </div>
                        )}
                        <div className="li-container" onClick={toggleClubManage}>
                            <div className="li-container-left">
                                <MdOutlineSettings style={{fontSize: "27px"}}/>
                                <li>동아리 관리</li>
                            </div>
                            {isClubManageOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}} />
                            )}
                        </div>
                        {isClubManageOpen && (
                            <div className="club-manage-list">
                                <div className="manage-item" onClick={handleClubInfoEdit}>동아리 정보 수정</div>
                                <div className="manage-item">동아리 삭제</div>
                            </div>
                        )}
                    </div>
                    <div className="leave-club" onClick={() => handleOpenDeleteModal("동아리에서 탈퇴하시겠습니까?")}>
                        <div className="leave-club-line">
                            <li style={{marginRight: "10px", fontSize: "14px", te: "center"}}>동아리 탈퇴하기</li>
                            <TbDoorExit style={{fontSize: "23px"}}/>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <Modal_confirm onClose={handleCloseDeleteModal} message={modalMessage} link="/" />}
            </div>
        </>
    );
}

export default MyclubHeader;