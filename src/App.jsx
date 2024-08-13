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
import Written_post_detail from "./pages/mypage/written_post/Written_post_detail.jsx";
import Edit_info from "./pages/mypage/edit_info/Edit_info.jsx";
import Member_info_fix_list from "./pages/myclub/headerHamburger/member_manage/member_info_fix_list/Member_info_fix_list.jsx";
import Member_info_fix from "./pages/myclub/headerHamburger/member_manage/member_info_fix/Member_info_fix.jsx";
import MainPage from './pages/main/MainPage.jsx'
import ClubDetailPage from "./pages/main/ClubDetailPage.jsx";
import Community_Main from "./pages/community/Community_Main.jsx";
import PostDetail from "./pages/community/PostDetail.jsx";
import ActivityPage from "./pages/community/activity/ActivityPage.jsx";
import ActivityDetailPage from "./pages/community/activity/ActivityDetailPage.jsx";
import Member_request from "./pages/myclub/headerHamburger/member_manage/member_request/Member_request.jsx";
import Member_request_detail from "./pages/myclub/headerHamburger/member_manage/member_request/Member_request_detail.jsx";
import MyclubMain from "./pages/myclub/MyclubMain.jsx";
import MyclubDetail from "./pages/myclub/MyclubDetail.jsx";
import Etc1 from "./pages/myclub/attendance/Etc1.jsx";
import Atd from "./pages/myclub/attendance/Atd.jsx";
import NoticeList from "./pages/myclub/noticeBoard/NoticeList.jsx";
import NoticeWrite from "./pages/myclub/noticeBoard/NoticeWrite.jsx";
import FreeBoardList from "./pages/myclub/freeBoard/FreeBoardList.jsx";
import FreeBoardWrite from "./pages/myclub/freeBoard/FreeBoardWrite.jsx";
import ClubInfoEdit from "./pages/myclub/headerHamburger/club_manage/ClubInfoEdit.jsx";
import BoardEdit from "./pages/mypage/written_post/BoardEdit.jsx";
import ActivityList from "./pages/myclub/activityBoard/ActivityList.jsx";
import PostEdit from "./pages/myclub/component/PostEdit.jsx";
import BoardDetail from "./pages/myclub/component/BoardDetail.jsx";
import ActivityDetail from "./pages/myclub/activityBoard/ActivityDetail.jsx";
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

    useEffect(() => {
        console.log("showLogo:", showLogo);
    }, [showLogo]);

    return (
        <Router>
            <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                <div className="App">
                        <Routes>
                            <Route path="/" element={showLogo ? <Logo /> : <Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/members/:memberId" element={<Mypage />} />
                            <Route path="/post_list/:memberId" element={<Written_post />} />
                            <Route path="/posts/:memberId/:postId" element={<Written_post_detail />} />
                            <Route path="/posts_edit/:postId/" element={<BoardEdit />} />
                            <Route path="/edit_info/:memberId" element={<Edit_info />} />
                            <Route path="/clubs/create/:memberId" element={<Create_club />} />
                            <Route path="/clubs/:id/memberInfoFixList" element={<Member_info_fix_list />} />
                            <Route path="/clubs/:id/memberInfoFix/:memberId" element={<Member_info_fix />} />
                            <Route path="/main" element={<MainPage />} />
                            <Route path="/clubs/:clubName" element={<ClubDetailPage />} />
                            <Route path="/community" element={<Community_Main />} />
                            <Route path="/board/1/posts/:postId" element={<PostDetail/>}/>
                            <Route path="/board/3/clubs/:clubId/posts" element={<ActivityPage />} />
                            <Route path="/board/3/clubs/:clubId/posts/:postId" element={<ActivityDetailPage />} />
                            <Route path="/clubs/:id/joinRequest" element={<Member_request />} />
                            <Route path="/clubs/:id/joinRequest/:requestId" element={<Member_request_detail />} />
                            <Route path="/activity_detail" element={<ActivityDetailPage />}/>

                            //내동아리 라우팅
                            <Route path="/clubs" element={<MyclubMain />} />
                            <Route path="/clubs/:id/myclub" element={<MyclubDetail />} />
                            <Route path="/clubs/:id/activeList" element={<ActivityList />} />
                            <Route path="/clubs/:id/noticelist" element={<NoticeList />} />
                            <Route path="/clubs/:id/freeboardlist" element={<FreeBoardList />} />
                            <Route path="/clubs/:id/noticelist/noticewrite" element={<NoticeWrite />} />
                            <Route path="/clubs/:id/freeboardlist/freeboardwrite" element={<FreeBoardWrite />} />
                            {/*<Route path="/clubs/:id/activitylist/activitywrite" element={<ActivityWrite />} />*/}
                            <Route path="/clubs/:clubId/board/:boardId/posts/:postId" element={<BoardDetail />} />
                            <Route path="/clubs/:clubId/activity/:postId" element={<ActivityDetail />} />
                            <Route path="/clubs/:clubId/board/:boardId/posts/:postId/edit" element={<PostEdit />} />
                            {/*<Route path="/clubs/:id/activity/:postId/edit" element={<ActivityEdit />} />*/}
                            <Route path="/clubs/etc1" element={<Etc1 />} />
                            <Route path="/clubs/etc1/atd" element={<Atd />} />
                            <Route path="/clubs/:id/changeclubinfo" element={<ClubInfoEdit />} />
                        </Routes>
                    </div>
                </GoogleOAuthProvider>
            </Router>
    );
}

export default App;