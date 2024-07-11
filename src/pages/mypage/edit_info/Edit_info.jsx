import React, {useState} from "react";
import './edit_info.css';
import {Link} from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import propyl from "../../../images/propyl.png";

function Edit_info() {
    const [data, setData] = useState({
        name: "도라에몽",
        major: "컴퓨터공학부",
        password: "1234"
    });

    const Change = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="Edit_info">
            <div className="header">
                <Link to="/members">
                    <FaArrowLeft style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer' }} />
                </Link>
                <p>정보 수정</p>
            </div>
            <div className="edit">
                <Link to="#">
                    <img src={propyl} />
                    <MdOutlineCameraAlt className="camera_icon" />
                </Link>
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
            <Link to="/members">
                <button>수정하기</button>
            </Link>
        </div>
    )
}

export default Edit_info;