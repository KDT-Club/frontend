import React from "react";
import "./member_info_fix.css";
import {Link, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";

function Member_info_fix() {
    const { memberId } = useParams();
    const member = member_info_data.find(m => m.memberId === parseInt(memberId));

    return (
        <div className="Member_info_fix">
            <div className="header">
                <Link to="/memberInfoFixList">
                    <FaArrowLeft style={{fontSize: '20px', strokeWidth: '0.1', cursor: 'pointer'}}/>
                </Link>
                <p>회원 정보 수정</p>
            </div>
            {member && (
                <div className="member_info_detail">
                    <img src={member.img} alt={member.name}/>
                    <p className="name">{member.name}</p>
                    <p className="studentNum">학번: {member.studentNum}</p><br/>
                    <div className="role">직책<br/>
                        <button>회장</button>
                        <button>부회장</button>
                        <button>일반</button>
                    </div>
                    <div className="phone">전화번호
                        <p className="phoneNum">{member.phone}</p>
                    </div>
                    <div className="major">전공<br />
                        <p className="majorName">{member.major}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Member_info_fix;