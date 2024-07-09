import React, {useState} from "react";
import './member_manage_main.css';
import member_manage_data from "./member_manage_data.jsx";
import {Link} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";

function Member_manage_main() {
    let [list] = useState(member_manage_data);
    return (
        <div className="Member_manage_main">
            <div className="header">
                <Link to="#">
                    <FaArrowLeft style={{fontSize: '20px', strokeWidth: '0.1', cursor: 'pointer'}}/>
                </Link>
                <p>회원 관리</p>
            </div>
            <div className="member_manage_list">
                {
                    list.map((a, i) => {
                        return (
                            <List key={i} title={a.title} link={a.link}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({title, link}) {
    return (
        <div className="member_manage_item">
            <Link to={link}>
                <p className="title">{title}</p>
            </Link>
        </div>
    )
}

export default Member_manage_main;