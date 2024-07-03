import React from 'react';
import logo from '../../images/logo_text.png'
import '../../styles/logo.css'


function StartLogo() {
    return(
        <div className="start_logo">
            <img src={logo} alt="logo" className="logo_text"/>
        </div>
    )
}

export default StartLogo;