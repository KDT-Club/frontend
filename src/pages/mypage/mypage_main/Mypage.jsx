import React, {useCallback, useState} from "react";
import './mypage.css';
import { Link, useParams } from 'react-router-dom';
import list_data from "./mypage_list_data.jsx";
import Header_center from "../../../components/header/Header_center.jsx";
import Footer from "../../../components/footer/Footer.jsx";
import Modal_confirm from "../../../components/modal/Modal_confirm.jsx";
import member_info_data from "../../../data/member_info_data.jsx";

function Mypage() {
    const { memberId } = useParams();
    const member = member_info_data.find(m => m.memberId === parseInt(memberId, 10));

    let [list] = useState(list_data);
    const [showDeleteModal, setShowDeleteModel] = useState(false);
    const [modalMessage, setModelMessage] = useState("");
    const iconStyle = { fontSize: "27px" };

    const handleOpenModal = useCallback((message) => {
        setModelMessage(message);
        setShowDeleteModel(true);
    }, []);

    const handleCloseModal = () => setShowDeleteModel(false);

    return (
        <div className="Mypage">
            <Header_center />
            {member && (
                <div className="propyl">
                    <div className="title">
                        <p>내 프로필</p>
                        <button onClick={() => handleOpenModal("로그아웃 하시겠습니까?")}>로그아웃</button>
                    </div>
                    <img
                        src={member.img}
                        alt="Profile"
                    />
                    <div className="info">
                        <p style={{ paddingTop: "5px", fontSize: "18px" }}>{member.name}</p>
                        <p style={{ fontSize: "15px", marginLeft: "2px" }}>{member.studentNum}</p>
                    </div>
                </div>
            )}
            <div className="menu_list">
                {
                    list.map((a, i) => {
                        if (a.isDelete) {
                            return (
                                <div className="mypage_list" key={i}>
                                    <div className="link" onClick={() => handleOpenModal(a.message)}>
                                        <div style={iconStyle} className="icon">{a.icon}</div>
                                        <p>{a.name}</p>
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <List
                                    key={i}
                                    name={a.name}
                                    icon={a.icon}
                                    link={a.link.replace(":memberId", memberId)}
                                    iconStyle={iconStyle}
                                />
                            )
                        }
                    })
                }
            </div>
            <Footer />
            {showDeleteModal && <Modal_confirm onClose={handleCloseModal} message={modalMessage} link="/" />}
        </div>
    );
}

function List({ name, icon, link, iconStyle }) {
    return (
        <div className="mypage_list">
            <Link to={link} className="link">
                <div style={iconStyle} className="icon">{icon}</div>
                <p>{name}</p>
            </Link>
        </div>
    );
}

export default Mypage;