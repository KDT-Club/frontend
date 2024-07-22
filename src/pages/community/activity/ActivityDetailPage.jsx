import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './activity.css'
import { FaArrowLeft } from "react-icons/fa6";
import dm from "../../../images/DM.png";

function ActivityDetailPage() {
    const navigate = useNavigate();
    const { clubId, postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts/${postId}`);
                setPost({...response.data.post});
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [clubId, postId]);

    const handleBack = () => {
        navigate('/community');
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <div>
            <div className="header">
                <FaArrowLeft onClick={handleBack}/>
                <h2>활동내용</h2>
            </div>
            <div className="detail-info">
                <img src={dm} alt="dm" className="clubs-logo"/>
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
                        <h4>첨부 파일:</h4>
                        {post.attachmentNames.map((name, index) => (
                            <p key={index}>{name}</p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityDetailPage;