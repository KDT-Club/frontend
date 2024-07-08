import React, { useState } from 'react';
import './myclubheader.css'
import { FaArrowLeft } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import {useNavigate, useParams} from "react-router-dom";
import { MdOutlineManageAccounts, MdOutlinePerson, MdOutlineSettings } from "react-icons/md";
import { TbDoorExit } from "react-icons/tb";
import { MdOutlineKeyboardDoubleArrowRight, MdKeyboardArrowRight } from "react-icons/md";
//아래 화살표: MdKeyboardArrowDown

function MyclubHeader({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find(club => club.clubId === parseInt(id));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleBackClick = () => {
        navigate('/clubs');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
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
                        <div className="li-container">
                            <div className="li-container-left">
                                <MdOutlinePerson style={{fontSize: "27px"}}/>
                                <li>회원</li>
                            </div>
                            <MdKeyboardArrowRight
                                style={{marginRight: "20px", fontSize: "28px", cursor: "pointer"}}/>
                        </div>
                        <div className="li-container">
                            <div className="li-container-left">
                                <MdOutlineManageAccounts style={{fontSize: "27px"}}/>
                                <li>회원 관리</li>
                            </div>
                            <MdOutlineKeyboardDoubleArrowRight
                                style={{marginRight: "20px", fontSize: "28px", cursor: "pointer"}}/>
                        </div>
                        <div className="li-container">
                            <div className="li-container-left">
                                <MdOutlineSettings style={{fontSize: "27px"}}/>
                                <li>동아리 관리</li>
                            </div>
                            <MdOutlineKeyboardDoubleArrowRight
                                style={{marginRight: "20px", fontSize: "28px", cursor: "pointer"}}/>
                        </div>
                    </div>
                    <div className="leave-club">
                        <div className="li-container">
                            <div className="li-container-left">
                                <TbDoorExit style={{fontSize: "27px"}}/>
                                <li style={{marginRight: "20px"}}>동아리 탈퇴하기</li>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyclubHeader;