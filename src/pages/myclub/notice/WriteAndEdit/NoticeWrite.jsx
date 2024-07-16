import React, { useState, useEffect } from 'react';
import axios from "axios";
import '../../DetailHeader/myclubheader.css'
import './noticewrite.css';
import {useNavigate, useParams} from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";

function NoticeWrite() {
    let { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);

    const [clubName, setClubName] = useState('');

    useEffect(() => {
        const fetchClubInfo = async () => {
            try {
                // 1. 현재 로그인한 사용자 정보 가져오기
                const userResponse = await axios.get(''); //로그인 정보 받을 수 있는 url
                const memberId = userResponse.data.memberId;

                // 2. 해당 사용자의 동아리 목록 가져오기
                const clubsResponse = await axios.get(`/clubs?memberId=${memberId}`);
                const clubs = clubsResponse.data;

                // 3. 현재 페이지의 id와 일치하는 동아리 찾고 clubName 얻기
                const club = clubs.find(club => club.clubId === parseInt(id));
                if (club) {
                    setClubName(club.clubName);
                } else {
                    throw new Error('해당 동아리를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('정보를 가져오는 중 오류 발생:', error);
                alert('정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchClubInfo();
    }, [id]);

    // 제목 입력
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // 내용 입력
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    // Presigned URL 요청 및 이미지 업로드
    const getPresignedUrl = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await axios.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });
            return presignedUrl.split("?")[0]; // 이미지 URL 반환
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            throw error;
        }
    };

    // 첨부 파일 선택
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const urls = await Promise.all(selectedFiles.map(file => getPresignedUrl(file)));
        setAttachmentNames(urls);
    };

    // 글쓰기 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clubName) {
            alert('동아리 정보를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침 후 다시 시도해주세요.');
            return;
        }
        try {
            const response = await axios.post(`/club${id}/board/2/posts`, {
                title,
                content,
                attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                attachment_names: attachmentNames,
                club_name: clubName,
            });
            if (response.status === 200 || response.status === 201) {
                alert('공지사항 작성 완료');
                navigate(`/clubs/${id}/noticelist`);
            }
        } catch (error) {
            console.error('공지사항 작성 중 오류 발생:', error);
            alert('글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/noticelist`);
    };

    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '19px', fontWeight: "bold"}}>공지사항 작성</div>
                <FiCheck
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleSubmit}
                />
            </div>
            <div className='write_container'>
                <form onSubmit={handleSubmit}>
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
                    <div
                        style={{display: "flex", justifyContent: "center", alignItems: "center", color: "#414141"}}>
                        <label>
                            <LuImagePlus style={{fontSize: '30px', cursor: 'pointer', marginLeft: "10px"}}/>
                            <input
                                type="file"
                                multiple
                                style={{display: 'none'}}
                                onChange={handleFileChange}
                            />
                        </label>
                        <div style={{marginLeft: "10px"}}>첨부할 사진을 선택하세요.</div>
                    </div>
                </form>
                <div id="uploaded-images">
                    {attachmentNames.map((url, index) => (
                        <img key={index} src={url} alt={`uploaded ${index}`}
                             style={{width: '100px', height: '100px', margin: '10px'}}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NoticeWrite;