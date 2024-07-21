import React, { useState } from 'react';
import axios from 'axios';
import './community_styles/writepostmodal.css';

function WritePostModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [clubName, setClubName] = useState('');
    const [files, setFiles] = useState([]);
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [urlArray, setUrlArray] = useState([]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setAttachmentNames(selectedFiles.map(file => file.name));
    };

    const uploadFileToS3 = async (file) => {
        try {
            // 서버에서 presigned URL을 요청합니다.
            const filename = encodeURIComponent(file.name);
            const response = await fetch(`https://zmffjq.store/presigned-url?filename=${filename}`,{
                withCredentials: true
            });
            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }
            const presignedUrl = await response.text(); // 문자열로 응답 처리

            // presigned URL을 사용하여 파일을 S3에 업로드합니다.
            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (uploadResponse.ok) {
                return presignedUrl.split("?")[0]; // 업로드된 파일의 URL을 반환합니다.
            } else {
                throw new Error('S3 upload failed with status: ' + uploadResponse.status);
            }
        } catch (error) {
            console.error("파일 업로드 중 오류 발생:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (title && content && clubName) {
            try {
                const uploadPromises = files.map(file => uploadFileToS3(file));
                const fileUrls = await Promise.all(uploadPromises);

                const postData = {
                    title,
                    content,
                    attachment_flag: files.length > 0 ? 'Y' : 'N',
                    attachmentNames: fileUrls,
                    club_name: clubName
                };

                const response = await fetch('https://zmffjq.store/board/1/posts', {
                    method: 'POST',
                    body: JSON.stringify(postData),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const responseData = await response.json();
                    onSubmit(responseData);
                    setTitle('');
                    setContent('');
                    setClubName('');
                    setFiles([]);
                    setAttachmentNames([]);
                    setUrlArray([]);
                    onClose();
                } else {
                    throw new Error('Failed to create post with status: ' + response.status);
                }
            } catch (error) {
                console.error("게시글 작성 중 오류 발생:", error);
                if (error.response) {
                    console.error("서버 응답:", error.response.data);
                }
            }
        } else {
            alert("제목, 내용, 동아리 이름을 모두 입력해주세요.");
        }
    };



    return (
        <div className="post-edit-overlay">
            <div className="post-edit">
                <header className="edit-header">
                    <span onClick={onClose} className="edit-cancel">X</span>
                    <h2 className="edit-title">글쓰기</h2>
                    <span onClick={handleSubmit} className="edit-save">✓</span>
                </header>
                <hr style={{ marginTop: '-30px' }} />
                <div className="edit-form">
                    <input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <input
                        type="text"
                        placeholder="동아리 이름"
                        value={clubName}
                        onChange={(e) => setClubName(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', marginBottom: '10px', padding: '5px' }}
                    />
                    <hr />
                    <textarea
                        placeholder="내용을 입력하세요."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ fontSize: '16px', width: '100%', height: 'calc(100vh - 300px)', padding: '5px' }}
                    />
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ marginTop: '10px' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default WritePostModal;
