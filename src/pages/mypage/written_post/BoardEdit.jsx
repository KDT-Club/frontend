import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import '../../myclub/headerHamburger/slide.css';
import '../../myclub/noticeBoard/noticewrite.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FiX, FiCheck } from 'react-icons/fi';
import { LuImagePlus } from 'react-icons/lu';
import Modal_ok from '../../../components/modal/Modal_ok.jsx';

axios.defaults.withCredentials = true;

function BoardEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [memberId, setMemberId] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploading, setUploading] = useState(false); // 이미지 업로드 중 여부
    const [isModalOpen, setIsModalOpen] = useState(false);

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await apiClient.get(`/postdetail/${postId}`);
                const post = response.data;
                setTitle(post.post.title);
                setContent(post.post.content);
                setAttachmentNames(post.attachmentNames || []);
            } catch (error) {
                console.error('게시글 정보 가져오는 중 오류 발생:', error);
                alert('게시글 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchPostData();
    }, [postId]);

    const fetchUserId = async () => {
        try {
            const response = await axios.get("http://localhost:8080/getUserId", {
                withCredentials: true,
            });
            setMemberId(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Unauthorized access. Please log in.');
            } else {
                console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);

    const uploadFileToS3 = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data;

            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                withCredentials: false,
            });
            return presignedUrl.split("?")[0];
        } catch (error) {
            console.error('Presigned URL 요청 또는 이미지 업로드 실패:', error);
            throw error;
        }
    };

    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        setSelectedFiles(prevSelectedFiles => [...prevSelectedFiles, ...selectedFiles]);

        const newPreviewImages = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prevImages => [...prevImages, ...newPreviewImages]);

        setUploading(true); // 업로드 진행 상태 표시

        try {
            const urls = await Promise.all(selectedFiles.map(file => uploadFileToS3(file)));
            setAttachmentNames(prevUrls => [...prevUrls, ...urls]);
            console.log('업로드된 이미지 URL들:', urls);
        } catch (error) {
            console.error('이미지 업로드 중 오류 발생:', error);
            alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setUploading(false); // 업로드 완료 상태로 변경
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const attachmentFlag = attachmentNames.length > 0 ? 'Y' : 'N';
            console.log('Attachment flag:', attachmentFlag);

            const response = await apiClient.put(`/posts/${postId}`, {
                postId,
                title,
                content,
                attachment_flag: attachmentFlag,
                attachment_names: attachmentNames,
            });

            if (response.status === 200 || response.status === 201) {
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            alert('글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => navigate(-1);
    const handleModalClose = () => setIsModalOpen(false);
    const handleModalConfirm = () => navigate(`/posts/${memberId}/${postId}`);

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '19px', fontWeight: "bold" }}>글 수정</div>
                <FiCheck
                    style={{ fontSize: '24px', cursor: 'pointer' }}
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
                        style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#414141" }}>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <button
                            type="button"
                            onClick={handleFileInputClick}
                            style={{
                                cursor: 'pointer',
                                marginTop: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: "center",
                            }}
                        >
                            <LuImagePlus style={{ fontSize: '30px' }} />
                            <span style={{ marginLeft: "20px" }}>
                                {selectedFiles.length > 0 ? "파일 선택됨" : "첨부할 사진을 선택하세요."}
                            </span>
                        </button>
                    </div>
                    {uploading && <p>업로드 중...</p>} {/* 업로드 중 상태 표시 */}
                </form>
                <div id="uploaded-images" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {previewImages.map((url, index) => (
                        <img key={index} src={url} alt={`uploaded ${index}`}
                             style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '10px' }} />
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <Modal_ok
                    message="수정이 완료되었습니다."
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}
        </div>
    );
}

export default BoardEdit;