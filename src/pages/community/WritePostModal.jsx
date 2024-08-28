import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FiX, FiCheck } from 'react-icons/fi';
import { LuImagePlus } from 'react-icons/lu';

const Whole = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    z-index: 1000;
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
    height: calc(100vh - 450px);

    &:focus {
        outline: none;
        border-color: #597CA5;
    }
`;

const FileInputButton = styled.button`
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #414141;
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

function WritePostModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        const newPreviewImages = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);

        const uploadPromises = selectedFiles.map(file => uploadFileToS3(file));
        const fileUrls = await Promise.all(uploadPromises);
        setAttachmentNames(prevUrls => [...prevUrls, ...fileUrls]);
    };

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await axios.get(`/api/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            return presignedUrl.split('?')[0];
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (title && content) {
            try {
                const postData = {
                    title,
                    content,
                    attachment_flag: files.length > 0 ? 'Y' : 'N',
                    attachment_names: attachmentNames,
                    club_name: '.' // 동아리 이름 대신 '.' 전송
                };
                const response = await fetch('/api/board/1/posts', {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Post created successfully:', responseData);
                    setTitle('');
                    setContent('');
                    setFiles([]);
                    setAttachmentNames([]);
                    setPreviewImages([]);
                    onSubmit(); // Call the onSubmit prop function to notify the parent component
                } else {
                    throw new Error('Failed to create post with status: ' + response.status);
                }
            } catch (error) {
                console.error('Error submitting post:', error);
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    const handleImageDelete = (index) => {
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
        setAttachmentNames(prevUrls => prevUrls.filter((_, i) => i !== index));
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleFileInputClick = () => fileInputRef.current.click();

    return (
        <Whole>
            <HeaderContainer>
                <Icon as={FiX} onClick={onClose} />
                <HeaderTitle>글쓰기</HeaderTitle>
                <Icon as={FiCheck} onClick={handleSubmit} />
            </HeaderContainer>
            <Title
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Content
                placeholder="내용을 입력하세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
                <LuImagePlus style={{fontSize: '30px'}}/>
                <span style={{marginLeft: "20px"}}>
                    첨부할 사진을 선택하세요.
                </span>
            </FileInputButton>
            <ImagePreviewContainer>
                {previewImages.map((url, index) => (
                    <ImagePreview key={index}>
                        <PreviewImage src={url} alt={`uploaded ${index}`} />
                        <DeleteIcon onClick={() => handleImageDelete(index)} />
                    </ImagePreview>
                ))}
            </ImagePreviewContainer>
        </Whole>
    );
}

export default WritePostModal;