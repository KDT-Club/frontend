import React, {useCallback, useState} from "react";
import './modal_post_complain.css';
import Modal_confirm from "./Modal_confirm.jsx";
import Modal_ok from "./Modal_ok.jsx";
import axios from "axios";

const Modal_post_complain = ({onClose, postId, memberId}) => {

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네 / 아니오 모달창 띄우기
    const [showOkModal, setShowOkModel] = useState(false);
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const handleOpenModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowDeleteModal(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModal(false);

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleComplain = async () => {
        try {
            const response = await apiClient.post(`/${postId}/report`, null, {
                params: { memberId }
            });
            console.log("게시물 신고가 완료되었습니다.", response.data);
            onClose();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    handleOpenOkModal("해당 게시글을 이미 신고하였습니다.", () => {});
                    console.error("서버 내부 오류가 발생했습니다. 나중에 다시 시도해주세요.", error.response.data);
                } else {
                    console.error("신고 처리 중 오류가 발생했습니다:", error.response.data);
                }
            } else {
                console.error("신고 처리 중 오류가 발생했습니다:", error.message);
            }
        }
    }

    return (
        <div className="Modal_post_complain" onClick={handleOverlayClick}>
            <div className="modal_post_complain_content" onClick={(e) => e.stopPropagation()}>
                <button className="post_complain" onClick={() => handleOpenModal("글을 신고하시겠습니까?", handleComplain)}>글 신고하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} onConfirm={onConfirm} />}
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

export default Modal_post_complain;