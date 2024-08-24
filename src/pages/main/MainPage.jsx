import React, { useEffect, useState } from 'react';
import Header_center from "../../components/header/Header_center.jsx";
import Footer from "../../components/footer/Footer.jsx";
import '../../styles/App.css';
import Search from "../../images/search.png";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

const MainContainer = styled.div`
    // ??
`;

const FindClubContainer = styled.div`
    width: 350px;
    margin: 0 auto;
`;

const SearchInputContainer = styled.div`
    position: relative;
`;

const SearchInput = styled.input`
    padding: 10px;
    width: 100%;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    border-radius: 20px;
    font-size: 16px;
    border: none;
`;

const SearchIcon = styled.img`
    position: absolute;
    right: 5px;
    top: 50%;
    border-radius: 20px;
    transform: translateY(-50%);
    width: 35px;
    height: 35px;
    padding: 7px;
    cursor: pointer;
    background-color: #5a7ca5;
`;

const MenuContainer = styled.div`
    width: 100%;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    flex-shrink: 0;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const MenuScroll = styled.div`
    display: inline-flex;
    padding: 10px 0;
`;

const MenuItem = styled.div`
    flex: 0 0 auto;
    border: 5px solid #ccc;
    border-radius: 20px;
    padding: 5px;
    margin-top: 10px;
    margin-left: 10px;
    margin-bottom: 20px;
    border: ${props => props.active ? '2px solid black' : '2px solid lightgray'};
    color: ${props => props.active ? 'black' : 'lightgray'};
    font-weight: ${props => props.active ? '700' : '500'};
    width: 100px;
    cursor: pointer;
`;

const ClubsContainerWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 70px;
    padding-right: 10px;
    padding-left: 10px;
`;

const ClubContainer = styled.div`
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    border-radius: 20px;
    width: calc(50% - 10px);
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 20px;
    overflow-y: hidden;
    padding: 7px;
    height: 280px;
    cursor: pointer;
`;

const ClubLogo = styled.img`
    width: 100%;
    border-radius: 20px 20px 0 0;
    height: 150px;
    object-fit: scale-down;
`;

const ClubTitle = styled.p`
    font-weight: bold;
    margin-bottom: 5px;
`;

const ClubDescription = styled.p`
    color: black;
    font-size: 12px;
`;

function MainPage() {
    const [findClub, setFindClub] = useState('');
    const [allClubs, setAllClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllClubs();
    }, []);

    useEffect(() => {
        setActiveIndex(0);
        setFilteredClubs(allClubs);
    }, [allClubs]);

    const fetchAllClubs = async () => {
        try {
            const response = await axios.get("http://localhost:8080/clubs");
            setAllClubs(response.data);
            setFilteredClubs([]);
        } catch (error) {
            console.error("에러발생:", error);
        }
    }

    const handleMenuClick = (index, item) => {
        setActiveIndex(index);
        if (item === '전체') {
            setFilteredClubs(allClubs);
        } else {
            const clubType = getClubType(item);
            const filtered = allClubs.filter(club => club.clubType === clubType);
            setFilteredClubs(filtered);
        }
    }

    const getClubType = (menuItem) => {
        switch (menuItem) {
            case '체육': return 'SPORT';
            case '학술': return 'ACADEMIC';
            case '문화': return 'CULTURE';
            case '봉사': return 'SERVICE';
            case '신규': return 'NEW';
            default: return '';
        }
    }

    const handleSearch = () => {
        const searchResults = allClubs.filter(club =>
            club.clubName.toLowerCase().includes(findClub.toLowerCase()) ||
            club.description.toLowerCase().includes(findClub.toLowerCase())
        );
        setFilteredClubs(searchResults);
    }

    const handleClubClick = (clubName) => {
        navigate(`/clubs/${clubName}`);
    }

    return (
        <MainContainer>
            <Header_center />
            <FindClubContainer>
                <SearchInputContainer>
                    <SearchInput
                        type="text"
                        placeholder="원하시는 동아리를 찾아보세요!"
                        value={findClub}
                        onChange={(e) => setFindClub(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <SearchIcon src={Search} alt="search" onClick={handleSearch} />
                </SearchInputContainer>
            </FindClubContainer>
            <MenuContainer>
                <MenuScroll>
                    {['전체', '체육', '학술', '문화', '봉사', '신규'].map((item, index) => (
                        <MenuItem
                            key={index}
                            active={activeIndex === index}
                            onClick={() => handleMenuClick(index, item)}
                        >
                            <p>{item}</p>
                        </MenuItem>
                    ))}
                </MenuScroll>
            </MenuContainer>
            <ClubsContainerWrapper>
                {filteredClubs.map((club) => (
                    <ClubContainer key={club.clubId} onClick={() => handleClubClick(club.clubName)}>
                        <ClubLogo src={club.clubImgUrl} alt={club.clubName} />
                        <div>
                            <ClubTitle>{club.clubName}</ClubTitle>
                            <ClubDescription>{club.description}</ClubDescription>
                        </div>
                    </ClubContainer>
                ))}
            </ClubsContainerWrapper>
            <Footer />
        </MainContainer>
    );
}

export default MainPage;
