import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import styled from 'styled-components';
import axios from 'axios';

const ClubDetailPage = () => {
    const { clubName } = useParams();
    const [member, setMember] = useState(null);
    const [memberId, setMemberId] = useState(null);
    const [club, setClub] = useState(null);
    const [showJoinForm, setShowJoinForm] = useState(false);
    const [motivation, setMotivation] = useState('');
    const [userInfo, setUserInfo] = useState({ name: '', username: '', id: '', memberImageURL: '' });
    const [lastActivityImage, setLastActivityImage] = useState(null);
    const navigate = useNavigate();

    const apiClient = axios.create({
        baseURL: 'http://localhost:8080', // .env 파일에서 API URL 가져오기
        timeout: 10000, // 요청 타임아웃 설정 (10초)
        headers: {
            'Content-Type': 'application/json',
        },
    });

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get("http://localhost:8080/getUserId", {
                    withCredentials: true
                });
                console.log(response.data);
                setMemberId(response.data.message);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Unauthorized access. Please log in.');
                } else {
                    console.error('유저 아이디를 불러오는 중 에러 발생:', error);
                    alert('유저 아이디를 불러오는 중 에러가 발생했습니다.');
                }
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        apiClient.get(`/members/${memberId}`)
            .then(response => {
                setMember(response.data);
            })
            .catch(error => {
                console.error('Error fetching member data:', error);
            });
    }, [memberId]);

    useEffect(() => {
        const fetchClubDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/clubs/${clubName}`);
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
            const response = await axios.get(`http://localhost:8080/members/${memberId}`);
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
            const response = await axios.get(`http://localhost:8080/board/3/clubs/${clubId}/posts`);
            if (response.data && response.data.length > 0) {
                const lastPost = response.data[0];
                const postResponse = await axios.get(`http://localhost:8080/board/3/clubs/${clubId}/posts/${lastPost.postId}`);
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

            const response = await axios.post(`http://localhost:8080/clubs/${clubName}/applications`, {
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
                <HeaderContainer>
                    <FaArrowLeft
                        style={{fontSize: '24px', cursor: 'pointer'}}
                        onClick={() => setShowJoinForm(false)}
                    />
                    <div style={{fontSize: '20px', fontWeight: "bold"}}>동아리 가입 신청</div>
                    <div style={{width: '24px'}}></div>
                </HeaderContainer>
                <UserInfo>
                    <img src={member.memberImageURL} alt="profile" />
                    <ProfileInfo>
                        <h4>{member.name}</h4>
                        <p>학번: {member.studentId}</p>
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
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBackClick}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>동아리 소개</div>
                <div style={{width: '24px'}}></div>
            </HeaderContainer>
            <hr />
            <ClubInfo>
                <img src={club.clubImgUrl} alt="club" />
                <ClubInfoText>
                    <h3>{club.clubName}</h3>
                    <InfoDes>{club.clubSlogan}</InfoDes>
                </ClubInfoText>
            </ClubInfo>
            <ClubInfoCenter>
                <p>{club.description}</p>
                {club.activities && club.activities.map((activity, index) => (
                    <p key={index}>{activity}</p>
                ))}
            </ClubInfoCenter>
            <LastActivity>
                <h4 style={{fontSize: "19px", textAlign: "left", fontWeight: "bold", marginBottom: "10px", marginLeft: "20px"}}>최근 활동</h4>
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
                    <img src={club.member.memberImageURL} alt="club" style={{width: "55px", height: "55px", borderRadius: "50%"}}/>
                    <LeaderInfoName>
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
    //font-family: Arial, sans-serif;
    position: relative;
    height: 100%;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 47.5px;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding-left: 25px;
    padding-right: 25px;
    margin-bottom: 0px;
`;

const ClubInfo = styled.div`
    padding: 20px;
    height: 17%;
    margin-top: 10px;
    display: flex;
    align-items: flex-start;

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
    width: 100%;
    margin-bottom: 20px;
    padding: 5px 15px;
    text-align: left;
`;

const LastActivity = styled.div`
    position: relative;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 18px;
`;

const LastActivityText = styled.div`
    border: 1px solid #ccc;
    border-radius: 20px;
    overflow-x: auto;
    width: 93%;
    height: 50%;
    object-fit: scale-down;
    margin-left: 3.5%;
`;

const UnoCards = styled.div`
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    margin-bottom: 10px;
    border-radius: 30px;

    img {
        border-radius: 10px;
        width: 93%;
        height: 200px;
        margin-top: 10px;
        margin-right: 10px;
        margin-left: 10px;
    }
`;

const LeaderInfo = styled.div`
    padding: 20px;
    height: 15%;

    h4 {
        font-size: 19px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 13px;
    }
`;

const LeaderInfoText = styled.div`
    display: flex;
`;

const LeaderInfoName = styled.div`
    margin-left: 20px;
    
    p {
        padding-top: 12px;
        font-size: 19px;
    }
`;

const LeaderInfoPhone = styled.div`
    margin-right: 5%;
    display: flex;
    flex-direction: column;
    text-align: right;
    margin-top: 3%;
    font-size: 15px;
    flex: 1;
    position: relative;

    p {
        font-size: 19px;
    }
`;

const JoinButton = styled.button`
    width: 92%;
    bottom: 0;
    padding: 3%;
    background-color: #567cac;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
    font-weight: bold;
    height: 50px;
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
`;

const JoinForm = styled.div`
    position: relative;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 15px;

    img {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        margin: 20px;
    }
`;

const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    text-align: left;

    h4 {
        margin-top: 27px;
        font-size: 19px;
        font-weight: bold;
    }

`;

const ReasonInput = styled.div`
    margin-top: 30px;
    margin-bottom: 20px;

    p {
        margin-top: 10px;
        margin-left: 21px;
        font-weight: bold;
        text-align: left;
        margin-bottom: 10px;
        font-size: 22px;
    }

    textarea {
        width: 90%;
        height: 40vh;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;

        &:focus {
            outline: none;
        }
    }
`;

const SubmitButton = styled.button`
    width: 91%;
    padding: 10px;
    background-color: #567cac;
    display: flex;
    font-weight: bold;
    justify-content: center;
    margin: 0 auto;
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
`;
