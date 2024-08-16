import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ActivityPage() {
    const [clubActivities, setClubActivities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllClubActivities = async () => {
            try {
                const clubsResponse = await axios.get('https://zmffjq.store/clubs');
                const clubs = clubsResponse.data;

                const activitiesPromises = clubs.map(club =>
                    axios.get(`https://zmffjq.store/board/3/clubs/${club.clubId}/posts`)
                );

                const activitiesResponses = await Promise.all(activitiesPromises);

                const allActivities = clubs.map((club, index) => ({
                    clubId: club.clubId,
                    clubName: club.clubName,
                    clubImgUrl: club.clubImgUrl,
                    posts: activitiesResponses[index].data
                })).filter(club => club.posts.length > 0);

                setClubActivities(allActivities);
            } catch (error) {
                console.error('Error fetching club activities:', error);
            }
        };

        fetchAllClubActivities();
    }, []);

    const handleInActivity = (clubId, postId) => {
        navigate(`/board/3/clubs/${clubId}/posts/${postId}`);
    };

    return (
        <ActivityContainer>
            {clubActivities.length > 0 ? (
                clubActivities.map(club => (
                    <ClubActivity key={club.clubId}>
                        <h2>{club.clubName}</h2>
                        {club.posts.map(post => (
                            <ActivityInfo
                                key={post.postId}
                                onClick={() => handleInActivity(club.clubId, post.postId)}
                            >
                                <ClubsLogo src={club.clubImgUrl} alt={club.clubName} />
                                <DetailInfo>
                                    <h3>{post.title}</h3>
                                    <span>
                                        {new Date(post.createdAt).toLocaleDateString()} {club.clubName} 활동입니다.
                                    </span>
                                </DetailInfo>
                            </ActivityInfo>
                        ))}
                    </ClubActivity>
                ))
            ) : (
                <p>동아리 활동 내용이 없습니다.</p>
            )}
        </ActivityContainer>
    );
}

export default ActivityPage;

const ActivityContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
`;

const ClubActivity = styled.div`
    overflow-y: auto;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    h2 {
        font-weight: bold;
        font-size: 25px;
    }
`;

const ActivityInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    margin-left: 10px;
`;

const DetailInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    h3 {
        font-size: 20px;
        font-weight: bold;
    }

    span {
        margin-left: 10px;
        color: #666;
    }
`;

const ClubsLogo = styled.img`
    width: 100%;
    height: 20vh;
    border-radius: 50%;
    margin-bottom: 10px;
`;
