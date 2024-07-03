import React, {useEffect} from 'react';
import './styles/App.css';
import Header_center from "./components/Header_center.jsx";
import Header_left from "./components/Header_left.jsx";
import Footer from './components/Footer.jsx';
import Mypage from "./pages/mypage/Mypage.jsx";

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
        <div className="App">
            <Header_center />
            <Mypage />
            <Footer/>
        </div>
    );
}

export default App;