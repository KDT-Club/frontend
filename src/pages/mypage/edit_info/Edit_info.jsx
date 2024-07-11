import React, {useState} from "react";
import './edit_info.css';
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import member_info_data from "../../../data/member_info_data.jsx";

function Edit_info() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));
    const [data, setData] = useState({
        img: member.img,
        name: member.name,
        memberId: member.memberId,
        major: member.major,
        password: member.password
    });

    const Change = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = () => {
        navigate(`/members/${data.memberId}`);
    };

    return (
        <div className="Edit_info">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer' }}
                    onClick={() => navigate(-1)}
                />
                <p>정보 수정</p>
            </div>
            <div className="edit">
                <img src={data.img} />
                <MdOutlineCameraAlt className="camera_icon" />
                <div className="information">
                    <div className="name">
                        <p>이름</p>
                        <input type="text" name="name" value={data.name} onChange={Change}/>
                    </div>
                    <div className="major">
                        <p>학과</p>
                        <input type="text" name="major" value={data.major} onChange={Change} />
                    </div>
                    <div className="password">
                        <p>비밀번호 변경</p>
                        <input type="password" name="password" value={data.password} onChange={Change}/>
                        <div className="check-icon">
                            <FaCheck/>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleSave}>수정하기</button>
        </div>
    )
}

export default Edit_info;