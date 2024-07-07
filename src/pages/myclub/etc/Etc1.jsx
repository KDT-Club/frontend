import React, { useState, useEffect } from 'react';
import '../DetailHeader/myclubheader.css';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegCalendarPlus } from "react-icons/fa";
import { RiCheckboxBlankCircleLine, RiCheckboxCircleLine } from "react-icons/ri";
import './etc.css';

function Etc1() {
    const navigate = useNavigate();

    const initialAttendance = {
        "2024/07/30 (일) - 연합 경기": false,
        "2024/07/19 (금) - 회식": false,
        "2024/06/10 (월) - MT": true,
        "2024/06/03 (월) - 정기 모임": true,
        "2024/05/21 (화) - 오리엔테이션": true,
    };

    const [attendance, setAttendance] = useState(initialAttendance);

    useEffect(() => {
        const savedAttendance = localStorage.getItem('attendance');
        if (savedAttendance) {
            setAttendance(JSON.parse(savedAttendance));
        }
    }, []);

    const toggleAttendance = (date) => {
        setAttendance((prev) => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    const saveAttendance = () => {
        localStorage.setItem('attendance', JSON.stringify(attendance));
        alert('출석 상태가 저장되었습니다.');
    };

    const handleBackClick = () => {
        navigate(-1);
    };

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
            <div className="aaa">
                {Object.keys(attendance).map((date) => (
                    <span key={date} onClick={() => toggleAttendance(date)}>
                        <div className="ddd">
                            <div className="ccc">{date}</div>
                        </div>
                        <div>
                            {attendance[date] ? (
                                <RiCheckboxCircleLine style={{fontSize: '28px', cursor: 'pointer'}}/>
                            ) : (
                                <RiCheckboxBlankCircleLine style={{fontSize: '28px', cursor: 'pointer'}}/>
                            )}
                        </div>
                    </span>
                ))}
            </div>
            <button className="att-complete-button" onClick={saveAttendance}>완료</button>
        </div>
    );
}

export default Etc1;
