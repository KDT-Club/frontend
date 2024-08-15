import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import styled from 'styled-components';
import axios from 'axios';

const ClubDetailPage = () => {
    const { clubName } = useParams();
    const [club, setClub] = useState(null);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', username: '', id: '', memberImageURL: '' });
    const [lastActivityImage, setLastActivityImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await fetch(`https://zmffjq.store/clubs/${clubName}`);
                if (response.ok) {
                    const data = await response.json();
                    setClub(data);

                    if (data.clubId) {
                        fetchLastActivityImage(data.clubId);
                    }
                } else {
                    console.error('Failed to fetch club details');
                }
            } catch (error) {
                console.error('Error fetching club details:', error);
            }
        };

        fetchClubDetails();

        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            if (parsedUserInfo.memberImageURL) {
                setUserInfo(prevState => ({
                    ...prevState,
                    memberImageURL: parsedUserInfo.memberImageURL
                }));
            } else {
                fetchMemberDetails(parsedUserInfo.id);
            }
        }
    }, [clubName]);

    const fetchMemberDetails = async (memberId) => {
        try {
            const response = await axios.get(`https://zmffjq.store/members/${memberId}`);
            if (response.data) {
                setUserInfo(prevState => ({
                    ...prevState,
                    memberImageURL: response.data.memberImageURL
                }));
                const updatedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
                updatedUserInfo.memberImageURL = response.data.memberImageURL;
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            }
        } catch (error) {
            console.error('Error fetching member details:', error);
        }
    };

    const fetchLastActivityImage = async (clubId) => {
        try {
            const response = await axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts`);
            if (response.data && response.data.length > 0) {
                const lastPost = response.data[0];
                const postResponse = await axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts/${lastPost.postId}`);
                const attachmentNames = postResponse.data.attachmentNames || [];
                if (attachmentNames.length > 0) {
                    setLastActivityImage(attachmentNames[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching last activity image:', error);
        }
    };

    const handleBackClick = () => {
        navigate('/main');
    };

    const handleJoinClick = () => {
        setShowJoinForm(true);
    };

    const handleJoinSubmit = async () => {
        try {
            const config = {
                withCredentials: true
            };

            const response = await axios.post(`https://zmffjq.store/clubs/${clubName}/applications`, {
                motivation
            }, config);

            if (response.status === 200) {
                alert('가입 신청이 성공적으로 제출되었습니다.');
                setShowJoinForm(false);
            }
        } catch (error) {
            console.error('Error submitting join application:', error);
            alert('가입 신청 중 오류가 발생했습니다.');
        }
    };

    if (!club) {
        return <div>Loading...</div>;
    }

    if (showJoinForm) {
        return (
            <JoinForm>
                <JoinFormHeader>
                    <FaArrowLeft
                        style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                        onClick={() => setShowJoinForm(false)} />
                    <p>동아리 가입 신청</p>
                </JoinFormHeader>
                <UserInfo>
                    <img src={userInfo.memberImageURL} alt="profile" />
                    <ProfileInfo>
                        <h4>{userInfo.name}</h4>
                        <p>학번: {userInfo.id}</p>
                    </ProfileInfo>
                </UserInfo>
                <ReasonInput>
                    <p>지원동기</p>
                    <textarea
                        placeholder="지원 동기를 작성해주세요."
                        value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}
                    ></textarea>
                </ReasonInput>
                <SubmitButton onClick={handleJoinSubmit}>가입 신청</SubmitButton>
            </JoinForm>
        );
    }

    return (
        <ClubDetailPageContainer>
            <Header>
                <FaArrowLeft
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={handleBackClick} />
                <p>동아리 소개</p>
            </Header>
            <hr />
            <ClubInfo>
                <img src={club.clubImgUrl} alt="club" />
                <ClubInfoText>
                    <h3>{club.clubName}</h3>
                    <InfoDes>{club.clubSlogan}</InfoDes>
                    <ClubInfoCenter>
                        <p>{club.description}</p>
                        {club.activities && club.activities.map((activity, index) => (
                            <p key={index}>{activity}</p>
                        ))}
                    </ClubInfoCenter>
                </ClubInfoText>
            </ClubInfo>
            <LastActivity>
                <h4>최근 활동</h4>
                <LastActivityText>
                    <UnoCards>
                        {lastActivityImage ? (
                            <img src={lastActivityImage} alt="최근 활동" />
                        ) : (
                            <img src={club.clubImgUrl} alt="기본 이미지" />
                        )}
                    </UnoCards>
                </LastActivityText>
            </LastActivity>
            <LeaderInfo>
                <h4>동아리 회장 연락처</h4>
                <LeaderInfoText>
                    <img src={club.member.memberImageURL} alt="club" />
                    <LeaderInfoName>
                        <p>회장</p>
                        <p>{club.member.name}</p>
                    </LeaderInfoName>
                    <LeaderInfoPhone>
                        <p>{club.member.phone}</p>
                    </LeaderInfoPhone>
                </LeaderInfoText>
            </LeaderInfo>
            <JoinButton onClick={handleJoinClick}>함께하기!</JoinButton>
        </ClubDetailPageContainer>
    );
};

export default ClubDetailPage;

const ClubDetailPageContainer = styled.div`
    font-family: Arial, sans-serif;
    position: relative;
    height: 100%;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    font-size: 24px;
    padding: 10px 0;
    margin-top: 2%;
    margin-left: 3%;
    p {
        margin-top: -1%;
        margin-left: 5%;
        align-items: center;
    }
`;

const ClubInfo = styled.div`
    padding: 20px;
    margin-top: 10px;
    display: flex;
    align-items: flex-start;
    height: 22%;

    img {
        box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
        object-fit: scale-down;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin-bottom: 10px;
    }

    h3 {
        border-bottom: dimgray 3px solid;
        position: absolute;
        margin-left: 20px;
        font-weight: bold;
        font-size: 25px;
    }
`;

const ClubInfoText = styled.div`
    flex: 1;
`;

const InfoDes = styled.p`
    margin-top: 60px;
    text-align: left;
    margin-left: 20px;
`;

const ClubInfoCenter = styled.div`
    text-align: left;
    margin-top: 30px;
    margin-left: -45px;
    padding: 5px;
    overflow-y: auto;
`;

const LastActivity = styled.div`
    position: relative;
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 18px;
`;

const LastActivityText = styled.div`
    border: 1px solid #ccc;
    border-radius: 20px;
    overflow-x: auto;
    width: 95%;
    height: 50%;
    object-fit: scale-down;
    margin-left: 2%;
`;

const UnoCards = styled.div`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 10px;
    border-radius: 30px;

    img {
        border-radius: 10px;
        width: 100%;
        height: 250px;
        margin-top: 10px;
        margin-right: 10px;
        margin-left: 10px;
    }
`;

const LeaderInfo = styled.div`
    padding: 20px;
    height: 15%;
    
    h4 {
        margin-top: -5%;
        font-size: 24px;
        text-align: left;
        margin-bottom: 10px;
    }
`;

const LeaderInfoText = styled.div`
    display: flex;
`;

const LeaderInfoName = styled.div`
    margin-left: 20px;
`;

const LeaderInfoPhone = styled.div`
    margin-right: 5%;
    display: flex;
    flex-direction: column;
    text-align: right;
    margin-top: 5%;
    font-size: 15px;
    flex: 1;
    position: relative;
`;

const JoinButton = styled.button`
    width: 85%;
    padding: 3%;
    background-color: #567cac;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    height: 50px;
`;

const JoinForm = styled.div`
    position: relative;
`;

const JoinFormHeader = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px 0;

    p {
        margin-left: 10px;
        font-size: 25px;
        font-weight: bold;
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: flex-start;

    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 10px;
    }
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;
    
    h4 {
        font-size: 16px;
        font-weight: bold;
    }
    
`;

const ReasonInput = styled.div`
    margin-bottom: 20px;

    p {
        margin-left: 20px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 20px;
        font-size: 25px;
    }

    textarea {
        width: 90%;
        height: 50vh;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;

        &:focus {
            outline: none;
        }
    }
`;

const SubmitButton = styled.button`
    width: 330px;
    padding: 10px;
    background-color: #567cac;
    display: flex;
    font-weight: bold;
    justify-content: center;
    margin: 0 auto;
    position: fixed;
    left: 0;
    right: 0;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
`;
