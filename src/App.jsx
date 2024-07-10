import React, {useEffect} from 'react';
import './styles/App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Logo from './pages/login/start_logo.jsx';
import Login from './pages/login/login.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUp from './pages/login/signup.jsx';
import Mypage from './pages/mypage/mypage_main/Mypage.jsx';
import Written_post from "./pages/mypage/written_post/Written_post.jsx";
import Edit_info from "./pages/mypage/edit_info/Edit_info.jsx";
import Create_club from "./pages/mypage/create_club/Create_club.jsx";
import Member_manage_main from "./pages/myclub/member_manage/main/Member_manage_main.jsx";
import Member_info_fix_list from "./pages/myclub/member_manage/member_info_fix_list/Member_info_fix_list.jsx";
import Member_info_fix from "./pages/myclub/member_manage/member_info_fix/Member_info_fix.jsx";
import MainPage from './pages/main/MainPage.jsx'
import ClubDetailPage from "./pages/main/ClubDetailPage.jsx";
import Community_Main from "./pages/community/Community_Main.jsx";
import PostDetail from "./pages/community/PostDetail.jsx";

function App() {
    const [showLogo, setShowLogo] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLogo(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    function setScreenSize() {
        let vh = window.innerHeight * 0.01;
        let vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        document.documentElement.style.setProperty("--vw", `${vw}px`);
    }

    useEffect(() => {
        setScreenSize();
        window.addEventListener('resize', setScreenSize);


        return () => window.removeEventListener('resize', setScreenSize);
    }, []);

    return (
        <Router>
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <div className="App">
                    <Routes>
                        <Route path="/" element={showLogo ? <Logo /> : <Login/>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/mypage" element={<Mypage />} />
                        <Route path="/posts" element={<Written_post />} />
                        <Route path="/edit_info" element={<Edit_info />} />
                        <Route path="/create_club" element={<Create_club />} />
                        <Route path="/clubMemberManage" element={<Member_manage_main />} />
                        <Route path="/memberInfoFixList" element={<Member_info_fix_list />} />
                        <Route path="/memberInfoFix/:memberId" element={<Member_info_fix />} />
                        <Route path="/main" element={<MainPage />} />
                        <Route path="members" element={<Mypage />} />
                        <Route path="/club/:clubId" element={<ClubDetailPage />} />
                        <Route path="/community" element={<Community_Main/>} />
                        <Route path="/post/:postId" element={<PostDetail/>}/>
                    </Routes>
                </div>
            </GoogleOAuthProvider>
        </Router>
    );
}

export default App;