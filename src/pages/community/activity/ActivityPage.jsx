import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './activity.css';
import board from '../../../images/boardgame.png';
import game from '../../../images/game.jpg';
import dm from "../../../images/DM.png";
import axios from 'axios';

function ActivityPage() {
    const navigate = useNavigate();
    const { clubId } = useParams(); // URL 파라미터에서 clubId를 가져옵니다.
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // clubId를 포함하여 API 요청
                const response = await axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts`);
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        // clubId가 정의되어 있을 때만 API 호출
        if (clubId) {
            fetchPosts();
        }
    }, [clubId]); // clubId가 변경될 때마다 호출

    const handleInActivity = (postId) => {
        navigate(`/activity_detail/${postId}`);
    };

    return (
        <div>
            <div className="activity-container">
                <div className="activity-img">
                    <img src={board} alt="board image" />
                    <img src={game} alt="game image" />
                    <img src={game} alt="game image" />
                </div>
            </div>
            {posts.map(post => (
                <div key={post.postId} onClick={() => handleInActivity(post.postId)} style={{ cursor: 'pointer' }} className="activity-info">
                    <img src={dm} alt="dm" className="clubs-logo" />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: "20px", fontWeight: 'bold' }}>{post.title}</h2>
                        <span style={{ marginLeft: '10px' }}>{new Date(post.createdAt).toLocaleDateString()} 보드게임 활동입니다.</span>
                    </div>
                </div>
            ))}
            <hr />
        </div>
    );
}

export default ActivityPage;
