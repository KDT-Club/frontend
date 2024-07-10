import React from 'react';
import '../DetailHeader/myclubheader.css';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaRegCalendarPlus } from "react-icons/fa";
//import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from "react-icons/ri";
import './etc.css';

function Etc1() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleDateClick = (date) => {
        navigate('/atd', { state: { date } });
    };

    const dates = [
        { date: "2024/07/30 (일)", event: "정기 모임" },
        { date: "2024/07/19 (금)", event: "회식" },
        { date: "2024/06/10 (월)", event: "MT" },
        { date: "2024/06/03 (월)", event: "정기 모임" },
        { date: "2024/05/21 (화)", event: "오리엔테이션" },
    ];

    return (
        <div className="whole">
            <div className="header_container">
                <FaArrowLeft
                    style={{ fontSize: '26px', cursor: 'pointer' }}
                    onClick={handleBackClick}
                />
                <div style={{ fontSize: '22px', fontWeight: "bold", marginRight: "10px" }}>출석 관리</div>
                <FaRegCalendarPlus
                    style={{ fontSize: '26px', cursor: 'pointer' }}
                />
            </div>
            <div className="aaa" style={{fontSize: '20px', cursor: 'pointer'}}>
                {dates.map((item, index) => (
                    <div key={index} className="bbb" style={{justifyContent: "center"}} onClick={() => handleDateClick(`${item.date} - ${item.event}`)}>
                        <div>{item.date} - {item.event}</div>
                        <MdKeyboardArrowRight style={{marginLeft: "auto", fontSize: "25px"}}/>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Etc1;
