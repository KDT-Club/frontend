import React, { useState } from "react";
import './footer.css';
import { FaRegBookmark } from 'react-icons/fa';
import { PiUsersThree } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { LuUserSquare } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom';

function Footer() {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const memberId = 101;

    return (
        <div className="Footer">
            <Menu
                to="/main"
                Icon={IoHomeOutline}
                title="홈"
                iconStyle={{fontSize:"30px", marginTop:"2px"}}
                textStyle={{marginTop:"2px"}}
                isActive={activeMenu === "/main"}
                onClick={() => setActiveMenu("/main")}
            />
            <Menu
                to="/community"
                Icon={PiUsersThree}
                title="커뮤니티"
                iconStyle={{fontSize:"33px", marginLeft:"6px"}}
                textStyle={{marginTop:"2px"}}
                isActive={activeMenu === "/community"}
                onClick={() => setActiveMenu("/community")}
            />
            <Menu
                to="/clubs"
                Icon={FaRegBookmark}
                title="내 동아리"
                iconStyle={{fontSize:"27px", marginTop:"1px", marginLeft:"12px"}}
                textStyle={{marginTop:"6px"}}
                isActive={activeMenu === "/clubs"}
                onClick={() => setActiveMenu("/clubs")}
            />
            {memberId && (
                <Menu
                    to={`/members/${memberId}`}
                    Icon={LuUserSquare}
                    title="마이페이지"
                    iconStyle={{fontSize:"30px", marginLeft:"15px"}}
                    textStyle={{marginTop:"5px"}}
                    isActive={activeMenu === `/members/${memberId}`}
                    onClick={() => setActiveMenu(`/members/${memberId}`)}
                />
            )}
        </div>
    )
}

function Menu({ to, Icon, iconStyle, title, textStyle, isActive, onClick }) {
    const activeStyle = isActive ? { color: '#597CA5' } : { color: 'darkgray' };

    return (
        <div className="menu">
            <Link to={to} style={activeStyle} onClick={onClick}>
                <Icon style={{ ...iconStyle, ...activeStyle }} />
                <p style={{ ...textStyle, ...activeStyle }}>{title}</p>
            </Link>
        </div>
    )
}

export default Footer;
