import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './activity.css';
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
                const postData = response.data;
                const attachmentNames = postData.attachmentNames || [];

                setPost({
                    ...postData.post,
                    attachmentNames: attachmentNames
                });
            } catch (error) {
                console.error('Error fetching post detail:', error);
            }
        };

        fetchPostDetail();
    }, [clubId, postId]);

    const handleBack = () => {
        navigate('/community');
    };

    if (!post) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <div className="header">
                <FaArrowLeft
                    style={{ fontSize: '25px', strokeWidth: '0.1', cursor: 'pointer', marginLeft: '15px' }}
                    onClick={handleBack}/>
                <p>활동 내용</p>
            </div>
            <div className="detail-info">
                <img src={dm} alt="dm" className="clubs-logo" />
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
                            <img key={index} src={url} alt={`첨부 이미지 ${index + 1}`} style={{ maxWidth: '100%', marginBottom: '10px' }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ActivityDetailPage;
