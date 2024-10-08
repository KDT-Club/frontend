import React, { useEffect, useState } from "react";
import './footer.css';
import { FaRegBookmark } from 'react-icons/fa';
import { PiUsersThree } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { LuUserSquare } from "react-icons/lu";
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";

function Footer() {
    const location = useLocation();
    const [memberId, setMemberId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("/api/getUserId", {
                    withCredentials: true
                });
                console.log(response.data);
                setMemberId(response.data.message);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Unauthorized access. Please log in.');
                } else {
                    console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                    alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
                }
            }
        };

        fetchUserId();
    }, []);

    // 현재 경로에 맞춰 활성화된 메뉴를 결정
    const determineActiveMenu = () => {
        if (location.pathname === "/main") {
            return "/main";
        } else if (location.pathname.startsWith("/community")) {
            return "/community";
        } else if (location.pathname.startsWith("/clubs")) {
            return "/clubs";
        } else if (location.pathname.startsWith("/members")) {
            return `/members/${memberId}`;
        } else {
            return "/main";
        }
    };

    const [activeMenu, setActiveMenu] = useState(determineActiveMenu());

    useEffect(() => {
        setActiveMenu(determineActiveMenu());
    }, [location, memberId]);

    return (
        <div className="Footer">
            <Menu
                to="/main"
                Icon={IoHomeOutline}
                title="홈"
                iconStyle={{ fontSize: "30px", marginTop: "2px" }}
                textStyle={{ marginTop: "2px" }}
                isActive={activeMenu === "/main"}
                onClick={() => setActiveMenu("/main")}
            />
            <Menu
                to="/community"
                Icon={PiUsersThree}
                title="커뮤니티"
                iconStyle={{ fontSize: "33px", marginLeft: "6px" }}
                textStyle={{ marginTop: "2px" }}
                isActive={activeMenu === "/community"}
                onClick={() => setActiveMenu("/community")}
            />
            <Menu
                to={`/clubs?memberId=${memberId}`}
                Icon={FaRegBookmark}
                title="내 동아리"
                iconStyle={{ fontSize: "27px", marginTop: "1px", marginLeft: "12px" }}
                textStyle={{ marginTop: "6px" }}
                isActive={activeMenu === "/clubs"}
                onClick={() => setActiveMenu("/clubs")}
            />
            <Menu
                to={`/members/${memberId}`}
                Icon={LuUserSquare}
                title="마이페이지"
                iconStyle={{ fontSize: "30px", marginLeft: "15px" }}
                textStyle={{ marginTop: "5px" }}
                isActive={activeMenu === `/members/${memberId}`}
                onClick={() => setActiveMenu(`/members/${memberId}`)}
            />
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
