import React, {useCallback, useState} from "react";
import './create_club.css';
import axios from "axios";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

function Create_club() {
    const navigate = useNavigate();
    const {memberId} = useParams();
    let category_id = ["sport", "scholarship", "literature", "service", "entertain", "new"];
    let category_list = ["체육", "학술", "문학", "봉사", "예체능", "신설"];

    const [showOkModal, setShowOkModel] = useState(false);  // OK 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [onConfirm, setOnConfirm] = useState(() => () => {}); // OK 버튼 클릭 시 연결할 링크


    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () =>{
        setShowOkModel(false);
    }

    return (
        <div className="Create_club">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>동아리 만들기</p>
            </div>
            <div className="form">
                <div className="image">
                    <CiCirclePlus style={{fontSize: "55px", display: "flex", float: "left", position: "relative"}}/>
                    <div className="add_club_picture">
                        <p style={{fontSize: "16px", fontWeight: "bold"}}>동아리 프로필 사진</p>
                        <p style={{fontSize: "11px", color: "gray"}}>대표 이미지를 선택해주세요.</p>
                    </div>
                </div>
                <div className="add_club_info">
                    <p>동아리 이름</p>
                    <input type="text" placeholder="소수정예 전략 보드게임 동아리"/>
                    <p>동아리 슬로건</p>
                    <input type="text" placeholder="5기 곰돌이가 서울에 상륙하였습니다!"/>
                    <div style={{marginBottom: "4px"}}>
                        <p style={{marginBottom: "1px"}}>카테고리</p>
                        {
                            category_list.map((a, i) => {
                                return (
                                    <List key={category_id[i]} id={category_id[i]} name={category_list[i]}/>
                                )
                            })
                        }
                    </div>
                    <p>동아리 설명</p>
                    <textarea placeholder="활동 내용, 활동 위치 등"/>
                    <div className="content_picture">
                        <p>사진 추가</p>
                    </div>
                </div>
                <button onClick={() => handleOpenOkModal("생성 완료 / 생성 불가", () => {navigate("/members/" + memberId)})}>만들기</button>
            </div>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

function List({ id, name }) {
    return (
        <label className="category_radio">
            <input type="radio" id={id} name="club_category" />{name}
        </label>
    )
}

export default Create_club;

/* API 연결 전체 코드
import React, { useCallback, useState } from "react";
import './create_club.css';
import axios from "axios";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

function Create_club() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const category_id = ["sport", "scholarship", "literature", "service", "entertain", "new"];
    const category_list = ["체육", "학술", "문학", "봉사", "예체능", "신설"];

    // 상태 정의
    const [clubData, setClubData] = useState({
        clubName: "",
        clubSlogan: "",
        description: "",
        category: "",
        clubImgUrl: ""
    });
    const [selectedFile, setSelectedFile] = useState(null);  // 이미지 파일 상태
    const [showOkModal, setShowOkModel] = useState(false);  // OK 모달창 띄우기
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [onConfirm, setOnConfirm] = useState(() => () => {}); // OK 버튼 클릭 시 연결할 링크

    // 모달창 열기
    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    // 모달창 닫기
    const handleCloseOkModal = () => setShowOkModel(false);

    // 입력 값 변경
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClubData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // 파일 선택
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setClubData(prevData => ({
            ...prevData,
            clubImgUrl: URL.createObjectURL(file)  // 선택한 이미지 파일의 URL 생성
        }));
    };

    // 카테고리 선택
    const handleCategoryChange = (e) => {
        setClubData(prevData => ({
            ...prevData,
            category: e.target.id
        }));
    };

    // 폼 제출
    const handleSubmit = () => {
        if (!clubData.clubName || !clubData.clubSlogan || !clubData.description || !clubData.category || !clubData.clubImgUrl) {
            handleOpenOkModal("모든 필드를 입력해주세요.", () => {});
            return;
        }

        // FormData 객체 생성
        const formData = new FormData();
        formData.append("clubName", clubData.clubName);
        formData.append("clubSlogan", clubData.clubSlogan);
        formData.append("description", clubData.description);
        formData.append("category", clubData.category);
        formData.append("image", selectedFile);

        // API 호출
        axios.post(`/clubs/create/${memberId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            handleOpenOkModal("동아리가 성공적으로 생성되었습니다!", () => navigate(`/members/${memberId}`));
        })
        .catch(error => {
            console.error('Error creating club:', error);
            handleOpenOkModal("동아리 생성에 실패했습니다. 다시 시도해주세요.", () => {});
        });
    };

    return (
        <div className="Create_club">
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={() => navigate(-1)}
                />
                <p>동아리 만들기</p>
            </div>
            <div className="form">
                <div className="image">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="upload"
                    />
                    <label htmlFor="upload">
                        <CiCirclePlus style={{ fontSize: "55px", display: "flex", float: "left", position: "relative" }} />
                    </label>
                    <div className="add_club_picture">
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>동아리 프로필 사진</p>
                        <p style={{ fontSize: "11px", color: "gray" }}>대표 이미지를 선택해주세요.</p>
                    </div>
                </div>
                <div className="add_club_info">
                    <p>동아리 이름</p>
                    <input
                        type="text"
                        name="name"
                        value={clubData.clubName}
                        onChange={handleInputChange}
                        placeholder="소수정예 전략 보드게임 동아리"
                    />
                    <p>동아리 슬로건</p>
                    <input
                        type="text"
                        name="slogan"
                        value={clubData.clubSlogan}
                        onChange={handleInputChange}
                        placeholder="5기 곰돌이가 서울에 상륙하였습니다!"
                    />
                    <div style={{ marginBottom: "4px" }}>
                        <p style={{ marginBottom: "1px" }}>카테고리</p>
                        {
                            category_list.map((name, i) => {
                                return (
                                    <List
                                        key={category_id[i]}
                                        id={category_id[i]}
                                        name={name}
                                        onChange={handleCategoryChange}
                                    />
                                )
                            })
                        }
                    </div>
                    <p>동아리 설명</p>
                    <textarea
                        name="description"
                        value={clubData.description}
                        onChange={handleInputChange}
                        placeholder="활동 내용, 활동 위치 등"
                    />
                    <div className="content_picture">
                        <p>사진 추가</p>
                    </div>
                </div>
                <button onClick={handleSubmit}>만들기</button>
            </div>
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

function List({ id, name, onChange }) {
    return (
        <label className="category_radio">
            <input
                type="radio"
                id={id}
                name="club_category"
                onChange={onChange}
            />
            {name}
        </label>
    )
}

export default Create_club;
 */
