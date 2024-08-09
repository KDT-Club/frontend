import React, {useCallback, useState} from "react";
import './modal_post_complain.css';
import Modal_confirm from "./Modal_confirm.jsx";

const Modal_post_complain = ({onClose}) => {
    const [modalMessage, setModalMessage] = useState("");   // 모달창에 띄울 메세지 전달
    const [showDeleteModal, setShowDeleteModal] = useState(false);  // 네/아니오 모달창 띄우기
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const handleOpenModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowDeleteModal(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModal(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleComplain = async () => {
        // 글 신고 api 호출 로직
        console.log("신고 처리 로직 실행");
    }

    return (
        <div className="Modal_post_complain" onClick={handleOverlayClick}>
            <div className="modal_post_complain_content" onClick={(e) => e.stopPropagation()}>
                <button className="post_complain" onClick={() => handleOpenModal("글을 신고하시겠습니까?", handleComplain)}>글 신고하기</button>
            </div>
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} onConfirm={onConfirm} />}
        </div>
    )
}

export default Modal_post_complain;