import React, { useState } from 'react';
import '../../DetailHeader/myclubheader.css'
import { FiX, FiCheck } from "react-icons/fi";
import './noticewrite.css';
import axios from 'axios';
import {useNavigate, useParams} from "react-router-dom";


function NoticeWrite({clubs}) {
    let { id } = useParams();
    const navigate = useNavigate();
    const club = clubs.find(club => club.clubId === parseInt(id));
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    // 제목 입력
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };
    // 내용 입력
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    // 글쓰기 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 기본 동작 방지

        try {
            const response = await axios.post('', {
                title: title,
                content: content
            });

            console.log('글쓰기 요청 성공:', response.data);
            // 데이터 백엔드에 전송한 후 추가적인 처리
        } catch (error) {
            console.error('글쓰기 요청 실패:', error);
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/board/2`);
    };

    return (
        <div className="whole">
            <div className="header_container">
                <FiX
                    style={{fontSize: '27px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '22px', fontWeight: "bold"}}>공지사항 글쓰기</div>
                <FiCheck
                    style={{fontSize: '27px', cursor: 'pointer'}}
                    onClick={handleSubmit}
                />
            </div>
            <div className='write_container'>
                <input
                    type="text"
                    className="notice_title"
                    placeholder="제목"
                    value={title}
                    onChange={handleTitleChange}
                />
                <textarea
                    className="notice_content"
                    placeholder="내용을 입력하세요."
                    rows={10}
                    value={content}
                    onChange={handleContentChange}
                ></textarea>
            </div>
        </div>
    )
}

export default NoticeWrite;