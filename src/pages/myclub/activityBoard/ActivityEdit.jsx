import React, {useState, useEffect, useCallback} from 'react';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiX, FiCheck } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function ActivityEdit() {
    const navigate = useNavigate();
    const {clubId, postId} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [attachmentNames, setAttachmentNames] = useState([]);
    const [memberId, setMemberId] = useState(null);
    const [deletedAttachments, setDeletedAttachments] = useState([]);
    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {
    });

    const apiClient = axios.create({
        baseURL: '/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetchUserId = async () => {
        try {
            const response = await apiClient.get("/getUserId", {
                withCredentials: true
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
        const fetchPostData = async () => {
            try {
                const response = await apiClient.get(`/board/3/clubs/${clubId}/posts/${postId}`);
                const post = response.data.post;
                setTitle(post.title);
                setContent(post.content);
                setAttachmentNames(response.data.attachmentNames || []);
            } catch (error) {
                console.error('게시글 정보 가져오는 중 오류 발생:', error);
                alert('게시글 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchPostData();
        fetchUserId();
    }, [clubId, postId]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const getPresignedUrl = async (file) => {
        try {
            const filename = encodeURIComponent(file.name);
            const response = await apiClient.get(`/presigned-url?filename=${filename}`);
            const presignedUrl = response.data.url;
            if (!presignedUrl) {
                throw new Error('서버로부터 URL 받을 수 없음');
            }
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
        const urls = await Promise.all(selectedFiles.map(async (file) => {
            try {
                return await getPresignedUrl(file);
            } catch (error) {
                console.error('파일 업로드 중 오류 발생:', error);
                alert('파일 업로드 중 오류가 발생했습니다.');
                throw error;
            }
        }));
        setAttachmentNames([...attachmentNames, ...urls]);
    };

    const handleImageDelete = (index) => {
        const deletedAttachment = attachmentNames[index];
        setDeletedAttachments([...deletedAttachments, deletedAttachment]);
        setAttachmentNames(attachmentNames.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.put(`/posts/${postId}`, {
                postId,
                title,
                content,
                attachment_flag: attachmentNames.length > 0 ? 'Y' : 'N',
                attachment_names: attachmentNames,
            });
            if (response.status === 200 || response.status === 201) {
                // 삭제된 첨부 파일 처리
                for (const deletedAttachment of deletedAttachments) {
                    await apiClient.delete(`/attachments/${deletedAttachment}`);
                }
                handleOpenOkModal("수정이 완료되었습니다.", () => navigate(`/clubs/${clubId}/activity/${postId}`));
            }
        } catch (error) {
            console.error('수정 중 오류 발생:', error);
            alert('글 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleBackClick = () => {
        navigate(`/clubs/${clubId}/activity/${postId}`);
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);


    return (
        <div>
            <div className="header_container">
                <FiX
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '19px', fontWeight: "bold"}}>활동 글 수정</div>
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
                <div id="uploaded-images" style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px'}}>
                    {attachmentNames.map((url, index) => (
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
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm}/>}
        </div>
    );
}
export default ActivityEdit;