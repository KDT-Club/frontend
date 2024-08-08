import React, {useState, useEffect, useCallback} from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import { MdOutlineManageAccounts, MdOutlinePerson, MdOutlineSettings, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import Modal_confirm from "../../../components/modal/Modal_confirm.jsx";
import axios from "axios";
axios.defaults.withCredentials = true;

function MyclubHeader({ clubName }) {
    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const memberId = location.state?.memberId || localStorage.getItem('memberId');

    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const [member, setMember] = useState('');
    const [clubMembers, setClubMembers] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(location.state?.isMenuOpen || false); //햄버거탭 슬라이드
    const [isMemberListOpen, setIsMemberListOpen] = useState(false); //회원리스트
    const [isMemberManageOpen, setIsMemberManageOpen] = useState(false); //회원관리
    const [isClubManageOpen, setIsClubManageOpen] = useState(false); //동아리 관리

    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네,아니오 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달 메세지

    const [isClubPresident, setIsClubPresident] = useState(false);
    const [studentId, setStudentId] = useState(null);

    // 회원 정보를 조회하는 API 호출
    useEffect(() => {
        apiClient.get(`/members/${memberId}`)
            .then(response => {
                setMember(response.data);
                if (response.data.id === parseInt(memberId)) {
                    setStudentId(response.data.studentId);
                }
            })
            .catch(error => {
                console.error('회원정보 조회 중 에러 발생', error);
            });
    }, [memberId]);

    //햄버거탭에서 회원리스트 조회 및 회장 여부 확인
    useEffect(() => {
        const fetchClubMembers = async () => {
            try {
                const response = await apiClient.get(`/clubs/${id}/clubMember`);
                const members = response.data;
                ///setClubMembers(members);

                // 로그인 중인 멤버의 상태를 찾아 회장 여부를 확인
                const loggedInMember = members.find(member => member.studentId === studentId);
                if (loggedInMember?.status === "CLUB_PRESIDENT") {
                    setIsClubPresident(true);
                } else {
                    setIsClubPresident(false);
                }

                const sortedMembers = members.sort((a, b) => {
                    if (a.status === "CLUB_PRESIDENT") return -1;
                    if (b.status === "CLUB_PRESIDENT") return 1;
                    return 0;
                });
                setClubMembers(sortedMembers);
            } catch (error) {
                console.error('동아리 회원 리스트 조회 중 에러 발생', error);
            }
        };
        if (studentId) {
            fetchClubMembers();
        }
    }, [id, studentId]);

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
        if (isClubPresident) {
            setIsMemberManageOpen(!isMemberManageOpen);
        } else {
            alert("동아리 회장만 접근 가능합니다.");
        }
    };

    //동아리관리 토글
    const toggleClubManage = (e) => {
        e.stopPropagation();
        if (isClubPresident) {
            setIsClubManageOpen(!isClubManageOpen);
        } else {
            alert("동아리 회장만 접근 가능합니다.");
        }
    };

    const handleClubInfoEdit = () => {
        if (isClubPresident) {
            navigate(`/clubs/${id}/changeclubinfo`, { state: { isMenuOpen: true } });
        }
    };

    const handleClubDelete = () => {
        //구현
    };

    // 네/아니오 모달창 open
    const handleOpenDeleteModal = useCallback((message) => {
        setModalMessage(message);
        setShowDeleteModal(true);
    }, []);

    // 네/아니오 모달창 close
    const handleCloseDeleteModal = () => setShowDeleteModal(false);

    return (
        <>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>{clubName}</div>
                <RxHamburgerMenu
                    style={{fontSize: '24px', strokeWidth: '0.3', cursor: 'pointer'}}
                    onClick={toggleMenu}
                />
            </div>
            {isMenuOpen && <div className="overlay" onClick={closeMenu}></div>}
            <div className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="slide-menu-content">
                    <div className="member-info">
                        <h2>{member.name}</h2>
                        <p>{member.studentId}</p>
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
                                {clubMembers.map((member, index) => (
                                    <div key={index} className="member-item">
                                        <div>{member.studentId} {member.name} {member.status === "CLUB_PRESIDENT" && "(회장)"}</div>
                                    </div>
                                ))}
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
                                <div className="manage-item" onClick={() => navigate('/clubs/etc1/atd')}>회원 출석 관리</div>
                                <div className="manage-item" onClick={() => navigate(`/clubs/${id}/joinRequest`)}>가입 신청 현황</div>
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
                        {isClubPresident && isClubManageOpen && (
                            <div className="club-manage-list">
                                <div className="manage-item" onClick={handleClubInfoEdit}>동아리 정보 수정</div>
                                <div className="manage-item" onClick={handleClubDelete}>동아리 삭제</div>
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