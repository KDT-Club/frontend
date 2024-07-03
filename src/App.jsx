import React from 'react';
import './styles/App.css';
import Header_center from "./components/header_center.jsx";
import Header_left from "./components/header_left.jsx";
import Footer from './components/footer.jsx';

function App() {
    return (
        <div className="App">
            <Header_center />
            <h1>Hello</h1>
            <h2>hello</h2>
            <Footer/>
        </div>
    );
}

export default App;