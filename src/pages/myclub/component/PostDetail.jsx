import {React, useCallback, useState} from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { FiMoreVertical } from "react-icons/fi";
import { formatDate } from "../component/Date";
import Modal_post from "../../../components/modal/Modal_post.jsx";
import Modal_post_complain from "../../../components/modal/Modal_post_complain.jsx";
import styled from 'styled-components';
import CommentSection from "./CommentSection.jsx";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal_ok from "../../../components/modal/Modal_ok.jsx";

function PostDetail({
                        title,
                        post,
                        like,
                        comments,
                        attachmentNames,
                        onLikeClick,
                        showOkModal,
                        modalMessage,
                        onConfirm,
                        onCloseOkModal,
                        onBackClick,
                        onPostDotClick,
                        onCommentSubmit,
                        onCommentEdit,
                        onSaveEditedComment,
                        onCommentDelete,
                        newComment,
                        setNewComment,
                        editingCommentId,
                        editedCommentContent,
                        setEditedCommentContent,
                        memberId,
                        commentCount
                    }) {

    const [showPostModal, setShowPostModal] = useState(false);
    const [showComplainModal, setShowComplainModal] = useState(false);

    const handlePostDotClick = () => {
        if (parseInt(post.member.id) === parseInt(memberId)) {
            setShowPostModal(true);
        } else {
            setShowComplainModal(true);
        }
    };

    const closeModal = () => {
        setShowPostModal(false);
        setShowComplainModal(false);
    };

    return (
        <Whole>
            <HeaderContainer>
                <FaArrowLeft style={{fontSize: '24px', cursor: 'pointer'}} onClick={onBackClick}/>
                <Title>{title}</Title>
                <FiMoreVertical style={{fontSize: '24px', cursor: 'pointer'}} onClick={handlePostDotClick}/>
            </HeaderContainer>
            <ScrollContainer>
                {post && (
                    <PostContainer>
                        <PostAuthorContainer>
                            <ProfileImage src={post.member.memberImageURL} alt="" />
                            <PostAuthorDate>{post.member.name} | {formatDate(post.createdAt)}</PostAuthorDate>
                        </PostAuthorContainer>
                        <PostTitle>{post.title}</PostTitle>
                        <PostContent>{post.content}</PostContent>
                        <ImageContainer>
                            {attachmentNames.length > 0 ? (
                                attachmentNames.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`첨부 이미지 ${index + 1}`}
                                        onError={(e) => {
                                            console.error(`이미지 로딩 오류 ${index}:`, e);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ))
                            ) : (
                                <p></p>
                            )}
                        </ImageContainer>
                        <HeartContainer onClick={onLikeClick}>
                            <FaRegThumbsUp/>
                            &nbsp;
                            <p>{like}</p>
                        </HeartContainer>
                    </PostContainer>
                )}
                <Divider />
                <CommentSection
                    comments={comments}
                    postId={post.postId}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    editingCommentId={editingCommentId}
                    editedCommentContent={editedCommentContent}
                    setEditedCommentContent={setEditedCommentContent}
                    onCommentSubmit={onCommentSubmit}
                    onCommentEdit={onCommentEdit}
                    onSaveEditedComment={onSaveEditedComment}
                    onCommentDelete={onCommentDelete}
                />
                {showPostModal && <Modal_post
                    onClose={closeModal}
                    onEdit={onPostDotClick}
                />}
                {showComplainModal && <Modal_post_complain onClose={closeModal} postId={post.id} memberId={memberId} />}
                {showOkModal && <Modal_ok onClose={onCloseOkModal} message={modalMessage} onConfirm={onConfirm} />}
            </ScrollContainer>
        </Whole>
    );
}

const Whole = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
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

const ScrollContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: darkgray white;
`;

const Title = styled.div`
    font-size: 20px;
    font-weight: bold;
`;

const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 10px;
`;

const PostAuthorContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
`;

const ProfileImage = styled.img`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;`;

const PostAuthorDate = styled.p`
    font-size: 16.6px;
    color: gray;
    font-weight: bold;
    margin: 0;
`;

const PostTitle = styled.p`
    font-size: 20px;
    font-weight: bold;
    padding-bottom: 12px;
    text-align: start;
    width: 100%;
    margin-top: 8px;
    margin-left: 10px;
    padding-right: 10px;
`;

const PostContent = styled.p`
    font-size: 17.8px;
    margin-top: 0px;
    margin-left: 10px;
    text-align: start;
`;

const ImageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    img {
        width: 100%;
        max-width: 200px;
        min-width: 200px;
        height: auto;
        border-radius: 8px;
        margin-bottom: 10px;
    }
`;

const HeartContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    color: #555;
    cursor: pointer;
    font-size: 17.3px;
`

const Divider = styled.div`
    border-bottom: 1.5px solid dimgrey;
    margin-top: 10px;
`;

export default PostDetail;