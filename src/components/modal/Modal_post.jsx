import React from "react";
import './modal_post.css';

const Modal_ok = ({onClose}) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return (
        <div className="Modal_post" onClick={handleOverlayClick}>
            <div className="modal_post_content" onClick={(e) => e.stopPropagation()}>
                <button className="post_delete">글 삭제하기</button>
                <button>글 수정하기</button>
            </div>
        </div>
    );
};

export default Modal_ok;