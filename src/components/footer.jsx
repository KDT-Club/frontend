import React from "react";
import '../styles/footer.css';
import { FaRegBookmark } from 'react-icons/fa';
import { BsPersonBadge } from "react-icons/bs";
import { PiUsersThree } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";

function Footer() {
    return (
        <div className="Footer">
            <div className="menu">
                <IoHomeOutline style={{fontSize:"30px", marginTop:"2px"}} />
                <p style={{marginTop:"2px"}}>홈</p>
            </div>
            <div className="menu">
                <PiUsersThree style={{fontSize:"33px"}} />
                <p style={{marginTop:"2px"}}>커뮤니티</p>
            </div>
            <div className="menu">
                <FaRegBookmark style={{fontSize:"27px", marginTop:"1px"}} />
                <p style={{marginTop:"6px"}}>내 동아리</p>
            </div>
            <div className="menu">
                <BsPersonBadge style={{fontSize:"27px"}} />
                <p style={{marginTop:"7px"}}>마이페이지</p>
            </div>
        </div>
    )
}

export default Footer;