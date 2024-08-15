import React, { useState } from 'react';
import styled from 'styled-components';

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(5); // 6월부터 시작 (0-indexed)
    const [currentYear, setCurrentYear] = useState(2024);

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"];

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const events = [
        { dates: [26, 27, 28, 29, 30], type: 'dance', description: '댄스 동아리 교내 공연' },
        { dates: [12, 13, 14], type: 'board-game', description: '보드게임 동아리 부원 모집' },
        { dates: [1, 2, 3, 4, 5], type: 'stock', description: '주식 동아리 주식 대회 접수' },
    ];

    const getEventType = (day) => {
        for (let event of events) {
            if (event.dates.includes(day)) {
                return event.type;
            }
        }
        return '';
    };

    const renderCalendar = () => {
        let days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<Day key={`empty-${i}`} className="empty"></Day>);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            const eventType = getEventType(i);
            days.push(
                <Day key={i} className={eventType}>
                    {i}
                </Day>
            );
        }
        return days;
    };

    const changeMonth = (delta) => {
        let newMonth = currentMonth + delta;
        let newYear = currentYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    return (
        <CalendarContainer>
            <CalendarContent>
                <CalendarHeader>
                    <button onClick={() => changeMonth(-1)}>&lt;</button>
                    <h2>{currentYear}년 {monthNames[currentMonth]}</h2>
                    <button onClick={() => changeMonth(1)}>&gt;</button>
                    <AddEventButton>+</AddEventButton>
                </CalendarHeader>
                <Weekdays>
                    <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
                </Weekdays>
                <CalendarGrid>
                    {renderCalendar()}
                </CalendarGrid>
            </CalendarContent>
            <CalendarLegend>
                <p><Legend className="dance"></Legend> 26 ~ 30 댄스 동아리 교내 공연</p>
                <p><Legend className="board-game"></Legend> 12 ~ 14 보드게임 동아리 부원 모집</p>
                <p><Legend className="stock"></Legend> 1 ~ 5 주식 동아리 주식 대회 접수</p>
            </CalendarLegend>
        </CalendarContainer>
    );
};

export default Calendar;

const CalendarContainer = styled.div`
    width: 90%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
    @media (max-width: 768px) {
        max-width: 100%;
    }
`;

const CalendarContent = styled.div`
    border: 1px solid rgba(204, 204, 204, 0.5);
    border-radius: 20px;
    padding: 10px 30px;
`;

const CalendarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 15%;
    margin-bottom: 5%;
    
    button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
`;

const AddEventButton = styled.button`
    background-color: #007bff;
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: none;
    cursor: pointer;
`;

const Weekdays = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
`;

const CalendarGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
`;

const Day = styled.div`
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    &.empty {
        visibility: hidden;
    }
    &.dance {
        background-color: #90EE90;
    }
    &.board-game {
        background-color: #FFB6C1;
    }
    &.stock {
        background-color: #ADD8E6;
    }
`;

const CalendarLegend = styled.div`
    width: 100%;
    margin-top: 5%;
    border: 1px solid rgba(204, 204, 204, 0.5);
    border-radius: 20px;
    padding: 10px 30px;
`;

const Legend = styled.span`
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border-radius: 50%;
    &.dance {
        background-color: #90EE90;
    }
    &.board-game {
        background-color: #FFB6C1;
    }
    &.stock {
        background-color: #ADD8E6;
    }
`;
