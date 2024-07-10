import React, {useEffect} from 'react';
import './styles/App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
// import Logo from './pages/login/start_logo.jsx'
// import Login from './pages/login/login.jsx'
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import SignUp from './pages/login/signup.jsx'
import "./styles/App.css";
import MyclubMain from "./pages/myclub/MyclubMain.jsx";

function App() {
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
            <div className="App">
                <Routes>
                    <Route path="/*" element={<MyclubMain />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;