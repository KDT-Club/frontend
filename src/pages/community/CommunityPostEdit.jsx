import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft } from "react-icons/fa6";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";

const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

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

function CommunityPostEdit() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [deletedAttachments, setDeletedAttachments] = useState([]);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        fetchPostDetails();
    }, [postId]);

    const fetchPostDetails = async () => {
        try {
            const response = await apiClient.get(`/board/1/posts/${postId}`);
            setTitle(response.data.post.title);
            setContent(response.data.post.content);
            setAttachmentNames(response.data.attachmentNames || []);
            setPreviewImages(response.data.attachmentNames || []);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && content) {
            try {
                const response = await apiClient.put(`/posts/${postId}`, {
                    postId: parseInt(postId),
                    title,
                    content,
                    attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                    attachment_names: attachmentNames,  // 'name'에서 'names'로 변경
                });

                if (response.status === 200 || response.status === 201) {
                    console.log('Post updated successfully:', response.data);

                    // 삭제된 첨부 파일 처리
                    for (const deletedAttachment of deletedAttachments) {
                        await apiClient.delete(`/attachments/${deletedAttachment}`);
                    }

                    navigate(`/board/1/posts/${postId}`);
                } else {
                    throw new Error('Failed to update post');
                }
            } catch (error) {
                console.error('Error updating post:', error);
                alert('글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    const handleImageDelete = (index) => {
        const deletedAttachment = attachmentNames[index];
        setDeletedAttachments(prev => [...prev, deletedAttachment]);

        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
        setAttachmentNames(prevUrls => prevUrls.filter((_, i) => i !== index));
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <Whole>
            <HeaderContainer>
                <Icon as={FiX} onClick={() => navigate(`/board/1/posts/${postId}`)} />
                <HeaderTitle>글 수정</HeaderTitle>
                <Icon as={FiCheck} onClick={(e) => handleSubmit(e)} />
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
                id="fileInput"
            />
            <FileInputButton onClick={() => document.getElementById('fileInput').click()}>
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

export default CommunityPostEdit;