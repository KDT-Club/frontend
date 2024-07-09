import React from "react";
import './modal_confirm.css';
import { useNavigate } from "react-router-dom";

const Modal_ok = ({onClose, message}) => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        navigate("/");
    };

    return (
        <div className="Modal_ok">
            <div className="modal_ok_content">
                <p dangerouslySetInnerHTML={{__html: message}}></p>
                <div className="modal_ok_button">
                    <button onClick={handleConfirm} className="ok_button">OK</button>
                </div>
            </div>
        </div>
    );
};

export default Modal_ok;