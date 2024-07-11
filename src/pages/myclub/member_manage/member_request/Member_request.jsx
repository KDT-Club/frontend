import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";

function Member_request() {
    const navigate = useNavigate();
    let [list] = useState(member_info_data);

    return (
        <div className="Member_request">
            <div className="header">
                <FaArrowLeft
                    style={{fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer'}}
                    onClick={() => navigate(-1)}
                />
                <p>가입 신청 현황</p>
            </div>
            <div className="request_member_list">
                {
                    list.map((a, i) => {
                        return (
                            <List img={a.img} name={a.name} major={a.major} studentNum={a.studentNum} link={a.link} />
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({ img, name, major, studentNum, link }) {
    const navigate = useNavigate();
    return (
        <div className="request_member_item" onClick={() => navigate(link)}>
            <img src={img} />
            <p>{name}</p>
            <p>{major}</p>
            <p>{studentNum}</p>
        </div>
    );
}

export default Member_request;