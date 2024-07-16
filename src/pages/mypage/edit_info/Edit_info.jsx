import React, {useCallback, useEffect, useState} from "react";
import './edit_info.css';
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import member_info_data from "../../../data/member_info_data.jsx";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function Edit_info() {
    const navigate = useNavigate();
    const { memberId } = useParams();

    // 여기부터
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));
    const [data, setData] = useState({
        img: member.img,
        name: member.name,
        memberId: member.memberId,
        major: member.major,
        phone: member.phone,
        password: member.password
    });
    // 여기까지 임의로 memberId 설정 -> 나중에 삭제

    // member 데이터 관리
//    const [data, setData] = useState({
//        img: "",
//        name: "",
//        memberId: "",
//        major: "",
//        password: ""
//    });

    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    // 회원 정보 조회
//    useEffect(() => {
//        // 회원 정보를 조회하는 API 호출
//        axios.get(`/members/${memberId}`)
//            .then(response => {
//                setData({
//                    img: response.data.img,
//                    name: response.data.name,
//                    memberId: response.data.memberId,
//                    major: response.data.major,
//                    password: response.data.password
//                });
//            })
//            .catch(error => {
//                console.error('Error fetching member data:', error);
//            });
//    }, [memberId]);

    const Change = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () =>{
        setShowOkModel(false);
    };

//    const handleUpdateInfo = () => {
//        axios.put(`/members/${memberId}`, data)
//            .then(response => {
//                handleOpenOkModal("수정이 완료되었습니다.", () => navigate(-1));
//            })
//            .catch(error => {
//                console.error('Error updating member data:', error);
//                handleOpenOkModal("수정에 실패했습니다. 다시 시도해주세요.", () => {});
//            });
//    };

    return (
        <div className="Edit_info">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
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
                        <input type="text" name="major" value={data.major} onChange={Change}/>
                    </div>
                    <div className="phone">
                        <p>전화번호</p>
                        <input type="text" name="phone" value={data.phone} onChange={Change}/>
                    </div>
                    <div className="password">
                        <p>비밀번호 변경</p>
                        <input type="password" name="password" value={data.password} onChange={Change}/>
                    </div>
                </div>
            </div>
            <button onClick={() => handleOpenOkModal("수정이 완료되었습니다.", () => navigate(-1))}>수정하기</button>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

export default Edit_info;