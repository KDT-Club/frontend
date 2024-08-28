import React, { useCallback, useEffect, useState } from "react";
import './edit_info.css';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineCameraAlt } from "react-icons/md";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import styled from "styled-components";

function Edit_info() {
    const navigate = useNavigate();
    const { memberId } = useParams();

    const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47.5px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 0px;
`;

    const apiClient = axios.create({
        baseURL: '/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // member 데이터 관리
    const [data, setData] = useState({
        id: "",
        name: "",
        department: "",
        studentId: "",
        password: "",
        memberImageURL: "",
        phone: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [showOkModal, setShowOkModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    // 회원 정보 조회
    useEffect(() => {
        apiClient.get(`/members/${memberId}`)
            .then(response => {
                setData({
                    id: response.data.id,
                    name: response.data.name,
                    department: response.data.department,
                    studentId: response.data.studentId,
                    password: response.data.password,
                    memberImageURL: response.data.memberImageURL,
                    phone: response.data.phone
                });
            })
            .catch(error => {
                console.error('회원 정보 조회 중 오류 발생:', error);
            });
    }, [memberId]);

    const Change = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModal(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModal(false);

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: { 'Content-Type': file.type },
                withCredentials: false
            });
            return presignedUrl.split("?")[0];
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            throw error;
        }
    };

    const handleUpdateInfo = async () => {
        try {
            let memberImageURL = data.memberImageURL;

            if (selectedFile) {
                memberImageURL = await uploadFileToS3(selectedFile);
            }

            const requestBody = {
                id: data.id,
                name: data.name,
                department: data.department,
                studentId: data.studentId,
                password: data.password,
                memberImageURL,
                phone: data.phone
            };

            await apiClient.post(`/members/${memberId}`, requestBody);
            handleOpenOkModal("수정이 완료되었습니다.", () => navigate(-1));
        } catch (error) {
            console.error('회원 정보 수정 중 오류 발생:', error);
            handleOpenOkModal("수정에 실패했습니다.<br>다시 시도해주세요.", () => {});
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setData(prevData => ({
            ...prevData,
            memberImageURL: URL.createObjectURL(file)
        }));
    };

    return (
        <div className="Edit_info">
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={() => navigate(`/members/${memberId}`)}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", textAlign: "left", marginRight: "123px"}}>정보 수정</div>
            </HeaderContainer>
            <div className="edit">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="upload"
                />
                <label htmlFor="upload" className="image-label">
                    <img src={data.memberImageURL} alt="profile" />
                    <MdOutlineCameraAlt className="camera_icon" />
                </label>
                <div className="information">
                    <div className="name">
                        <p>이름</p>
                        <input type="text" name="name" value={data.name} onChange={Change} />
                    </div>
                    <div className="major">
                        <p>학과</p>
                        <input type="text" name="department" value={data.department} onChange={Change} />
                    </div>
                    <div className="phone">
                        <p>전화번호</p>
                        <input type="text" name="phone" value={data.phone} onChange={Change} />
                    </div>
                    <div className="password">
                        <p>비밀번호 변경</p>
                        <input type="password" name="password" value={data.password} onChange={Change} />
                    </div>
                </div>
            </div>
            <button onClick={handleUpdateInfo}>수정하기</button>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    );
}

export default Edit_info;