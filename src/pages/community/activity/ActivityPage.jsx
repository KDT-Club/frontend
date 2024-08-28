import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ActivityPage() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const clubsResponse = await axios.get('/api/clubs');
                const clubs = clubsResponse.data;

                const activitiesPromises = clubs.map(club =>
                    axios.get(`/api/board/3/clubs/${club.clubId}/posts`)
                );

                const activitiesResponses = await Promise.all(activitiesPromises);

                // 모든 클럽의 포스트를 하나의 리스트로 병합
                const allPosts = activitiesResponses.flatMap((response, index) =>
                    response.data.map(post => ({
                        ...post,
                        clubName: clubs[index].clubName,
                        clubId: clubs[index].clubId,
                        clubImgUrl: clubs[index].clubImgUrl
                    }))
                );

                setPosts(allPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchAllPosts();
    }, []);

    const handleInActivity = (clubId, postId) => {
        navigate(`/board/3/clubs/${clubId}/posts/${postId}`);
    };

    return (
        <ActivityContainer>
            {posts.length > 0 ? (
                posts.map(post => (
                    <ActivityInfo
                        key={post.postId}
                        onClick={() => handleInActivity(post.clubId, post.postId)}
                    >
                        {post.attachmentNames && (
                            <ClubsLogo src={post.attachmentNames} alt={post.clubName} />
                        )}
                        <DetailInfo>
                            <h3>{post.title}</h3>
                            <span>
                                {new Date(post.createdAt).toLocaleDateString()} {post.clubName} 활동입니다.
                            </span>
                        </DetailInfo>
                    </ActivityInfo>
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

const ActivityInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin: 9px 10px;
    border-bottom: 1px solid #ccc;
`;

const DetailInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    padding-bottom: 10px;

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
    border-radius: 5%;
    padding-right: 7px;
    margin-bottom: 10px;
`;