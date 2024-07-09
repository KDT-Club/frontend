import React, { useState, useEffect } from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams} from "react-router-dom";
import { MdOutlineManageAccounts, MdOutlinePerson, MdOutlineSettings } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { MdOutlineKeyboardDoubleArrowRight, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import clubmemberData from '../data/clubmemberData.jsx';
import memberInfo from "../data/memberInfo.jsx";

function MyclubHeader({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find(club => club.clubId === parseInt(id));
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMemberListOpen, setIsMemberListOpen] = useState(false);
    const [clubMembers, setClubMembers] = useState([]);

    useEffect(() => {
        //clubmemberData.jsx에서 회원 memberId get
        const getMemberId = clubmemberData.filter(member => member.clubId === parseInt(id));

        //회원 이름 get
        const getMemberName = getMemberId.map(clubMember => {
            const memberName = memberInfo.find(member => member.memberId === clubMember.memberId);
            return memberName ? memberName.name : "회원이 없습니다.";
        })

        setClubMembers(getMemberName);
    }, [id]);

    const handleBackClick = () => {
        navigate('/clubs');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleMemberList = (e) => {
        e.stopPropagation();
        setIsMemberListOpen(!isMemberListOpen);
    };

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
                        <h2>최자두</h2>
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
                            </div>
                        )}
                        <div className="li-container">
                            <div className="li-container-left">
                                <MdOutlineManageAccounts style={{fontSize: "27px"}}/>
                                <li>회원 관리</li>
                            </div>
                            <MdOutlineKeyboardDoubleArrowRight
                                style={{marginRight: "20px", fontSize: "28px"}}/>
                        </div>
                        <div className="li-container">
                            <div className="li-container-left">
                                <MdOutlineSettings style={{fontSize: "27px"}}/>
                                <li>동아리 관리</li>
                            </div>
                            <MdOutlineKeyboardDoubleArrowRight
                                style={{marginRight: "20px", fontSize: "28px"}}/>
                        </div>
                    </div>
                    <div className="leave-club">
                        <div className="leave-club-line">
                            <li style={{marginRight: "10px", fontSize: "15px", te: "center"}}>동아리 탈퇴하기</li>
                            <TbDoorExit style={{fontSize: "25px"}}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyclubHeader;