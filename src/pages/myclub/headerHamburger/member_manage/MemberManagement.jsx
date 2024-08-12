import React, {useCallback, useState} from 'react';
import { useNavigate } from "react-router-dom";
import { MdOutlineManageAccounts, MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function MemberManagement({ id, isClubPresident }) {
    const navigate = useNavigate();
    const [isMemberManageOpen, setIsMemberManageOpen] = useState(false);
    const [showOkModal, setShowOkModel] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirm, setOnConfirm] = useState(() => () => {});

    const toggleMemberManage = (e) => {
        e.stopPropagation();
        if (isClubPresident) {
            setIsMemberManageOpen(!isMemberManageOpen);
        } else {
            handleOpenOkModal("동아리 회장만 접근 가능합니다.", () => {});
        }
    };

    const handleOpenOkModal = useCallback((message, confirmCallback) => {
        setModalMessage(message);
        setOnConfirm(() => confirmCallback);
        setShowOkModel(true);
    }, []);

    const handleCloseOkModal = () => setShowOkModel(false);

    return (
        <>
            <div className="li-container" onClick={toggleMemberManage}>
                <div className="li-container-left">
                    <MdOutlineManageAccounts style={{fontSize: "27px"}}/>
                    <li>회원 관리</li>
                </div>
                {isMemberManageOpen ? (
                    <MdKeyboardArrowDown style={{marginRight: "17px", fontSize: "28px"}} />
                ) : (
                    <MdKeyboardArrowRight style={{marginRight: "17px", fontSize: "28px"}} />
                )}
            </div>
            {isMemberManageOpen && (
                <div className="member-manage-list">
                    <div className="manage-item" onClick={() => navigate(`/clubs/${id}/memberInfoFixList`)}>회원 정보 수정</div>
                    <div className="manage-item" onClick={() => navigate('/clubs/etc1/atd')}>회원 출석 관리</div>
                    <div className="manage-item" onClick={() => navigate(`/clubs/${id}/joinRequest`)}>가입 신청 현황</div>
                </div>
            )}
            {showOkModal && <Modal_ok onClose={handleCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
        </>
    );
}

export default MemberManagement;