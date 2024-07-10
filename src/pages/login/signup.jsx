import React from 'react';
import {useNavigate} from 'react-router-dom';
import Header_center from "../../components/header/Header_center.jsx";
import './login_styles/signup.css';
import '../../styles/App.css';
import back from '../../images/shape.png'

function Modal({onClose}) {
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                <p>가입이 완료되었습니다!</p>
                <p>로그인 화면으로 돌아갑니다.</p>
                </div>
                <hr/>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    )
}


function signup () {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [id, setId] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [name, setName] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [major, setMajor] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [password, setPassword] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [confirmPassword, setConfirmPassword] = React.useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [duplicateId, setDuplicateId] = React.useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [showModal, setShowModal] = React.useState(false);

    const handleDuplicateCheck = () => {
        setDuplicateId(true);
    }

    const handleBackClick = () => {
        window.history.back();
    }

    const handleSignup = (e) => {
        e.preventDefault();
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    }

    return(
        <div>
            <div className="header-container">
                <button onClick={handleBackClick} className="back-button">
                    <img src={back} alt="back"/>
                </button>
                <div className="signup-header-center">
                <Header_center/>
                </div>
            </div>
            <div className="signup-title">
                회원가입
            </div>
            <div className="signup-container">
                <div className="input-group">
                    <label htmlFor="student-name">이름</label>
                    <input
                        id="student-name"
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="student-major">학과</label>
                    <input
                        id="student-major"
                        type="text"
                        placeholder="학과를 입력해주세요."
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="student-id">학번</label>
                    <div className="input-with-button">
                    <input
                        id="student-id"
                        type="id"
                        placeholder="학번을 입력해주세요."
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                        <button onClick={handleDuplicateCheck} className="duplicate-check-btn">중복확인</button>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="passowrd">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호 확인</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            borderColor: password !== confirmPassword && confirmPassword !== '' ? 'red' : '',
                            borderWidth: password !== confirmPassword && confirmPassword !== '' ? '1px' : ''
                        }}
                    />
                </div>
                <button type="submit" className="signup-btn" onClick={handleSignup}>가입하기</button>
                {showModal && (
                    <Modal onClose={handleModalClose} />
                )}
            </div>
        </div>
    )
}

export default signup;