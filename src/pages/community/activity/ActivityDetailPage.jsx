import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './activity.css'
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import dm from "../../../images/DM.png";

function ActivityDetailPage() {
    const navigate = useNavigate();
    const { clubId, postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`https://zmffjq.store/board/3/clubs/${clubId}/posts/${postId}`);
                setPost(response.data);
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
                }}>{post.club_name}</h2>
            </div>
            <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                {post.attachment_flag === 'Y' && (
                    <div className="attachments">
                        <h4>첨부 파일:</h4>
                        <p>{post.attachment_name}</p>
                        {post.attachment_names && post.attachment_names.map((url, index) => (
                            <img key={index} src={url} alt={`Attachment ${index + 1}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ActivityDetailPage;