import React, {useState, useEffect, useCallback} from 'react';
import './slide.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import { MdOutlinePerson, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import Modal_confirm from "../../../components/modal/Modal_confirm.jsx";
import axios from "axios";
import MemberManagement from './MemberManagement.jsx';
import ClubManagement from './ClubManagement';
import styled from "styled-components";

axios.defaults.withCredentials = true;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
`;

function Slide({ clubName }) {
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
                        <ProfileImage src={member.memberImageURL} alt={member.name}/>
                        <h3>{member.name}</h3>
                        <p>{member.studentId}</p>
                    </div>
                    <div className="menu-items">
                        <div className="li-container" onClick={toggleMemberList}>
                            <div className="li-container-left">
                                <MdOutlinePerson style={{fontSize: "27px"}}/>
                                <li>회원</li>
                            </div>
                            {isMemberListOpen ? (
                                <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}}/>
                            ) : (
                                <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}}/>
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
                        <MemberManagement id={id} isClubPresident={isClubPresident}/>
                        <ClubManagement id={id} isClubPresident={isClubPresident}/>
                    </div>
                    <div className="leave-club" onClick={() => handleOpenDeleteModal("동아리에서 탈퇴하시겠습니까?")}>
                        <div className="leave-club-line">
                            <li style={{marginRight: "10px", fontSize: "14px", te: "center"}}>동아리 탈퇴하기</li>
                            <TbDoorExit style={{fontSize: "23px"}}/>
                        </div>
                    </div>
                </div>
                {showDeleteModal && <Modal_confirm onClose={handleCloseDeleteModal} message={modalMessage} link="/"/>}
            </div>
        </>
    );

}

export default Slide;