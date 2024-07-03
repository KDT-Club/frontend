import React, {useEffect} from 'react';
import './styles/App.css';
import Logo from './pages/login/start_logo.jsx'
import Login from './pages/login/login.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
    const [showLogo, setShowLogo] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() =>{
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
        <GoogleOAuthProvider clientId="">
            <div className="App">
                {showLogo ? <Logo /> : <Login />}
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;