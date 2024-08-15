import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";
import styled from "styled-components";

const Whole = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

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

const HeaderTitle = styled.div`
    font-size: 19px;
    font-weight: bold;
`;

const Icon = styled.div`
    font-size: 24px;
    cursor: pointer;
`;

const Title = styled.input`
    width: 100%;
    height: 50px;
    padding: 10px;
    font-size: 20px;
    margin-top: 35px;
    margin-bottom: 20px;
    border-left-width: 0;
    border-right-width: 0;
    border-top-width: 0;
    border-bottom: 1.5px solid #ccc;

    &:focus {
    outline: none;
    border-color: #597CA5;
    }
`;

const Content = styled.textarea`
    width: 100%;
    padding: 10px;
    font-size: 17px;
    margin-bottom: 20px;
    border: 1.5px solid #ccc;
    border-radius: 4px;

    &:focus {
    outline: none;
    border-color: #597CA5;
    }
`;

const FileInputButton = styled.button`
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #414141;
    width: 100%;
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`;

const ImagePreviewContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;
`;

const ImagePreview = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #ddd;
`;

const DeleteIcon = styled(FiX)`
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    background: white;
    border-radius: 50%;
    padding: 2px;
`;

function PostWrite({ boardType, apiEndpoint, navigateBackPath }) {
    const apiClient = axios.create({
        baseURL: 'https://zmffjq.store',
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
    });

    let { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [uploading, setUploading] = useState(false);
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

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: { 'Content-Type': file.type },
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
            // 활동 게시판 API의 경우 엔드포인트에 clubId가 이미 포함되어 있어서 apiEndpoint를 그대로 사용
            const endpoint = apiEndpoint.includes('/club/') ? apiEndpoint : `${apiEndpoint}/club/${id}/posts`;
            await apiClient.post(endpoint, {
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

    const handleBackClick = () => navigate(navigateBackPath);
    const handleModalClose = () => setIsModalOpen(false);
    const handleModalConfirm = () => navigate(navigateBackPath);
    const handleFileInputClick = () => fileInputRef.current.click();

    return (
        <Whole>
            <HeaderContainer>
                <Icon as={FiX} onClick={handleBackClick} />
                <HeaderTitle>{boardType} 글쓰기</HeaderTitle>
                <Icon as={FiCheck} onClick={handleSubmit} />
            </HeaderContainer>
            <form onSubmit={handleSubmit}>
                <Title
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={handleTitleChange}
                />
                <Content
                    placeholder="내용을 입력하세요."
                    rows={10}
                    value={content}
                    onChange={handleContentChange}
                />
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{display: 'none'}}
                    ref={fileInputRef}
                />
                <FileInputButton type="button" onClick={handleFileInputClick}>
                    <IconWrapper>
                        <LuImagePlus style={{fontSize: '30px', marginRight: "10px"}}/>
                        {uploading ? "이미지 업로드 중..." : "첨부할 사진을 선택하세요."}
                    </IconWrapper>
                </FileInputButton>
            </form>
            <ImagePreviewContainer>
                {previewImages.map((url, index) => (
                    <ImagePreview key={index}>
                        <PreviewImage src={url} alt={`uploaded ${index}`} />
                        <DeleteIcon onClick={() => handleImageDelete(index)} />
                    </ImagePreview>
                ))}
            </ImagePreviewContainer>
            {isModalOpen && (
                <Modal_ok
                    message="작성이 완료되었습니다."
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </Whole>
    );
}

export default PostWrite;