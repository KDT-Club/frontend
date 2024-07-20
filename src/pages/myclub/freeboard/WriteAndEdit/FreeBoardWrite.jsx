import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../../DetailHeader/myclubheader.css'
import '../../notice/WriteAndEdit/noticewrite.css';
import {useNavigate, useParams} from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
axios.defaults.withCredentials = true;

function FreeBoardWrite() {
    let {id} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [uploading, setUploading] = useState(false); // 이미지 업로드 중 여부를 관리

    const [clubName, setClubName] = useState('');

    useEffect(() => {
        const storedClubName = localStorage.getItem(`clubName_${id}`);
        if (storedClubName) {
            setClubName(storedClubName);
        } else {
            alert('동아리 조회 실패. 다시 시도해주세요.');
        }
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
            const response = await axios.get(`https://zmffjq.store/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                }
            });
            return presignedUrl.split("?")[0]; // 이미지 URL 반환
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw error;
        }
    };

    // 첨부 파일 선택
    // const handleFileChange = async (e) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     const urls = await Promise.all(selectedFiles.map(file => getPresignedUrl(file)));
    //     setAttachmentNames(urls);
    // };
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setUploading(true);

        try {
            const urls = await Promise.all(selectedFiles.map(file => getPresignedUrl(file)));
            setAttachmentNames(urls);

            // 업로드된 이미지 표시
            const uploadedImagesDiv = document.getElementById('uploaded-images');
            uploadedImagesDiv.innerHTML = '';
            urls.forEach(url => {
                const imgElement = document.createElement('img');
                imgElement.src = url;
                imgElement.style.width = '100px';
                imgElement.style.height = '100px';
                imgElement.style.margin = '10px';
                uploadedImagesDiv.appendChild(imgElement);
            });
            console.log('업로드된 이미지 URL들:', urls);
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setUploading(false);
        }
    };

    // 글쓰기 폼 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clubName) {
            alert('동아리 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
            return;
        }

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`https://zmffjq.store/club/${id}/board/4/posts`, {
                title,
                content,
                attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                attachment_names: attachmentNames,
                club_name: clubName,
            });
            console.log('서버 응답:', response.data);
            alert('공지사항 작성 완료');
            navigate(`/clubs/${id}/freeboardlist`);
        } catch (error) {
            console.error('공지사항 작성 중 오류 발생:', error.response?.data || error.message);
            alert('글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/freeboardlist`);
    };

    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '19px', fontWeight: "bold"}}>자유게시판 글쓰기</div>
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
                        <div style={{marginLeft: "10px"}}>
                            {uploading ? (
                                <span>이미지 업로드 중...</span>
                            ) : (
                                <span>첨부할 사진을 선택하세요.</span>
                            )}
                        </div>
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

export default FreeBoardWrite;