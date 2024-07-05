import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import '../../styles/login.css';
import '../../styles/App.css';
import Header_center from '../../components/Header_center.jsx'
import kakao from '../../images/kakao_login.png'
import {GoogleLogin} from '@react-oauth/google'

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', id, password);
    };

    const handleSignup = (e) => {
        e.preventDefault();
        navigate('/signup')
    }

    const handleKakaoLogin = () => {
        console.log('KakaoTalk login');
    };

    const responseMessage = (response) => {
        console.log(response);
        // 로그인 성공 처리
    };
    const errorMessage = (error) => {
        console.log(error);
        // 에러처리
    }

    return (
        <div className="login-container">
            <Header_center/>
            <h1 className="login_text">로그인</h1>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="student-id">학번</label>
                    <input
                        id="student-id"
                        type="text"
                        placeholder="Your ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Your Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <p className="signup-text">
                    계정이 없으신가요? <span className="signup-link" onClick={handleSignup}>회원가입</span>
                </p>
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
                <img src={kakao} alt="KakaoTalk"/>
            </button>
            <button type="submit" className="login-btn">Login</button>
        </div>
    );
}

export default Login;