import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import '../headerHamburger/slide.css'
import '../noticeBoard/noticewrite.css';
import {useNavigate, useParams} from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
axios.defaults.withCredentials = true;

function FreeBoardWrite() {
    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store', // API URL
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    let {id} = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [uploading, setUploading] = useState(false); // 이미지 업로드 중 여부를 관리
    const [clubName, setClubName] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                withCredentials: false
            });
            return presignedUrl.split("?")[0];
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            throw error;
        }
    };

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setUploading(true);

        try {
            const newPreviewImages = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);

            const urls = await Promise.all(selectedFiles.map(file => uploadFileToS3(file)));
            setAttachmentNames(prevUrls => [...prevUrls, ...urls]);

            console.log('업로드된 이미지 URL들:', urls);
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setUploading(false);
        }
    };

    const handleImageDelete = (index) => {
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
        setAttachmentNames(prevUrls => prevUrls.filter((_, i) => i !== index));
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
            const response = await apiClient.post(`/club/${id}/board/4/posts`, {
                title,
                content,
                attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                attachment_names: attachmentNames,
                club_name: clubName,
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('글 작성 중 오류 발생:', error.response?.data || error.message);
            alert('글 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${id}/freeboardlist`);
    };

    const handleModalClose = () => setIsModalOpen(false);
    const handleModalConfirm = () => navigate(`/clubs/${id}/freeboardlist`);

    const handleFileInputClick = () => {
        fileInputRef.current.click();
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
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", color: "#414141"}}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{display: 'none'}}
                            ref={fileInputRef}
                        />
                        <button
                            type="button" onClick={handleFileInputClick}
                            style={{
                                cursor: 'pointer',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "center",
                            }}
                        >
                            <LuImagePlus style={{fontSize: '30px'}}/>
                            <span style={{marginLeft: "20px"}}>
                                {uploading ? "이미지 업로드 중..." : "첨부할 사진을 선택하세요."}
                            </span>
                        </button>
                    </div>
                </form>
                <div id="uploaded-images" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px'}}>
                    {previewImages.map((url, index) => (
                        <div key={index} style={{position: 'relative', width: '100px', height: '100px'}}>
                            <img
                                src={url}
                                alt={`uploaded ${index}`}
                                style={{width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #ddd'}}
                            />
                            <FiX
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    cursor: 'pointer',
                                    background: 'white',
                                    borderRadius: '50%',
                                    padding: '2px'
                                }}
                                onClick={() => handleImageDelete(index)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <Modal_ok
                    message="작성이 완료되었습니다."
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div>
    )
}

export default FreeBoardWrite;