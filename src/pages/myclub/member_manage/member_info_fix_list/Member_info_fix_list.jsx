import React, {useEffect, useState} from "react";
import './member_info_fix_list.css';
import {Link, useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";
import { FaPlus } from "react-icons/fa6";
import memberInfo from "../../data/memberInfo.jsx";

function Member_info_fix_list() {
    const navigate = useNavigate();
    let [list] = useState(member_info_data);

    return (
        <div className="Member_info_fix">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>회원 정보 수정</p>
            </div>
            <div className="member_info_list">
                <h2>멤버 리스트</h2>
                {
                    list.map((a, i) => {
                        return (
                            <List key={i} img={a.img} name={a.name} role={a.role} memberId={a.memberId}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({ img, name, role, memberId }) {
    return (
        <div className="member_info_item">
            <img src={img} alt={name} />
            <div className="member_info">
                <p className="name">{name}</p>
                <p className="role">{role}</p>
            </div>
            <Link to={`/memberInfoFix/${memberId}`}>
                <FaPlus className="plus_icon" />
            </Link>
        </div>
    );
}

export default Member_info_fix_list;