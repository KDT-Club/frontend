import React from 'react';
import './styles/App.css';
import Header_center from "./components/Header_center.jsx";
import Header_left from "./components/Header_left.jsx";
import Footer from './components/Footer.jsx';
import Mypage from "./pages/mypage/Mypage.jsx";

function App() {
    return (
        <div className="App">
            <Header_center />
            <Mypage />
            <Footer/>
        </div>
    );
}

export default App;