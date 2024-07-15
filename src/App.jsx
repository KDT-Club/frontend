import React, {useEffect} from 'react';
import './styles/App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Logo from './pages/login/start_logo.jsx';
import Login from './pages/login/login.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Create_club from "./pages/mypage/create_club/Create_club.jsx";
import SignUp from './pages/login/signup.jsx';
import Mypage from './pages/mypage/mypage_main/Mypage.jsx';
import Written_post from "./pages/mypage/written_post/Written_post.jsx";
import Edit_info from "./pages/mypage/edit_info/Edit_info.jsx";
import Member_info_fix_list from "./pages/myclub/member_manage/member_info_fix_list/Member_info_fix_list.jsx";
import Member_info_fix from "./pages/myclub/member_manage/member_info_fix/Member_info_fix.jsx";
import MainPage from './pages/main/MainPage.jsx'
import ClubDetailPage from "./pages/main/ClubDetailPage.jsx";
import Community_Main from "./pages/community/Community_Main.jsx";
import PostDetail from "./pages/community/PostDetail.jsx";
import ActivityPage from "./pages/community/activity/ActivityPage.jsx";
import ActivityDetailPage from "./pages/community/activity/ActivityDetailPage.jsx";
import Member_request from "./pages/myclub/member_manage/member_request/Member_request.jsx";
import Member_request_detail from "./pages/myclub/member_manage/member_request/Member_request_detail.jsx";
import MyclubMain from "./pages/myclub/MyclubMain.jsx";
import MyclubDetail from "./pages/myclub/MyclubDetail.jsx";
import Etc1 from "./pages/myclub/etc/Etc1.jsx";
import Atd from "./pages/myclub/etc/Atd.jsx";
import Etc2 from "./pages/myclub/etc/Etc2.jsx";
import Etc3 from "./pages/myclub/etc/Etc3.jsx";
import NoticeList from "./pages/myclub/notice/NoticeList.jsx";
import NoticeWrite from "./pages/myclub/notice/WriteAndEdit/NoticeWrite.jsx";
import FreeBoardList from "./pages/myclub/freeboard/FreeBoardList.jsx";
import NoticeDetail from "./pages/myclub/notice/NoticeDetail.jsx";
import FreeBoardDetail from "./pages/myclub/freeboard/FreeBoardDetail.jsx";
import FreeBoardWrite from "./pages/myclub/freeboard/WriteAndEdit/FreeBoardWrite.jsx";

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
                        <Route path="/members/:memberId" element={<Mypage />} />
                        <Route path="/posts/:memberId" element={<Written_post />} />
                        <Route path="/edit_info/:memberId" element={<Edit_info />} />
                        <Route path="/clubs/create/:memberId" element={<Create_club />} />
                        <Route path="/memberInfoFixList" element={<Member_info_fix_list />} />
                        <Route path="/memberInfoFix/:memberId" element={<Member_info_fix />} />
                        <Route path="/main" element={<MainPage />} />
                        <Route path="/club/:memberId" element={<ClubDetailPage />} />
                        <Route path="/community" element={<Community_Main/>} />
                        <Route path="/post/:postId" element={<PostDetail/>}/>
                        <Route path="/activity" element={<ActivityPage />} />
                        <Route path="/activity_detail" element={<ActivityDetailPage />} />
                        <Route path="/clubs/:id/joinRequest" element={<Member_request />} />
                        <Route path="/clubs/:id/joinRequest/:memberId" element={<Member_request_detail />} />
                        <Route path="/activity_detail" element={<ActivityDetailPage />}/>

                        //내동아리 라우팅
                        <Route path="/clubs" element={<MyclubMain />} />
                        <Route path="/clubs/:id" element={<MyclubDetail />} />
                        <Route path="/clubs/:id/noticelist" element={<NoticeList />} />
                        <Route path="/clubs/:id/noticelist/noticewrite" element={<NoticeWrite />} />
                        <Route path="/clubs/:clubId/board/2/posts/:postId" element={<NoticeDetail />} />
                        <Route path="/clubs/:id/freeboardlist" element={<FreeBoardList />} />
                        <Route path="/clubs/:id/freeboardlist/freeboardwrite" element={<FreeBoardWrite />} />
                        <Route path="/clubs/:clubId/board/4/posts/:postId" element={<FreeBoardDetail />} />
                        <Route path="/clubs/etc1" element={<Etc1 />} />
                        <Route path="/clubs/etc1/atd" element={<Atd />} />
                        <Route path="/clubs/etc2" element={<Etc2 />} />
                        <Route path="/clubs/etc3" element={<Etc3 />} />
                    </Routes>
                </div>
            </GoogleOAuthProvider>
        </Router>
    );
}

export default App;