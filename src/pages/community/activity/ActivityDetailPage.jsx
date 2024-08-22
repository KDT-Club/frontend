import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './activity.css';
import { FaArrowLeft } from "react-icons/fa6";
import styled from "styled-components";

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

function ActivityDetailPage() {
    const navigate = useNavigate();
    const { clubId, postId } = useParams();
    const [post, setPost] = useState(null);
    const [clubImgUrl, setClubImgUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postResponse, clubsResponse] = await Promise.all([
                    axios.get(`/api/board/3/clubs/${clubId}/posts/${postId}`),
                    axios.get('/api/clubs')
                ]);

                const postData = postResponse.data;
                const attachmentNames = postData.attachmentNames || [];

                setPost({
                    ...postData.post,
                    attachmentNames: attachmentNames
                });

                const clubs = clubsResponse.data;
                const currentClub = clubs.find(club => club.clubId === parseInt(clubId));
                if (currentClub) {
                    setClubImgUrl(currentClub.clubImgUrl);
                }
            } catch (error) {
                console.error('Error fetching post detail or club info:', error);
            }
        };

        fetchData();
    }, [clubId, postId]);

    const handleBack = () => {
        navigate('/community');
    };

    if (!post || !clubImgUrl) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <HeaderContainer>
                <FaArrowLeft
                    style={{fontSize: '24px', cursor: 'pointer'}}
                    onClick={handleBack}
                />
                <div style={{fontSize: '20px', fontWeight: "bold"}}>활동 내용</div>
                <div style={{width: '24px'}}></div>
            </HeaderContainer>
            <div className="detail-info">
                <img src={clubImgUrl} alt="club" className="clubs-logo" />
                <h2 style={{
                    fontSize: "20px",
                    fontWeight: 'bold',
                    marginLeft: '10px',
                    marginTop: '10px'
                }}>{post.clubName}</h2>
            </div>
            <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.attachmentFlag === 'Y' && post.attachmentNames && post.attachmentNames.length > 0 && (
                    <div className="attachments">
                        {post.attachmentNames.map((url, index) => (
                            <img key={index} src={url} alt={`첨부 이미지 ${index + 1}`} style={{ width: '100%', marginBottom: '10px' }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActivityDetailPage;