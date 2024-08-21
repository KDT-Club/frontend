import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header_center from "../../components/header/Header_center.jsx";
import styled from 'styled-components';
import { FaArrowLeft } from "react-icons/fa6";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: white;
    width: 60%;
    height: 15%;
    padding: 20px;
    border-radius: 8%;
    text-align: center;
`;

const ModalHeader = styled.div`
    margin-bottom: 7px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const ModalButton = styled.button`
    width: 60%;
    margin-top: 5px;
    padding: 5px 20px;
    cursor: pointer;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47.5px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 0px;
`;

const SignupHeaderCenter = styled.div`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

const SignupTitle = styled.div`
    font-size: 30px;
    font-weight: bold;
    padding-top: 50px;
    margin-bottom: 50px;
    margin-top: 1%;
`;

const SignupContainer = styled.div`
    width: 100%;
    height: 75%;
`;

const InputGroup = styled.div`
    text-align: left;
    width: 100%;
    max-width: 330px;
    margin: 0 auto 2%;
`;

const InputWithButton = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
`;

const SignupButton = styled.button`
    width: 100%;
    max-width: 330px;
    padding: 12px;
    margin: 5% auto 0;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    height: 50px;
    background-color: #5a7ca5;
    color: white;
`;

function Modal({ onClose }) {
    return (
        <ModalOverlay>
            <ModalContent>
                <ModalHeader>
                    <p>가입이 완료되었습니다!</p>
                    <p>로그인 화면으로 돌아갑니다.</p>
                </ModalHeader>
                <hr />
                <ModalButton onClick={onClose}>OK</ModalButton>
            </ModalContent>
        </ModalOverlay>
    )
}

function Signup() {
    const [username, setUserName] = React.useState('');
    const [name, setName] = React.useState('');
    const [department, setDepartment] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [duplicateId, setDuplicateId] = React.useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = React.useState(false);
    const [phone, setPhone] = React.useState('');

    const handleSignUp = async () => {
        try {
            if (password !== confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('department', department);
            formData.append('phone', phone);

            const response = await fetch('/api/signup', {
                method: 'POST',
                body: formData
            });

            if (response.status === 200) {
                localStorage.setItem('userInfo', JSON.stringify({ name, username }))
                setShowModal(true);
            } else {
                throw new Error('회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.log('회원가입 중 에러 발생:', error);
            alert('회원가입 중 에러가 발생하였습니다.');
        }
    }

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/login');
    }

    return (
        <div>
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={() => navigate("/")}
                />
                <div style={{fontSize: '20px', fontWeight: "bold", textAlign: "left", marginRight: "123px"}}>회원 가입</div>
            </HeaderContainer>
            <SignupTitle>
                회원가입
            </SignupTitle>
            <SignupContainer>
                <InputGroup>
                    <Label htmlFor="student-name">이름</Label>
                    <Input
                        id="student-name"
                        type="text"
                        placeholder="이름을 입력해주세요."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="student-id">학번</Label>
                    <InputWithButton>
                        <Input
                            id="student-id"
                            type="id"
                            placeholder="학번을 입력해주세요."
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </InputWithButton>
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                            borderColor: password !== confirmPassword && confirmPassword !== '' ? 'red' : '',
                            borderWidth: password !== confirmPassword && confirmPassword !== '' ? '1px' : ''
                        }}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="student-major">학과</Label>
                    <Input
                        id="student-major"
                        type="text"
                        placeholder="학과를 입력해주세요."
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="phone">핸드폰 번호</Label>
                    <Input
                        id="phone"
                        type="text"
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </InputGroup>
                <SignupButton type="submit" onClick={handleSignUp}>가입하기</SignupButton>
                {showModal && (
                    <Modal onClose={handleModalClose} />
                )}
            </SignupContainer>
        </div>
    )
}

export default Signup;
