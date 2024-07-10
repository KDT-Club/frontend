//내 동아리 자유게시판 - 글 상세
import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import postData from "../data/postData.jsx";
import memberInfo from "../data/memberInfo.jsx";
import commentData from '../data/commentData.jsx';
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

function FreeBoardDetail() {
    let {clubId, postId} = useParams();
    const navigate = useNavigate();
    const post = postData.find(post => post.postId === parseInt(postId) && post.boardId === 4);
    const comments = commentData.filter(comment => comment.postId === parseInt(postId));

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
                        fontSize: "20px",
                        color: "gray",
                        fontWeight: "bold",
                        marginBottom: "5px"
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
                        fontSize: "21px",
                        marginTop: "20px",
                        textAlign: "start"
                    }}
                >{post.content}</p>
            </div>
            <div style={{borderBottom: "1.5px solid dimgrey", marginTop: "40px"}}></div>
            <div className="comment-container">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment.commentId} className="comment-oneline">
                            <p style={{fontSize: '19px', color: 'gray', marginLeft: "30px", marginBottom: "5px"}}>
                                {getMemberName(comment.memberId)} | {formatDate(comment.createdAt)}
                            </p>
                            <p style={{
                                fontSize: '21px',
                                marginLeft: "30px",
                                marginBottom: "16px"
                            }}>{comment.content}</p>
                            <div style={{borderBottom: '1px solid gray', width: '100%'}}></div>
                        </div>
                    ))
                ) : (
                    <p style={{fontSize: '18px'}}>댓글이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default FreeBoardDetail;