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
//햄버거탭을 여기에 설정해놔서 코드가 복잡해졌음....

function MyclubHeader() {
    let { id } = useParams();
    let memberId = 104;
    const member = memberInfo.find(m => m.memberId === parseInt(memberId, 10));
    const navigate = useNavigate();
    const location = useLocation();

    const [clubs, setClubs] = useState([]);
    //const [club, setClub] = useState([]); 나중에 위 코드를 이거로 변경
    const [clubMembers, setClubMembers] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(location.state?.isMenuOpen || false); //햄버거탭 슬라이드
    const [isMemberListOpen, setIsMemberListOpen] = useState(false); //회원리스트
    const [isMemberManageOpen, setIsMemberManageOpen] = useState(false); //회원관리
    const [isClubManageOpen, setIsClubManageOpen] = useState(false); //동아리 관리

    const [showDeleteModal, setShowDeleteModel] = useState(false);  // 네,아니오 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달 메세지

    // club 데이터를 불러와서 상태 설정
    //여기부터.......
    useEffect(() => {
        setClubs(clubData);
    }, []);
    const club = clubs.find(club => club.clubId === parseInt(id)) ?? {};

    useEffect(() => {
        //memberId get
        const getMemberId = clubmemberData.filter(member => member.clubId === parseInt(id));
        //회원 이름 get
        const getMemberName = getMemberId.map(clubMember => {
            const memberName = memberInfo.find(member => member.memberId === clubMember.memberId);
            return memberName ? memberName.name : "회원이 없습니다.";
        })
        setClubMembers(getMemberName);
    }, [id]);
    //여기까지 UI보기용 데이터 조회. 나중에 삭제

    //동아리 정보 API 조회; 헤더에 동아리 이름 띄워야됨
    // useEffect(() => {
    //     const fetchClub = async() => {
    //         try {
    //             const response = await fetch(`/clubs/${id}`);
    //             if (!response.ok) {
    //                 throw new Error('동아리 정보 조회 실패');
    //             }
    //             const data = await response.json();
    //             setClub(data);
    //         } catch (error) {
    //             console.error('동아리 정보 조회 중 에러 발생', error);
    //         }
    //     };
    //     fetchClub();
    // }, [id]);

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

    const handleBackClick = () => {
        navigate('/clubs');
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
        navigate(`/clubs/${id}/changeClubInfo`, { state: { isMenuOpen: true } }); // 햄버거탭 오픈 상태 전달;
    };

    const handleOpenDeleteModal = useCallback((message) => {
        setModalMessage(message);
        setShowDeleteModel(true);
    }, []);

    const handleCloseDeleteModal = () => setShowDeleteModel(false);

    return (
        <>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '26px', fontWeight: "bold"}}>{club.name}</div>
                <RxHamburgerMenu
                    style={{fontSize: '27px', strokeWidth: '0.3', cursor: 'pointer'}}
                    onClick={toggleMenu}
                />
            </div>
            {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
            <div className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="slide-menu-content">
                    <div className="member-info">
                        <h2>{member.name}</h2>
                        <p>2020101460</p>
                    </div>
                    <div className="menu-items">
                        <div className="li-container" onClick={toggleMemberList}>
                            <div className="li-container-left">
                                <MdOutlinePerson style={{fontSize: "27px"}}/>
                                <li>회원</li>
                            </div>
                            {isMemberListOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "20px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "20px", fontSize: "28px"}} />
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
                                <MdKeyboardArrowDown style={{marginRight: "20px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "20px", fontSize: "28px"}} />
                            )}
                        </div>
                        {isMemberManageOpen && (
                            <div className="member-manage-list">
                                <div className="manage-item" onClick={() => navigate("/memberInfoFixList")}>회원정보 수정</div>
                                <div className="manage-item">회원출석 관리</div>
                                <div className="manage-item" onClick={() => navigate("/clubs/:id/joinRequest")}>가입 신청 현황</div>
                            </div>
                        )}
                        <div className="li-container" onClick={toggleClubManage}>
                            <div className="li-container-left">
                                <MdOutlineSettings style={{fontSize: "27px"}}/>
                                <li>동아리 관리</li>
                            </div>
                            {isClubManageOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "20px", fontSize: "28px"}} />
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "20px", fontSize: "28px"}} />
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
                            <li style={{marginRight: "10px", fontSize: "15px", te: "center"}}>동아리 탈퇴하기</li>
                            <TbDoorExit style={{fontSize: "25px"}}/>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <Modal_confirm onClose={handleCloseDeleteModal} message={modalMessage} link="/" />}
            </div>
        </>
    );
}

export default MyclubHeader;