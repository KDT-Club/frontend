import React, {useCallback, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { MdOutlineSettings, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function ClubManagement({ id, isClubPresident }) {
    const navigate = useNavigate();
    const [isClubManageOpen, setIsClubManageOpen] = useState(false);
    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const toggleClubManage = (e) => {
        e.stopPropagation();
        if (isClubPresident) {
            setIsClubManageOpen(!isClubManageOpen);
        } else {
            handleOpenOkModal("동아리 회장만 접근 가능합니다.", () => {});
        }
    };

    const handleClubInfoEdit = () => {
        if (isClubPresident) {
            navigate(`/clubs/${id}/changeclubinfo`, { state: { isMenuOpen: true } });
        }
    };

    const handleClubDelete = () => {
        // 구현
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);

    return (
        <>
            <div className="li-container" onClick={toggleClubManage}>
                <div className="li-container-left">
                    <MdOutlineSettings style={{fontSize: "27px"}}/>
                    <li>동아리 관리</li>
                </div>
                {isClubManageOpen ? (
                    <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}} />
                ) : (
                    <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}} />
                )}
            </div>
            {isClubPresident && isClubManageOpen && (
                <div className="club-manage-list">
                    <div className="manage-item" onClick={handleClubInfoEdit}>동아리 정보 수정</div>
                    <div className="manage-item" onClick={handleClubDelete}>동아리 삭제</div>
                </div>
            )}
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </>
    );
}

export default ClubManagement;