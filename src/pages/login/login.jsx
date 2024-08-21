import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header_center from '../../components/header/Header_center.jsx';
import axios from 'axios';

const LoginContainer = styled.div`
  width: 100%;
  min-height: 90vh;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const LoginTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin-top: 10vh;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 30px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const InputGroup = styled.div`
  text-align: left;
  width: 100%;
  max-width: 330px;
  margin: 0 auto 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 330px;
  padding: 12px;
  margin: 5% auto 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 50px;
  background-color: #5a7ca5;
  color: white;

  @media (max-width: 480px) {
    height: 44px;
  }
`;

const SignupText = styled.p`
  font-size: 14px;
  color: #606770;
  margin-top: 2vh;
`;

const SignupLink = styled.a`
  font-size: 14px;
  color: #1877f2;
  text-decoration: none;
  cursor: pointer;
`;

function Login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('studentId', username);
        formData.append('password', password);

        try {
            const response = await axios.post('/api/login', formData, {
                withCredentials: true
            });

            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            const data = response.data;

            // 24.08.21 response.status === 200이면 로그인 성공하다록 수정 (이정훈)
            // 이 방법은 로그인 실패 시에도 로그인이 되서 추후 개선이 필요함
            // if (data.message === '성공') {
            //     localStorage.setItem('memberId', data.memberId);
            //     console.log('로그인 성공, 메인 페이지로 이동합니다.');
            //     navigate('/main');
            // }
            if (response.status === 200) {
                localStorage.setItem('memberId', data.memberId);
                console.log('로그인 성공, 메인 페이지로 이동합니다.');
                navigate('/main');
            } else {
                alert(`로그인에 실패했습니다: ${data.message}`);
            }
        } catch (error) {
            if (error.response) {
                const contentType = error.response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                    const errorData = error.response.data;
                    alert(`로그인에 실패했습니다: ${errorData.message}`);
                } else {
                    const parser = new DOMParser();
                    const htmlDocument = parser.parseFromString(error.response.data, 'text/html');
                    const errorElement = htmlDocument.querySelector('p');
                    if (errorElement) {
                        alert(`로그인에 실패했습니다: ${errorElement.textContent}`);
                    } else {
                        alert('서버에서 예상치 않은 데이터 형식을 반환했습니다.');
                    }
                }
            } else {
                console.error('로그인 중 에러 발생:', error);
                alert('로그인 중 에러가 발생했습니다.');
            }
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <LoginContainer>
            <Header_center />
            <LoginTitle>로그인</LoginTitle>
            <form onSubmit={handleLogin}>
                <InputGroup>
                    <Label htmlFor="username">학번</Label>
                    <Input
                        type="text"
                        id="username"
                        value={username}
                        placeholder="Your ID"
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </InputGroup>
                <InputGroup>
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Your Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </InputGroup>
                <Button type="submit">Login</Button>
            </form>
            <SignupText>
                계정이 없으신가요? <SignupLink onClick={handleSignup}>회원가입</SignupLink>
            </SignupText>
        </LoginContainer>
    );
}

export default Login;