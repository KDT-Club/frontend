//내 동아리 자유게시판 - 글 상세
import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import freeboardListData from '../data/freeboardListData.jsx';
import memberInfo from "../data/memberData.jsx";
import {FaArrowLeft} from 'react-icons/fa6';
import { FiMoreVertical } from "react-icons/fi";

function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}/${day}`;
}

function getMemberName(memberId) {
    const member = memberInfo.find(member => member.memberId === memberId);
    return member ? member.name : 'Unknown';
}

function BoardDetail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();
    const post = freeboardListData.find(post => post.postId === parseInt(postId));

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/board/4`);
    };

    const handleDotClick = () => {
        //클릭 시 작성자 본인이면 글수정or글삭제 팝업이 뜨도록.
    }

    return (
        <div className="whole">
            <div className="header_container">
                <FaArrowLeft
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>자유게시판</div>
                <FiMoreVertical
                    style={{fontSize: '26px', cursor: 'pointer'}}
                    onClick={handleDotClick}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    marginTop: "35px",
                    marginLeft: "30px"
                }}
            >
                <p
                    style={{
                        fontSize: "18px",
                        color: "darkgray",
                        fontWeight: "bold"
                    }}
                >{getMemberName(post.memberId)} | {formatDate(post.createdAt)}</p>
                <p
                    style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        paddingBottom: "12px",
                        textAlign: "start",
                        width: "100%"
                    }}
                >{post.title}</p>
                <p
                    style={{
                        fontSize: "18px",
                        marginTop: "20px",
                        textAlign: "start"
                    }}
                >{post.content}</p>
            </div>
            <div style={{borderBottom: "1px solid gray", marginTop: "50px"}}></div>
        </div>
    );
}

export default BoardDetail;