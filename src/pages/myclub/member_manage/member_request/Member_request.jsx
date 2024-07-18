import React, {useState} from "react";
import './member_request.css';
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft, FaXmark, FaCheck} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";

function Member_request() {
    let { id } = useParams();
    const navigate = useNavigate();
    let [list] = useState(member_info_data);

    return (
        <div className="Member_request">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px'}}
                    onClick={() => navigate(-1)}
                />
                <p>가입 신청 현황</p>
            </div>
            <div className="request_member_list">
                {
                    list.map((a, i) => {
                        return (
                            <List
                                key={i}
                                memberImageURL={a.memberImageURL}
                                name={a.name}
                                department={a.department}
                                studentId={a.studentId}
                                link={a.link.replace(":id", id)}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({memberImageURL, name, department, studentId, link}) {
    const navigate = useNavigate();
    return (
        <div className="member_request_item">
            <img src={memberImageURL} alt={name} onClick={() => navigate(link)}/>
            <div className="member_info" onClick={() => navigate(link)}>
                <p className="name">{name}</p>
                <p className="major_studentNum">{department} {studentId}</p>
            </div>
            <div className="icons">
                <FaXmark className="icon"/>
                <FaCheck className="icon"/>
            </div>
        </div>
    )
}

export default Member_request;