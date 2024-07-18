import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login_styles/login.css';
import Header_center from '../../components/header/Header_center.jsx';
import kakao from '../../images/kakao_login.png';
import { GoogleLogin } from '@react-oauth/google';
import {useAuth} from "../../components/AuthContext.jsx";

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
            const response = await fetch('http://3.36.56.20:8080/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include' // 쿠키를 보낼 수 있도록 설정
            });

            console.log('Response status:', response.status);

            console.log(await response.json())

            if (response.ok) {
                // 토큰이 아닌 JSESSIONID가 쿠키로 자동으로 저장될 것임

                // 로그인 성공 후 메인 페이지로 이동
                navigate('/main');
            } else {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    alert(`로그인에 실패했습니다: ${errorData.message}`);
                } else {
                    // 서버에서 HTML 형식으로 오류 페이지를 반환한 경우
                    const responseText = await response.text();
                    const parser = new DOMParser();
                    const htmlDocument = parser.parseFromString(responseText, 'text/html');
                    const errorElement = htmlDocument.querySelector('p');
                    if (errorElement) {
                        alert(`로그인에 실패했습니다 : ${errorElement.textContent}`);
                    } else {
                        alert('서버에서 예상치 않은 데이터 형식을 반환했습니다.');
                    }
                }
            }
        } catch (error) {
            console.error('로그인 중 에러 발생:', error);
            alert('로그인 중 에러가 발생했습니다.');
        }
    };


    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleKakaoLogin = () => {
        console.log('KakaoTalk login');
    };

    const responseMessage = (response) => {
        console.log(response);
        // 로그인 성공 처리
    };

    const errorMessage = (error) => {
        console.log(error);
        // 에러 처리
    };

    return (
        <div className="login-container">
            <Header_center />
            <h1 className="login_text">로그인</h1>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="student-id">학번</label>
                    <input
                        id="student-id"
                        name="studentId"
                        type="text"
                        placeholder="Your ID"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <p className="signup-text">
                    계정이 없으신가요? <span className="signup-link" onClick={handleSignup}>회원가입</span>
                </p>
                <button type="submit" className="login-btn">Login</button>
            </form>
            <div className="social-login-container">
                <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                    size="large"
                    buttonText="Sign in with Google"
                    shape="rectangular"
                    logo_alignment="left"
                    width="320"
                    height="300"
                />
            </div>
            <button onClick={handleKakaoLogin} className="social-login kakao-btn">
                <img src={kakao} alt="KakaoTalk" />
            </button>
        </div>
    );
}

export default Login;