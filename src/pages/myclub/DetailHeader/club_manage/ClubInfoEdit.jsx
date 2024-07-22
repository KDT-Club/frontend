import React, { useState, useEffect } from 'react';
import {FaArrowLeft} from "react-icons/fa6";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from 'axios';
import "./clubinfoedit.css";
import { RiImageCircleLine } from "react-icons/ri";


function ClubInfoEdit() {
    let { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [originalClubData, setOriginalClubData] = useState({
        clubImgUrl: '',
        clubName: '',
        clubSlogan: '',
        description: ''
    });
    
    const [clubData, setClubData] = useState({
        clubImgUrl: '',
        clubName: '',
        clubSlogan: '',
        description: ''
    });

    const [selectedImage, setSelectedImage] = useState(null); //선택한 이미지 상태 관리

    useEffect(() => {
        axios.get(`/clubs/${id}/changeClubInfo`)
            .then(response => {
                const { clubImgUrl, clubName, clubSlogan, description } = response.data;
                setClubData({ clubImgUrl, clubName, clubSlogan, description });//수정용 데이터
                setOriginalClubData({ clubImgUrl, clubName, clubSlogan, description });//원본 데이터
            })
            .catch(error => {
                console.error("동아리 정보 가져오는 중 에러 발생", error);
            });
    }, [id]);

    function isOtherInfoChanged() {
        return (
            clubData.clubName !== originalClubData.clubName ||
            clubData.clubSlogan !== originalClubData.clubSlogan ||
            clubData.description !== originalClubData.description
        );
    }

    function updateOtherInfo() { //이미지 말고 다른 정보들만 수정되었을 경우 사용되는 함수
        const updatedData = {
            clubName: clubData.clubName !== originalClubData.clubName ? clubData.clubName : "",
            description: clubData.description !== originalClubData.description ? clubData.description : "",
            clubSlogan: clubData.clubSlogan !== originalClubData.clubSlogan ? clubData.clubSlogan : "",
            clubImgUrl: "" // 이미지는 별도로 처리되므로 여기서는 빈 문자열로 설정
        };
        axios.put(`/clubs/${id}/changeClubInfo`, updatedData)
            .then(response => {
                console.log('동아리 정보가 수정되었습니다.', response.data);
                navigate(`/clubs/${id}`, { state: { isMenuOpen: location.state?.isMenuOpen } });
            })
            .catch(error => {
                console.error("동아리 정보 수정 중 에러 발생", error);
            });
    }

    const handleInputChange = (e) => { //input창 상태 업데이트 함수
        const { name, value } = e.target;
        setClubData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => { //새로운 이미지 선택했을 때 호출되는 함수
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/myclub`, { state: { isMenuOpen: location.state?.isMenuOpen } });
    };

    const handleSubmit = () => {
        // 이미지 변경 처리: 선택한 이미지가 있으면 FormData를 생성하여 전송
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);

            axios.post(`/clubs/${id}/changeClubImage`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                console.log('이미지가 성공적으로 변경되었습니다.', response.data);
                // 이미지 말고 다른 정보가 변경되었는지 확인
                if (isOtherInfoChanged()) {
                    updateOtherInfo();
                } else {
                    navigate(`/clubs/${id}`, {state: {isMenuOpen: location.state?.isMenuOpen}});
                }
            }).catch(error => {
                console.error('이미지 업로드 중 오류가 발생했습니다.', error);
            });
        } else if (isOtherInfoChanged()) {
            updateOtherInfo();
        } else {
            console.log('변경된 정보가 없습니다.');
            navigate(`/clubs/${id}/myclub`, {state: {isMenuOpen: location.state?.isMenuOpen}});
        }
    }

    return (
        <div>
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>동아리 정보 수정</div>
                <div></div>
            </div>
            <div className="clubinfo-edit-container">
                <div className="edit-container">
                    <label htmlFor="imageInput">
                        <RiImageCircleLine
                            style={{fontSize: '55px', cursor: 'pointer', marginBottom: "10px", marginLeft:"100px"}}
                        />
                        <div style={{fontSize: "16.5px"}}>변경할 대표 이미지를 선택하세요.</div>
                    </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{display: 'none'}}
                    />
                </div>
                <div className="edit-container-left">
                    <div className="edit-container-left-in">
                        <div className="edit-title">동아리 이름</div>
                        <input
                            type="text"
                            name="clubName"
                            value={clubData.clubName}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{width: "35%", height: "35px", textAlign: "center"}}
                        />
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">슬로건</div>
                        <textarea
                            name="clubSlogan"
                            value={clubData.clubSlogan}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{width: "60%", height: "70px"}}
                        />
                    </div>
                    <div className="edit-container-left-in">
                        <div className="edit-title">설명</div>
                        <textarea
                            name="description"
                            value={clubData.description}
                            onChange={handleInputChange}
                            className="edit-input-box"
                            style={{width: "60%", height: "250px"}}
                        ></textarea>
                    </div>
                </div>
                <button className="att-complete-button" style={{marginBottom: "20px"}} onClick={handleSubmit}>완료
                </button>
            </div>
        </div>
    );
}

export default ClubInfoEdit;