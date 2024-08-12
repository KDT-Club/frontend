import React, {useEffect, useState} from "react";
import './member_info_fix_list.css';
import {useNavigate, useParams} from "react-router-dom";
import {FaArrowLeft} from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import styled from "styled-components";

function Member_info_fix_list() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const { id } = useParams();

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
        baseURL: 'https://zmffjq.store', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 회원 정보를 조회하는 API 호출
    useEffect(() => {
        apiClient.get(`/clubs/${id}/clubMember`)
            .then(response => {
                setList(response.data);
            })
            .catch(error => {
                console.error('Error fetching member data:', error);
            });
    }, [id]);

    return (
        <div className="Member_info_fix">
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={() => navigate(`/clubs/${id}/myclub`)}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", textAlign: "left", marginRight: "110px"}}>회원 정보 수정</div>
            </HeaderContainer>
            <div className="member_info_list">
                <h2>멤버 리스트</h2>
                {
                    list.map((member, i) => {
                        return (
                            <List key={i} memberImageurl={member.memberImageurl} name={member.name} role={member.role} memberId={member.memberId}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

function List({ memberImageurl, name, role, memberId }) {
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="member_info_item">
            <img src={memberImageurl} alt={name} />
            <div className="member_info">
                <p className="name">{name}</p>
                <p className="role">{role}</p>
            </div>
            <FaPlus className="plus_icon" onClick={() => navigate(`/clubs/${id}/memberInfoFix/` + memberId)}/>
        </div>
    );
}

export default Member_info_fix_list;