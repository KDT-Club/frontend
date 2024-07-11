import React from "react";
import './create_club.css';
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { CiCirclePlus } from "react-icons/ci";

function Create_club() {
    const navigate = useNavigate();
    const { memberId } = useParams();
    let category_id = ["sport", "scholarship", "literature", "service", "entertain", "new"];
    let category_list = ["체육", "학술", "문학", "봉사", "예체능", "신설"];

    const handleSave = () => {
        navigate(`/members/${memberId}`);
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
                    <CiCirclePlus style={{ fontSize: "55px", display: "flex", float: "left", position: "relative" }} />
                    <div className="add_club_picture">
                        <p style={{ fontSize: "16px", fontWeight: "bold" }}>동아리 프로필 사진</p>
                        <p style={{ fontSize: "11px", color: "gray" }}>대표 이미지를 선택해주세요.</p>
                    </div>
                </div>
                <div className="add_club_info">
                    <p>동아리 이름</p>
                    <input type="text" placeholder="소수정예 전략 보드게임 동아리" />
                    <p>동아리 슬로건</p>
                    <input type="text" placeholder="5기 곰돌이가 서울에 상륙하였습니다!" />
                    <div style={{ marginBottom: "4px" }}>
                        <p style={{ marginBottom: "1px" }}>카테고리</p>
                        {
                            category_list.map((a, i) => {
                                return (
                                    <List key={category_id[i]} id={category_id[i]} name={category_list[i]} />
                                )
                            })
                        }
                    </div>
                    <p>동아리 설명</p>
                    <textarea placeholder="활동 내용, 활동 위치 등" />
                    <div className="content_picture">
                        <p>사진 추가</p>
                    </div>
                </div>
            </div>
            <button onClick={handleSave}>만들기</button>
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
