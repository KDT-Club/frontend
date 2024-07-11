import React, {useState} from "react";
import "./member_info_fix.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import member_info_data from "../../../../data/member_info_data.jsx";
import Modal_confirm from "../../../../components/modal/Modal_confirm.jsx";

function Member_info_fix() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const member = member_info_data.find(m => m.memberId === parseInt(memberId));

    const [role, setRole] = useState(member?.role || '');
    const [showDeleteModal, setShowDeleteModel] = useState(false);
    const [modalMessage, setModelMessage] = useState("");

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    }

    const handleOpenModal = (message) => {
        setModelMessage(message);
        setShowDeleteModel(true);
    }
    const handleCloseModal = () => setShowDeleteModel(false);

    return (
        <div className="Member_info_fix">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>회원 정보 수정</p>
            </div>
            {member && (
                <div className="member_info_detail">
                    <img src={member.img} alt={member.name}/>
                    <p className="name">{member.name}</p>
                    <p className="studentNum">학번: {member.studentNum}</p><br/>
                    <div className="role">직책<br/>
                        <button
                            className={`role-button ${role === '회장' ? 'role-president' : ''}`}
                            onClick={() => handleRoleChange('회장')}
                        >
                            회장
                        </button>
                        <button
                            className={`role-button ${role === '부회장' ? 'role-vice-president' : ''}`}
                            onClick={() => handleRoleChange('부회장')}
                        >
                            부회장
                        </button>
                        <button
                            className={`role-button ${role === '일반' ? 'role-general' : ''}`}
                            onClick={() => handleRoleChange('일반')}
                        >
                            일반
                        </button>
                    </div>
                    <div className="phone">전화번호
                        <p className="phoneNum">{member.phone}</p>
                    </div>
                    <div className="major">전공<br/>
                        <p className="majorName">{member.major}</p>
                    </div>
                </div>
            )}
            <div className="buttons">
                <button className="out" onClick={() => handleOpenModal("동아리에서 탈퇴시키겠습니까?")}>회원 탈퇴</button>
                <Link to="/memberInfoFixList">
                    <button className="fix">수정하기</button>
                </Link>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} link="/memberInfoFixList" />}
        </div>
    )
}

export default Member_info_fix;